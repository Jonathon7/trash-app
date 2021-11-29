import React, { useState, useEffect } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Card from "./Card";
import Error from "./Error";
import UpdateCustomerForm from "./UpdateCustomerForm";
import Notification from "./Notification";

// SQL Server formats the return array with nested objects and the MUI Autocomplete component wants a different format
function createCustomersArray(arr) {
  let result = [];

  for (let i = 0; i < arr.length; i++) {
    result.push({ label: arr[i][1].value, id: arr[i][0].value });
  }

  return result;
}

export default function Customer() {
  const [customers, setCustomers] = useState([]);
  const [customerID, setCustomerID] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [getCustomerError, setGetCustomerError] = useState(false);
  const [results, setResults] = useState([]);
  const [addID, setAddID] = useState("");
  const [addName, setAddName] = useState("");
  const [addCustomerError, setAddCustomerError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [update, setUpdate] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let isSubscribed = true;
    getCustomers().then((customers) => {
      return isSubscribed ? setCustomers(customers || []) : null;
    });
    return () => (isSubscribed = false);
  }, []);

  async function getCustomers() {
    return axios
      .get("/api/get-customers")
      .then((res) => createCustomersArray(res.data))
      .catch((err) => console.log(err));
  }

  function getCustomer() {
    if (!validateGetCustomerForm()) return;

    axios
      .get(`/api/get-customer/${customerID}`)
      .then((res) => {
        let result = [];
        result.push({ ID: res.data[0][0].value });
        result.push({ Name: res.data[0][1].value });
        setResults(result);
      })
      .catch((err) => console.log(err));
  }

  function addCustomer() {
    if (!validateAddCustomerForm()) return;

    axios
      .post("/api/add-customer", { id: addID, name: addName })
      .then((res) => {
        if (typeof res.data === "string") {
          setErrorMessage(res.data);
        } else {
          toggleOpen();
          setMessage("Customer Added");
          setAddID("");
          setAddName("");
          updateMUIOptions(null, res.data);
        }
      })
      .catch((err) => console.log(err));
  }

  function updateCustomerName(newName) {
    axios
      .put("/api/update-name", { newName, id: results[0].ID })
      .then((res) => {
        updateMUIOptions(customerName, res.data[1].value);
        toggleOpen();
        setMessage("Customer Info Updated");
        setResults([{ ID: res.data[0].value }, { NAME: res.data[1].value }]);
        setUpdate(false);
      })
      .catch((err) => console.log(err));
  }

  function updateMUIOptions(oldValue, newValue) {
    if (oldValue) {
      let option = customers.find((elem) => elem.label === oldValue);
      option.label = newValue;
      setCustomerName(newValue);
    } else {
      let customersCopy = [...customers];
      customersCopy.push({ label: newValue[1].value, id: newValue[0].value });
      setCustomers(customersCopy);
    }
  }

  const validateGetCustomerForm = () => {
    if (!customerName) {
      setGetCustomerError(true);
      return false;
    } else {
      return true;
    }
  };

  const validateAddCustomerForm = () => {
    if (!addID || !addName) {
      setAddCustomerError(true);
      return false;
    } else {
      return true;
    }
  };

  const toggleUpdateStatus = () => {
    setUpdate(!update);
  };

  function handleAutocompleteChange(e, val) {
    setResults([]);

    if (val) {
      setCustomerID(val.id);
      setCustomerName(val.label);
      return;
    }

    setCustomerName(null);
    setCustomerID(null);
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
            Find a Customer
          </Typography>
          <FormControl margin="normal">
            <Autocomplete
              required
              autoComplete
              autoSelect
              autoHighlight
              variant="outlined"
              size="small"
              value={customerName || null}
              disabled={update && true}
              onChange={handleAutocompleteChange}
              options={customers}
              isOptionEqualToValue={(option, value) => {
                return option.label === value;
              }}
              renderOption={(props, option) => {
                return (
                  <li {...props} key={option.id}>
                    {option.label}
                  </li>
                );
              }}
              renderInput={(params) => {
                return (
                  <TextField
                    {...params}
                    label="Customer Name"
                    error={getCustomerError && !customerName && true}
                  />
                );
              }}
            ></Autocomplete>
          </FormControl>
          <Button
            variant="outlined"
            onClick={getCustomer}
            disabled={update && true}
          >
            Search
          </Button>
          {results.length ? <Card title="Customer" data={results} /> : null}
          {results.length ? (
            <Button variant="outlined" onClick={toggleUpdateStatus}>
              Change
            </Button>
          ) : null}
          {update && (
            <UpdateCustomerForm
              name={customerName}
              updateCustomerName={updateCustomerName}
              toggleUpdateStatus={toggleUpdateStatus}
            />
          )}
        </Grid>

        <Grid container direction="column" style={{ width: "40%" }}>
          <Typography component="h1" variant="h5">
            Add a Customer
          </Typography>
          <FormControl margin="normal">
            <TextField
              required
              label="Enter ID"
              variant="outlined"
              size="small"
              value={addID}
              error={addCustomerError && !addID && true}
              onFocus={() => setErrorMessage("")}
              onChange={(e) => setAddID(e.target.value)}
            ></TextField>
          </FormControl>
          <FormControl style={{ marginBottom: 10 }}>
            <TextField
              required
              label="Enter Customer Name"
              variant="outlined"
              size="small"
              value={addName}
              error={addCustomerError && !addName && true}
              onChange={(e) => setAddName(e.target.value)}
            ></TextField>
          </FormControl>
          <Button variant="outlined" onClick={addCustomer}>
            Add Customer
          </Button>
          {errorMessage && <Error message={errorMessage} />}
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
