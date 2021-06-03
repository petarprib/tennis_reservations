import moment from "moment";

const fetchHoursUtil = async (openTime, closeTime) => {
  let sessions = [];
  let hour = openTime;
  // console.log("HOUR", hour);
  while (hour.isBefore(closeTime)) {
    sessions.push(hour.format("HH:mm"));
    hour = moment(hour).add(30, "minutes");
  }
  return sessions;
};

export default fetchHoursUtil;
