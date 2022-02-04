import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import DateFilter from "./DateFilter";
import { formatDate } from "../utils/formatDate";

function createDateOptionsArray() {
  const dates = [];

  const start = new Date();
  const end = new Date();

  start.setMonth(start.getMonth() - 1);
  start.setDate(21);
  start.setHours(0, 0, 0);

  end.setHours(0, 0, 0);

  let date = { start: formatDate(start), end: formatDate(end) };

  dates.push(date);

  const defaultDate = { start: formatDate(start), end: formatDate(end) };

  for (let i = 0; i < 2; i++) {
    start.setMonth(start.getMonth() - 1);
    start.setDate(21);
    start.setHours(0, 0, 0);

    end.setMonth(end.getMonth() - 1);
    end.setDate(20);
    end.setHours(0, 0, 0);

    dates.push({ start: formatDate(start), end: formatDate(end) });
  }

  return { defaultDate, dates };
}

export default function DateRange() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showDateOptions, setShowDateOptions] = useState(false);
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const { defaultDate, dates } = createDateOptionsArray();

  function toggleShowDateOptions() {
    if (showCustomDatePicker) {
      setShowCustomDatePicker(false);
    }

    setShowDateOptions(!showDateOptions);
  }

  function toggleShowCustomDatePicker() {
    if (showDateOptions) {
      setShowDateOptions(false);
    }

    setShowCustomDatePicker(!showCustomDatePicker);
  }

  function select() {
    const date = { start: formatDate(startDate), end: formatDate(endDate) };
    setSelectedDate(date);
    setShowCustomDatePicker(false);
  }

  function cancel() {
    setShowCustomDatePicker(false);
  }

  return (
    <React.Fragment>
      <Grid container direction="column">
        <Typography
          variant="subtitle1"
          display="inline"
          sx={{
            bgcolor: "#fff",
            border: "solid 1px #2196f3",
            p: 0.7,
            borderRadius: 5,
            width: "fit-content",
          }}
        >
          {selectedDate
            ? selectedDate.start + " - " + selectedDate.end
            : defaultDate.start + " - " + defaultDate.end}
          <IconButton onClick={toggleShowDateOptions}>
            <ArrowDropDownIcon />
          </IconButton>
        </Typography>
        {showDateOptions && (
          <Box
            sx={{
              position: "absolute",
              bgcolor: "#fff",
              p: 1.2,
              mt: 7,
              ml: 4,
              width: "fit-content",
              border: "solid 1px #e3f2fd",
            }}
          >
            {dates.map((elem, i) => {
              return (
                <Typography
                  key={i}
                  sx={{
                    "&:hover": {
                      bgcolor: "#e3f2fd48",
                    },
                    p: 1,
                    cursor: "pointer",
                    bgcolor:
                      selectedDate &&
                      selectedDate.start === elem.start &&
                      selectedDate.end === elem.end &&
                      "#e3f2fd80",
                  }}
                  onClick={() => {
                    setSelectedDate(elem);
                    setShowDateOptions(false);
                  }}
                >
                  {elem.start} - {elem.end}
                </Typography>
              );
            })}
            <Typography
              sx={{
                "&:hover": {
                  bgcolor: "#e3f2fd80",
                },
                p: 1,
                cursor: "pointer",
              }}
              onClick={toggleShowCustomDatePicker}
            >
              Custom Date
            </Typography>
          </Box>
        )}
        {showCustomDatePicker && (
          <Box sx={{ position: "absolute", mt: 8, p: 1.2, background: "#fff" }}>
            <DateFilter
              startDate={startDate}
              endDate={endDate}
              setStartDate={setStartDate}
              setEndDate={setEndDate}
            />
            <Button onClick={cancel}>Cancel</Button>
            <Button onClick={select}>Select</Button>
          </Box>
        )}
      </Grid>
    </React.Fragment>
  );
}
