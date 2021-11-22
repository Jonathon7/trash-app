import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

export default function AddFeeForm(props) {
  const [addFeeName, setAddFeeName] = useState("");
  const [addFeeAmount, setAddFeeAmount] = useState("");
  const [error, setError] = useState(false);
  const [validNumber, setValidNumber] = useState(true);

  function handleClick() {
    if (!validate() || !isValidAmount) return;
    isValidAmount();
    props.addFeeToDB(addFeeName, addFeeAmount);
  }

  function validate() {
    if (!addFeeName || !addFeeAmount) {
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
    if (isNaN(addFeeAmount) || addFeeAmount.slice(-1) === ".") {
      return false;
    }

    return true;
  }

  return (
    <Grid container direction="column">
      <FormControl margin="normal">
        <TextField
          label="Fee Name"
          variant="outlined"
          size="small"
          error={error && !addFeeName && true}
          value={addFeeName}
          onChange={(e) => setAddFeeName(e.target.value)}
        ></TextField>
      </FormControl>
      <FormControl margin="normal">
        <TextField
          label="Fee Amount"
          variant="outlined"
          size="small"
          error={(error && !addFeeAmount) || (!validNumber && true)}
          value={addFeeAmount}
          onFocus={() => !validNumber && setValidNumber(true)}
          onChange={(e) => setAddFeeAmount(e.target.value)}
        ></TextField>
      </FormControl>
      <Button variant="outlined" onClick={handleClick}>
        Submit
      </Button>
    </Grid>
  );
}
