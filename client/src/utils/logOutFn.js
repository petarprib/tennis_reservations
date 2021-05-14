const logOutFn = async () => {
  try {
    const res = await fetch("/api/auth/logout");
    const parseRes = await res.json();
    return parseRes;
  } catch (error) {
    console.error(error.message);
  }
};

export default logOutFn;
