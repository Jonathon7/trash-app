import React, { useState, useEffect } from "react";
import axios from "axios";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import Card from "./Card";
import UpdateContainerForm from "./UpdateContainerForm";
import Error from "./Error";
import Notification from "./Notification";

// SQL Server formats the return array with nested objects and the MUI Autocomplete component wants a different format
function createContainerIDsArray(arr) {
  let result = [];

  for (let i = 0; i < arr.length; i++) {
    result.push(arr[i][0].value);
  }

  return result;
}

export default function Container() {
  const [ID, setID] = useState("");
  const [results, setResults] = useState([]);
  const [containerIDs, setContainerIDs] = useState([]);
  const [getContainerError, setGetContainerError] = useState(false);
  const [update, setUpdate] = useState(false);
  const [cubicYard, setCubicYard] = useState("");
  const [type, setType] = useState("");
  const [cityOwned, setCityOwned] = useState("");
  const [setDateVal, setSetDateVal] = useState("");
  const [inStock, setInStock] = useState(false);
  const [locationID, setLocationID] = useState("");
  const [customerID, setCustomerID] = useState("");
  const [comments, setComments] = useState("");
  const [returnedToStockDate, setReturnedToStockDate] = useState(null);
  const [addID, setAddID] = useState("");
  const [addCubicYard, setAddCubicYard] = useState(30);
  const [addType, setAddType] = useState("COMPACTOR");
  const [addCityOwned, setAddCityOwned] = useState("YES");
  const [addInStock, setAddInStock] = useState("YES");
  const [addSetDateVal, setAddSetDateVal] = useState(null);
  const [addReturnedToStockDate, setAddReturnedToStockDate] = useState(null);
  const [addLocationID, setAddLocationID] = useState(0);
  const [addCustomerID, setAddCustomerID] = useState(0);
  const [addComments, setAddComments] = useState("");
  const [addContainerError, setAddContainerError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("info");

  useEffect(() => {
    let isSubscribed = true;
    getContainerIDs().then((IDs) => {
      if (isSubscribed) {
        setContainerIDs(IDs);
      }
    });

    return () => (isSubscribed = false);
  }, []);

  const getContainerIDs = () =>
    new Promise((resolve) => {
      axios
        .get("/api/container")
        .then((res) => {
          resolve(createContainerIDsArray(res.data));
        })
        .catch((err) => console.log(err));
    });

  function getContainer() {
    if (!validateGetContainerForm()) return;

    axios
      .get(`/api/container/${ID}`)
      .then((res) => {
        let result = [];
        result.push({ ID: res.data[1].value });
        result.push({ CUBIC_YARD: res.data[2].value });
        result.push({ TYPE: res.data[3].value });
        result.push({ CITY_OWNED: res.data[4].value ? "YES" : "NO" });
        result.push({
          IN_STOCK: res.data[9].value ? "YES" : "NO",
        });
        result.push({
          SET_DATE: res.data[5].value ? res.data[5].value : "NULL",
        });
        result.push({ LOCATION_ID: res.data[6].value });
        result.push({ CUSTOMER_ID: res.data[7].value });
        result.push({ COMMENTS: res.data[8].value });
        result.push({ RETURNED_TO_STOCK_DATE: res.data[10].value });
        setCubicYard(res.data[2].value);
        setType(res.data[3].value);
        setCityOwned(res.data[4].value ? "YES" : "NO");
        setSetDateVal(res.data[5].value);
        setInStock(res.data[9].value ? "YES" : "NO");
        setLocationID(res.data[6].value);
        setCustomerID(res.data[7].value);
        setComments(res.data[8].value);
        setReturnedToStockDate(res.data[10].value);
        setResults(result);
      })
      .catch((err) => console.log(err));
  }

  function handleAutocompleteChange(e, val) {
    setResults([]);
    if (val) {
      setID(val);
      setResults([]);
    }
  }

  function validateGetContainerForm() {
    if (!ID) {
      setGetContainerError(true);
      return false;
    } else {
      return true;
    }
  }

  function validateAddContainerForm() {
    if (
      !addID ||
      (!addCustomerID && addCustomerID !== 0) ||
      (!addLocationID && addLocationID !== 0)
    ) {
      setAddContainerError(true);
      return false;
    } else {
      return true;
    }
  }

  function addContainer() {
    if (!validateAddContainerForm()) return;

    axios
      .post("/api/container", {
        ID: addID,
        cubicYard: addCubicYard,
        type: addType,
        cityOwned: addCityOwned,
        inStock: addInStock,
        setDate: addSetDateVal,
        customerID: addCustomerID,
        locationID: addLocationID,
        comments: addComments,
        returnedToStockDate: addReturnedToStockDate,
      })
      .then((res) => {
        if (typeof res.data === "string") {
          changeSeverity("error");
          setNotificationMessage(res.data);
          toggleOpen();
          return;
        } else {
          toggleOpen();
          setMessage("Container Added");
          setAddID("");
          setAddCubicYard(30);
          setAddType("COMPACTOR");
          setAddCityOwned("YES");
          setAddSetDateVal(null);
          setAddLocationID(0);
          setAddCustomerID(0);
          setAddComments("");
          setAddReturnedToStockDate(null);
          getContainerIDs();
        }
      })
      .catch((err) => console.log(err));
  }

  function toggleUpdateStatus() {
    setUpdate(!update);
  }

  function validate(val) {
    if (!val && val !== 0) {
      return true;
    }

    return false;
  }

  function toggleOpen() {
    setOpen(!open);
  }

  function setNotificationMessage(msg) {
    setMessage(msg);
  }

  function changeSeverity(value) {
    setSeverity(value);
  }

  return (
    <React.Fragment>
      <Notification
        open={open}
        message={message}
        toggleOpen={toggleOpen}
        severity={severity}
      />
      <Grid container direction="row" justifyContent="space-evenly">
        <Grid container direction="column" style={{ width: "40%" }}>
          <Typography variant="h5" component="h1">
            Find a Container
          </Typography>
          <FormControl margin="normal">
            <Autocomplete
              required
              autoComplete
              autoSelect
              autoHighlight
              variant="outlined"
              size="small"
              value={ID || null}
              disabled={update && true}
              onChange={handleAutocompleteChange}
              getOptionLabel={(option) => option.toString()}
              options={containerIDs}
              isOptionEqualToValue={(option, value) => {
                return option === value;
              }}
              renderOption={(props, option) => {
                return (
                  <li {...props} key={option}>
                    {option}
                  </li>
                );
              }}
              renderInput={(params) => {
                return (
                  <TextField
                    {...params}
                    label="Container ID"
                    error={getContainerError && !ID && true}
                  />
                );
              }}
            ></Autocomplete>
          </FormControl>
          <Button
            variant="outlined"
            disabled={update && true}
            onClick={getContainer}
          >
            Search
          </Button>
          {results.length ? <Card title="Container" data={results} /> : null}
          {results.length ? (
            <Button variant="outlined" onClick={toggleUpdateStatus}>
              Change
            </Button>
          ) : null}
          {update && (
            <UpdateContainerForm
              toggleUpdateStatus={toggleUpdateStatus}
              ID={ID}
              cubicYard={cubicYard}
              type={type}
              cityOwned={cityOwned}
              setDate={setDateVal}
              inStock={inStock}
              locationID={locationID}
              customerID={customerID}
              comments={comments}
              returnedToStockDate={returnedToStockDate}
              toggleOpen={toggleOpen}
              changeSeverity={changeSeverity}
              setNotificationMessage={setNotificationMessage}
            />
          )}
        </Grid>
        <Grid container direction="column" style={{ width: "40%" }}>
          <Typography variant="h5" component="h1">
            Add a Container
          </Typography>
          <FormControl margin="normal">
            <TextField
              required
              label="Container ID"
              variant="outlined"
              size="small"
              error={addContainerError && !addID && true}
              value={addID}
              onFocus={() => errorMessage && setErrorMessage("")}
              onChange={(e) => setAddID(e.target.value)}
            ></TextField>
          </FormControl>

          <FormControl margin="normal">
            <InputLabel id="cubic-yard">Cubic Yard</InputLabel>
            <Select
              labelId="cubic-yard"
              size="small"
              variant="outlined"
              value={addCubicYard}
              onChange={(e) => setAddCubicYard(e.target.value)}
              label="Cubic Yard"
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
              size="small"
              value={addType}
              onChange={(e) => setAddType(e.target.value)}
              label="Type"
            >
              <MenuItem value={"COMPACTOR"}>COMPACTOR</MenuItem>
              <MenuItem value={"OPEN TOP"}>OPEN TOP</MenuItem>
            </Select>
          </FormControl>

          <FormControl margin="normal">
            <InputLabel id="city-owned">City Owned</InputLabel>
            <Select
              labelId="city-owned"
              size="small"
              value={addCityOwned}
              onChange={(e) => setAddCityOwned(e.target.value)}
              label="City Owned"
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
              value={addInStock}
              onChange={(e) => setAddInStock(e.target.value)}
            >
              <MenuItem value={"YES"}>YES</MenuItem>
              <MenuItem value={"NO"}>NO</MenuItem>
            </Select>
          </FormControl>

          <FormControl margin="normal">
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DesktopDatePicker
                disabled={!addReturnedToStockDate ? false : true}
                label="Set Date"
                value={addSetDateVal}
                onChange={(date) => setAddSetDateVal(date)}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </FormControl>

          <FormControl margin="normal">
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DesktopDatePicker
                disabled={!addSetDateVal ? false : true}
                label="Returned to Stock Date"
                value={addReturnedToStockDate}
                onChange={(date) => setAddReturnedToStockDate(date)}
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
              error={validate(addCustomerID)}
              value={addCustomerID}
              onChange={(e) => setAddCustomerID(e.target.value)}
            ></TextField>
          </FormControl>

          <FormControl margin="normal">
            <TextField
              required
              label="Location ID"
              variant="outlined"
              size="small"
              error={validate(addLocationID)}
              value={addLocationID}
              onChange={(e) => setAddLocationID(e.target.value)}
            ></TextField>
          </FormControl>

          <FormControl margin="normal">
            <TextField
              label="Comments"
              variant="outlined"
              size="small"
              value={addComments}
              onChange={(e) => setAddComments(e.target.value)}
            ></TextField>
          </FormControl>
          <Button variant="outlined" onClick={addContainer}>
            Submit
          </Button>
          {errorMessage && <Error message={errorMessage} />}
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
