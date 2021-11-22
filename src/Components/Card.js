import React from "react";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

export default function BasicCard(props) {
  return (
    <Card sx={{ marginTop: 5 }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {props.title}
        </Typography>
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
      </CardContent>
    </Card>
  );
}
