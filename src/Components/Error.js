import React from "react";
import Typography from "@mui/material/Typography";

export default function Error(props) {
  return (
    <React.Fragment>
      <Typography
        variant="h6"
        component="div"
        color="red"
        style={{ marginTop: 10 }}
      >
        {props.message}
      </Typography>
    </React.Fragment>
  );
}
