import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import Tooltip from "@mui/material/Tooltip";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AddFeeForm from "./AddFeeForm";
import UpdateFeeForm from "./UpdateFeeForm";
import FeesTable from "./FeesTable";
import Notification from "./Notification";
import FeesModal from "./FeesModal";
import money from "money-math";
import TransactionsModal from "./TransactionsModal";
import TransactionAppBar from "./TransactionsAppBar";
import BillModal from "./BillModal";

function createFeesArray(arr) {
  let result = [];

  for (let i = 0; i < arr.length; i++) {
    let amountInCents = arr[i][2].value;

    result.push({
      label: arr[i][1].value,
      amount: amountInCents.toString(),
      id: arr[i][0].value,
    });
  }

  return result;
}

let tonTimeout = null;
let containerIDTimeout = null;

export default function Transactions() {
  const [customerID, setCustomerID] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [locationID, setLocationID] = useState("");
  const [containerID, setContainerID] = useState("");
  const [ton, setTon] = useState(0);
  const [servicedDate, setServicedDate] = useState(null);
  const [comments, setComments] = useState("");
  const [landfillTonnageFeeAmount, setLandfillTonnageFeeAmount] = useState("");
  const [TNRCCFeeAmount, setTNRCCFeeAmount] = useState("");
  const [landfillTonnage, setLandfillTonnage] = useState("");
  const [TNRCC, setTNRCC] = useState("");
  const [fees, setFees] = useState([]);
  const [fee, setFee] = useState("");
  const [addedFees, setAddedFees] = useState([]);
  const [total, setTotal] = useState("");
  const [transactionFormError, setTransactionFormError] = useState(false);
  const [addedFeesFormError, setAddedFeesFormError] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("info");
  const [addOrUpdate, setAddOrUpdate] = useState("");
  const [infoMessage, setInfoMessage] = useState(false);
  const [feesModalOpen, setFeesModalOpen] = useState(false);
  const [transactionsModalOpen, setTransactionsModalOpen] = useState(false);
  const [billModalOpen, setBillModalOpen] = useState(false);
  const [checkedForSessionData, setCheckedForSessionData] = useState(false);
  const [requiredFees] = useState([
    "PULL FEE",
    "LANDFILL TONNAGE",
    "TNRCC FEE CHARGE",
  ]);

  const toggleFeesModal = () => setFeesModalOpen(!feesModalOpen);

  // All form data is stored server side in a mssql session store
  const saveTransactionFormData = useCallback(
    function saveTransactionFormData() {
      if (!checkedForSessionData) return;
      const formData = {
        customerID,
        customerName,
        locationID,
        containerID,
        ton,
        servicedDate,
        comments,
        landfillTonnageFeeAmount,
        TNRCCFeeAmount,
        landfillTonnage,
        TNRCC,
        fee,
        addedFees,
        total,
      };

      axios
        .post("/api/transaction-form-data", formData)
        .catch((err) => console.log(err));
    },
    [
      customerID,
      customerName,
      locationID,
      containerID,
      ton,
      servicedDate,
      comments,
      landfillTonnageFeeAmount,
      TNRCCFeeAmount,
      landfillTonnage,
      TNRCC,
      fee,
      addedFees,
      total,
      checkedForSessionData,
    ]
  );

  // checks for session data on component mount
  const checkForSessionData = useCallback(
    function () {
      if (checkedForSessionData) return;
      axios
        .get("/api/transaction-form-data")
        .then((res) => {
          res.data.customerID && setCustomerID(res.data.customerID);
          res.data.customerName && setCustomerName(res.data.customerName);
          res.data.locationID && setLocationID(res.data.locationID);
          res.data.containerID && setContainerID(res.data.containerID);
          res.data.ton && setTon(res.data.ton);
          res.data.servicedDate && setServicedDate(res.data.servicedDate);
          res.data.comments && setComments(res.data.comments);
          res.data.landfillTonnageFeeAmount &&
            setLandfillTonnageFeeAmount(res.data.landfillTonnageFeeAmount);
          res.data.TNRCCFeeAmount && setTNRCCFeeAmount(res.data.TNRCCFeeAmount);
          res.data.landfillTonnage &&
            setLandfillTonnage(res.data.landfillTonnage);
          res.data.TNRCC && setTNRCC(res.data.TNRCC);
          res.data.fee && setFee(res.data.fee);
          res.data.addedFees && setAddedFees(res.data.addedFees);
          res.data.total && setTotal(res.data.total);
          setCheckedForSessionData(true);
        })
        .catch((err) => console.log(err));
    },
    [checkedForSessionData]
  );

  useEffect(() => {
    let isSubscribed = true;
    getFees().then((fees) => isSubscribed && setFees(fees || []));
    saveTransactionFormData();
    checkForSessionData();
    return () => (isSubscribed = false);
  }, [saveTransactionFormData, checkForSessionData]);

  async function getFees() {
    return axios
      .get("/api/fees")
      .then((res) => createFeesArray(res.data))
      .catch((err) => console.log(err));
  }

  function handleAutocompleteChange(e, val) {
    setFee(val);
  }

  function handleTonInputFocus() {
    if (!TNRCCFeeAmount || !landfillTonnageFeeAmount) {
      let feesCopy = [...fees];
      let TNRCC;
      let landfillTonnage;
      TNRCC = feesCopy.find((elem) => elem.label === "TNRCC FEE CHARGE");
      landfillTonnage = feesCopy.find(
        (elem) => elem.label === "LANDFILL TONNAGE"
      );

      setTNRCCFeeAmount(TNRCC.amount);
      setLandfillTonnageFeeAmount(landfillTonnage.amount);
    }
  }

  // since the LANDFILL TONNAGE and TNRCC fee inputs are disabled, their values are dependent on the ton onChange event
  function handleTonChange(e) {
    // limits the amount of digits the tonnage number can have to 10
    if (e.target.value.toString().length > 10) return;
    // the ton value is not money but it does need to be converted into a '0.00' string to perform safe calculations
    let tonValue = money.floatToAmount(e.target.value);

    setTon(e.target.value);

    clearTimeout(tonTimeout);

    tonTimeout = setTimeout(() => {
      setCalculatedFees(tonValue);
    }, 500);
  }

  /**
   * @param {Number} Tonnage
   * @description - called by the ton onChange event - this function sets the calculated fees in state - landfillTonnage and TNRCC
   * If a required fee is being set or removed, then the update total is wrapped in an async function to ensure that
   * updateTotal is only called once with the correct value
   */
  function setCalculatedFees(tonnage) {
    if (landfillTonnageFeeAmount && TNRCCFeeAmount) {
      // code in if block executes only if landfill and tnrcc previously contained non-zero numeric values
      if (
        landfillTonnage &&
        TNRCC &&
        landfillTonnage !== "0.00" &&
        TNRCC !== "0.00"
      ) {
        let newLandfillTonnage = money.mul(tonnage, landfillTonnageFeeAmount);
        let newTNRCC = money.mul(tonnage, TNRCCFeeAmount);
        let addedValues = money.add(newLandfillTonnage, newTNRCC);
        let oldValue = money.add(landfillTonnage, TNRCC);

        let calculatedValue = money.subtract(addedValues, oldValue);

        setTNRCC(newTNRCC);
        setLandfillTonnage(newLandfillTonnage);

        updateCalculatedFees(newTNRCC, newLandfillTonnage);

        if (tonnage === "0.00") {
          removeRequiredFees().then((amount) => {
            updateTotal(money.subtract(calculatedValue, amount), "add");
          });
        } else {
          updateTotal(calculatedValue, "add");
        }

        // else case only expected to run if the previous tnrcc and landfill tonnage values were zero
      } else {
        let calculatedTNRCC = money.mul(tonnage, TNRCCFeeAmount);
        let calculatedLandfillTonnage = money.mul(
          tonnage,
          landfillTonnageFeeAmount
        );
        let addedValues = money.add(calculatedLandfillTonnage, calculatedTNRCC);
        setLandfillTonnage(calculatedLandfillTonnage);
        setTNRCC(calculatedTNRCC);
        // setRequiredFees returns a promise to ensure that updateTotal - an asynchronous function - will only be called once and not multiple times setting the wrong amount
        addRequiredFees(calculatedTNRCC, calculatedLandfillTonnage).then(
          (amount) => {
            updateTotal(money.add(addedValues, amount), "add");
          }
        );
      }
    }
  }

  /**
   *
   * @param {String} amount1 - TNRCC FEE CHARGE
   * @param {String} amount2 - LANDFILL TONNAGE
   */
  function updateCalculatedFees(amount1, amount2) {
    const result = [...addedFees];

    const idx1 = result.findIndex((elem) => elem.label === "TNRCC FEE CHARGE");
    const idx2 = result.findIndex((elem) => elem.label === "LANDFILL TONNAGE");

    result[idx1].amount = amount1;
    result[idx2].amount = amount2;

    setAddedFees(result);
  }

  /**
   * @description - required fees are those fees that are required when the ton value in state has a non-zero numeric value and should be added automatically
   * @returns {Promise} - resolved with either the value of the required fee or zero if it has already been added
   */
  function addRequiredFees(calculatedTNRCC, calculatedLandfillTonnage) {
    return new Promise((resolve, reject) => {
      const result = [...addedFees];
      const feesCopy = JSON.parse(JSON.stringify(fees));
      let sum = "0.00";

      for (let i = 0; i < requiredFees.length; i++) {
        // checks if any of the required fees have already been added since they should only be added once
        if (result.some((elem) => elem.label === requiredFees[i])) {
          resolve(money.floatToAmount(0));
          return;
        }

        const requiredFee = feesCopy.find(
          (elem) => elem.label === requiredFees[i]
        );
        if (requiredFee.label === "TNRCC FEE CHARGE") {
          requiredFee.amount = calculatedTNRCC;
        }
        if (requiredFee.label === "LANDFILL TONNAGE") {
          requiredFee.amount = calculatedLandfillTonnage;
        }

        if (
          requiredFee.label !== "TNRCC FEE CHARGE" &&
          requiredFee.label !== "LANDFILL TONNAGE"
        ) {
          sum = money.add(sum, money.floatToAmount(requiredFee.amount));
        }
        result.unshift(requiredFee);
      }

      setAddedFees(result);
      resolve(sum);
    });
  }

  /**
   * @description - removes the required fees from the addedFees table
   * @returns {Promise} - resolves the amount to subtract from the total
   */
  function removeRequiredFees() {
    return new Promise((resolve) => {
      const result = [...addedFees];
      const requiredFees = ["PULL FEE", "TNRCC FEE CHARGE", "LANDFILL TONNAGE"];
      let sum = "0.00";

      for (let i = 0; i < requiredFees.length; i++) {
        const idx = result.findIndex((elem) => elem.label === requiredFees[i]);
        if (
          result[idx].label !== "TNRCC FEE CHARGE" &&
          result[idx].label !== "LANDFILL TONNAGE"
        ) {
          sum = money.add(sum, money.floatToAmount(result[idx].amount));
        }
        result.splice(idx, 1);
      }

      setAddedFees(result);
      resolve(sum);
    });
  }

  function updateTotal(value, action) {
    let formattedValue = money.floatToAmount(value);
    if (action === "add") {
      let newTotal = money.add(total, formattedValue);
      setTotal(newTotal);
    } else if (action === "subtract") {
      let newTotal = money.subtract(total, formattedValue);
      setTotal(newTotal);
    }
  }

  /**
   * @descrption - adds fees from the MUI Autcomplete component to the fees table
   */
  function addFeeToTable() {
    if (!validateAddedFeesForm()) return;
    const result = [...addedFees];
    const feesCopy = [...fees];
    const addedFee = feesCopy.find((elem) => elem.label === fee.label);
    result.push(addedFee);
    setAddedFees(result);

    updateTotal(addedFee.amount, "add");
    setFee("");
  }

  function removeFee(label) {
    let result = [...addedFees];
    const idx = addedFees.findIndex((elem) => elem.label === label);
    updateTotal(result[idx].amount, "subtract");
    result.splice(idx, 1);
    setAddedFees(result);
  }

  function validateTransactionForm() {
    if (!addedFees.length) {
      setMessage("At least one fee is required on each transaction");
      setSeverity("error");
      toggleOpen();
    }

    if (
      !containerID ||
      customerID === "" ||
      locationID === "" ||
      !addedFees.length ||
      !servicedDate
    ) {
      setTransactionFormError(true);
      return false;
    }

    return true;
  }

  function validateAddedFeesForm() {
    if (!fee) {
      setAddedFeesFormError(true);
      return false;
    }

    return true;
  }

  async function createTransaction() {
    if (!validateTransactionForm()) return;

    for (let i = 0; i < addedFees.length; i++) {
      await axios
        .post("/api/transaction", {
          customerID,
          locationID,
          containerID,
          feeID: addedFees[i].id,
          feeName: addedFees[i].label,
          feeAmount: addedFees[i].amount,
          ton,
          servicedDate,
          comments,
        })
        .then((res) => {
          if (typeof res.data === "string") {
            setMessage(res.data);
            setSeverity("error");
            toggleOpen();
            return;
          }

          setMessage("Transaction Created");
          setSeverity("success");
          toggleOpen();
          setAddedFees([]);
          setCustomerID("");
          setCustomerName("");
          setLocationID("");
          setContainerID("");
          setTon(0);
          setServicedDate(null);
          setComments("");
          setTNRCC("");
          setLandfillTonnage("");
          setTotal("");
          setTransactionFormError(false);
        })
        .catch((err) => console.log(err));
    }
  }

  function toggleOpen() {
    setOpen(!open);
  }

  function addFeeToDB(name, amount) {
    axios
      .post("/api/fees", { name, amount })
      .then((res) => {
        if (typeof res.data === "string") {
          setMessage(res.data);
          setSeverity("error");
          toggleOpen();
        } else {
          setAddOrUpdate("");
          setMessage(res.data.message);
          setSeverity("success");
          toggleOpen();
          getFees().then((fees) => setFees(fees));
        }
      })
      .catch((err) => console.log(err));
  }

  function updateFee(id, feeAmount) {
    axios
      .put("/api/fees", { id, feeAmount })
      .then((res) => {
        setMessage(res.data);
        setSeverity("success");
        toggleOpen();
        getFees().then((fees) => setFees(fees));
        setAddOrUpdate("");
      })
      .catch((err) => console.log(err));
  }

  function handleContainerIDChange(e) {
    if (isNaN(e.target.value) || e.target.value === " ") return;

    setContainerID(e.target.value);
    clearTimeout(containerIDTimeout);

    // allow the input to be cleared, but not search for NULL ID
    if (e.target.value === "") {
      setCustomerID("");
      setCustomerName("");
      setLocationID("");
      if (infoMessage) setInfoMessage(false);
      return;
    }

    containerIDTimeout = setTimeout(() => {
      const ID = e.target.value;
      axios
        .get(`/api/container/${ID}`)
        .then((res) => {
          if (Array.isArray(res.data)) {
            setCustomerID(res.data[7].value);
            setCustomerName(res.data[11].customerName);
            setLocationID(res.data[6].value);
            if (infoMessage) setInfoMessage(false);
          } else {
            setInfoMessage(true);
            setCustomerID("");
            setCustomerName("");
            setLocationID("");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }, 500);
  }

  function toggleTransactionsModal() {
    setTransactionsModalOpen(!transactionsModalOpen);
  }

  function toggleBillModal() {
    setBillModalOpen(!billModalOpen);
  }

  function clearForm() {
    axios.delete("/api/clear-form");

    setCustomerID("");
    setCustomerName("");
    setLocationID("");
    setContainerID("");
    setTon("");
    setServicedDate(null);
    setComments("");
    setLandfillTonnageFeeAmount("");
    setTNRCCFeeAmount("");
    setLandfillTonnage("");
    setTNRCC("");
    setFee("");
    setAddedFees([]);
    setTotal("");
    setTransactionFormError(false);
    setAddedFeesFormError(false);
  }

  return (
    <React.Fragment>
      <Notification
        open={open}
        message={message}
        toggleOpen={toggleOpen}
        severity={severity}
      />

      <FeesModal open={feesModalOpen} onClose={toggleFeesModal} fees={fees} />

      <TransactionsModal
        open={transactionsModalOpen}
        onClose={toggleTransactionsModal}
      />

      <BillModal open={billModalOpen} close={toggleBillModal} />

      <TransactionAppBar
        createTransaction={createTransaction}
        toggleTransactionsModal={toggleTransactionsModal}
        toggleFeesModal={toggleFeesModal}
        toggleBillModal={toggleBillModal}
        clearForm={clearForm}
        addedFees={addedFees.length}
        total={total}
      />

      <Grid container direction="row" justifyContent="space-evenly">
        <Grid container direction="column" sx={{ width: "40%" }}>
          <Typography component="h1" variant="h5">
            Transaction
          </Typography>

          <Tooltip
            arrow
            title="Container does not exist"
            placement="top-end"
            open={infoMessage && !customerName && containerID}
          >
            <FormControl margin="normal">
              <TextField
                required
                disabled={!fees.length}
                label="Container ID"
                variant="outlined"
                size="small"
                error={transactionFormError && !containerID && true}
                value={containerID}
                onChange={handleContainerIDChange}
              ></TextField>
            </FormControl>
          </Tooltip>

          <Tooltip
            arrow
            title={customerName}
            placement="left-start"
            open={customerName !== "" && !transactionsModalOpen}
          >
            <FormControl margin="normal">
              <TextField
                disabled
                label="Customer ID"
                variant="outlined"
                size="small"
                error={transactionFormError && !customerID && true}
                value={customerID}
              ></TextField>
            </FormControl>
          </Tooltip>

          <FormControl margin="normal">
            <TextField
              disabled
              label="Location ID"
              variant="outlined"
              size="small"
              error={transactionFormError && !locationID && true}
              value={locationID}
            ></TextField>
          </FormControl>

          <FormControl margin="normal">
            <TextField
              disabled={!fees.length}
              label="TON"
              variant="outlined"
              size="small"
              value={ton ? ton : ""}
              onFocus={handleTonInputFocus}
              onChange={handleTonChange}
            ></TextField>
          </FormControl>

          <FormControl margin="normal">
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DesktopDatePicker
                disabled={!fees.length}
                label="Serviced Date"
                value={servicedDate}
                onChange={(date) => setServicedDate(date)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    error={transactionFormError && !servicedDate && true}
                  />
                )}
              />
            </LocalizationProvider>
          </FormControl>

          <FormControl margin="normal">
            <TextField
              multiline
              disabled={!fees.length}
              label="Comments"
              variant="outlined"
              size="small"
              minRows={2}
              maxRows={4}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
            ></TextField>
          </FormControl>

          <Grid container direction="column" sx={{ width: "100%", mt: 3 }}>
            <Typography component="h1" variant="h5">
              Add or Update Fee
            </Typography>

            <FormControl margin="normal" size="small">
              <InputLabel id="add-or-update">Add or Update</InputLabel>
              <Select
                disabled={!fees.length}
                value={addOrUpdate}
                label="Add or Update"
                onChange={(e) => setAddOrUpdate(e.target.value)}
              >
                <MenuItem value={"Add"}>Add</MenuItem>
                <MenuItem value={"Update"}>Update</MenuItem>
              </Select>
            </FormControl>

            {addOrUpdate === "Add" ? (
              <AddFeeForm addFeeToDB={addFeeToDB} />
            ) : addOrUpdate === "Update" ? (
              <UpdateFeeForm fees={fees} updateFee={updateFee} />
            ) : null}
          </Grid>
        </Grid>

        <Grid container direction="column" sx={{ width: "40%" }}>
          <Typography component="h1" variant="h5">
            Add Fees
          </Typography>
          <FormControl margin="normal">
            <Autocomplete
              required
              variant="outlined"
              size="small"
              getOptionDisabled={(option) => {
                return addedFees.some((elem) => elem.id === option.id);
              }}
              value={fee || null}
              onChange={handleAutocompleteChange}
              options={fees}
              renderOption={(props, option) => {
                if (
                  option.label === "TNRCC FEE CHARGE" ||
                  option.label === "LANDFILL TONNAGE" ||
                  option.label === "PULL FEE" ||
                  option.label === "RETURN TO STOCK" ||
                  option.label === "SERVICE CHARGE" ||
                  option.label === "ECTOR COUNTY ASSISTANCE DISTRI" ||
                  option.label.includes("RENT") ||
                  option.label.includes("TAX")
                )
                  return;
                return (
                  <li {...props} key={option.label}>
                    {option.label}
                  </li>
                );
              }}
              isOptionEqualToValue={(option, value) => {
                return option.id === value.id;
              }}
              renderInput={(params) => {
                return (
                  <TextField
                    {...params}
                    label="Fees"
                    error={addedFeesFormError && !fee && true}
                    onFocus={() =>
                      addedFeesFormError && setAddedFeesFormError(false)
                    }
                  />
                );
              }}
            ></Autocomplete>
          </FormControl>
          <Button variant="outlined" onClick={addFeeToTable}>
            Add Fee
          </Button>
          {addedFees.length ? (
            <FeesTable addedFees={addedFees} removeFee={removeFee} />
          ) : null}
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
