import moment from "moment";

const reserveTimeFn = async (day, time, club, court) => {
  try {
    let chosenTime = moment(time, "HH:mm")
      .days(day.days())
      .month(day.month())
      .year(day.year());
    let startTime = chosenTime.format("YYYY-MM-DD HH:mm:ss");
    let endTime = chosenTime.add(30, "minutes").format("YYYY-MM-DD HH:mm:ss");

    const body = { club, court, startTime, endTime }; // player is the one in the session
    const res = await fetch("/api/dashboard/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const parseRes = await res.json();
    return parseRes;

    // setReservations([
    //   ...reservations,
    //   {
    //     ...parseRes,
    //     start_time: moment(parseRes.start_time).format("YYYY-MM-DD HH:mm:ss"),
    //     end_time: moment(parseRes.end_time).format("YYYY-MM-DD HH:mm:ss"),
    //   },
    // ]);

    // fetchReservations();

    // if (typeof parseRes !== "string") {
    //   getCourts();
    //   setCourtError("");
    // } else {
    //   setCourtError(parseRes);
    // }
  } catch (error) {
    console.error(error.message);
  }
};

export default reserveTimeFn;
