import React, { useState } from "react";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Divider from "@mui/material/Divider";
import SideDrawer from "./SideDrawer";
import Customer from "./Customer";
import Location from "./Location";
import Container from "./Container";
import Transactions from "./Transactions";
import { Typography } from "@mui/material";

export default function Main() {
  const [componentName, setComponent] = useState("Transactions");
  let component = null;

  function toggleComponent(selectedComponent) {
    setComponent(selectedComponent);
  }

  switch (componentName) {
    case "Customer":
      component = <Customer />;
      break;
    case "Location":
      component = <Location />;
      break;
    case "Container":
      component = <Container />;
      break;
    case "Transactions":
      component = <Transactions />;
      break;
    default:
      component = <Customer />;
  }

  return (
    <React.Fragment>
      <Toolbar>
        <Typography>{componentName}</Typography>
      </Toolbar>
      <Divider />
      <SideDrawer
        toggleComponent={toggleComponent}
        componentName={componentName}
      ></SideDrawer>
      <Box sx={{ mt: 3, ml: 25, maxWidth: 1200 }}>{component}</Box>
    </React.Fragment>
  );
}
