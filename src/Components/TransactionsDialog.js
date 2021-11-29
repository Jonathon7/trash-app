import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function TransactionsDialog(props) {
  return (
    <React.Fragment>
      <Dialog
        open={props.open}
        onClose={props.toggleDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {`You are about to delete ${props.rows} row(s)`}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Click yes to permanently delete these rows.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.toggleDialog}>NO</Button>
          <Button
            onClick={() => {
              props.deleteRows();
              props.toggleDialog();
            }}
            autoFocus
          >
            YES
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
