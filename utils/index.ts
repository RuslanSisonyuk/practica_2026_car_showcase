export async function fetchCars() {
    const headers = {
            'x-rapidapi-key': '6fe272275fmsh1a771261bfdf3a7p1c79aajsn8a1969b48a2d',
            'x-rapidapi-host': 'cars-by-api-ninjas.p.rapidapi.com'
        }

    const response = await fetch(`https://cars-by-api-ninjas.p.rapidapi.com/v1/cars?model=corolla&min_comb_mpg=2`, { 
        headers: headers,
        });

    const result = await response.json();

    return result;
}