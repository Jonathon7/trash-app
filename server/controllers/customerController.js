let Request = require("tedious").Request;
let { openDbConnection } = require("../database");

/**
 * @description - If the customer's id exists in the db, then the whole row is sent as a response.
 */
const getCustomers = async (req, res) => {
  openDbConnection()
    .then((connection) => {
      let result;
      const request = new Request(
        `SELECT * FROM ${process.env.customerTable}`,
        (err) => {
          if (err) {
            throw err;
          }
          connection.close();
        }
      );
      request.on("doneInProc", (rowCount, more, rows) => {
        result = rows;
      });
      request.on("requestCompleted", function () {
        res.status(200).json(result);
      });

      connection.execSql(request);
    })
    .catch((err) => console.log(err));
};

const getCustomer = (req, res) => {
  openDbConnection().then((connection) => {
    let result = [];

    const request = new Request(
      `SELECT * FROM ${process.env.customerTable} WHERE CustomerId = ${req.params.ID}; SELECT ContainerId, Location FROM ${process.env.containerTable} WHERE CustomerId = ${req.params.ID};`,
      (err) => {
        if (err) {
          throw err;
        }

        connection.close();
      }
    );

    request.on("doneInProc", (rowCount, more, rows) => {
      for (let i = 0; i < rows.length; i++) {
        result.push(rows[i]);
      }
    });

    request.on("requestCompleted", function () {
      res.status(200).json(result);
    });

    connection.execSql(request);
  });
};

const addCustomer = async (req, res) => {
  const exists = await checkForExistingCustomer(req.body.id);

  if (exists)
    return res.status(200).json("Customer already exists: ID already in use.");

  openDbConnection().then((connection) => {
    let result;

    let { id, name, taxExempt } = req.body;

    if (taxExempt) {
      taxExempt = 1;
    } else {
      taxExempt = 0;
    }

    const request = new Request(
      `INSERT INTO ${process.env.customerTable}(CustomerId, Name, TaxExempt) VALUES(${id}, '${name}', ${taxExempt}); SELECT * FROM ${process.env.customerTable} WHERE CustomerId=${id};`,
      (err) => {
        if (err) {
          throw err;
        }
        connection.close();
      }
    );

    request.on("doneInProc", (rowCount, more, rows) => {
      if (rows[0]) {
        result = rows[0];
      }
    });

    request.on("requestCompleted", function () {
      res.status(200).json(result);
    });

    connection.execSql(request);
  });
};

const updateCustomer = async (req, res) => {
  const customerExists = await checkForExistingCustomer(req.body.newID);
  openDbConnection().then((connection) => {
    let result;

    let { ID, newID, name, taxExempt } = req.body;

    newID = parseInt(newID, 10);

    if (taxExempt === "YES") {
      taxExempt = 1;
    } else {
      taxExempt = 0;
    }

    let sql = `UPDATE ${process.env.customerTable} SET Name='${name}', TaxExempt=${taxExempt} WHERE CustomerId = ${req.body.ID}; SELECT * FROM ${process.env.customerTable} WHERE CustomerId=${req.body.ID};`;

    if (ID !== newID) {
      if (customerExists)
        return res
          .status(200)
          .json("Customer already exists: ID already in use.");

      sql = `INSERT INTO ${process.env.customerTable} (CustomerId, Name, TaxExempt) VALUES(${newID}, '${name}', ${taxExempt});
             UPDATE ${process.env.containerTable} SET CustomerId = ${newID} WHERE CustomerId = ${ID};
             UPDATE ${process.env.transactionsTable} SET CustomerId = ${newID} WHERE CustomerId = ${ID};
             DELETE FROM ${process.env.customerTable} WHERE CustomerId = ${ID};
             SELECT * FROM ${process.env.customerTable} WHERE CustomerId=${req.body.newID};`;
    }

    const request = new Request(sql, (err) => {
      if (err) {
        throw err;
      }
      connection.close();
    });

    request.on("doneInProc", (rowCount, more, rows) => {
      if (rows[0]) {
        result = rows[0];
      }
    });

    request.on("requestCompleted", function () {
      res.status(200).json(result);
    });

    connection.execSql(request);
  });
};

const checkForExistingCustomer = (id) =>
  new Promise((resolve, reject) => {
    openDbConnection().then((connection) => {
      let customerExists = false;
      const request = new Request(
        `SELECT * FROM ${process.env.customerTable} WHERE CustomerId = ${id}`,
        (err) => {
          if (err) {
            throw err;
          }
          connection.close();
        }
      );

      request.on("doneInProc", (rowCount, more, rows) => {
        if (rows[0]) {
          customerExists = true;
        }
      });

      request.on("requestCompleted", function () {
        if (customerExists) {
          resolve(true);
        } else {
          resolve(false);
        }
      });

      connection.execSql(request);
    });
  });

const getCustomerBill = (req, res) => {
  openDbConnection().then((connection) => {
    let customerExists = false;
    const request = new Request(
      `SELECT * FROM ${process.env.customerTable} WHERE CustomerId = ${id}`,
      (err) => {
        if (err) {
          throw err;
        }
        connection.close();
      }
    );

    request.on("doneInProc", (rowCount, more, rows) => {
      if (rows[0]) {
        customerExists = true;
      }
    });

    request.on("requestCompleted", function () {
      if (customerExists) {
        resolve(true);
      } else {
        resolve(false);
      }
    });

    connection.execSql(request);
  });
};

const getCustomerInfo = async (req, res) => {
  openDbConnection().then((connection) => {
    let result = "";

    const sql = `SELECT Name FROM ${process.env.customerTable} WHERE CustomerId = ${req.params.customerID}; SELECT Address1 FROM ${process.env.locationTable} WHERE LocationId = ${req.params.locationID};`;

    const request = new Request(sql, (err) => {
      if (err) {
        throw err;
      }
      connection.close();
    });

    request.on("doneInProc", (rowCount, more, rows) => {
      if (rows) {
        if (!result) {
          result += rows[0][0].value;
          result += "\n";
        } else {
          result += rows[0][0].value;
        }
      }
    });

    request.on("requestCompleted", function () {
      res.status(200).json(result);
    });

    connection.execSql(request);
  });
};

module.exports = {
  getCustomers,
  getCustomer,
  getCustomerBill,
  addCustomer,
  updateCustomer,
  getCustomerInfo,
};
