import moment from "moment";

const deleteReservationUtil = async (court, time, date) => {
  try {
    let chosenTime = moment(time, "HH:mm")
      .date(date.date())
      .month(date.month())
      .year(date.year());
    let startTime = chosenTime.format("YYYY-MM-DD HH:mm:ss");

    const body = { court, startTime };
    await fetch("/api/dashboard/reservations", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return;
  } catch (error) {
    console.error(error.message);
  }
};

export default deleteReservationUtil;
