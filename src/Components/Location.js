import React, { useState, useEffect } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import GetLocationForm from "./GetLocationForm";
import AddLocationForm from "./AddLocationForm";
import Notification from "./Notification";

function formatLocationsArray(arr) {
  let locations = [];

  for (let i = 0; i < arr.length; i++) {
    let locationObj = {};
    locationObj.id = arr[i][0].value;
    locationObj.label = arr[i][2].value;
    locations.push(locationObj);
  }

  return locations;
}

export default function Location() {
  const [locations, setLocations] = useState([]);
  const [ID, setID] = useState(null);
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [accountType, setAccountType] = useState("");
  const [insideOutsideCityTax, setInsideOutsideCityTax] = useState("");
  const [ectorTax, setEctorTax] = useState("");
  const [results, setResults] = useState([]);
  const [update, setUpdate] = useState(false);
  const [getLocationError, setGetLocationError] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  const [addID, setAddID] = useState("");
  const [addAddress1, setAddAddress1] = useState("");
  const [addAddress2, setAddAddress2] = useState("");
  const [addAccountType, setAddAccountType] = useState("PERM");
  const [addInsideOutsideCityTax, setAddInsideOutsideCityTax] = useState("TSI");
  const [addEctorTax, setAddEctorTax] = useState("EC");
  const [addLocationFormError, setAddLocationFormError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
      .get(`/api/get-location/${ID}`)
      .then((res) => {
        let result = [];
        result.push({ ID: res.data[0][0].value });
        result.push({ ADDRESS1: res.data[0][2].value });
        result.push({ ADDRESS2: res.data[0][3].value });
        result.push({ ACCOUNT_TYPE: res.data[0][1].value });
        result.push({ INSIDE_OUTSIDE_CITY_TAX: res.data[0][4].value });
        result.push({ ECTOR_TAX: res.data[0][5].value });
        setID(res.data[0][0].value);
        setAddress2(res.data[0][3].value);
        setAccountType(res.data[0][1].value);
        setInsideOutsideCityTax(res.data[0][4].value);
        setEctorTax(res.data[0][5].value);
        setResults(result);
      })
      .catch((err) => console.log(err));
  }

  function toggleUpdateStatus() {
    setUpdate(!update);
  }

  function updateLocation(
    newID,
    newAddress1,
    newAddress2,
    newAccountType,
    newInsideOutsideCityTax,
    newEctorTax
  ) {
    axios
      .put("/api/update-location", {
        ID,
        newID,
        address1: newAddress1,
        address2: newAddress2,
        accountType: newAccountType,
        insideOutsideCityTax: newInsideOutsideCityTax,
        ectorTax: newEctorTax,
      })
      .then((res) => {
        toggleOpen();
        setMessage("Location Updated");
        setResults([
          { ID: res.data[0].value },
          { ADDRESS1: res.data[2].value },
          { ADDRESS2: res.data[3].value },
          { ACCOUNT_TYPE: res.data[1].value },
          { INSIDE_OUTSIDE_CITY_TAX: res.data[4].value },
          { ECTOR_TAX: res.data[5].value },
        ]);
        updateMUIOptions(ID, {
          label: res.data[2].value,
          id: res.data[0].value,
        });
        setUpdate(false);
        setID(res.data[0].value);
        setAddress2(res.data[3].value);
        setAccountType(res.data[1].value);
        setInsideOutsideCityTax(res.data[4].value);
        setEctorTax(res.data[5].value);
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
      let idx = locations.findIndex((elem) => elem.id === oldValue);
      locations[idx] = newValue;
      setAddress1(newValue.label);
    } else {
      locationsCopy.push(newValue);
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
        insideOutsideCityTax: addInsideOutsideCityTax,
        ectorTax: addEctorTax,
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
          setAddAccountType("PERM");
          setAddInsideOutsideCityTax("TSI");
          setAddEctorTax("EC");
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
        <GetLocationForm
          ID={ID}
          address1={address1}
          address2={address2}
          accountType={accountType}
          insideOutsideCityTax={insideOutsideCityTax}
          ectorTax={ectorTax}
          update={update}
          setID={setID}
          setAddress1={setAddress1}
          setResults={setResults}
          locations={locations}
          getLocationError={getLocationError}
          getLocation={getLocation}
          results={results}
          toggleUpdateStatus={toggleUpdateStatus}
          updateLocation={updateLocation}
        />

        <AddLocationForm
          addID={addID}
          setAddID={setAddID}
          addLocationFormError={addLocationFormError}
          addAddress1={addAddress1}
          setAddAddress1={setAddAddress1}
          addAddress2={addAddress2}
          setAddAddress2={setAddAddress2}
          addAccountType={addAccountType}
          setAddAccountType={setAddAccountType}
          addInsideOutsideCityTax={addInsideOutsideCityTax}
          setAddInsideOutsideCityTax={setAddInsideOutsideCityTax}
          addEctorTax={addEctorTax}
          setAddEctorTax={setAddEctorTax}
          addLocation={addLocation}
          errorMessage={errorMessage}
        />
      </Grid>
    </React.Fragment>
  );
}
