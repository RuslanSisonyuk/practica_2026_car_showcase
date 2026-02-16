import { CarProps } from "@/types";
import { FilterProps } from "@/types";

export async function fetchCars( filters: FilterProps ) {
    const { manufacturer, year, model, fuel } = filters;

    const headers = {
            'x-rapidapi-key': process.env.RAPID_API_KEY || '',
            'x-rapidapi-host': 'cars-by-api-ninjas.p.rapidapi.com'
        }

    console.log(`https://cars-by-api-ninjas.p.rapidapi.com/v1/cars?make=${manufacturer}&year=${year}&model=${model}&fuel_type=${fuel}`);
    const response = await fetch(`https://cars-by-api-ninjas.p.rapidapi.com/v1/cars?make=${manufacturer}&year=${year}&model=${model}&fuel_type=${fuel}`, { 
        headers: headers,
        });

    const result = await response.json();

    return result;
}

export const calculateCarRent = (city_mpg: number, year: number) => {
    const basePricePerDay = 50; // Base rental price per day in dollars
    const mileageFactor = 0.1; // Additional rate per mile driven
    const ageFactor = 0.05; // Additional rate per year of vehicle age

    const mileageRate = Math.random() * mileageFactor;
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