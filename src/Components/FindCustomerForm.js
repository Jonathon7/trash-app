import React from "react";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Card from "./Card";
import UpdateCustomerForm from "./UpdateCustomerForm";

export default function FindCustomerForm(props) {
  return (
    <Grid container direction="column" sx={{ width: "40%" }}>
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
          value={props.customerName || null}
          disabled={props.update && true}
          onChange={props.handleAutocompleteChange}
          options={props.customers}
          isOptionEqualToValue={(option, value) => option.label === value}
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
                error={props.getCustomerError && !props.customerName && true}
              />
            );
          }}
        ></Autocomplete>
      </FormControl>
      <Button
        variant="outlined"
        onClick={props.getCustomer}
        disabled={props.update && true}
      >
        Search
      </Button>
      {props.results.length ? (
        <Card title="Customer" data={props.results} />
      ) : null}
      {props.results.length ? (
        <Button variant="outlined" onClick={props.toggleUpdateStatus}>
          Change
        </Button>
      ) : null}
      {props.update && (
        <UpdateCustomerForm
          name={props.customerName}
          updateCustomerName={props.updateCustomerName}
          toggleUpdateStatus={props.toggleUpdateStatus}
        />
      )}
    </Grid>
  );
}
