import React, { useState } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import EditCourt from "../../modals/EditCourt.jsx";
import DeleteCourt from "../../modals/DeleteCourt.jsx";
import Hour from "./Hour";

const Court = (props) => {
  const { court, scrollRef } = props;
  const date = useSelector((state) => state.date);
  const hours = useSelector((state) => state.hours);
  const reservations = useSelector((state) => state.reservations);
  const user = useSelector((state) => state.user);
  const userType = useSelector((state) => state.userType);
  const [showIcons, setShowIcons] = useState(false);

  return (
    <div
      key={court.number}
      className="court"
      onMouseEnter={() => setShowIcons(true)}
      onMouseLeave={() => setShowIcons(false)}
      data-dashboard
    >
      <div className="court-info" data-dashboard>
        <p className="court-number" data-dashboard>
          {court.number}
        </p>
        <p className="court-type" data-dashboard>
          {court.type}
        </p>
        {userType === 2 && showIcons && (
          <EditCourt courtId={court.id} courtNumber={court.number} courtType={court.type_id} />
        )}
        {userType === 2 && showIcons && <DeleteCourt courtId={court.id} courtNumber={court.number} />}
      </div>

      <div className="hours" onScroll={(event) => props.handleScroll(event)} ref={scrollRef} data-dashboard>
        {hours.map((hour) => {
          let playerReservation = false;
          let color = "rgb(154, 205, 50)";
          let nameAcronym;
          let name;
          let email;
          reservations.map((reservation) => {
            if (court.id !== reservation.court) return false;
            let now = moment(hour, "HH:mm")
              .date(date.date())
              .month(date.month())
              .year(date.year());
            let startTime = moment(reservation.start_time, "YYYY-MM-DD HH:mm:ss");
            let endTime = moment(reservation.end_time, "YYYY-MM-DD HH:mm:ss");
            if (now.isSame(startTime) || now.isBetween(startTime, endTime)) {
              if (reservation.player === user) {
                color = "rgb(135, 206, 235)";
              } else {
                playerReservation = true;
                color = "rgb(255, 70, 53)";
                nameAcronym = reservation.name.match(/\b(\w)/g).join("");
                name = reservation.name;
                email = reservation.email;
              }
              return false;
            }
            return true;
          });

          return (
            <Hour
              key={hour}
              court={court}
              hour={hour}
              color={color}
              nameAcronym={nameAcronym}
              playerReservation={playerReservation}
              name={name}
              email={email}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Court;
