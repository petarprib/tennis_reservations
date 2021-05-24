const fetchCourtTypes = async () => {
  try {
    const res = await fetch("/api/dashboard/court-types");
    const parseRes = await res.json();
    // setCourtTypes([{ id: 0, type: "All" }, ...parseRes]);
    return parseRes;
  } catch (error) {
    console.error(error.message);
  }
};

export default fetchCourtTypes;
