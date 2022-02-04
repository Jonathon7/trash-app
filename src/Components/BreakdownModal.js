import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Checkbox from "@mui/material/Checkbox";
import BreakdownsTable from "./BreakdownsTable";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import money from "money-math";
import DateFilter from "./DateFilter";
import { formatDate } from "../utils/formatDate";

function createBreakdownArray(arr) {
  let finalTotal = money.floatToAmount(0);

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

      const breakdownHeader = breakdownHeaders.some(
        (elem) => elem.label === containers[i][key][j].feeName
      );

      if (!breakdownHeader) {
        breakdownHeaders.push({
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

  return rows;
}

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

let breakdownHeaders = [
  { label: "CUSTOMER ID", key: "customerId" },
  { label: "SERVICED DATE", key: "servicedDate" },
  { label: "CONTAINER ID", key: "containerId" },
  { label: "TONS", key: "tons" },
];

export default function BreakdownModal(props) {
  const [breakdowns, setBreakdowns] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [customers, setCustomers] = useState([]);
  const [customerSelection, setCustomerSelection] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

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

  function getBreakdowns() {
    if (!startDate || !endDate || (!customerSelection.length && !selectAll)) {
      return;
    }

    const customersArray = [];

    breakdownHeaders = [
      { label: "CUSTOMER ID", key: "customerId" },
      { label: "SERVICED DATE", key: "servicedDate" },
      { label: "CONTAINER ID", key: "containerId" },
      { label: "TONS", key: "tons" },
    ];

    let ids;

    if (selectAll) {
      ids = customers.map((elem) => elem.id);
    } else {
      ids = customerSelection.map((elem) => elem.id);
    }

    axios
      .post(`/api/breakdown-view/${startDate}/${endDate}/${ids}`)
      .then((res) => {
        customersArray.push([res.data[0]]);
        for (let i = 1; i < res.data.length; i++) {
          if (res.data[i][0].value !== res.data[i - 1][0].value) {
            customersArray.push([res.data[i]]);
          } else {
            customersArray[customersArray.length - 1].push(res.data[i]);
          }
        }

        const customerBreakdowns = [];

        for (let i = 0; i < customersArray.length; i++) {
          customerBreakdowns.push(createBreakdownArray(customersArray[i]));
        }

        breakdownHeaders.push({ label: "CHARGE AMOUNT", key: "total" });
        setBreakdowns(customerBreakdowns);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleAutocompleteChange(e, val) {
    setCustomerSelection(val);
  }

  return (
    <Modal
      open={props.open}
      onClose={props.close}
      style={{
        overflowY: "scroll",
        overflowX: "hidden",
        height: "100%",
        width: "100%",
        background: "#fff",
      }}
    >
      <Box
        sx={{
          width: "100%",
          minHeight: "100%",
          bgcolor: "background.paper",
          p: 4,
        }}
      >
        <IconButton
          onClick={props.close}
          variant="outlined"
          size="large"
          color="info"
          style={{ position: "absolute", left: 60, top: 15 }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Grid
          container
          direction="row"
          justifyContent="space-evenly"
          alignItems="flex-start"
        >
          <Grid item>
            <FormControl margin="normal" sx={{ width: 800 }}>
              <Grid container direction="row">
                <Autocomplete
                  multiple
                  fullWidth
                  disableCloseOnSelect
                  variant="outlined"
                  size="small"
                  onChange={handleAutocompleteChange}
                  options={customers}
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
              </Grid>
            </FormControl>

            <DateFilter
              startDate={startDate}
              endDate={endDate}
              setStartDate={setStartDate}
              setEndDate={setEndDate}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={selectAll}
                  onChange={() => setSelectAll(!selectAll)}
                />
              }
              label="Select All"
            />
          </Grid>
          <Button onClick={getBreakdowns}>Search</Button>
        </Grid>
        <BreakdownsTable data={breakdowns} headers={breakdownHeaders} />
      </Box>
    </Modal>
  );
}
