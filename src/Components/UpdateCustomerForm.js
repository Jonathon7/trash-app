import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

export default function UpdateCustomerForm(props) {
  const [updateName, setUpdateName] = useState("");
  const [error, setError] = useState(false);

  function handleClick() {
    if (!validate()) return;
    props.updateCustomerName(updateName);
  }

  function validate() {
    if (!updateName) {
      setError(true);
      return false;
    } else {
      return true;
    }
  }

  return (
    <Grid container direction="column" style={{ width: "100%", marginTop: 10 }}>
      <Grid container justifyContent="space-between">
        <Typography component="h1" variant="h5">
          Update Customer
        </Typography>
        <IconButton onClick={props.toggleUpdateStatus}>
          <CloseIcon />
        </IconButton>
      </Grid>
      <FormControl margin="normal">
        <TextField
          required
          label="Enter New Customer Name"
          variant="outlined"
          size="small"
          error={error && !updateName && true}
          defaultValue={props.name}
          onChange={(e) => setUpdateName(e.target.value)}
        ></TextField>
      </FormControl>
      <Button variant="outlined" onClick={handleClick}>
        Update Customer
      </Button>
    </Grid>
  );
}
