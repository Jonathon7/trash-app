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
      `SELECT * FROM ${process.env.locationTable} WHERE address1 = '${req.params.address1}'`,
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

const updateLocation = (req, res) => {
  openDbConnection().then((connection) => {
    let result;
    const request = new Request(
      `UPDATE ${process.env.locationTable} SET Address1 = '${req.body.newAddress1}', Address2 = '${req.body.newAddress2}', AccountType = '${req.body.newAccountType}' WHERE LocationId = ${req.body.ID}; SELECT * FROM ${process.env.locationTable} WHERE LocationId = ${req.body.ID}`,
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

const addLocation = async (req, res) => {
  const exists = await checkForExistingLocation(req.body.ID);

  if (exists)
    return res.status(200).json("Location already exists: ID already in use.");

  openDbConnection().then((connection) => {
    const request = new Request(
      `INSERT INTO ${process.env.locationTable}(LocationId, AccountType, Address1, Address2) VALUES('${req.body.ID}', '${req.body.accountType}', '${req.body.address1}', '${req.body.address2}');`,
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
