let Request = require("tedious").Request;
let { openDbConnection } = require("../database");
const { formatDate } = require("../utils/formatDate");

const getFees = (req, res) => {
  openDbConnection().then((connection) => {
    let result;
    const request = new Request(
      `SELECT * FROM ${process.env.feesTable}`,
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

      const transactionDate = formatDate(new Date());
      const setDate = formatDate(dates[0].value);
      servicedDate = formatDate(servicedDate);

      if (!setDate) {
        res.status(200).json("The container is required to have a Set Date");
        return;
      }

      const sql1 = `INSERT INTO ${process.env.transactionsTable} (CustomerId, LocationId, ContainerId, FeeId, Name, Amount, TransactionDate, Tonnage, SetDate, Comment, ServicedDate) VALUES (${customerID}, ${locationID}, ${containerID}, ${feeID}, '${feeName}', ${feeAmount}, '${transactionDate}', ${ton}, '${setDate}', '${comments}', '${servicedDate}')`;
      const sql2 = `INSERT INTO ${process.env.transactionsTable} (CustomerId, LocationId, ContainerId, FeeId, Name, Amount, TransactionDate, Tonnage, SetDate, Comment) VALUES (${customerID}, ${locationID}, ${containerID}, ${feeID}, '${feeName}', ${feeAmount}, '${transactionDate}', ${ton}, '${setDate}', '${comments}')`;

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
          `INSERT INTO ${process.env.feesTable}(Name, Amount) values('${req.body.name}', ${req.body.amount});`,
          (err) => {
            if (err) {
              throw err;
            }
            connection.close();
          }
        );

        request.on("requestCompleted", function () {
          res.status(200).json({ message: "Fee Added." });
        });

        connection.execSql(request);
      });
    }
  });
};

const updateFee = (req, res) => {
  openDbConnection().then((connection) => {
    const request = new Request(
      `UPDATE ${process.env.feesTable} SET Amount = ${req.body.feeAmount} WHERE FeeId = ${req.body.id}`,
      (err) => {
        if (err) {
          throw err;
        }

        connection.close();
      }
    );

    request.on("requestCompleted", function () {
      res.status(200).json("Fee Updated.");
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
        `SELECT * FROM ${process.env.feesTable} WHERE Name = '${name}'`,
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
        `SELECT SetDate FROM ${process.env.containerTable} WHERE ContainerId = '${id}'`,
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
    const {
      customerID,
      locationID,
      containerID,
      startDate,
      endDate,
      showOnlyUnprocessedTransactions,
    } = req.params;

    let sql = `SELECT * FROM ${process.env.transactionsTable}`;

    if (customerID !== "null") sql += ` WHERE (CustomerId = ${customerID}`;

    if (locationID !== "null")
      sql += `${
        sql.includes("WHERE") ? " OR " : " WHERE ("
      } LocationId = ${locationID}`;

    if (containerID !== "null")
      sql += `${
        sql.includes("WHERE") ? " OR " : " WHERE ("
      } ContainerId = ${containerID}`;

    sql.includes("WHERE") && (sql += ")");

    if (startDate !== "null" && endDate !== "null") {
      !sql.includes("WHERE") ? (sql += " WHERE ") : (sql += " AND ");

      sql += `ServicedDate BETWEEN '${formatDate(startDate)}' AND '${formatDate(
        endDate
      )}'`;
    }

    showOnlyUnprocessedTransactions === "true" &&
      (sql += "AND TransactionProcessed = 0");

    sql += " ORDER BY ServicedDate";

    let results;
    const request = new Request(sql, (err) => {
      if (err) {
        throw err;
      }
      connection.close();
    });

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

const updateTransaction = (req, res) => {
  console.log(req.body);
  res.status(200).json("Transaction Updated");
};

const deleteTransactions = (req, res) => {
  openDbConnection().then((connection) => {
    const request = new Request(
      `DELETE FROM ${process.env.transactionsTable} WHERE TransactionId = '${req.params.ID}';`,
      (err) => {
        if (err) {
          throw err;
        }
        connection.close();
      }
    );

    request.on("requestCompleted", function () {
      res.status(200).json("Transactions Deleted");
    });

    connection.execSql(request);
  });
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
  updateTransaction,
  deleteTransactions,
};
