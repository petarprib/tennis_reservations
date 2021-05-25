const deleteCourtFn = async (court) => {
  try {
    const body = { court };
    await fetch("/api/dashboard/courts", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return;
  } catch (error) {
    console.error(error.message);
  }
};

export default deleteCourtFn;
