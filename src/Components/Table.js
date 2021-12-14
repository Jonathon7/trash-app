import React from "react";
import Typography from "@mui/material/Typography";
import MUITable from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

export default function Table(props) {
  const keys = Object.keys(props.data[0]);
  return (
    <TableContainer>
      <Typography component="h6" variant="h6" sx={{ margin: 1, pl: 1 }}>
        Containers Owned By This Customer
      </Typography>
      <MUITable>
        <TableHead>
          <TableRow>
            {keys.map((elem, i) => {
              return <TableCell key={i}>{elem}</TableCell>;
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {props.data.map((elem, i) => {
            const values = Object.values(elem);
            return (
              <TableRow key={i}>
                {values.map((elem, i) => {
                  return <TableCell key={i}>{elem}</TableCell>;
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </MUITable>
    </TableContainer>
  );
}
