import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "@mui/material/Modal";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Container from "@mui/material/Container";
import TransactionsTable from "./TransactionsTable";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { formatDate } from "../utils/formatDate";

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
      } else {
        obj.value = arr[i][j].value;
      }

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
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    let isSubscribed = true;
    getCustomers().then((customers) => {
      return isSubscribed ? setCustomers(customers) : null;
    });
    return () => (isSubscribed = false);
  }, []);

  async function getCustomers() {
    return axios
      .get("/api/get-customers")
      .then((res) => createCustomersArray(res.data))
      .catch((err) => console.log(err));
  }

  function handleAutocompleteChange(e, val) {
    if (val) {
      setCustomerName(val.label);
      setCustomerID(val.id);
    }
  }

  function getTransactions() {
    if (!customerID) return;
    axios
      .get(`/api/transactions`, { params: { ID: customerID } })
      .then((res) => {
        setTransactions(createTransactionsArray(res.data));
      })
      .catch((err) => console.log(err));
  }

  return (
    <React.Fragment>
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
            <Box sx={{ width: 400 }}>
              <Typography variant="h6" component="h2">
                Search Transactions By Customer Name
              </Typography>
              <FormControl margin="normal" sx={{ width: "100%" }}>
                <Autocomplete
                  required
                  fullWidth
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
              <Button variant="outlined" fullWidth onClick={getTransactions}>
                Search
              </Button>
            </Box>
            <TransactionsTable transactions={transactions} />
          </Container>
        </Box>
      </Modal>
    </React.Fragment>
  );
}
