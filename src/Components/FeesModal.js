import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Modal from "@mui/material/Modal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export default function FeesModal(props) {
  return (
    <React.Fragment>
      <Modal open={props.open} onClose={props.onClose}>
        <Box sx={style}>
          <Typography variant="h5" component="h2">
            Fees
          </Typography>
          {props.fees.map((elem) => {
            return (
              <Grid
                container
                direction="row"
                justifyContent="space-between"
                key={elem.id}
              >
                <Typography
                  variant="h6"
                  component="h2"
                  sx={{ color: "#2196f3" }}
                >
                  {elem.label}:
                </Typography>
                <Typography variant="h6" component="h2">
                  ${elem.amount}
                </Typography>
              </Grid>
            );
          })}
        </Box>
      </Modal>
    </React.Fragment>
  );
}
