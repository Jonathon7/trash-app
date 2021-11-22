import React from "react";
import Grid from "@mui/material/Grid";
import Drawer from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";
import Toolbar from "@mui/material/Toolbar";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import OdessaLogo from "../assets/Logo.jpg";

export default function SideDrawer(props) {
  return (
    <React.Fragment>
      <Drawer
        sx={{
          width: 200,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 200,
            boxSizing: "border-box",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar>
          <Grid container alignItems="center" justifyContent="space-between">
            <img src={OdessaLogo} alt="Odessa Logo" height="50" />
            <Typography component="h1" variant="h6">
              Trash App
            </Typography>
          </Grid>
        </Toolbar>
        <Divider />
        <List>
          {["Customer", "Location", "Container", "Transactions"].map((text) => (
            <ListItemButton
              key={text}
              onClick={() => props.toggleComponent(text)}
              selected={props.componentName === text}
            >
              <ListItemText primary={text} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>
    </React.Fragment>
  );
}
