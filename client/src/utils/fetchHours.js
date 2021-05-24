import moment from "moment";

const fetchHours = async (openTime, closeTime) => {
  let sessions = [];
  let hour = openTime;
  while (hour.isBefore(closeTime)) {
    sessions.push(hour.format("HH:mm"));
    hour = moment(hour).add(30, "minutes");
  }
  return sessions;
};

export default fetchHours;
