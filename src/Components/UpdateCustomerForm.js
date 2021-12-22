import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

export default function UpdateCustomerForm(props) {
  const [updateID, setUpdateID] = useState(null);
  const [updateName, setUpdateName] = useState("");
  const [updateTaxExempt, setUpdateTaxExempt] = useState("NO");

  useEffect(() => {
    setUpdateTaxExempt(props.taxExempt);
  }, [props.taxExempt]);

  function handleClick() {
    props.updateCustomer(
      updateID ? updateID : props.ID,
      updateName ? updateName : props.name,
      updateTaxExempt
    );
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
          label="Enter New Customer ID"
          variant="outlined"
          size="small"
          defaultValue={props.ID}
          onChange={(e) => setUpdateID(e.target.value)}
        ></TextField>
      </FormControl>
      <FormControl margin="normal">
        <TextField
          required
          label="Enter New Customer Name"
          variant="outlined"
          size="small"
          defaultValue={props.name}
          onChange={(e) => setUpdateName(e.target.value)}
        ></TextField>
      </FormControl>
      <FormControl margin="normal">
        <InputLabel id="tax-exempt">Tax Exempt</InputLabel>
        <Select
          labelId="tax-exempt"
          label="tax-exempt"
          variant="outlined"
          size="small"
          value={updateTaxExempt}
          onChange={(e) => setUpdateTaxExempt(e.target.value)}
        >
          <MenuItem value={"YES"}>YES</MenuItem>
          <MenuItem value={"NO"}>NO</MenuItem>
        </Select>
      </FormControl>
      <Button variant="outlined" onClick={handleClick}>
        Update Customer
      </Button>
    </Grid>
  );
}
