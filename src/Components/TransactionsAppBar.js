import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

export default function TransactionsAppBar(props) {
  return (
    <React.Fragment>
      <AppBar
        position="static"
        color="transparent"
        sx={{ width: "87%", m: "auto", mb: 3 }}
      >
        <Toolbar variant="dense">
          <Grid container direction="row" justifyContent="space-between">
            <Button
              variant="text"
              sx={{ mr: 2 }}
              onClick={props.createTransaction}
            >
              CREATE TRANSACTION
            </Button>
            <Button
              variant="text"
              sx={{ mr: 2 }}
              onClick={props.toggleTransactionsModal}
            >
              SHOW TRANSACTIONS
            </Button>
            <Button
              variant="text"
              sx={{ mr: 2 }}
              onClick={props.toggleBreakdownsModal}
            >
              SHOW BREAKDOWNS
            </Button>
            <Button
              variant="text"
              sx={{ mr: 2 }}
              onClick={props.toggleFeesModal}
            >
              SHOW FEES
            </Button>
            <Button
              variant="text"
              sx={{ mr: 2 }}
              onClick={props.toggleBillModal}
            >
              BILL
            </Button>
            <Button variant="text" sx={{ mr: 2 }} onClick={props.clearForm}>
              CLEAR FORM
            </Button>
            <Typography variant="h6" component="div">
              {props.addedFees ? `$${props.total}` : ""}
            </Typography>
          </Grid>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
}
