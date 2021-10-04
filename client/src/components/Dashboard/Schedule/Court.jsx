import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import EditCourtModal from "../../Modals/EditCourtModal.jsx";
import DeleteCourtModal from "../../Modals/DeleteCourtModal.jsx";
import Hour from "./Hour";

const Court = (props) => {
  const { court, scrollRef } = props;
  const date = useSelector((state) => state.date);
  const hours = useSelector((state) => state.hours);
  const reservations = useSelector((state) => state.reservations);
  const user = useSelector((state) => state.userData.user);
  const userType = useSelector((state) => state.userData.userType);
  const [showIcons, setShowIcons] = useState(false);
  const [openEditCourt, setOpenEditCourt] = useState(false);
  const [openDeleteCourt, setOpenDeleteCourt] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
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
          {(() => {
            if (userType === 2) {
              if (windowWidth > 992 && showIcons) {
                return (
                  <div>
                    <div>
                      <i className="fas fa-edit" onClick={() => setOpenEditCourt(true)} />
                    </div>
                    <div>
                      <i className="fas fa-trash" onClick={() => setOpenDeleteCourt(true)} />
                    </div>
                  </div>
                );
              } else if (windowWidth <= 992) {
                return (
                  <div>
                    <div>
                      <i className="fas fa-edit" onClick={() => setOpenEditCourt(true)} />
                    </div>
                    <div>
                      <i className="fas fa-trash" onClick={() => setOpenDeleteCourt(true)} />
                    </div>
                  </div>
                );
              }
            }
          })()}
        </div>

        <div className="hours" onScroll={(event) => props.handleScroll(event)} ref={scrollRef} data-dashboard>
          {hours.map((hour) => {
            let playerReservation = false;
            let color = "rgb(154, 205, 50)";
            let nameAcronym;
            let name;
            let email;
            console.log("hour: ", hour);
            reservations.map((reservation) => {
              if (court.id !== reservation.court) return false;
              let now = moment(hour, "HH:mm")
                .date(date.date())
                .month(date.month())
                .year(date.year());
              let startTime = moment(reservation.start_time, "YYYY-MM-DD HH:mm:ss");
              let endTime = moment(reservation.end_time, "YYYY-MM-DD HH:mm:ss");
              console.log("now: ", now);
              console.log("startTime: ", startTime);
              console.log("endTime: ", endTime);
              if (now.isSame(startTime) || now.isBetween(startTime, endTime)) {
                console.log("RESERVED now: ", now);
                console.log("RESERVED startTime: ", startTime);
                console.log("RESERVED endTime: ", endTime);
                if (reservation.player === user) {
                  color = "rgb(63, 81, 181)";
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
      <EditCourtModal
        open={openEditCourt}
        close={() => setOpenEditCourt(false)}
        courtId={court.id}
        courtNumber={court.number}
        courtType={court.type_id}
      />
      <DeleteCourtModal
        open={openDeleteCourt}
        close={() => setOpenDeleteCourt(false)}
        courtId={court.id}
        courtNumber={court.number}
      />
    </>
  );
};

export default Court;
