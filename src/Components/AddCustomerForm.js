import React from "react";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
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
      <FormControl margin="dense">
        <InputLabel id="tax-exempt">Tax Exempt</InputLabel>
        <Select
          labelId="tax-exempt"
          label="tax-exempt"
          variant="outlined"
          size="small"
          value={props.addTaxExempt === "YES" ? "YES" : "NO"}
          onChange={(e) => props.setAddTaxExempt(e.target.value)}
        >
          <MenuItem value={"YES"}>YES</MenuItem>
          <MenuItem value={"NO"}>NO</MenuItem>
        </Select>
      </FormControl>
      <Button variant="outlined" onClick={props.addCustomer}>
        Add Customer
      </Button>
      {props.errorMessage && <Error message={props.errorMessage} />}
    </Grid>
  );
}
