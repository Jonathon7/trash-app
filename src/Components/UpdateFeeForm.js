import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";

export default function AddFeeForm(props) {
  const [feeName, setFeeName] = useState("");
  const [feeAmount, setFeeAmount] = useState("");
  const [feeID, setFeeID] = useState("");
  const [chargeCode, setChargeCode] = useState("");
  const [rateCode, setRateCode] = useState("");
  const [error, setError] = useState(false);
  const [validNumber, setValidNumber] = useState(true);

  function handleClick() {
    if (!validate() || !isValidAmount(feeAmount)) return;
    props.updateFee(feeID, feeAmount, chargeCode, rateCode);
  }

  function validate() {
    if (!feeName || !feeAmount) {
      setError(true);
      return false;
    }

    return true;
  }

  function handleFeeOnChange(e, val) {
    if (val) {
      setFeeName(val.label);
      setFeeAmount(val.amount);
      setChargeCode(val.chargeCode);
      setRateCode(val.rateCode);
      setFeeID(val.id);
    } else {
      setFeeName(val);
      setFeeAmount("");
      setChargeCode("");
      setRateCode("");
      setFeeID("");
    }
  }

  function isValidAmount(amount) {
    console.log(amount);
    if (isNaN(amount)) {
      setValidNumber(false);
      return false;
    }

    return true;
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
          onFocus={() => !validNumber && setValidNumber(true)}
          value={feeAmount}
          onChange={(e) => setFeeAmount(e.target.value)}
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
