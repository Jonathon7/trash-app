let Request = require("tedious").Request;
let { openDbConnection } = require("../database");
const { formatDate } = require("../utils/formatDate");

const getFees = (req, res) => {
  openDbConnection().then((connection) => {
    let result;
    const request = new Request(
      `SELECT * FROM ${process.env.testFeesTable}`,
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

const createTransaction = (req, res) => {
  getDates(req.body.containerID).then((dates) => {
    openDbConnection().then((connection) => {
      let {
        customerID,
        locationID,
        containerID,
        feeID,
        feeName,
        feeAmount,
        ton,
        comments,
        servicedDate,
      } = req.body;

      // Transaction Date - uses current date
      const m = new Date();
      const date =
        m.getFullYear() +
        "/" +
        ("0" + (m.getMonth() + 1)).slice(-2) +
        "/" +
        ("0" + m.getDate()).slice(-2) +
        " " +
        ("0" + m.getHours()).slice(-2) +
        ":" +
        ("0" + m.getMinutes()).slice(-2) +
        ":" +
        ("0" + m.getSeconds()).slice(-2);

      const setDate = formatDate(dates[0].value);
      servicedDate = formatDate(servicedDate);

      if (!setDate) {
        res.status(200).json("The container is required to have a Set Date");
        return;
      }

      const sql1 = `INSERT INTO ${process.env.testTransactionsTable} (CustomerId, LocationId, ContainerId, FeeId, Name, Amount, TransactionDate, Tonnage, SetDate, Comment, ServicedDate) VALUES (${customerID}, ${locationID}, ${containerID}, ${feeID}, '${feeName}', ${feeAmount}, '${date}', ${ton}, '${setDate}', '${comments}', '${servicedDate}')`;
      const sql2 = `INSERT INTO ${process.env.testTransactionsTable} (CustomerId, LocationId, ContainerId, FeeId, Name, Amount, TransactionDate, Tonnage, SetDate, Comment) VALUES (${customerID}, ${locationID}, ${containerID}, ${feeID}, '${feeName}', ${feeAmount}, '${date}', ${ton}, '${setDate}', '${comments}')`;

      const sql = servicedDate ? sql1 : sql2;

      const request = new Request(sql, (err) => {
        if (err) {
          console.log(err.stack);
          throw err;
        }

        connection.close();
      });

      connection.execSql(request);

      req.session.transaction = {};
      res.status(200).json({ message: "Rows Inserted." });
    });
  });
};

const addFee = (req, res) => {
  checkForExistingFee(req.body.name).then((exists) => {
    if (exists) {
      res.status(200).json("Fee already exists: Name already in use.");
    } else {
      openDbConnection().then((connection) => {
        const request = new Request(
          `INSERT INTO ${process.env.testFeesTable}(Name, Amount) values('${req.body.name}', ${req.body.amount});`,
          (err) => {
            if (err) {
              throw err;
            }
            connection.close();
          }
        );

        request.on("requestCompleted", function () {
          res.status(200).json("Fee Added.");
        });

        connection.execSql(request);
      });
    }
  });
};

const updateFee = (req, res) => {
  openDbConnection().then((connection) => {
    const request = new Request(
      `UPDATE ${process.env.testFeesTable} SET Amount = ${req.body.feeAmount} WHERE FeeId = ${req.body.id}`,
      (err) => {
        if (err) {
          throw err;
        }

        connection.close();
      }
    );

    request.on("requestCompleted", function () {
      res.sendStatus(200);
    });

    connection.execSql(request);
  });
};

/**
 * @description - a user cannot create two fees with the same name
 */
const checkForExistingFee = (name) =>
  new Promise((resolve, reject) => {
    openDbConnection().then((connection) => {
      let feeExists = false;
      const request = new Request(
        `SELECT * FROM ${process.env.testFeesTable} WHERE Name = '${name}'`,
        (err) => {
          if (err) {
            throw err;
          }
          connection.close();
        }
      );

      request.on("doneInProc", (rowCount, more, rows) => {
        if (rows[0]) {
          feeExists = true;
        }
      });

      request.on("requestCompleted", function () {
        if (feeExists) {
          resolve(true);
        } else {
          resolve(false);
        }
      });

      connection.execSql(request);
    });
  });

const getDates = (id) =>
  new Promise((resolve, reject) => {
    openDbConnection().then((connection) => {
      let results;
      const request = new Request(
        `SELECT SetDate FROM ${process.env.testContainerTable} WHERE ContainerId = '${id}'`,
        (err) => {
          if (err) {
            throw err;
          }
          connection.close();
        }
      );

      request.on("doneInProc", (rowCount, more, rows) => {
        if (rows[0]) {
          results = rows[0];
        }
      });

      request.on("requestCompleted", function () {
        resolve(results);
      });

      connection.execSql(request);
    });
  });

const getTransactions = (req, res) => {
  openDbConnection().then((connection) => {
    const { ID } = req.query;

    let results;
    const request = new Request(
      `SELECT * FROM ${process.env.testTransactionsTable} WHERE CustomerId = ${ID}`,
      (err) => {
        if (err) {
          throw err;
        }
        connection.close();
      }
    );

    request.on("doneInProc", (rowCount, more, rows) => {
      if (rows[0]) {
        results = rows;
      }
    });

    request.on("requestCompleted", function () {
      res.status(200).json(results);
    });

    connection.execSql(request);
  });
};

const getFormData = (req, res) => {
  res.status(200).json(req.session.transaction);
};

const saveFormData = (req, res) => {
  if (typeof req.session.transaction !== "undefined") {
    req.session.transaction = {};
  }

  req.session.transaction = req.body;

  res.status(200).json(req.session.transaction);
};

const clearForm = (req, res) => {
  req.session.transaction = {};
  res.status(200).json("form data cleared");
};

module.exports = {
  getFees,
  createTransaction,
  addFee,
  updateFee,
  getTransactions,
  getFormData,
  saveFormData,
  clearForm,
};
