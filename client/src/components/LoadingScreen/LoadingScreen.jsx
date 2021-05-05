import React from "react";
import { css } from "@emotion/core";
import SyncLoader from "react-spinners/SyncLoader";

const loader = css`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const LoadingScreen = () => {
  return (
    <div>
      <SyncLoader color={"#C6ED2C"} css={loader} size={20} />
    </div>
  );
};

export default LoadingScreen;
