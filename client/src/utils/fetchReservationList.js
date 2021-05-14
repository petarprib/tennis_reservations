import moment from "moment";

const fetchReservationList = async () => {
  try {
    const res = await fetch("/api/dashboard/reservations");
    const parseRes = await res.json();
    const reservations = parseRes.map((reservation) => {
      return {
        ...reservation,
        start_time: moment(reservation.start_time).format("YYYY-MM-DD HH:mm:ss"),
        end_time: moment(reservation.end_time).format("YYYY-MM-DD HH:mm:ss"),
      };
    });
    return reservations;
  } catch (error) {
    console.error(error.message);
  }
};

export default fetchReservationList;
