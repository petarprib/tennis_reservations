const fetchCourtTypes = async () => {
  try {
    const res = await fetch("/api/dashboard/court-types");
    const parseRes = await res.json();
    return parseRes;
  } catch (error) {
    console.error(error.message);
  }
};

export default fetchCourtTypes;
