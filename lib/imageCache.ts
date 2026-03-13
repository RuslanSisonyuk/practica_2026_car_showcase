import { prisma } from "@/lib/prisma";
import { generateCarImageUrl } from "@/utils";
import { CarProps } from "@/types";

const FALLBACK_DEFAULTS: Omit<CarProps, "make" | "model" | "year"> = {
  drive: "fwd",
  fuel_type: "gas",
  transmission: "a",
};

export async function getCarImageUrl(
  make: string,
  model: string,
  year: number | string
): Promise<string> {
  const yearInt = Number(year);
  // 1. Check DB cache
  const cached = await prisma.carImageCache.findUnique({
    where: { make_model_year: { make, model, year: yearInt } },
  });
  if (cached) return cached.imageUrl;

  // 2. Fetch from Serper (Google Image Search)
  try {
    const res = await fetch("https://google.serper.dev/images", {
      method: "POST",
      headers: {
        "X-API-KEY": process.env.SERPER_API_KEY ?? "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ q: `${make} ${model} ${yearInt} car`, num: 1 }),
    });

    if (res.ok) {
      const json = await res.json();
      // thumbnailUrl is Google-cached (gstatic.com) — reliable, no hotlink protection
      const imageUrl: string | undefined = json?.images?.[0]?.thumbnailUrl;

      if (imageUrl) {
        await prisma.carImageCache.create({
          data: { make, model, year: yearInt, imageUrl },
        });
        return imageUrl;
      }
    }
  } catch {
    // fall through to imagin.studio fallback
  }

  // 3. Fallback to imagin.studio
  return generateCarImageUrl({ make, model, year: yearInt, ...FALLBACK_DEFAULTS });
}
