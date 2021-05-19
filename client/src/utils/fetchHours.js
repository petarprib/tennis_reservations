import moment from "moment";

const fetchHours = async (openTime, closeTime) => {
  let sessions = [];
  let hour = openTime;
  while (hour.isBefore(closeTime)) {
    sessions.push(hour.format("HH:mm"));
    hour = moment(hour).add(30, "minutes");
    // if minOneHour, when a CLIENT (not valid for club) clicks on an hour, 1 full hour will be reserved

    // if (!minOneHour) {
    // hour = moment(hour).add(30, "minutes");
    // } else {
    //   hour = moment(hour).add(1, "hours");
    // }
  }
  return sessions;
};

export default fetchHours;
