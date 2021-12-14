let Request = require("tedious").Request;
let { openDbConnection } = require("../database");
const { formatDate } = require("../utils/formatDate");

const getContainerIDs = (req, res) => {
  openDbConnection().then((connection) => {
    let result;
    const request = new Request(
      `SELECT ContainerId FROM ${process.env.containerTable}`,
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

const getContainer = (req, res) => {
  openDbConnection().then((connection) => {
    let result;

    const request = new Request(
      `SELECT * FROM ${process.env.containerTable} WHERE ContainerId = ${req.params.ID};`,
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

    request.on("requestCompleted", async function () {
      if (result) {
        const customerName = await getCustomerName(result[7].value);
        result.push({ customerName });
        res.status(200).json(result);
      } else {
        res.status(200).json("Container Not Found.");
      }
    });

    connection.execSql(request);
  });
};

const getCustomerName = (id) =>
  new Promise((resolve, reject) => {
    openDbConnection().then((connection) => {
      let result;

      const request = new Request(
        `SELECT Name FROM ${process.env.customerTable} WHERE CustomerId = ${id};`,
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
        if (result) {
          resolve(result[0].value);
        } else {
          resolve("");
        }
      });

      connection.execSql(request);
    });
  });

const updateContainer = async (req, res) => {
  const customerExists = await checkIfCustomerExists(req.body.customerID);
  const locationExists = await checkIfLocationExists(req.body.locationID);

  if (!customerExists) return res.status(200).json("Customer does not exist.");
  if (!locationExists) return res.status(200).json("Location does not exist.");

  openDbConnection().then((connection) => {
    let {
      ID,
      cubicYard,
      type,
      cityOwned,
      inStock,
      locationID,
      customerID,
      comments,
      setDate,
      returnedToStockDate,
    } = req.body;

    cityOwned = cityOwned === "YES" ? 1 : 0;
    inStock = inStock === "YES" ? 1 : 0;

    if (returnedToStockDate) {
      locationID = 0;
      customerID = 0;
    }

    setDate = formatDate(setDate);
    returnedToStockDate = formatDate(returnedToStockDate);

    const sql1 = `UPDATE ${process.env.containerTable} SET CubicYard ='${cubicYard}', Type ='${type}', CityOwned=${cityOwned}, SetDate='${setDate}', Location=${locationID}, CustomerId=${customerID}, Comment='${comments}', InStock=${inStock}, ReturnedToStockDate=NULL WHERE containerId=${ID}`;
    const sql2 = `UPDATE ${process.env.containerTable} SET CubicYard ='${cubicYard}', Type ='${type}', CityOwned=${cityOwned}, SetDate=NULL, Location=${locationID}, CustomerId=${customerID}, Comment='${comments}', InStock=${inStock}, ReturnedToStockDate='${returnedToStockDate}' WHERE containerId=${ID}`;
    const sql3 = `UPDATE ${process.env.containerTable} SET CubicYard ='${cubicYard}', Type ='${type}', CityOwned=${cityOwned}, SetDate=NULL, Location=${locationID}, CustomerId=${customerID}, Comment='${comments}', InStock=${inStock}, ReturnedToStockDate=NULL WHERE containerId=${ID}`;

    let sql;

    if (!setDate && !returnedToStockDate) {
      sql = sql3;
    } else if (!setDate) {
      sql = sql2;
    } else {
      sql = sql1;
    }

    const request = new Request(sql, (err) => {
      if (err) {
        throw err;
      }
      connection.close();
    });

    request.on("requestCompleted", function () {
      res.status(200).json({ message: "Container Updated.", row: req.body });
    });

    connection.execSql(request);
  });
};

const addContainer = async (req, res) => {
  let customerExists = await checkIfCustomerExists(req.body.customerID);
  let locationExists = await checkIfLocationExists(req.body.locationID);

  if (!customerExists) return res.status(200).json("Customer does not exist.");
  if (!locationExists) return res.status(200).json("Location does not exist.");

  checkForExistingContainer(req.body.ID).then((exists) => {
    if (exists) {
      res.status(200).json("Container already exists: ID already in use.");
    } else {
      openDbConnection().then((connection) => {
        let {
          ID,
          cubicYard,
          type,
          cityOwned,
          inStock,
          setDate,
          customerID,
          locationID,
          comments,
          returnedToStockDate,
        } = req.body;

        cityOwned = cityOwned === "YES" ? 1 : 0;
        inStock = inStock === "YES" ? 1 : 0;

        const sql1 = `INSERT INTO ${process.env.containerTable} (ContainerId, CubicYard, Type, CityOwned, InStock, SetDate, CustomerId, Location, Comment) VALUES ('${ID}', '${cubicYard}', '${type}', ${cityOwned}, ${inStock}, '${setDate}', '${customerID}', '${locationID}', '${comments}');`;

        const sql2 = `INSERT INTO ${process.env.containerTable} (ContainerId, CubicYard, Type, CityOwned, InStock, ReturnedToStockDate, CustomerId, Location, Comment) VALUES ('${ID}', '${cubicYard}', '${type}', ${cityOwned}, ${inStock}, '${returnedToStockDate}', '${customerID}', '${locationID}', '${comments}');`;

        const sql3 = `INSERT INTO ${process.env.containerTable} (ContainerId, CubicYard, Type, CityOwned, InStock, CustomerId, Location, Comment) VALUES ('${ID}', '${cubicYard}', '${type}', ${cityOwned}, ${inStock}, '${customerID}', '${locationID}', '${comments}');`;

        const sql =
          !setDate && !returnedToStockDate ? sql3 : setDate ? sql1 : sql2;

        const request = new Request(sql, (err) => {
          if (err) {
            throw err;
          }
          connection.close();
        });

        request.on("requestCompleted", function () {
          res.status(200).json({ message: "Row Inserted." });
        });

        connection.execSql(request);
      });
    }
  });
};

const checkForExistingContainer = (ID) =>
  new Promise((resolve, reject) => {
    openDbConnection().then((connection) => {
      let containerExists = false;
      const request = new Request(
        `SELECT * FROM ${process.env.containerTable} WHERE ContainerId = ${ID}`,
        (err) => {
          if (err) {
            throw err;
          }
          connection.close();
        }
      );

      request.on("doneInProc", (rowCount, more, rows) => {
        if (rows[0]) {
          containerExists = true;
        }
      });

      request.on("requestCompleted", function () {
        if (containerExists) {
          resolve(true);
        } else {
          resolve(false);
        }
      });

      connection.execSql(request);
    });
  });

const checkIfLocationExists = (ID) =>
  new Promise((resolve, reject) => {
    openDbConnection().then((connection) => {
      let locationExists = false;
      const request = new Request(
        `SELECT * FROM ${process.env.locationTable} WHERE LocationId = ${ID}`,
        (err) => {
          if (err) {
            throw err;
          }
          connection.close();
        }
      );

      request.on("doneInProc", (rowCount, more, rows) => {
        if (rows[0]) {
          locationExists = true;
        }
      });

      request.on("requestCompleted", function () {
        if (locationExists) {
          resolve(true);
        } else {
          resolve(false);
        }
      });

      connection.execSql(request);
    });
  });

const checkIfCustomerExists = (ID) =>
  new Promise((resolve, reject) => {
    openDbConnection().then((connection) => {
      let customerExists = false;
      const request = new Request(
        `SELECT * FROM ${process.env.customerTable} WHERE CustomerId = ${ID}`,
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

const returnToStock = (req, res) => {
  const { customerID, locationID, ID, returnedToStockDate } =
    req.body.container;

  openDbConnection().then((connection) => {
    const request = new Request(
      `INSERT INTO ${
        process.env.transactionsTable
      }(CustomerId, LocationId, ContainerId, ReturnedToStockDate, ServicedDate, FeeId, Name, Amount, TransactionDate) VALUES(${customerID}, ${locationID}, ${ID}, '${formatDate(
        returnedToStockDate
      )}', '${formatDate(
        returnedToStockDate
      )}', 38, 'RETURN TO STOCK', 0, '${formatDate(new Date())}')`,
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

module.exports = {
  getContainer,
  getContainerIDs,
  updateContainer,
  addContainer,
  returnToStock,
};
