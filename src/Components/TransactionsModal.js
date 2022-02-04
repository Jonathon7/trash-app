import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "@mui/material/Modal";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import TransactionsTable from "./TransactionsTable";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { formatDate } from "../utils/formatDate";
import TransactionsDialog from "./TransactionsDialog";
import Notification from "./Notification";
import DateFilter from "./DateFilter";
import Switch from "./Switch";
import { CSVDownload } from "react-csv";
import money from "money-math";

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
    result.push({
      label: arr[i][1].value + ", " + arr[i][0].value,
      id: arr[i][0].value,
    });
  }

  return result;
}

function createLocationsArray(arr) {
  let result = [];

  for (let i = 0; i < arr.length; i++) {
    result.push({
      label: arr[i][2].value + ", " + arr[i][0].value,
      id: arr[i][0].value,
    });
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

function createBreakdownArray(arr) {
  // console.log(arr);
  let finalTotal = money.floatToAmount(0);

  headers = [
    { label: "DATE", key: "date" },
    { label: "CUSTOMER", key: "customer" },
    { label: "LOCATION", key: "location" },
    { label: "START DATE", key: "startDate" },
    { label: "END DATE", key: "endDate" },
    { label: "CUSTOMER INFO", key: "customerInfo" },
    { label: "", key: "" },
    { label: "SERVICED DATE", key: "servicedDate" },
    { label: "CONTAINER ID", key: "containerId" },
    { label: "TONS", key: "tons" },
  ];

  const containers = [];
  for (let i = 0; i < arr.length; i++) {
    if (
      typeof arr[i][3].value === "string" &&
      arr[i][3].value.includes("RETURN TO STOCK")
    ) {
      continue;
    }

    let idx = containers.findIndex((elem) =>
      elem.hasOwnProperty(arr[i][2].value)
    );

    if (idx === -1) {
      containers.push({ [arr[i][2].value]: [] });
      idx = containers.length - 1;
    }

    containers[idx][arr[i][2].value].push({
      customerId: arr[i][0].value,
      containerId: arr[i][2].value,
      feeName: arr[i][3].value,
      tons: arr[i][4].value,
      chargeAmount: arr[i][7].value,
      servicedDate: arr[i][6].value,
    });
  }

  const rows = [];
  let row = {};
  let total = money.floatToAmount(0);

  for (let i = 0; i < containers.length; i++) {
    const key = Object.keys(containers[i]);
    for (let j = 0; j < containers[i][key].length; j++) {
      if (
        (row.hasOwnProperty("servicedDate") &&
          row["servicedDate"] !==
            formatDate(containers[i][key][j].servicedDate)) ||
        (row.hasOwnProperty("tons") &&
          row["tons"] !== containers[i][key][j].tons)
      ) {
        row.total = total;
        rows.push(row);
        row = {};
        finalTotal = money.add(
          money.floatToAmount(finalTotal),
          money.floatToAmount(total)
        );
        total = money.floatToAmount(0);
      }

      row.customerId = containers[i][key][j].customerId;
      row.servicedDate = formatDate(containers[i][key][j].servicedDate);
      row[containers[i][key][j].feeName] = containers[i][key][j].chargeAmount;

      const header = headers.some(
        (elem) => elem.label === containers[i][key][j].feeName
      );

      if (!header) {
        headers.push({
          label: containers[i][key][j].feeName,
          key: containers[i][key][j].feeName,
        });
      }

      if (!isNaN(containers[i][key][j].chargeAmount)) {
        total = money.add(
          money.floatToAmount(containers[i][key][j].chargeAmount),
          money.floatToAmount(total)
        );
      }

      if (containers[i][key][j].tons) row.tons = containers[i][key][j].tons;
      row.containerId = containers[i][key][j].containerId;
    }
    row.total = total;
    rows.push(row);
    row = {};
    finalTotal = money.add(
      money.floatToAmount(finalTotal),
      money.floatToAmount(total)
    );
    total = money.floatToAmount(0);
  }

  rows.push({ total: finalTotal });

  // some headers are added dynamically so, this ensures that charge amount is always the last field
  headers.push({ label: "CHARGE AMOUNT", key: "total" });

  return rows;
}

let headers = [
  { label: "DATE", key: "date" },
  { label: "CUSTOMER", key: "customer" },
  { label: "LOCATION", key: "location" },
  { label: "START DATE", key: "startDate" },
  { label: "END DATE", key: "endDate" },
  { label: "CUSTOMER INFO", key: "customerInfo" },
  { label: "", key: "" },
  { label: "SERVICED DATE", key: "servicedDate" },
  { label: "CONTAINER ID", key: "containerId" },
  { label: "TONS", key: "tons" },
];

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
  const [showOnlyUnprocessedTransactions, setShowOnlyUnprocessedTransactions] =
    useState(false);
  const [colorCode, setColorCode] = useState(false);
  const [CSV, setCSV] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    let isSubscribed = true;

    if (props.open) {
      getTopTransactions().then((transactions) => {
        return isSubscribed ? setTransactions(transactions) : null;
      });
    } else {
      getCustomers().then((customers) => {
        return isSubscribed ? setCustomers(customers || []) : null;
      });
      getLocations().then((locations) => {
        return isSubscribed ? setLocations(locations || []) : null;
      });
      getContainers().then((containers) => {
        return isSubscribed ? setContainers(containers || []) : null;
      });
    }

    return () => (isSubscribed = false);
  }, [props.open]);

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

  async function getTopTransactions() {
    return axios
      .get("/api/top-transactions")
      .then((res) => createTransactionsArray(res.data))
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
    if (!customerID && !locationID && !containerID && !startDate && !endDate) {
      setTransactions([]);
      return;
    }

    axios
      .get(
        `/api/transactions/${customerID || null}/${locationID || null}/${
          containerID || null
        }/${startDate || null}/${
          endDate || null
        }/${showOnlyUnprocessedTransactions}`
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

  function selectRow(transactionID, transactionProcessed) {
    if (!editingEnabled || transactionProcessed === "YES") return;

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
      const idx = tmp.findIndex((elem) => elem[0].value === rowsToDelete[i]);
      tmp.splice(idx, 1);
    }

    setTransactions(tmp);
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

  function switchOnChange() {
    setShowOnlyUnprocessedTransactions(!showOnlyUnprocessedTransactions);
  }

  function colorSwitchOnChange() {
    setColorCode(!colorCode);
  }

  function getCustomerBillBreakdown(ID) {
    axios
      .get(`/api/bill-breakdown/${startDate}/${endDate}/${ID}`)
      .then(async (res) => {
        const breakdown = createBreakdownArray(res.data);
        setData(breakdown);

        breakdown[0].customer = ID;
        breakdown[0].location = res.data[0][1].value;
        breakdown[0].startDate = formatDate(startDate);
        breakdown[0].endDate = formatDate(endDate);
        breakdown[0].date = formatDate(new Date());

        const customerInfo = await axios.get(
          `/api/customer-info/${ID}/${res.data[0][1].value}`
        );

        breakdown[0].customerInfo = customerInfo.data;

        setCSV(true);
        setCSV(false);
      })
      .catch((err) => console.log(err));
  }

  return (
    <React.Fragment>
      {CSV ? <CSVDownload data={data} headers={headers} /> : null}
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
      <Modal
        open={props.open}
        onClose={props.onClose}
        style={{
          overflowY: "scroll",
          overflowX: "hidden",
          height: "120%",
          background: "#fff",
        }}
      >
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
          <Card sx={{ width: "80%", m: "auto", mt: 6, p: 3 }}>
            <Grid container justifyContent="start" alignItems="center">
              <Box sx={{ width: 350 }}>
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
                      return <TextField {...params} label="Customer" />;
                    }}
                  ></Autocomplete>
                </FormControl>
              </Box>

              <Box sx={{ width: 250, ml: 1, mr: 1 }}>
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
                      return <TextField {...params} label="Location" />;
                    }}
                  ></Autocomplete>
                </FormControl>
              </Box>

              <Box sx={{ width: 150 }}>
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

            <Grid container direction="row" alignItems="center">
              <Switch
                label="Show Only Unprocessed Transactions"
                onChange={switchOnChange}
                disabled={editingEnabled}
              />

              <Switch
                label="Color Code"
                onChange={colorSwitchOnChange}
                disabled={editingEnabled}
              />
            </Grid>
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
          </Card>

          <TransactionsTable
            transactions={transactions}
            editingEnabled={editingEnabled}
            selectRow={selectRow}
            rowsToDelete={rowsToDelete}
            colorCode={colorCode}
            download={startDate && endDate ? true : false}
            getCustomerBillBreakdown={getCustomerBillBreakdown}
          />
        </Box>
      </Modal>
    </React.Fragment>
  );
}
