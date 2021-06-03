const changePasswordUtil = async (newPassword, repNewPassword, currentPassword) => {
  try {
    const body = { newPassword, repNewPassword, currentPassword };
    const res = await fetch("/api/dashboard/accounts/password", {
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

export default changePasswordUtil;
