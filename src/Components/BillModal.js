import React, { useState } from "react";
import axios from "axios";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import DateFilter from "./DateFilter";
import Typography from "@mui/material/Typography";

export default function BillModal(props) {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [dateFilterFormError, setDateFilterFormError] = useState(false);

  async function bill() {
    if (!startDate || !endDate) {
      setDateFilterFormError(true);
      return;
    }

    // get fee amounts
    const fees = await axios.get("/api/bill-fee-amounts");

    const feesData = [
      {
        SERVICE_CHARGE_FEE_ID: fees.data[0][0].value,
        SERVICE_CHARGE_FEE_NAME: fees.data[0][1].value, // 0
        SERVICE_CHARGE_FEE_AMOUNT: fees.data[0][2].value,
      },
      {
        MONTHLY_RENT_30YD_OT: fees.data[1][2].value, // 1
      },
      {
        MONTHLY_RENT_40YD_OT: fees.data[2][2].value, // 2
      },
      {
        DAILY_RENT_30YD_OT: fees.data[3][2].value, // 3
      },
      {
        DAILY_RENT_40YD_OT: fees.data[4][2].value, // 4
      },
      {
        DAILY_RENT_COMPACTOR: fees.data[5][2].value, // 5
      },
      { TSI: fees.data[6][2].value },
      { TMI: fees.data[7][2].value },
      { TCI: fees.data[8][2].value },
      { TII: fees.data[9][2].value },
      { TSO: fees.data[10][2].value },
      { TMO: fees.data[11][2].value },
      { TCO: fees.data[12][2].value },
      { TIO: fees.data[13][2].value },
      { EC: fees.data[14][2].value },
    ];

    // add service charge
    await axios.post("/api/service-charge", {
      startDate,
      endDate,
      feeID: feesData[0].SERVICE_CHARGE_FEE_ID,
      Name: feesData[0].SERVICE_CHARGE_FEE_NAME,
      Amount: feesData[0].SERVICE_CHARGE_FEE_AMOUNT,
    });

    // add rent charge
    await axios.post("/api/monthly-rent-charge", {
      startDate,
      endDate,
      DAILY_RENT_30YD_OT: feesData[3].DAILY_RENT_30YD_OT,
      DAILY_RENT_40YD_OT: feesData[4].DAILY_RENT_40YD_OT,
      MONTHLY_RENT_30YD_OT: feesData[1].MONTHLY_RENT_30YD_OT,
      MONTHLY_RENT_40YD_OT: feesData[2].MONTHLY_RENT_40YD_OT,
      DAILY_RENT_COMPACTOR: feesData[5].DAILY_RENT_COMPACTOR,
    });

    // update transactions in date range to processed
    await axios.put("/api/bill", { startDate, endDate });

    //taxes
    await axios.post("/api/taxes", {
      startDate,
      endDate,
      TSI: feesData[6].TSI,
      TMI: feesData[7].TMI,
      TCI: feesData[8].TCI,
      TII: feesData[9].TII,
      TSO: feesData[10].TSO,
      TMO: feesData[11].TMO,
      TCO: feesData[12].TCO,
      TIO: feesData[13].TIO,
      EC: feesData[14].EC,
    });
  }

  return (
    <Modal open={props.open} onClose={props.close}>
      <Box
        sx={{
          width: "50%",
          height: "50%",
          bgcolor: "#fff",
          m: "auto",
          mt: 10,
          display: "flex",
          alignItems: "start",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "fit-content",
            pt: 5,
          }}
        >
          <Typography variant="h6" component="h1" sx={{ alignSelf: "start" }}>
            Bill Run
          </Typography>
          <DateFilter
            startDate={startDate}
            endDate={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            dateFilterFormError={dateFilterFormError}
          />

          <Button variant="outlined" onClick={bill} sx={{ alignSelf: "start" }}>
            BILL
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
