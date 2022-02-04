import React, { useState, useEffect } from "react";
import { makeStyles } from "@mui/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import randomMC from "random-material-color";
import TablePagination from "@mui/material/TablePagination";
import IconButton from "@mui/material/IconButton";
import DownloadIcon from "@mui/icons-material/Download";

const useStyles = makeStyles({
  tr: {
    "&:hover": {
      background: "rgba(33, 150, 243, .1)",
      cursor: "pointer",
    },
  },
  selectedTr: {
    background: "rgba(33, 150, 243, .4)",
    cursor: "pointer",
  },
});

const colors = [];

function getBackgroundColor(customerID) {
  if (colors.length) {
    for (let i = 0; i < colors.length; i++) {
      if (colors[i].id === customerID) {
        return colors[i].color;
      }
    }
  }

  const mcColor = randomMC.getColor();
  const color = mcColor + "4D"; // 40% opacity

  let colorData = {};

  colorData.color = color;
  colorData.id = customerID;
  colors.push(colorData);

  return color;
}

export default function TransactionsTable(props) {
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  useEffect(() => {
    setPage(0);
  }, [props.transactions.length]);

  function handlePageChange(e, newPage) {
    setPage(newPage);
  }

  function handleRowsPerPageChange(e) {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  }

  return (
    <React.Fragment>
      <TableContainer
        component={Paper}
        sx={{ maxHeight: 500, width: "calc(80% + 3rem)", m: "auto", mt: 3 }}
      >
        <Table stickyHeader>
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
            {props.transactions
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                return (
                  <TableRow
                    key={index}
                    onClick={() => props.selectRow(row[0].value, row[8].value)}
                    className={
                      !props.editingEnabled
                        ? null
                        : props.rowsToDelete.includes(row[0].value)
                        ? classes.selectedTr
                        : classes.tr
                    }
                    style={{
                      background:
                        props.colorCode &&
                        !props.editingEnabled &&
                        getBackgroundColor(row[1].value),
                    }}
                  >
                    <TableCell size="small">{row[0].value}</TableCell>
                    <TableCell size="small">{row[1].value}</TableCell>
                    <TableCell size="small">{row[2].value}</TableCell>
                    <TableCell size="small">{row[3].value}</TableCell>
                    <TableCell size="small">{row[4].value}</TableCell>
                    <TableCell size="small">{row[5].value}</TableCell>
                    <TableCell size="small">{row[6].value}</TableCell>
                    <TableCell size="small">{row[7].value}</TableCell>
                    <TableCell size="small">{row[8].value}</TableCell>
                    <TableCell size="small">{row[9].value}</TableCell>
                    <TableCell size="small">{row[10].value}</TableCell>
                    <TableCell size="small">{row[11].value}</TableCell>
                    <TableCell size="small">{row[12].value}</TableCell>
                    <TableCell size="small">
                      {props.download ? (
                        <IconButton
                          onClick={() =>
                            props.getCustomerBillBreakdown(row[1].value)
                          }
                        >
                          <DownloadIcon />
                        </IconButton>
                      ) : null}
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      {props.transactions.length ? (
        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 200]}
          component="div"
          count={props.transactions.length}
          page={page}
          onPageChange={handlePageChange}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleRowsPerPageChange}
          sx={{ width: "calc(80% + 3rem)", m: "auto" }}
        />
      ) : null}
    </React.Fragment>
  );
}
