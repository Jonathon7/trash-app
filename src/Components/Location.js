import React, { useState, useEffect } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Card from "./Card";
import UpdateLocationForm from "./UpdateLocationForm";
import Error from "./Error";
import Notification from "./Notification";

function formatLocationsArray(arr) {
  let locations = [];

  for (let i = 0; i < arr.length; i++) {
    locations.push(arr[i][2].value);
  }

  return locations;
}

export default function Location() {
  const [locations, setLocations] = useState([]);
  const [ID, setID] = useState([]);
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [accountType, setAccountType] = useState("");
  const [results, setResults] = useState([]);
  const [addID, setAddID] = useState("");
  const [addAddress1, setAddAddress1] = useState("");
  const [addAddress2, setAddAddress2] = useState("");
  const [addAccountType, setAddAccountType] = useState("PERM");
  const [update, setUpdate] = useState(false);
  const [addLocationFormError, setAddLocationFormError] = useState(false);
  const [getLocationError, setGetLocationError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let isSubscribed = true;
    getLocations().then((locations) => {
      return isSubscribed ? setLocations(locations || []) : null;
    });
    return () => (isSubscribed = false);
  }, []);

  async function getLocations() {
    return axios
      .get("/api/get-locations")
      .then((res) => formatLocationsArray(res.data))
      .catch((err) => console.log(err));
  }

  function getLocation() {
    if (!validateGetLocationForm()) return;

    axios
      .get(`/api/get-location/${address1}`)
      .then((res) => {
        let result = [];
        result.push({ ID: res.data[0][0].value });
        result.push({ ADDRESS1: res.data[0][2].value });
        result.push({ ADDRESS2: res.data[0][3].value });
        result.push({ ACCOUNT_TYPE: res.data[0][1].value });
        setID(res.data[0][0].value);
        setAddress2(res.data[0][3].value);
        setAccountType(res.data[0][1].value);
        setResults(result);
      })
      .catch((err) => console.log(err));
  }

  function toggleUpdateStatus() {
    setUpdate(!update);
  }

  function updateLocation(newAddress1, newAddress2, newAccountType) {
    axios
      .put("/api/update-location", {
        ID,
        newAddress1,
        newAddress2,
        newAccountType,
      })
      .then((res) => {
        toggleOpen();
        setMessage("Location Updated");
        setResults([
          { ID: res.data[0].value },
          { ADDRESS1: res.data[2].value },
          { ADDRESS2: res.data[3].value },
          { ACCOUNT_TYPE: res.data[1].value },
        ]);
        updateMUIOptions(address1, res.data[2].value);
        setUpdate(false);
        setAddress2(res.data[3].value);
        setAccountType(res.data[1].value);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  /**
   * @param {String} oldValue - old address1 value
   * @param {Object || String} newValue - either the new address1 or the MUI object to add to the autocomplete's locations array
   */
  function updateMUIOptions(oldValue, newValue) {
    let locationsCopy = [...locations];
    if (oldValue) {
      let idx = locations.findIndex((elem) => elem === oldValue);
      locations[idx] = newValue;
      setAddress1(newValue);
    } else {
      locationsCopy.push(newValue[1].value);
      setLocations(locationsCopy);
    }
  }

  function addLocation() {
    if (!validateAddLocationForm()) return;

    axios
      .post("/api/add-location", {
        ID: addID,
        address1: addAddress1,
        address2: addAddress2,
        accountType: addAccountType,
      })
      .then((res) => {
        if (res.data === "Location already exists: ID already in use.") {
          setErrorMessage(res.data);
        } else {
          toggleOpen();
          setMessage("Location Added");
          setAddID("");
          setAddAddress1("");
          setAddAddress2("");
          setAddAccountType("");
          setAddLocationFormError(false);
          getLocations().then((locations) => setLocations(locations));
        }
      })
      .catch((err) => console.log(err));
  }

  function validateGetLocationForm() {
    if (!address1) {
      setGetLocationError(true);
      return false;
    }

    return true;
  }

  function validateAddLocationForm() {
    if (!addID || !addAddress1 || !addAccountType || isNaN(addID)) {
      setAddLocationFormError(true);
      return false;
    }

    return true;
  }

  function toggleOpen() {
    setOpen(!open);
  }

  return (
    <React.Fragment>
      <Notification open={open} message={message} toggleOpen={toggleOpen} />
      <Grid container direction="row" justifyContent="space-evenly">
        <Grid container direction="column" style={{ width: "40%" }}>
          <Typography component="h1" variant="h5">
            Find a Location
          </Typography>
          <FormControl margin="normal">
            <Autocomplete
              required
              autoComplete
              autoSelect
              autoHighlight
              variant="outlined"
              size="small"
              disabled={update && true}
              value={address1 || null}
              onChange={(e, val) => {
                setAddress1(val);
                setResults([]);
              }}
              options={locations}
              renderInput={(params) => {
                return (
                  <TextField
                    {...params}
                    label="Location Address"
                    error={getLocationError && !address1 && true}
                  />
                );
              }}
            ></Autocomplete>
          </FormControl>
          <Button
            variant="outlined"
            onClick={getLocation}
            disabled={update && true}
          >
            Search
          </Button>
          {results.length ? <Card title="Location" data={results} /> : null}
          {results.length ? (
            <Button variant="outlined" onClick={toggleUpdateStatus}>
              Change
            </Button>
          ) : null}

          {update && (
            <UpdateLocationForm
              address1={address1}
              address2={address2}
              accountType={accountType}
              toggleUpdateStatus={toggleUpdateStatus}
              updateLocation={updateLocation}
            />
          )}
        </Grid>
        <Grid container direction="column" style={{ width: "40%" }}>
          <Typography component="h1" variant="h5">
            Add a Location
          </Typography>
          <FormControl margin="normal">
            <TextField
              required
              label="Enter ID"
              variant="outlined"
              size="small"
              error={(addLocationFormError && !addID) || (isNaN(addID) && true)}
              value={addID}
              onChange={(e) => setAddID(e.target.value)}
            ></TextField>
          </FormControl>

          <FormControl margin="normal">
            <TextField
              required
              label="Enter Address Line 1"
              variant="outlined"
              size="small"
              error={addLocationFormError && !addAddress1 && true}
              value={addAddress1}
              onChange={(e) => setAddAddress1(e.target.value)}
            ></TextField>
          </FormControl>

          <FormControl margin="normal">
            <TextField
              label="Enter Address Line 2"
              variant="outlined"
              size="small"
              value={addAddress2}
              onChange={(e) => setAddAddress2(e.target.value)}
            ></TextField>
          </FormControl>

          <FormControl margin="normal" size="small">
            <InputLabel id="account-type">Account Type</InputLabel>
            <Select
              labelId="account-type"
              label="account-type"
              variant="outlined"
              value={addAccountType}
              error={addLocationFormError && !addAccountType && true}
              onChange={(e) => setAddAccountType(e.target.value)}
            >
              <MenuItem value={"PERM"}>PERM</MenuItem>
              <MenuItem value={"TEMP"}>TEMP</MenuItem>
            </Select>
          </FormControl>

          <Button variant="outlined" onClick={addLocation}>
            Submit
          </Button>
          {errorMessage && <Error message={errorMessage} />}
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
