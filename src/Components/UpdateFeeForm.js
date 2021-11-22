import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

export default function AddFeeForm(props) {
  const [feeName, setFeeName] = useState("");
  const [feeAmount, setFeeAmount] = useState("");
  const [feeID, setFeeID] = useState("");
  const [error, setError] = useState(false);
  const [validNumber, setValidNumber] = useState(true);

  function handleClick() {
    if (!validate() || !isValidAmount()) return;
    props.updateFee(feeID, feeAmount);
  }

  function validate() {
    if (!feeName || !feeAmount) {
      setError(true);
      return false;
    }

    if (!isValidAmount()) {
      setValidNumber(false);
      return false;
    }

    return true;
  }

  function isValidAmount() {
    if (isNaN(feeAmount) || feeAmount.toString().slice(-1) === ".") {
      return false;
    }

    return true;
  }

  function handleFeeOnChange(e, val) {
    setFeeName(val ? val.label : val);

    if (!feeAmount) {
      setFeeAmount(val.amount / 100);
    }

    if (!feeID) {
      setFeeID(val.id);
    }

    if (!val) {
      setFeeAmount("");
      setFeeID("");
    }
  }

  return (
    <Grid container direction="column">
      <FormControl margin="normal">
        <Autocomplete
          required
          variant="outlined"
          size="small"
          value={feeName || null}
          onChange={handleFeeOnChange}
          options={props.fees}
          isOptionEqualToValue={(option, value) => {
            return option.label === value;
          }}
          renderOption={(props, option) => {
            return (
              <li {...props} key={option.label}>
                {option.label}
              </li>
            );
          }}
          renderInput={(params) => {
            return <TextField {...params} label="Fees" />;
          }}
        ></Autocomplete>
      </FormControl>
      <FormControl margin="normal">
        <TextField
          label="Fee Amount"
          variant="outlined"
          size="small"
          error={(error && !feeAmount) || (!validNumber && true)}
          value={feeAmount}
          onFocus={() => !validNumber && setValidNumber(true)}
          onChange={(e) => setFeeAmount(e.target.value)}
        ></TextField>
      </FormControl>
      <Button variant="outlined" onClick={handleClick}>
        Submit
      </Button>
    </Grid>
  );
}
