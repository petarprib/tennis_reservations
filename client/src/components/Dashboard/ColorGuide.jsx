import React from "react";

const ColorGuide = () => {
  return (
    <div id="color-guide" data-dashboard>
      <div>
        <p>Available</p>
        <i className="fas fa-square-full available" data-dashboard />
      </div>
      <div>
        <p>Unavailable</p>
        <i className="fas fa-square-full unavailable" data-dashboard />
      </div>
      <div>
        <p>You</p>
        <i className="fas fa-square-full you" data-dashboard />
      </div>
    </div>
  );
};

export default ColorGuide;
