import React from "react";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Error from "./Error";

export default function AddCustomerForm(props) {
  return (
    <Grid container direction="column" sx={{ width: "40%" }}>
      <Typography component="h1" variant="h5">
        Add a Customer
      </Typography>
      <FormControl margin="normal">
        <TextField
          required
          label="Enter ID"
          variant="outlined"
          size="small"
          value={props.addID}
          error={
            (props.addCustomerError && !props.addID) ||
            (isNaN(props.addID) && true)
          }
          onFocus={() => props.setErrorMessage("")}
          onChange={(e) => props.setAddID(e.target.value)}
        ></TextField>
      </FormControl>
      <FormControl sx={{ mb: 1 }}>
        <TextField
          required
          label="Enter Customer Name"
          variant="outlined"
          size="small"
          value={props.addName}
          error={props.addCustomerError && !props.addName && true}
          onChange={(e) => props.setAddName(e.target.value)}
        ></TextField>
      </FormControl>
      <Button variant="outlined" onClick={props.addCustomer}>
        Add Customer
      </Button>
      {props.errorMessage && <Error message={props.errorMessage} />}
    </Grid>
  );
}
