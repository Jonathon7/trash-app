import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";

export default function AddFeeForm(props) {
  const [addFeeName, setAddFeeName] = useState("");
  const [addFeeAmount, setAddFeeAmount] = useState("");
  const [chargeCode, setChargeCode] = useState("");
  const [rateCode, setRateCode] = useState("");
  const [error, setError] = useState(false);
  const [validNumber, setValidNumber] = useState(true);

  function handleClick() {
    if (!validate() || !isValidAmount()) return;
    isValidAmount();
    props.addFeeToDB(addFeeName, addFeeAmount, chargeCode, rateCode);
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
    if (isNaN(addFeeAmount)) {
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
      <FormControl margin="normal" size="small">
        <InputLabel id="charge-code">Charge Code</InputLabel>
        <Select
          value={chargeCode}
          label="Charge Code"
          onChange={(e) => setChargeCode(e.target.value)}
        >
          <MenuItem value={4200}>4200</MenuItem>
          <MenuItem value={6500}>6500</MenuItem>
        </Select>
      </FormControl>
      <FormControl margin="normal" size="small">
        <InputLabel id="rate-code">Rate Code</InputLabel>
        <Select
          value={rateCode}
          label="Rate Code"
          onChange={(e) => setRateCode(e.target.value)}
        >
          <MenuItem value={"EC"}>EC</MenuItem>
          <MenuItem value={"TAF"}>TAF</MenuItem>
          <MenuItem value={"TAH"}>TAH</MenuItem>
          <MenuItem value={"TCI"}>TCI</MenuItem>
          <MenuItem value={"TCO"}>TCO</MenuItem>
          <MenuItem value={"TDR3"}>TDR3</MenuItem>
          <MenuItem value={"TDR4"}>TDR4</MenuItem>
          <MenuItem value={"TDRC"}>TDRC</MenuItem>
          <MenuItem value={"TII"}>TII</MenuItem>
          <MenuItem value={"TIO"}>TIO</MenuItem>
          <MenuItem value={"TLT"}>TLT</MenuItem>
          <MenuItem value={"TMI"}>TMI</MenuItem>
          <MenuItem value={"TMO"}>TMO</MenuItem>
          <MenuItem value={"TMR3"}>TMR3</MenuItem>
          <MenuItem value={"TMR4"}>TMR4</MenuItem>
          <MenuItem value={"TNOS"}>TNOS</MenuItem>
          <MenuItem value={"TOFP"}>TOFP</MenuItem>
          <MenuItem value={"TOP"}>TOP</MenuItem>
          <MenuItem value={"TOW"}>TOW</MenuItem>
          <MenuItem value={"TPF"}>TPF</MenuItem>
          <MenuItem value={"TSC"}>TSC</MenuItem>
          <MenuItem value={"TSE"}>TSE</MenuItem>
          <MenuItem value={"TSC"}>TSC</MenuItem>
          <MenuItem value={"TSF"}>TSF</MenuItem>
          <MenuItem value={"TSH"}>TSH</MenuItem>
          <MenuItem value={"TSI"}>TSI</MenuItem>
          <MenuItem value={"TSO"}>TSO</MenuItem>
          <MenuItem value={"TSRF"}>TSRF</MenuItem>
          <MenuItem value={"TTF"}>TTF</MenuItem>
        </Select>
      </FormControl>
      <Button variant="outlined" onClick={handleClick}>
        Submit
      </Button>
    </Grid>
  );
}
