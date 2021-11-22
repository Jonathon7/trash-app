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
    let result;

    const request = new Request(
      `SELECT * FROM ${process.env.customerTable} WHERE CustomerId = ${req.params.ID}`,
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
  });
};

const addCustomer = async (req, res) => {
  const exists = await checkForExistingCustomer(req.body.id);

  if (exists)
    return res.status(200).json("Customer already exists: ID already in use.");

  openDbConnection().then((connection) => {
    let result;

    const request = new Request(
      `INSERT INTO ${process.env.customerTable}(CustomerId, Name) VALUES(${req.body.id}, '${req.body.name}'); SELECT * FROM ${process.env.customerTable} WHERE CustomerId=${req.body.id};`,
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

const updateCustomer = (req, res) => {
  openDbConnection().then((connection) => {
    let result;

    const request = new Request(
      `UPDATE ${process.env.customerTable} SET Name='${req.body.newName}' WHERE CustomerId =${req.body.id}; SELECT * FROM ${process.env.customerTable} WHERE CustomerId=${req.body.id}`,
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

module.exports = {
  getCustomers,
  getCustomer,
  addCustomer,
  updateCustomer,
};