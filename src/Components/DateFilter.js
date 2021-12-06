import React from "react";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";

export default function DateFilter(props) {
  return (
    <React.Fragment>
      <Grid container direction="row" sx={{ width: "fit-content" }}>
        <FormControl margin="normal" sx={{ mr: 1 }}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DesktopDatePicker
              clearable
              disabled={props.editingEnabled}
              label="Start Date"
              value={props.startDate}
              onChange={(date) => props.setStartDate(date)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  error={props.dateFilterFormError && !props.startDate && true}
                />
              )}
            />
          </LocalizationProvider>
        </FormControl>
        <FormControl margin="normal">
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DesktopDatePicker
              clearable
              disabled={props.editingEnabled}
              label="End Date"
              value={props.endDate}
              onChange={(date) => props.setEndDate(date)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  error={props.dateFilterFormError && !props.endDate && true}
                />
              )}
            />
          </LocalizationProvider>
        </FormControl>
      </Grid>
    </React.Fragment>
  );
}
