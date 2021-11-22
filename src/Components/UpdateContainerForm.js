import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import DesktopDatePicker from "@mui/lab/DatePicker";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

export default function UpdateContainerForm(props) {
  const [ID, setID] = useState("");
  const [cubicYard, setCubicYard] = useState("");
  const [type, setType] = useState("");
  const [cityOwned, setCityOwned] = useState("");
  const [setDate, setSetDate] = useState(null);
  const [inStock, setInStock] = useState("");
  const [locationID, setLocationID] = useState("");
  const [customerID, setCustomerID] = useState("");
  const [comments, setComments] = useState("");
  const [returnedToStockDate, setReturnedToStockDate] = useState(null);

  const setInitialValues = useCallback(() => {
    setID(props.ID);
    setCubicYard(props.cubicYard);
    setType(props.type);
    setCityOwned(props.cityOwned);
    setSetDate(props.setDate);
    setInStock(props.inStock);
    setLocationID(props.locationID);
    setCustomerID(props.customerID);
    setComments(props.comments);
    setReturnedToStockDate(props.returnedToStockDate);
    if (props.setDate) {
      setSetDate(props.setDate);
    }
  }, [
    props.ID,
    props.cubicYard,
    props.type,
    props.cityOwned,
    props.setDate,
    props.inStock,
    props.locationID,
    props.customerID,
    props.comments,
    props.returnedToStockDate,
  ]);

  useEffect(() => {
    setInitialValues();
  }, [setInitialValues]);

  function updateContainer() {
    axios
      .put("/api/container", {
        ID: ID,
        cubicYard: cubicYard,
        type: type,
        cityOwned: cityOwned,
        inStock: inStock,
        setDate: setDate,
        returnedToStockDate: returnedToStockDate,
        locationID: locationID || 0,
        customerID: customerID || 0,
        comments: comments,
      })
      .then((res) => {
        if (typeof res.data === "string") {
          props.changeSeverity("error");
          props.setNotificationMessage(res.data);
          props.toggleOpen();
          return;
        }

        props.changeSeverity("success");
        props.toggleOpen();
        props.setNotificationMessage("Container Updated");
        props.toggleUpdateStatus();
      })
      .catch((err) => console.log(err));
  }

  return (
    <React.Fragment>
      <Grid
        container
        direction="column"
        style={{ width: "100%", marginTop: 10, marginBottom: 50 }}
      >
        <Grid container justifyContent="space-between">
          <Typography variant="h5" component="h1">
            Update Container
          </Typography>
          <IconButton onClick={props.toggleUpdateStatus}>
            <CloseIcon />
          </IconButton>
        </Grid>
        <FormControl margin="normal">
          <TextField
            disabled
            label="Container ID"
            variant="outlined"
            size="small"
            value={ID}
            onChange={(e) => setID(e.target.value)}
          ></TextField>
        </FormControl>

        <FormControl margin="normal">
          <InputLabel id="cubic-yard">Cubic Yard</InputLabel>
          <Select
            labelId="cubic-yard"
            label="cubic-yard"
            variant="outlined"
            size="small"
            value={cubicYard}
            onChange={(e) => setCubicYard(e.target.value)}
          >
            <MenuItem value={30}>30yd</MenuItem>
            <MenuItem value={35}>35yd</MenuItem>
            <MenuItem value={40}>40yd</MenuItem>
            <MenuItem value={42}>42yd</MenuItem>
          </Select>
        </FormControl>

        <FormControl margin="normal">
          <InputLabel id="type">Type</InputLabel>
          <Select
            labelId="type"
            label="type"
            variant="outlined"
            size="small"
            value={type.trim()}
            onChange={(e) => setType(e.target.value)}
          >
            <MenuItem value={"COMPACTOR"}>COMPACTOR</MenuItem>
            <MenuItem value={"OPEN TOP"}>OPEN TOP</MenuItem>
          </Select>
        </FormControl>

        <FormControl margin="normal">
          <InputLabel id="city-owned">City Owned</InputLabel>
          <Select
            labelId="city-owned"
            label="city-owned"
            variant="outlined"
            size="small"
            value={cityOwned}
            onChange={(e) => setCityOwned(e.target.value)}
          >
            <MenuItem value={"YES"}>YES</MenuItem>
            <MenuItem value={"NO"}>NO</MenuItem>
          </Select>
        </FormControl>

        <FormControl margin="normal">
          <InputLabel id="in-stock">In Stock</InputLabel>
          <Select
            labelId="in-stock"
            label="in-stock"
            variant="outlined"
            size="small"
            value={inStock}
            onChange={(e) => setInStock(e.target.value)}
          >
            <MenuItem value={"YES"}>YES</MenuItem>
            <MenuItem value={"NO"}>NO</MenuItem>
          </Select>
        </FormControl>

        <FormControl margin="normal">
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DesktopDatePicker
              disabled={!returnedToStockDate ? false : true}
              label="Set Date"
              value={setDate}
              onChange={(date) => setSetDate(date)}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </FormControl>

        <FormControl margin="normal">
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DesktopDatePicker
              disabled={!setDate ? false : true}
              label="Returned to Stock Date"
              value={returnedToStockDate}
              onChange={(date) => setReturnedToStockDate(date)}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </FormControl>

        <FormControl margin="normal">
          <TextField
            required
            label="Customer ID"
            variant="outlined"
            size="small"
            value={customerID}
            onChange={(e) => setCustomerID(e.target.value)}
          ></TextField>
        </FormControl>

        <FormControl margin="normal">
          <TextField
            required
            label="Location ID"
            variant="outlined"
            size="small"
            value={locationID}
            onChange={(e) => setLocationID(e.target.value)}
          ></TextField>
        </FormControl>

        <FormControl margin="normal">
          <TextField
            label="Comments"
            variant="outlined"
            size="small"
            value={comments || ""}
            onChange={(e) => setComments(e.target.value)}
          ></TextField>
        </FormControl>
        <Button variant="outlined" onClick={updateContainer}>
          Submit
        </Button>
      </Grid>
    </React.Fragment>
  );
}
