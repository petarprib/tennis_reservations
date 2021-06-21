import { createMuiTheme } from "@material-ui/core";

const theme = createMuiTheme({
  typography: {
    fontFamily: "Lato",
  },
  props: {
    MuiButtonBase: {
      disableRipple: true,
    },
    MuiButtonGroup: {
      disableRipple: true,
    },
  },
});

export default theme;
