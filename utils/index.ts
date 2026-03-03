import { CarProps } from "@/types";
import { FilterProps } from "@/types";
import { NextRequest } from "next/server";

const NHTSA_BASE = 'https://vpic.nhtsa.dot.gov/api/vehicles';

export async function fetchCars(filters: FilterProps) {
  const { manufacturer, year, model, limit } = filters;

  const make = manufacturer?.trim() || 'toyota';
  const make_encoded = encodeURIComponent(make);
  const modelyear = year ?? new Date().getFullYear();
  const url = `${NHTSA_BASE}/GetModelsForMakeYear/make/${make_encoded}/modelyear/${modelyear}?format=json`;

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
    drive: 'fwd',
    fuel_type: 'gas',
    transmission: 'a',
  }));
}

export const calculateCarRent = (city_mpg: number, year: number) => {
    const basePricePerDay = 50; // Base rental price per day in dollars
    const ageFactor = -0.8; // Additional rate per year of vehicle age

    const ageRate = (new Date().getFullYear() - year) * ageFactor;
    const rentalRatePerDay = basePricePerDay + ageRate;

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


export function fetchCarImageUrl(car: CarProps, angle?: string) {
  // const apiKey = "jcmsx43qr_qtbfamspq_u840p7e1j";
  // if (!apiKey) return console.error('CARSXE_API_KEY is not set');
  // const make = car.make;
  // const model = car.model;

  // const url = new URL('https://api.carsxe.com/images');
  // url.searchParams.append('key', apiKey || '');
  // url.searchParams.append('make', make);
  // url.searchParams.append('model', model);
  // url.searchParams.append('year', car.year.toString());
  // url.searchParams.append('angle', angle || '0');
  // return `${url}`;
}

export const updateSearchParams = (type: string, value: string) => {
  const searchParams = new URLSearchParams(window.location.search);
  searchParams.set(type, value);

  const newPathname = `${window.location.pathname}?${searchParams.toString()}`;
  return newPathname;
}