const fetchCountriesUtil = async () => {
  try {
    const res = await fetch("/api/countries");
    const parseRes = await res.json();
    let countries = [];
    parseRes.forEach((country) =>
      countries.push({
        name: country.name,
        id: country.id,
      })
    );
    return countries;
  } catch (error) {
    console.error(error.message);
  }
};

export default fetchCountriesUtil;
