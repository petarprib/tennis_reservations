const changeEmailUtil = async (newEmail) => {
  try {
    const body = { newEmail };
    const res = await fetch("/api/dashboard/accounts/email", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const parseRes = await res.json();
    return parseRes;
  } catch (error) {
    console.error(error.message);
  }
};

export default changeEmailUtil;
