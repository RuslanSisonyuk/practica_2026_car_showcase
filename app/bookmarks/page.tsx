import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { CarCard } from "@/components";
import { CarProps } from "@/types";
import { getCarImageUrl } from "@/lib/imageCache";

export default async function BookmarksPage() {
  const session = await auth();
  if (!session) redirect("/auth/signin");

  const bookmarks = await prisma.bookmark.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: { make: true, model: true, year: true },
  });

  const cars: CarProps[] = bookmarks.map((c:{ make:string, model:string, year:number }) => ({
    make: c.make,
    model: c.model,
    year: c.year,
    drive: "fwd",
    fuel_type: "gas",
    transmission: "a",
  }));

  const imageUrls = await Promise.all(
    cars.map((car) => getCarImageUrl(car.make, car.model, car.year))
  );

  return (
    <main className="min-h-screen padding-x padding-y max-width pt-36">
      <div className="home__text-container mb-8 mt-20">
        <h1 className="text-4xl font-extrabold">My Bookmarks</h1>
        <p>Your saved cars</p>
      </div>

      {cars.length === 0 ? (
        <div className="home__error-container">
          <h2 className="text-black-100 text-xl font-bold">No bookmarks yet</h2>
          <p>Browse the catalogue and save cars you like.</p>
        </div>
      ) : (
        <div className="home__cars-wrapper">
          {cars.map((car, i) => (
            <CarCard
              key={car.make + car.model + car.year}
              car={car}
              imageUrl={imageUrls[i]}
              isBookmarked={true}
            />
          ))}
        </div>
      )}
    </main>
  );
}
