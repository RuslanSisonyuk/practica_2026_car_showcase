import { Hero } from "@/components";
import { SearchBar, CustomFilter, CarCard, ShowMore } from "@/components";
import { fetchCars } from "@/utils";
import { FilterProps } from "@/types";
import { getCarImageUrl } from "@/lib/imageCache";
import { fuels, yearsOfProduction } from "@/constants";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function Home({ searchParams }: { searchParams: FilterProps }) {
  const params = await searchParams

  const [allCars, session] = await Promise.all([
    fetchCars({
      manufacturer: params.manufacturer || "",
      year: params.year || 2015,
      fuel: params.fuel || "",
      model: params.model || "",
      limit: params.limit || 10,
    }),
    auth(),
  ]);

  const bookmarkedKeys = new Set<string>();
  if (session) {
    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: session.user.id },
      select: { make: true, model: true, year: true },
    });
    bookmarks.forEach((r:{ make:string, model:string, year:number }) =>
      bookmarkedKeys.add(`${r.make}|${r.model}|${r.year}`)
    );
  }

  const imageUrls = await Promise.all(
    allCars.map((car) => getCarImageUrl(car.make, car.model, car.year))
  );

  const isDataEmpty = !Array.isArray(allCars) || allCars.length < 1 || !allCars;

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
              {allCars?.map((car, i) => (
                <CarCard
                  key={car.make + car.model + car.year + i}
                  car={car}
                  imageUrl={imageUrls[i]}
                  isBookmarked={bookmarkedKeys.has(`${car.make}|${car.model}|${car.year}`)}
                />
              ))}
            </div>

            <ShowMore
              pageNumber={(params.limit || 10) / 10}
              isNext={(params.limit || 10) > allCars.length}
            />
          </section>
         ): (
          <div className="home__error-container">
            <h2 className="text-black-100 text-xl font-bold">
              No cars found
            </h2>
          </div>
         )
        }
      </div>
    </main>
  );
}
