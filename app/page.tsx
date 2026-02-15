import { Hero } from "@/components";
import { SearchBar, CustomFilter, CarCard, ShowMore } from "@/components";
import Image from "next/image";
import { fetchCars } from "@/utils";
import { FilterProps } from "@/types";
import { fuels, yearsOfProduction } from "@/constants";

export default async function Home({ searchParams }: { searchParams: FilterProps }) {
  const params = await searchParams

  const allCars = await fetchCars({
    manufacturer: params.manufacturer || "",
    year: params.year || 2021,
    fuel: params.fuel || "",
    model: params.model || "",
  });

  const isDataEmpty = !Array.isArray(allCars) || allCars.length < 1 || !allCars;
  
  console.log(allCars);
  return (
    <main className="overflow-hidden">
      <Hero />

      <div className="padding-x mt-12 padding-y max-width" id="discover">
        <div className="home__text-container">
          <h1 className="text-4xl font-extrabold">Car Catalogue</h1>
          <p>Explore the cars you might like</p>
        </div>
        <div className="home__filters">
          <SearchBar />
          
          <div className="home__filter-container">
            <CustomFilter title="fuel" options={fuels} />
            <CustomFilter title="year" options={yearsOfProduction} />
          </div>
        </div>


        {!isDataEmpty ? (
          <section>
            <div className="home__cars-wrapper">
              {allCars?.map((car) => (
                <CarCard key={car.make + car.model} car={car}/>
              ))}
            </div>

            <ShowMore
              pageNumber={(params.limit || 10) / 10}
              isNext={(10) > allCars.length}
            />
          </section>
         ): (
          <div className="home__error-container">
            <h2 className="text-black-100 text-xl font-bold">
              No car
            </h2>
            <p>{allCars?.message}</p>
          </div>
         )
        }
      </div>
    </main>
  );
}
