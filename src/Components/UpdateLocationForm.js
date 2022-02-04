import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import InputLabel from "@mui/material/InputLabel";

export default function UpdateLocationForm(props) {
  const [ID, setID] = useState(null);
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [accountType, setAccountType] = useState("");
  const [insideOutsideCityTax, setInsideOutsideCityTax] = useState("");
  const [ectorTax, setEctorTax] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    setID(props.ID);
    setAddress1(props.address1);
    setAddress2(props.address2);
    setAccountType(props.accountType);
    setInsideOutsideCityTax(props.insideOutsideCityTax);
    setEctorTax(props.ectorTax);
  }, [
    props.ID,
    props.address1,
    props.address2,
    props.accountType,
    props.insideOutsideCityTax,
    props.ectorTax,
  ]);

  function handleClick() {
    if (!validate()) return;

    props.updateLocation(
      ID,
      address1,
      address2,
      accountType,
      insideOutsideCityTax,
      ectorTax
    );
  }

  function validate() {
    if (!address1 || !accountType) {
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
          Update Location
        </Typography>
        <IconButton onClick={props.toggleUpdateStatus}>
          <CloseIcon />
        </IconButton>
      </Grid>

      <FormControl margin="normal">
        <TextField
          required
          label="Enter New ID"
          variant="outlined"
          size="small"
          error={error && !ID && true}
          defaultValue={props.ID}
          onChange={(e) => {
            setID(e.target.value);
          }}
        ></TextField>
      </FormControl>

      <FormControl margin="normal">
        <TextField
          required
          label="Enter New Address 1"
          variant="outlined"
          size="small"
          error={error && !address1 && true}
          defaultValue={props.address1}
          onChange={(e) => {
            setAddress1(e.target.value);
          }}
        ></TextField>
      </FormControl>

      <FormControl margin="normal">
        <TextField
          label="Enter New Address 2"
          variant="outlined"
          size="small"
          defaultValue={props.address2}
          onChange={(e) => {
            setAddress2(e.target.value);
          }}
        ></TextField>
      </FormControl>

      <FormControl margin="normal">
        <InputLabel id="account-type">Account Type</InputLabel>
        <Select
          labelId="account-type"
          label="account-type"
          variant="outlined"
          size="small"
          error={error && !accountType && true}
          defaultValue={props.accountType}
          onChange={(e) => setAccountType(e.target.value)}
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
          error={error && !insideOutsideCityTax && true}
          defaultValue={props.insideOutsideCityTax}
          onChange={(e) => setInsideOutsideCityTax(e.target.value)}
        >
          <MenuItem value={"TSI"}>TSI</MenuItem>
          <MenuItem value={"TMI"}>TMI</MenuItem>
          <MenuItem value={"TCI"}>TCI</MenuItem>
          <MenuItem value={"TII"}>TII</MenuItem>
          <MenuItem value={"TSO"}>TSO</MenuItem>
          <MenuItem value={"TMO"}>TMO</MenuItem>
          <MenuItem value={"TCO"}>TCO</MenuItem>
          <MenuItem value={"TIO"}>TIO</MenuItem>
        </Select>
      </FormControl>

      <FormControl margin="normal">
        <InputLabel id="Ector Tax">Ector Tax</InputLabel>
        <Select
          labelId="Ector Tax"
          label="Ector Tax"
          variant="outlined"
          size="small"
          error={error && !ectorTax && true}
          defaultValue={props.ectorTax}
          onChange={(e) => setEctorTax(e.target.value)}
        >
          <MenuItem value={"EC"}>EC</MenuItem>
          <MenuItem value={"NO"}>NO</MenuItem>
        </Select>
      </FormControl>

      <Button variant="outlined" onClick={handleClick}>
        Update Location
      </Button>
    </Grid>
  );
}
