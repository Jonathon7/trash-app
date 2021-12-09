require("dotenv").config();
const express = require("express");
const { json } = require("body-parser");
const session = require("express-session");
const TediousStore = require("connect-tedious")(session);
const Customer = require("./controllers/customerController");
const Location = require("./controllers/locationController");
const Container = require("./controllers/containerController");
const Transaction = require("./controllers/transactionController");

const app = express();
app.use(json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7 * 2, // 2 weeks
    },
    store: new TediousStore({
      config: {
        server: process.env.IP,
        userName: process.env.USER,
        password: process.env.PASSWORD,
        options: {
          port: 1433, // Default Port
          encrypt: false,
          trustServerCertificate: true,
          rowCollectionOnDone: true,
          database: process.env.DATABASE,
        },
      },
    }),
  })
);

// Customer Form
app.get("/api/get-customers", Customer.getCustomers);
app.get("/api/get-customer/:ID", Customer.getCustomer);
app.post("/api/add-customer", Customer.addCustomer);
app.put("/api/update-name", Customer.updateCustomer);

// Location Form
app.get("/api/get-locations", Location.getLocations);
app.get("/api/get-location/:address1", Location.getLocation);
app.put("/api/update-location", Location.updateLocation);
app.post("/api/add-location", Location.addLocation);

// Container Form
app.get("/api/container/", Container.getContainerIDs);
app.get("/api/container/:ID", Container.getContainer);
app.put("/api/container", Container.updateContainer);
app.post("/api/container", Container.addContainer);
app.put("/api/return-to-stock", Container.returnToStock);

// Transaction Form
app.get("/api/fees", Transaction.getFees);
app.get(
  "/api/transactions/:customerID/:locationID/:containerID/:startDate/:endDate/:showOnlyUnprocessedTransactions",
  Transaction.getTransactions
);
app.post("/api/transaction", Transaction.createTransaction);
app.post("/api/fees", Transaction.addFee);
app.put("/api/fees", Transaction.updateFee);
app.post("/api/transaction-form-data", Transaction.saveFormData);
app.get("/api/transaction-form-data", Transaction.getFormData);
app.delete("/api/clear-form", Transaction.clearForm);
app.put("/api/transactions", Transaction.updateTransaction);
app.delete("/api/transactions/:ID", Transaction.deleteTransactions);
app.get("/api/bill-fee-amounts", Transaction.getBillFeeAmounts);
app.post("/api/service-charge", Transaction.addServiceCharge);
app.post("/api/monthly-rent-charge", Transaction.addMonthlyRentCharge);
app.put("/api/bill", Transaction.bill);

const PORT = process.env.NODE_PORT;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
