import React from "react";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import MUISwitch from "@mui/material/Switch";

export default function Switchs(props) {
  return (
    <FormGroup sx={{ m: 3 }}>
      <FormControlLabel
        disabled={props.disabled || false}
        control={<MUISwitch onChange={props.onChange} />}
        label={props.label || ""}
      />
    </FormGroup>
  );
}
