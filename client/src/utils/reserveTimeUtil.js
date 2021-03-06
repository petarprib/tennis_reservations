import moment from "moment";

const reserveTimeUtil = async (time, club, court, date) => {
  console.log("time: ", time);
  console.log("date: ", date);
  try {
    let chosenTime = moment(time, "HH:mm")
      .date(date.date())
      .month(date.month())
      .year(date.year());
    let startTime = chosenTime.format("YYYY-MM-DD HH:mm:ss");
    let endTime = chosenTime.add(30, "minutes").format("YYYY-MM-DD HH:mm:ss");

    console.log("chosenTime: ", chosenTime);
    console.log("startTime: ", startTime);
    console.log("endTime: ", endTime);
    const body = { club, court, startTime, endTime };
    await fetch("/api/dashboard/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return;
  } catch (error) {
    console.error(error.message);
  }
};

export default reserveTimeUtil;
