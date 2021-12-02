import React from "react";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Card from "./Card";
import UpdateLocationForm from "./UpdateLocationForm";

export default function GetLocationForm(props) {
  return (
    <Grid container direction="column" sx={{ width: "40%" }}>
      <Typography component="h1" variant="h5">
        Find a Location
      </Typography>
      <FormControl margin="normal">
        <Autocomplete
          required
          autoComplete
          autoSelect
          autoHighlight
          variant="outlined"
          size="small"
          disabled={props.update && true}
          value={props.address1 || null}
          onChange={(e, val) => {
            props.setAddress1(val);
            props.setResults([]);
          }}
          options={props.locations}
          renderInput={(params) => {
            return (
              <TextField
                {...params}
                label="Location Address"
                error={props.getLocationError && !props.address1 && true}
              />
            );
          }}
        ></Autocomplete>
      </FormControl>
      <Button
        variant="outlined"
        onClick={props.getLocation}
        disabled={props.update && true}
      >
        Search
      </Button>
      {props.results.length ? (
        <Card title="Location" data={props.results} />
      ) : null}
      {props.results.length ? (
        <Button variant="outlined" onClick={props.toggleUpdateStatus}>
          Change
        </Button>
      ) : null}

      {props.update && (
        <UpdateLocationForm
          address1={props.address1}
          address2={props.address2}
          accountType={props.accountType}
          toggleUpdateStatus={props.toggleUpdateStatus}
          updateLocation={props.updateLocation}
        />
      )}
    </Grid>
  );
}
