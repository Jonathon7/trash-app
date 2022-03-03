let Request = require("tedious").Request;
let { openDbConnection } = require("../database");
const { formatDate } = require("../utils/formatDate");
const { formatDate2 } = require("../utils/formatDate2");
const startOfDay = require("../utils/startOfDay");
const endOfDay = require("../utils/endOfDay");

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
          `INSERT INTO ${process.env.feesTable}(Name, Amount, ChargeCode, RateCode) values('${req.body.name}', ${req.body.amount}, '${req.body.chargeCode}', '${req.body.rateCode}');`,
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
      `UPDATE ${process.env.feesTable} SET Amount = ${req.body.feeAmount}, ChargeCode = '${req.body.chargeCode}', RateCode = '${req.body.rateCode}' WHERE FeeId = ${req.body.id}`,
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

      sql += `ServicedDate BETWEEN '${formatDate(
        startOfDay(startDate)
      )}' AND '${formatDate(endOfDay(endDate))}'`;
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

const getTopTransactions = (req, res) => {
  openDbConnection().then((connection) => {
    let results;

    const sql = `SELECT TOP 100 * FROM ${process.env.transactionsTable} ORDER BY TransactionId DESC;`;

    const request = new Request(sql, (err) => {
      if (err) throw err;

      connection.close();
    });

    request.on("doneInProc", (rowCount, more, rows) => {
      if (rows) {
        results = rows;
      }
    });

    request.on("requestCompleted", () => {
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

const getBillFeeAmounts = (req, res) => {
  openDbConnection().then((connection) => {
    let result;

    const request = new Request(
      `SELECT FeeId, Name, Amount FROM ${process.env.feesTable} WHERE Name IN('SERVICE CHARGE', 'DAILY RENT 30YD OT', 'DAILY RENT 40YD OT', 'MONTHLY RENT 30YD OT', 'MONTHLY RENT 40YD OT', 'DAILY RENT COMPACTOR') OR RateCode IN('TSI', 'TMI', 'TCI', 'TII', 'TSO', 'TMO', 'TCO', 'TIO', 'EC');`,
      (err) => {
        if (err) {
          throw err;
        }
        connection.close();
      }
    );

    request.on("doneInProc", (rowCount, more, rows) => {
      if (rows[0]) {
        result = rows;
      }
    });

    request.on("requestCompleted", function () {
      res.status(200).json(result);
    });

    connection.execSql(request);
  });
};

const addServiceCharge = (req, res) => {
  openDbConnection().then((connection) => {
    const { startDate, endDate, feeID, Name, Amount } = req.body;

    const sql = `EXEC ${
      process.env.SP_MonthlyServiceCharge
    } @ServiceStartDate = '${formatDate2(
      startDate
    )}', @ServiceEndDate = '${formatDate2(
      endOfDay(endDate)
    )}', @FeeId = ${feeID}, @Name = '${Name}', @Amount = ${Amount}, @TransactionProcessed = 1;`;

    const request = new Request(sql, (err) => {
      if (err) {
        throw err;
      }
      connection.close();
    });

    request.on("requestCompleted", function () {
      res.sendStatus(200);
    });

    connection.execSql(request);
  });
};

const addMonthlyRentCharge = (req, res) => {
  openDbConnection().then((connection) => {
    const {
      startDate,
      endDate,
      DAILY_RENT_30YD_OT,
      DAILY_RENT_40YD_OT,
      MONTHLY_RENT_30YD_OT,
      MONTHLY_RENT_40YD_OT,
      DAILY_RENT_COMPACTOR,
    } = req.body;

    const sql = `EXEC ${
      process.env.SP_MonthlyRentFeeCurrentSet
    } @ServiceStartDate = '${formatDate2(
      startDate
    )}', @ServiceEndDate = '${formatDate2(
      endOfDay(endDate)
    )}', @DAILYRENT30YDOT = '${DAILY_RENT_30YD_OT}'
    ,@DAILYRENT40YDOT = '${DAILY_RENT_40YD_OT}'
    ,@MONTHLYRENT30YDOT = '${MONTHLY_RENT_30YD_OT}'
    ,@MONTHLYRENT40YDOT = '${MONTHLY_RENT_40YD_OT}'
    ,@DAILYRENTCOMPACTOR = '${DAILY_RENT_COMPACTOR}', @TransactionProcessed = 1;
    EXEC ${
      process.env.SP_MonthlyRentFeeReturnedToStock
    } @ServiceStartDate = '${formatDate2(
      startDate
    )}', @ServiceEndDate = '${formatDate2(
      endOfDay(endDate)
    )}', @DAILYRENT30YDOT = '${DAILY_RENT_30YD_OT}'
    ,@DAILYRENT40YDOT = '${DAILY_RENT_40YD_OT}'
    ,@MONTHLYRENT30YDOT = '${MONTHLY_RENT_30YD_OT}'
    ,@MONTHLYRENT40YDOT = '${MONTHLY_RENT_40YD_OT}'
    ,@DAILYRENTCOMPACTOR = '${DAILY_RENT_COMPACTOR}', @TransactionProcessed = 1;`;

    const request = new Request(sql, (err) => {
      if (err) {
        throw err;
      }
      connection.close();
    });

    request.on("requestCompleted", function () {
      res.sendStatus(200);
    });

    connection.execSql(request);
  });
};

const addTaxes = (req, res) => {
  const { startDate, endDate, TSI, TMI, TCI, TII, TSO, TMO, TCO, TIO, EC } =
    req.body;

  openDbConnection().then((connection) => {
    const sql = `EXEC ${
      process.env.SP_TaxesInsideOutsideCityLimits
    } @ServiceStartDate = '${formatDate2(
      startDate
    )}', @ServiceEndDate = '${formatDate2(
      endOfDay(endDate)
    )}', @TSI = ${TSI}, @TMI = ${TMI}, @TCI = ${TCI}, @TII = ${TII}, @TSO = ${TSO}, @TMO = ${TMO}, @TCO = ${TCO}, @TIO = ${TIO}; EXEC ${
      process.env.SP_TaxesEctor
    } @ServiceStartDate = '${formatDate2(
      startDate
    )}', @ServiceEndDate = '${formatDate2(endOfDay(endDate))}', @EC = ${EC};`;

    const request = new Request(sql, (err) => {
      if (err) throw err;
      connection.close();
    });

    request.on("requestCompleted", function () {
      res.sendStatus(200);
    });

    connection.execSql(request);
  });
};

const bill = (req, res) => {
  openDbConnection().then((connection) => {
    const { startDate, endDate } = req.body;

    const sql = `UPDATE ${
      process.env.transactionsTable
    } SET TransactionProcessed = 1 WHERE ServicedDate BETWEEN '${formatDate(
      startOfDay(startDate)
    )}' AND '${formatDate(endOfDay(endDate))}'`;

    const request = new Request(sql, (err) => {
      if (err) {
        throw err;
      }
      connection.close();
    });

    request.on("requestCompleted", function () {
      res.sendStatus(200);
    });

    connection.execSql(request);
  });
};

const getCustomerBillBreakdown = (req, res) => {
  openDbConnection().then((connection) => {
    const { startDate, endDate, ID } = req.params;
    let results;

    const sql = `EXEC ${
      process.env.SP_CustomerExport
    } @ServiceStartDate = '${formatDate(
      startDate
    )}', @ServiceEndDate = '${formatDate(
      endOfDay(endDate)
    )}', @CustomerId = ${ID}`;

    const request = new Request(sql, (err) => {
      if (err) throw err;

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

const importToMunis = (req, res) => {
  openDbConnection().then((connection) => {
    const { startDate, endDate } = req.params;
    let results;

    const sql = `EXEC ${
      process.env.SP_ImportToMunis
    } @ServiceStartDate = '${formatDate(
      startDate
    )}', @ServiceEndDate = '${formatDate(endOfDay(endDate))}'`;

    const request = new Request(sql, (err) => {
      if (err) throw err;

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

const getBreakdown = (req, res) => {
  const { startDate, endDate, customerSelection } = req.params;

  const customers = customerSelection.includes(",")
    ? customerSelection.split(",")
    : customerSelection;

  let results;

  openDbConnection().then((connection) => {
    let sql = `SELECT 
    [Transactions].[CustomerId] AS 'CUSTOMER ID'
   ,[Transactions].[LocationId] AS 'ACCOUNT'
   ,[Transactions].ContainerId AS 'ContainerId'
   ,[Transactions].[Name] AS 'FEE NAME'
   ,[Transactions].Tonnage AS 'TONNAGE'
   ,[Transactions].SetDate AS 'SET DATE'
   ,[Transactions].ServicedDate AS 'SERVICE DATE'
   ,[Transactions].[Amount] AS 'TOTAL' FROM ${process.env.transactionsTable}`;

    if (typeof customers === "object") {
      sql += `WHERE (CustomerId = ${customers[0]}`;

      for (let i = 1; i < customers.length; i++) {
        sql += `OR CustomerId = ${customers[i]}`;
      }

      sql += ")";

      sql += `AND [Transactions].[ServicedDate] BETWEEN '${formatDate(
        startDate
      )}' AND '${formatDate(endDate)}' ORDER BY CustomerId, ServicedDate;`;
    } else {
      sql += `WHERE [Transactions].[ServicedDate] BETWEEN '${formatDate(
        startDate
      )}' AND '${formatDate(endDate)}' ORDER BY CustomerId, ServicedDate;`;
    }

    console.log(sql);

    const request = new Request(sql, (err) => {
      if (err) throw err;

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

module.exports = {
  getFees,
  createTransaction,
  addFee,
  updateFee,
  getTopTransactions,
  getTransactions,
  getFormData,
  saveFormData,
  clearForm,
  updateTransaction,
  deleteTransactions,
  getBillFeeAmounts,
  addServiceCharge,
  addMonthlyRentCharge,
  addTaxes,
  bill,
  getCustomerBillBreakdown,
  importToMunis,
  getBreakdown,
};
