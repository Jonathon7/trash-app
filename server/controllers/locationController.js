let Request = require("tedious").Request;
let { openDbConnection } = require("../database");

const getLocations = (req, res) => {
  openDbConnection().then((connection) => {
    let result;
    const request = new Request(
      `SELECT * FROM ${process.env.locationTable}`,
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

const getLocation = (req, res) => {
  openDbConnection().then((connection) => {
    let result;
    const request = new Request(
      `SELECT * FROM ${process.env.locationTable} WHERE LocationId = ${req.params.ID}`,
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

const updateLocation = async (req, res) => {
  let locationExists;
  if (req.body.ID !== req.body.newID)
    locationExists = await checkForExistingLocation(req.body.newID);

  openDbConnection().then((connection) => {
    let result;

    let {
      ID,
      newID,
      address1,
      address2,
      accountType,
      insideOutsideCityTax,
      ectorTax,
    } = req.body;

    let sql = `UPDATE ${process.env.locationTable} SET Address1 = '${address1}', Address2 = '${address2}', AccountType = '${accountType}', InsideOutsideCityTax = '${insideOutsideCityTax}', EctorTax = '${ectorTax}' WHERE LocationId = ${ID}; SELECT * FROM ${process.env.locationTable} WHERE LocationId = ${ID};`;

    if (ID !== newID) {
      if (locationExists)
        return res
          .status(200)
          .json("Location already exists: ID already in use.");

      sql = `INSERT INTO ${process.env.locationTable} (LocationId, Address1, Address2, AccountType, InsideOutsideCityTax, EctorTax) VALUES(${newID}, '${address1}', '${address2}', '${accountType}', '${insideOutsideCityTax}', '${ectorTax}');
       UPDATE ${process.env.containerTable} SET Location = ${newID} WHERE Location = ${ID};
        UPDATE ${process.env.transactionsTable} SET LocationId = ${newID} WHERE LocationId = ${ID};
         DELETE FROM ${process.env.locationTable} WHERE LocationId = ${ID};
          SELECT * FROM ${process.env.locationTable} WHERE LocationId = ${newID};`;
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

const addLocation = async (req, res) => {
  const exists = await checkForExistingLocation(req.body.ID);

  const {
    ID,
    address1,
    address2,
    accountType,
    insideOutsideCityTax,
    ectorTax,
  } = req.body;

  if (exists)
    return res.status(200).json("Location already exists: ID already in use.");

  openDbConnection().then((connection) => {
    const request = new Request(
      `INSERT INTO ${process.env.locationTable}(LocationId, AccountType, Address1, Address2, InsideOutsideCityTax, EctorTax) VALUES('${ID}', '${accountType}', '${address1}', '${address2}', '${insideOutsideCityTax}', '${ectorTax}');`,
      (err) => {
        if (err) {
          throw err;
        }
        connection.close();
      }
    );

    request.on("requestCompleted", function () {
      connection.close();

      res.status(200).json("Location added.");
    });

    connection.execSql(request);
  });
};

const checkForExistingLocation = (ID) =>
  new Promise((resolve, reject) => {
    openDbConnection().then((connection) => {
      let locationExists = false;
      const request = new Request(
        `SELECT * FROM ${process.env.locationTable} WHERE LocationId = '${ID}';`,
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

module.exports = {
  getLocations,
  getLocation,
  updateLocation,
  addLocation,
};
