import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "@mui/material/Modal";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Container from "@mui/material/Container";
import TransactionsTable from "./TransactionsTable";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { formatDate } from "../utils/formatDate";
import TransactionsDialog from "./TransactionsDialog";
import Notification from "./Notification";
import DateFilter from "./DateFilter";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "100%",
  height: "100%",
  bgcolor: "background.paper",
  p: 4,
};

function createCustomersArray(arr) {
  let result = [];

  for (let i = 0; i < arr.length; i++) {
    result.push({ label: arr[i][1].value, id: arr[i][0].value });
  }

  return result;
}

function createLocationsArray(arr) {
  let result = [];

  for (let i = 0; i < arr.length; i++) {
    result.push({ label: arr[i][2].value, id: arr[i][0].value });
  }

  return result;
}

function createContainersArray(arr) {
  let result = [];

  for (let i = 0; i < arr.length; i++) {
    result.push(arr[i][0].value.toString());
  }

  return result;
}

function createTransactionsArray(arr) {
  let result = [];

  for (let i = 0; i < arr.length; i++) {
    let row = [];
    for (let j = 0; j < arr[i].length; j++) {
      if (arr[i][j].metadata.colName === "ReturnedToStockDate") continue;
      let obj = {};
      obj.label = arr[i][j].metadata.colName;
      if (obj.label.includes("Date") && arr[i][j].value) {
        obj.value = formatDate(arr[i][j].value);
      } else if (obj.label === "TransactionProcessed") {
        obj.value = arr[i][j].value ? "YES" : "NO";
      } else {
        obj.value = arr[i][j].value;
      }

      obj.servicedDate = arr[i][13].value;

      row.push(obj);
    }
    result.push(row);
  }

  return result;
}

export default function TransactionsModal(props) {
  const [customers, setCustomers] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [customerID, setCustomerID] = useState("");
  const [locations, setLocations] = useState([]);
  const [locationAddress, setLocationAddress] = useState("");
  const [locationID, setLocationID] = useState("");
  const [containers, setContainers] = useState([]);
  const [containerID, setContainerID] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [editingEnabled, setEditingEnabled] = useState(false);
  const [rowsToDelete, setRowsToDelete] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [severity, setSeverity] = useState("info");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [dateFilterFormError, setDateFilterFormError] = useState(false);

  useEffect(() => {
    let isSubscribed = true;
    getCustomers().then((customers) => {
      return isSubscribed ? setCustomers(customers || []) : null;
    });
    getLocations().then((locations) => {
      return isSubscribed ? setLocations(locations || []) : null;
    });
    getContainers().then((containers) => {
      return isSubscribed ? setContainers(containers || []) : null;
    });
    return () => (isSubscribed = false);
  }, []);

  async function getCustomers() {
    return axios
      .get("/api/get-customers")
      .then((res) => createCustomersArray(res.data))
      .catch((err) => console.log(err));
  }

  async function getLocations() {
    return axios
      .get("/api/get-locations")
      .then((res) => createLocationsArray(res.data))
      .catch((err) => console.log(err));
  }

  async function getContainers() {
    return axios
      .get("/api/container/")
      .then((res) => createContainersArray(res.data))
      .catch((err) => console.log(err));
  }

  function handleAutocompleteChange(e, val) {
    if (val) {
      setCustomerName(val.label);
      setCustomerID(val.id);
    } else {
      setCustomerName(val);
      setCustomerID(val);
    }
  }

  function getTransactions() {
    if (!customerID && !locationID && !containerID) {
      setTransactions([]);
      return;
    }

    axios
      .get(
        `/api/transactions/${customerID || null}/${locationID || null}/${
          containerID || null
        }/${startDate || null}/${endDate || null}`
      )
      .then((res) => {
        if (!res.data) {
          toggleNotificationOpen();
          setNotificationMessage("No Results");
          setTransactions([]);
          return;
        }
        setTransactions(createTransactionsArray(res.data));
      })
      .catch((err) => console.log(err));
  }

  function enableEditing() {
    setEditingEnabled(true);
  }

  function disableEditing() {
    setEditingEnabled(false);
    setRowsToDelete([]);
  }

  function selectRow(transactionID) {
    if (!editingEnabled) {
      return;
    }

    const tmp = [...rowsToDelete];
    const idx = tmp.findIndex((elem) => elem === transactionID);

    if (idx !== -1) {
      tmp.splice(idx, 1);
      setRowsToDelete(tmp);
      return;
    }

    tmp.push(transactionID);
    setRowsToDelete(tmp);
  }

  async function deleteRows() {
    for (let i = 0; i < rowsToDelete.length; i++) {
      await axios
        .delete(`/api/transactions/${rowsToDelete[i]}`)
        .catch((err) => console.log(err));
    }

    const tmp = [...transactions];

    for (let i = 0; i < rowsToDelete.length; i++) {
      const idx = tmp.findIndex(
        (elem) => elem.transactionID === rowsToDelete[i]
      );
      tmp.splice(idx, 1);
      setTransactions(tmp);
    }

    setNotificationMessage(`Deleted ${rowsToDelete.length} row(s)`);
    setSeverity("success");
    toggleNotificationOpen();
    setRowsToDelete([]);
    setEditingEnabled(false);
  }

  function toggleNotificationOpen() {
    setNotificationOpen(!notificationOpen);
  }

  function toggleDialog() {
    setDialogOpen(!dialogOpen);
  }

  return (
    <React.Fragment>
      <Notification
        open={notificationOpen}
        message={notificationMessage}
        severity={severity}
        toggleOpen={toggleNotificationOpen}
      />
      <TransactionsDialog
        open={dialogOpen}
        toggleDialog={toggleDialog}
        rows={rowsToDelete.length}
        deleteRows={deleteRows}
      />
      <Modal open={props.open} onClose={props.onClose}>
        <Box sx={style}>
          <IconButton
            onClick={props.onClose}
            variant="outlined"
            size="large"
            color="info"
            style={{ position: "absolute", left: 60, top: 60 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Container maxWidth="xl" sx={{ mt: 10 }}>
            <Grid container justifyContent="start" alignItems="center">
              <Box sx={{ width: 400 }}>
                <FormControl margin="normal" sx={{ width: "100%" }}>
                  <Autocomplete
                    fullWidth
                    disabled={!customers.length || editingEnabled}
                    autoComplete
                    autoSelect
                    autoHighlight
                    variant="outlined"
                    size="small"
                    value={customerName || null}
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
                      return <TextField {...params} label="Customer Name" />;
                    }}
                  ></Autocomplete>
                </FormControl>
              </Box>

              <Box sx={{ width: 400, ml: 1, mr: 1 }}>
                <FormControl margin="normal" sx={{ width: "100%" }}>
                  <Autocomplete
                    fullWidth
                    disabled={!locations.length || editingEnabled}
                    autoComplete
                    autoSelect
                    autoHighlight
                    variant="outlined"
                    size="small"
                    value={locationAddress || null}
                    onChange={(e, val) => {
                      val && setLocationAddress(val.label);
                      val && setLocationID(val.id);
                      !val && setLocationAddress(val);
                      !val && setLocationID(val);
                    }}
                    options={locations}
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
                      return <TextField {...params} label="Location Address" />;
                    }}
                  ></Autocomplete>
                </FormControl>
              </Box>

              <Box sx={{ width: 400 }}>
                <FormControl margin="normal" sx={{ width: "100%" }}>
                  <Autocomplete
                    fullWidth
                    disabled={!containers.length || editingEnabled}
                    autoComplete
                    autoSelect
                    autoHighlight
                    variant="outlined"
                    size="small"
                    value={containerID || null}
                    onChange={(e, val) => {
                      setContainerID(val);
                    }}
                    options={containers}
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
                      return <TextField {...params} label="Container ID" />;
                    }}
                  ></Autocomplete>
                </FormControl>
              </Box>

              <Button
                variant="outlined"
                onClick={getTransactions}
                size="small"
                disabled={editingEnabled}
                sx={{ height: 45, width: 100, m: 1, p: 0 }}
              >
                Search
              </Button>
            </Grid>

            <DateFilter
              startDate={startDate}
              endDate={endDate}
              dateFilterFormError={dateFilterFormError}
              setStartDate={setStartDate}
              setEndDate={setEndDate}
              setDateFilterFormError={setDateFilterFormError}
              editingEnabled={editingEnabled}
            />

            <Grid container direction="row" justifyContent="end">
              {editingEnabled ? (
                <React.Fragment>
                  <Button
                    variant="outlined"
                    onClick={disableEditing}
                    sx={{ m: 1 }}
                  >
                    CANCEL
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={toggleDialog}
                    disabled={!rowsToDelete.length}
                    sx={{ m: 1 }}
                  >
                    DELETE
                  </Button>
                </React.Fragment>
              ) : null}

              {transactions.length ? (
                <Button
                  variant="outlined"
                  onClick={enableEditing}
                  disabled={editingEnabled}
                  sx={{ m: 1 }}
                >
                  EDIT
                </Button>
              ) : null}
            </Grid>

            <TransactionsTable
              transactions={transactions}
              editingEnabled={editingEnabled}
              selectRow={selectRow}
              rowsToDelete={rowsToDelete}
            />
          </Container>
        </Box>
      </Modal>
    </React.Fragment>
  );
}
