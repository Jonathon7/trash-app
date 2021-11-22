const openDbConnection = () =>
  new Promise((resolve, reject) => {
    var Connection = require("tedious").Connection;

    var config = {
      server: process.env.IP,
      authentication: {
        type: "default",
        options: {
          userName: process.env.USER,
          password: process.env.PASSWORD,
        },
      },
      options: {
        port: 1433, // Default Port
        encrypt: false,
        trustServerCertificate: true,
        rowCollectionOnDone: true,
      },
    };

    const connection = new Connection(config);

    connection.on("connect", (err) => {
      if (err) {
        console.log("Connection Failed");
        throw err;
      }

      console.log("Connected to Database.");
      resolve(connection);
    });

    connection.connect();
  });

module.exports = {
  openDbConnection,
};
