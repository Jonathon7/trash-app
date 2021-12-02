import React from "react";
import { makeStyles } from "@mui/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const useStyles = makeStyles({
  tr: {
    "&:hover": {
      background: "rgba(33, 150, 243, .1)",
      cursor: "pointer",
    },
  },
  selectedTr: {
    background: "rgba(33, 150, 243, .4)",
  },
});

export default function TransactionsTable(props) {
  const classes = useStyles();
  return (
    <TableContainer component={Paper} sx={{ mt: 3, maxHeight: 500 }}>
      <Table>
        <TableHead>
          <TableRow>
            {props.transactions.length
              ? props.transactions[0].map((row, index) => {
                  return (
                    <TableCell key={index} size="small">
                      {row.label}
                    </TableCell>
                  );
                })
              : null}
          </TableRow>
        </TableHead>
        <TableBody>
          {props.transactions.map((row, index) => {
            return (
              <TableRow
                key={index}
                onClick={() => props.selectRow(row[0].value)}
                className={
                  !props.editingEnabled
                    ? null
                    : props.rowsToDelete.includes(row[0].value)
                    ? classes.selectedTr
                    : classes.tr
                }
              >
                {row.map((elem, index) => {
                  return (
                    <React.Fragment key={index}>
                      <TableCell size="small">{elem.value}</TableCell>
                    </React.Fragment>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
