import { CarProps } from "@/types";
import { FilterProps } from "@/types";

const NHTSA_BASE = 'https://vpic.nhtsa.dot.gov/api/vehicles';

export async function fetchCars(filters: FilterProps) {
  const { manufacturer, year, model, limit } = filters;

  if (!manufacturer?.trim()) {
    return [];
  }

  const make = encodeURIComponent(manufacturer.trim());
  const modelyear = year ?? new Date().getFullYear();
  const url = `${NHTSA_BASE}/GetModelsForMakeYear/make/${make}/modelyear/${modelyear}?format=json`;

  const res = await fetch(url, { next: { revalidate: 60 * 60 * 24 } });
  if (!res.ok) return [];

  const data = await res.json();
  const results = data.Results ?? [];

  // Optional: filter by model name (partial match)
  let list = results;
  if (model?.trim()) {
    const m = model.toLowerCase().trim();
    list = results.filter((r: { Model_Name: string }) =>
      r.Model_Name.toLowerCase().includes(m)
    );
  }

  // const limit = filters.limit ?? list.length;
  console.log("Limit: "+limit);

  // Map to CarProps with defaults for fields vPIC doesn't provide
  return list
  .slice(0, filters.limit ?? list.length)
  .map((r: { Make_Name: string; Model_Name: string }) => ({
    make: r.Make_Name,
    model: r.Model_Name,
    year: modelyear,
    city_mpg: 0,
    class: '',
    combination_mpg: 0,
    cylinders: 0,
    displacement: 0,
    drive: 'fwd',
    fuel_type: 'gas',
    highway_mpg: '0',
    transmission: 'a',
  }));
}

export const calculateCarRent = (city_mpg: number, year: number) => {
    const basePricePerDay = 50; // Base rental price per day in dollars
    const mileageFactor = 0.1; // Additional rate per mile driven
    const ageFactor = -0.8; // Additional rate per year of vehicle age


    const mileageRate = city_mpg * mileageFactor;
    const ageRate = (new Date().getFullYear() - year) * ageFactor;
    const rentalRatePerDay = basePricePerDay + mileageRate + ageRate;

    return rentalRatePerDay.toFixed(0);
}

export const generateCarImageUrl = (car: CarProps, angle?: string) => {
    const url = new URL('https://cdn.imagin.studio/getimage');

    const { make, model, year } = car;

    url.searchParams.append('customer', '');
    url.searchParams.append('make', make);
    url.searchParams.append('modelFamily', model.split(' ')[0]);
    url.searchParams.append('zoomType', 'fullscreen');
    url.searchParams.append('modelYear', year.toString());
    url.searchParams.append('angle', angle || '0');
    url.searchParams.append('model', model);
    url.searchParams.append('year', year.toString());
    url.searchParams.append('angle', angle || '0');

    return `${url}`;
}

const PEXELS_API_URL = 'https://api.pexels.com/v1/search';

export async function fetchCarImageUrl(car: CarProps): Promise<string | null> {
  const { make, model, year } = car;
  const query = `${year} ${make} ${model} car`;
  const key = process.env.PEXELS_API_KEY;

  if (!key) return null;

  try {
    const res = await fetch(
      `${PEXELS_API_URL}?query=${encodeURIComponent(query)}&per_page=1`,
      {
        headers: { Authorization: key },
        next: { revalidate: 60 * 60 * 24 }, // cache 24h
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const photo = data.photos?.[0];
    return photo?.src?.large ?? photo?.src?.medium ?? null;
  } catch {
    return null;
  }
}

export const updateSearchParams = (type: string, value: string) => {
  const searchParams = new URLSearchParams(window.location.search);
  searchParams.set(type, value);

  const newPathname = `${window.location.pathname}?${searchParams.toString()}`;
  return newPathname;
}