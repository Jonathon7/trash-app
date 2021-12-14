import React from "react";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import IconButton from "@mui/material/IconButton";
import InfoIcon from "@mui/icons-material/Info";
import Table from "./Table";

export default function BasicCard(props) {
  return (
    <Card sx={{ marginTop: 5 }}>
      <CardContent>
        <Grid
          container
          alignItems="center"
          justifyContent="space-between"
          sx={{ pb: 1 }}
        >
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            {props.title}
          </Typography>
          {props.toggleShowInfo && (
            <IconButton onClick={props.toggleShowInfo}>
              <InfoIcon color="primary" />
            </IconButton>
          )}
        </Grid>
        {props.data.map((elem, index) => {
          return (
            <Grid
              container
              direction="row"
              justifyContent="space-between"
              key={index}
            >
              <Typography variant="h6" component="div" color="#4285F4;">
                {Object.keys(elem)[0]}
              </Typography>
              <Typography variant="h6" component="div">
                {Object.values(elem)[0]}
              </Typography>
            </Grid>
          );
        })}
        <Modal open={props.showInfo || false} onClose={props.toggleShowInfo}>
          <Box
            sx={{ width: "70%", background: "#fff", margin: "auto", mt: 10 }}
          >
            <Table data={props.info} />
          </Box>
        </Modal>
      </CardContent>
    </Card>
  );
}
