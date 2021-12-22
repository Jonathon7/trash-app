import React, { useState, useEffect } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import FindCustomerForm from "./FindCustomerForm";
import AddCustomerForm from "./AddCustomerForm";
import Notification from "./Notification";
import { camelCaseToSnakeCase } from "../utils/camelCaseToSnakeCase";

// SQL Server formats the return array with nested objects and the MUI Autocomplete component requires a different format
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
  const [taxExempt, setTaxExempt] = useState(false);
  const [getCustomerError, setGetCustomerError] = useState(false);
  const [results, setResults] = useState([]);
  const [addID, setAddID] = useState("");
  const [addName, setAddName] = useState("");
  const [addTaxExempt, setAddTaxExempt] = useState(false);
  const [addCustomerError, setAddCustomerError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [update, setUpdate] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [info, setInfo] = useState([]);
  const [showInfo, setShowInfo] = useState(false);

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
        result.push({ NAME: res.data[0][1].value });
        result.push({ TAX_EXEMPT: res.data[0][2].value ? "YES" : "NO" });
        setTaxExempt(res.data[0][2].value ? "YES" : "NO");
        setResults(result);

        let infoCopy = [];
        for (let i = 1; i < res.data.length; i++) {
          let infoObj = {};
          for (let j = 0; j < res.data[i].length; j++) {
            infoObj[camelCaseToSnakeCase(res.data[i][j].metadata.colName)] =
              res.data[i][j].value;
          }
          infoCopy.push(infoObj);
        }

        setInfo(infoCopy);
      })
      .catch((err) => console.log(err));
  }

  function addCustomer() {
    if (!validateAddCustomerForm()) return;

    axios
      .post("/api/add-customer", {
        id: addID,
        name: addName,
        taxExempt: addTaxExempt,
      })
      .then((res) => {
        if (typeof res.data === "string") {
          setErrorMessage(res.data);
        } else {
          toggleOpen();
          setMessage("Customer Added");
          setAddID("");
          setAddName("");
          setAddTaxExempt(false);
          setAddCustomerError(false);
          updateMUIOptions(null, res.data);
        }
      })
      .catch((err) => console.log(err));
  }

  function updateCustomer(newID, newName, newTaxExempt) {
    axios
      .put("/api/update-customer", {
        ID: customerID,
        newID,
        name: newName,
        taxExempt: newTaxExempt,
      })
      .then((res) => {
        updateMUIOptions(customerName, res.data[1].value);
        setCustomerID(res.data[0].value);
        setTaxExempt(res.data[2].value ? "YES" : "NO");
        toggleOpen();
        setMessage("Customer Info Updated");
        setResults([
          { ID: res.data[0].value },
          { NAME: res.data[1].value },
          { TAX_EXEMPT: res.data[2].value ? "YES" : "NO" },
        ]);
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
    if (!addID || !addName || isNaN(addID)) {
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

  function toggleShowInfo() {
    setShowInfo(!showInfo);
  }

  return (
    <React.Fragment>
      <Notification open={open} message={message} toggleOpen={toggleOpen} />
      <Grid container direction="row" justifyContent="space-evenly">
        <FindCustomerForm
          customerID={customerID}
          customerName={customerName}
          taxExempt={taxExempt}
          update={update}
          handleAutocompleteChange={handleAutocompleteChange}
          customers={customers}
          getCustomer={getCustomer}
          getCustomerError={getCustomerError}
          results={results}
          showInfo={showInfo}
          info={info}
          toggleShowInfo={toggleShowInfo}
          toggleUpdateStatus={toggleUpdateStatus}
          updateCustomer={updateCustomer}
        />

        <AddCustomerForm
          addID={addID}
          addName={addName}
          addCustomer={addCustomer}
          addTaxExempt={addTaxExempt}
          setAddTaxExempt={setAddTaxExempt}
          addCustomerError={addCustomerError}
          errorMessage={errorMessage}
          setAddName={setAddName}
          setErrorMessage={setErrorMessage}
          setAddID={setAddID}
        />
      </Grid>
    </React.Fragment>
  );
}
