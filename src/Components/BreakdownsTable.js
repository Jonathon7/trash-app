import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

export default function BreakdownTable(props) {
  return (
    <React.Fragment>
      <TableContainer
        component={Paper}
        sx={{ maxHeight: 800, width: "calc(85% + 3rem)", m: "auto", mt: 3 }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {props.data.length
                ? props.headers.map((row, index) => {
                    return (
                      <TableCell key={index} size="small">
                        <p
                          style={{
                            fontSize: "12px",
                          }}
                        >
                          {row.label}
                        </p>
                      </TableCell>
                    );
                  })
                : null}
            </TableRow>
          </TableHead>
          <TableBody>
            {props.data.map((row) => {
              return row.map((elem, index) => {
                return (
                  <TableRow
                    key={index}
                    sx={{
                      bgcolor:
                        !elem.hasOwnProperty("customerId") && "#e3f2fd80",
                    }}
                  >
                    {props.headers.map((header, index) => {
                      return (
                        <TableCell
                          key={index}
                          sx={{ color: header.key === "total" && "#2196f3" }}
                        >
                          {Object.keys(elem).map((cell, i) => {
                            if (header.key === cell) {
                              return elem[cell];
                            } else {
                              return "";
                            }
                          })}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              });
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </React.Fragment>
  );
}
