const addCourtUtil = async (courtType, courtNumber) => {
  try {
    const body = { courtType, courtNumber };
    const res = await fetch("/api/dashboard/courts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const parseRes = await res.json();
    return parseRes;
  } catch (error) {
    console.error(error.message);
  }
};

export default addCourtUtil;
