import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

export default function TransactionsTable(props) {
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
              <TableRow key={index}>
                {row.map((elem, index) => {
                  return (
                    <TableCell key={index} size="small">
                      {elem.value}
                    </TableCell>
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
