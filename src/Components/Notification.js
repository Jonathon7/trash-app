import React from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

export default function Notification(props) {
  return (
    <React.Fragment>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={props.open}
        autoHideDuration={6000}
        onClose={props.toggleOpen}
      >
        <Alert severity={props.severity}>{props.message}</Alert>
      </Snackbar>
    </React.Fragment>
  );
}
