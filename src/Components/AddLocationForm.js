import React from "react";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Error from "./Error";

export default function AddLocationForm(props) {
  return (
    <Grid container direction="column" sx={{ width: "40%" }}>
      <Typography component="h1" variant="h5">
        Add a Location
      </Typography>
      <FormControl margin="normal">
        <TextField
          required
          label="Enter ID"
          variant="outlined"
          size="small"
          error={
            (props.addLocationFormError && !props.addID) ||
            (isNaN(props.addID) && true)
          }
          value={props.addID}
          onChange={(e) => props.setAddID(e.target.value)}
        ></TextField>
      </FormControl>

      <FormControl margin="normal">
        <TextField
          required
          label="Enter Address Line 1"
          variant="outlined"
          size="small"
          error={props.addLocationFormError && !props.addAddress1 && true}
          value={props.addAddress1}
          onChange={(e) => props.setAddAddress1(e.target.value)}
        ></TextField>
      </FormControl>

      <FormControl margin="normal">
        <TextField
          label="Enter Address Line 2"
          variant="outlined"
          size="small"
          value={props.addAddress2}
          onChange={(e) => props.setAddAddress2(e.target.value)}
        ></TextField>
      </FormControl>

      <FormControl margin="normal" size="small">
        <InputLabel id="account-type">Account Type</InputLabel>
        <Select
          labelId="account-type"
          label="account-type"
          variant="outlined"
          value={props.addAccountType}
          error={props.addLocationFormError && !props.addAccountType && true}
          onChange={(e) => props.setAddAccountType(e.target.value)}
        >
          <MenuItem value={"PERM"}>PERM</MenuItem>
          <MenuItem value={"TEMP"}>TEMP</MenuItem>
        </Select>
      </FormControl>

      <FormControl margin="normal">
        <InputLabel id="Inside Outside City Tax">
          Inside Outside City Tax
        </InputLabel>
        <Select
          labelId="Inside Outside City Tax"
          label="Inside Outside City Tax"
          variant="outlined"
          size="small"
          value={props.addInsideOutsideCityTax}
          onChange={(e) => props.setAddInsideOutsideCityTax(e.target.value)}
        >
          <MenuItem value={"TSI"}>TSI</MenuItem>
          <MenuItem value={"TMI"}>TMI</MenuItem>
          <MenuItem value={"TCI"}>TCI</MenuItem>
          <MenuItem value={"TII"}>TII</MenuItem>
          <MenuItem value={"TSO"}>TSO</MenuItem>
          <MenuItem value={"TMO"}>TMO</MenuItem>
          <MenuItem value={"TCO"}>TCO</MenuItem>
          <MenuItem value={"TIO"}>TIO</MenuItem>
          <MenuItem value={"VACANT"}>VACANT</MenuItem>
        </Select>
      </FormControl>

      <FormControl margin="normal">
        <InputLabel id="Ector Tax">Ector Tax</InputLabel>
        <Select
          labelId="Ector Tax"
          label="Ector Tax"
          variant="outlined"
          size="small"
          value={props.addEctorTax}
          onChange={(e) => props.setAddEctorTax(e.target.value)}
        >
          <MenuItem value={"EC"}>EC</MenuItem>
          <MenuItem value={"NO"}>NO</MenuItem>
          <MenuItem value={"VACANT"}>VACANT</MenuItem>
        </Select>
      </FormControl>

      <Button variant="outlined" onClick={props.addLocation}>
        Submit
      </Button>
      {props.errorMessage && <Error message={props.errorMessage} />}
    </Grid>
  );
}
