CREATE TABLE container (
	container_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	cubic_yard INT NOT NULL,
	type VARCHAR(10) NOT NULL,
	city_owned BIT NOT NULL,
	set_date DATETIME NULL,
	location INT NULL,
	customer_id INT NULL,
	comment VARCHAR(50) NULL,
	in_stock BIT NOT NULL,
	returned_to_stock_date DATETIME NULL
);

CREATE TABLE customer (
	customer_id INT NOT NULL,
	name VARCHAR(30) NOT NULL,
	tax_exempt BIT NOT NULL
);

CREATE TABLE fee (
	fee_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	name VARCHAR(30) NOT NULL,
	amount DECIMAL(10, 4) NOT NULL,
	charge_code INT NOT NULL,
	rate_code VARCHAR(10) NOT NULL
);

CREATE TABLE location (
	location_id INT NOT NULL,
	account_type VARCHAR(4) NOT NULL,
	address1 VARCHAR(100) NOT NULL,
	address2 VARCHAR(100),
	inside_outside_city_tax VARCHAR(10) NOT NULL,
	ector_tax VARCHAR(10) NOT NULL,
);

CREATE TABLE Sessions (
	Sid VARCHAR(255) NOT NULL,
	Expires DATETIMEOFFSET(7) NOT NULL,
	Sess NVARCHAR(max) NULL,
);

CREATE TABLE transaction (
	transaction_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	customer_id INT,
	location_id INT NOT NULL,
	container_id INT NOT NULL,
	fee_id INT NOT NULL,
	name VARCHAR(99) NOT NULL,
	amount DECIMAL(9, 2) NOT NULL,
	transaction_date DATETIME NOT NULL,
	transaction_processed BIT NOT NULL,
	tonnage DECIMAL(9, 2),
	set_date DATETIME NULL,
	returned_to_stock_date DATETIME,
	comment VARCHAR(99) NULL,
	serviced_date DATETIME NULL,
);

-- CONTAINER
const getContainerIDs = (req, res) => {
    `SELECT container_id FROM container`,
};

const getContainer = (req, res) => {
    `SELECT * FROM container WHERE container_id = ${req.params.id};`,
};

const getCustomerName = (id) =>
    `SELECT name FROM customer WHERE customer_id = ${id};`,
});

const updateContainer = async (req, res) => {
    const sql1 = `UPDATE container SET cubic_yard ='${cubicYard}', type ='${type}', city_owned=${cityOwned}, set_date='${setDate}', location=${locationId}, customer_id=${customerId}, comment='${comments}', in_stock=${inStock}, returned_to_stock_date=NULL WHERE container_id=${id}`;
    const sql2 = `UPDATE container SET cubic_yard ='${cubicYard}', type ='${type}', city_owned=${cityOwned}, set_date=NULL, location=${locationId}, customer_id=${customerId}, comment='${comments}', in_stock=${inStock}, returned_to_stock_date='${returnedToStockDate}' WHERE container_id=${id}`;
    const sql3 = `UPDATE container SET cubic_yard ='${cubicYard}', type ='${type}', city_owned=${cityOwned}, set_date=NULL, location=${locationId}, customer_id=${customerId}, comment='${comments}', in_stock=${inStock}, returned_to_stock_date=NULL WHERE container_id=${id}`;
};

const addContainer = async (req, res) => {
    const sql1 = `INSERT INTO container (container_id, cubic_yard, type, city_owned, in_stock, set_date, customer_id, location, comment) VALUES ('${id}', '${cubicYard}', '${type}', ${cityOwned}, ${inStock}, '${setDate}', '${customerId}', '${locationId}', '${comments}');`;
    const sql2 = `INSERT INTO container (container_id, cubic_yard, type, city_owned, in_stock, returned_to_stock_date, customer_id, location, comment) VALUES ('${id}', '${cubicYard}', '${type}', ${cityOwned}, ${inStock}, '${returnedToStockDate}', '${customerId}', '${locationId}', '${comments}');`;
    const sql3 = `INSERT INTO container (container_id, cubic_yard, type, city_owned, in_stock, customer_id, location, comment) VALUES ('${id}', '${cubicYard}', '${type}', ${cityOwned}, ${inStock}, '${customerId}', '${locationId}', '${comments}');`;
};

const checkForExistingContainer = (id) =>
        `SELECT * FROM container WHERE container_id = ${id}`,
  });

const checkIfLocationExists = (id) =>
        `SELECT * FROM location WHERE location_id = ${id}`,
  });

const checkIfCustomerExists = (id) =>
        `SELECT * FROM customer WHERE customer_id = ${id}`,
  });

const returnToStock = (req, res) => {
    const sql = `INSERT INTO transaction (customer_id, location_id, container_id, returned_to_stock_date, serviced_date, fee_id, name, amount, transaction_date) VALUES(0, 0, ${id}, '${formatDate(
      returnedToStockDate
    )}', '${formatDate(
      returnedToStockDate
    )}', 42, 'RETURN TO STOCK', 0, '${formatDate(new Date())}')`;
};

-- CUSTOMER
const getCustomers = async (req, res) => {
    `SELECT * FROM customer`,
};

const getCustomer = (req, res) => {
    `SELECT * FROM customer WHERE customer_id = ${req.params.id}; SELECT container_id, location FROM container WHERE customer_id = ${req.params.id};`,
};

const addCustomer = async (req, res) => {
    `INSERT INTO customer(customer_id, name, tax_exempt) VALUES(${id}, '${name}', ${taxExempt}); SELECT * FROM customer WHERE customer_id=${id};`,
};

const updateCustomer = async (req, res) => {
    let sql = `UPDATE customer SET name='${name}', tax_exempt=${taxExempt} WHERE customer_id = ${req.body.id}; SELECT * FROM customer WHERE customer_id=${req.body.id};`;

    sql = `INSERT INTO customer (customer_id, name, tax_exempt) VALUES(${newID}, '${name}', ${taxExempt});
             UPDATE container SET customer_id = ${newID} WHERE customer_id = ${id};
             UPDATE transaction SET customer_id = ${newID} WHERE customer_id = ${id};
             DELETE FROM customer WHERE customer_id = ${id};
             SELECT * FROM customer WHERE customer_id = ${req.body.newID};`;
    }
};

const checkForExistingCustomer = (id) =>
    `SELECT * FROM customer WHERE customer_id = ${id}`,
  });

const getCustomerBill = (req, res) => {
    `SELECT * FROM customer WHERE customer_id = ${id}`,
};

const getCustomerInfo = async (req, res) => {
    const sql = `SELECT name FROM customer WHERE customer_id = ${req.params.customerId}; SELECT address1 FROM location WHERE location_id = ${req.params.locationId};`;
};

-- LOCATIONS
const getLocations = (req, res) => {
    `SELECT * FROM location`,
};

const getLocation = (req, res) => {
    `SELECT * FROM location WHERE location_id = ${req.params.id}`,
};

const updateLocation = async (req, res) => {
    let sql = `UPDATE location SET address1 = '${address1}', address2 = '${address2}', account_type = '${accountType}', inside_outside_city_tax = '${insideOutsideCityTax}', ector_tax = '${ectorTax}' WHERE location_id = ${id}; SELECT * FROM location WHERE location_id = ${id};`;

      sql = `INSERT INTO location (location_id, address1, address2, account_type, inside_outside_city_tax, ector_tax) VALUES(${newID}, '${address1}', '${address2}', '${accountType}', '${insideOutsideCityTax}', '${ectorTax}');
        UPDATE container SET location = ${newID} WHERE location = ${id};
        UPDATE transaction SET location_id = ${newID} WHERE location_id = ${id};
        DELETE FROM location WHERE location_id = ${id};
        SELECT * FROM location WHERE location_id = ${newID};`;
};

const addLocation = async (req, res) => {
    `INSERT INTO location(location_id, account_type, address1, address2, inside_outside_city_tax, ector_tax) VALUES('${id}', '${accountType}', '${address1}', '${address2}', '${insideOutsideCityTax}', '${ectorTax}');`,
};

const checkForExistingLocation = (id) =>
    `SELECT * FROM location WHERE location_id = '${id}';`,
});

-- TRANSACTIONS
const getFees = (req, res) => {
    `SELECT * FROM fee`,
};

const createTransaction = (req, res) => {
      const sql1 = `INSERT INTO transaction (customer_id, location_id, container_id, fee_id, name, amount, transaction_date, tonnage, set_date, comment, serviced_date) VALUES (${customerId}, ${locationId}, ${containerID}, ${feeID}, '${feeName}', ${feeAmount}, '${transactionDate}', ${ton}, '${setDate}', '${comments}', '${servicedDate}')`;
      const sql2 = `INSERT INTO transaction (customer_id, location_id, container_id, fee_id, name, amount, transaction_date, tonnage, set_date, comment) VALUES (${customerId}, ${locationId}, ${containerID}, ${feeID}, '${feeName}', ${feeAmount}, '${transactionDate}', ${ton}, '${setDate}', '${comments}')`;
};

const addFee = (req, res) => {
    `INSERT INTO fee(name, amount, charge_code, rate_code) values('${req.body.name}', ${req.body.amount}, '${req.body.chargeCode}', '${req.body.rateCode}');`,
};

const updateFee = (req, res) => {
    `UPDATE fee SET amount = ${req.body.feeAmount}, charge_code = '${req.body.chargeCode}', rate_code = '${req.body.rateCode}' WHERE fee_id = ${req.body.id}`,
};

const checkForExistingFee = (name) =>
    `SELECT * FROM fee WHERE name = '${name}'`,
});

const getDates = (id) =>
     `SELECT set_date FROM container WHERE container_id = '${id}'`,
});

const getTransactions = (req, res) => {
    let sql = `SELECT * FROM transaction`;

    if (customerId !== "null") sql += ` WHERE (customer_id = ${customerId}`;

    if (locationId !== "null")
      sql += `${
        sql.includes("WHERE") ? " OR " : " WHERE ("
      } location_id = ${locationId}`;

    if (containerID !== "null")
      sql += `${
        sql.includes("WHERE") ? " OR " : " WHERE ("
      } container_id = ${containerID}`;

    sql.includes("WHERE") && (sql += ")");

    if (startDate !== "null" && endDate !== "null") {
      !sql.includes("WHERE") ? (sql += " WHERE ") : (sql += " AND ");

      sql += `serviced_date BETWEEN '${formatDate(
        startOfDay(startDate)
      )}' AND '${formatDate(endOfDay(endDate))}'`;
    }

    showOnlyUnprocessedTransactions === "true" &&
      (sql += "AND transaction_processed = 0");

    sql += " ORDER BY serviced_date";
};

const getTopTransactions = (req, res) => {
    const sql = `SELECT TOP 100 * FROM transaction ORDER BY transaction_id DESC;`;
};

const deleteTransactions = (req, res) => {
      `DELETE FROM transaction WHERE transaction_id = '${req.params.id}';`,
};

const getBillFeeAmounts = (req, res) => {
      `SELECT fee_id, name, amount FROM fee WHERE name IN('SERVICE CHARGE', 'DAILY RENT 30YD OT', 'DAILY RENT 40YD OT', 'MONTHLY RENT 30YD OT', 'MONTHLY RENT 40YD OT', 'DAILY RENT COMPACTOR') OR rate_code IN('TSI', 'TMI', 'TCI', 'TII', 'TSO', 'TMO', 'TCO', 'TIO', 'EC');`,
};

const addServiceCharge = (req, res) => {
    const sql = `EXEC ${
      process.env.SP_MonthlyServiceCharge
    } @ServiceStartDate = '${formatDate2(
      startDate
    )}', @ServiceEndDate = '${formatDate2(
      endOfDay(endDate)
    )}', @fee_id = ${feeID}, @name = '${name}', @amount = ${amount}, @transaction_processed = 1;`;
};

const addMonthlyRentCharge = (req, res) => {
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
    ,@DAILYRENTCOMPACTOR = '${DAILY_RENT_COMPACTOR}', @transaction_processed = 1;
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
    ,@DAILYRENTCOMPACTOR = '${DAILY_RENT_COMPACTOR}', @transaction_processed = 1;`;
};

const addTaxes = (req, res) => {
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
};

const bill = (req, res) => {
    const sql = `UPDATE transaction SET transaction_processed = 1 WHERE serviced_date BETWEEN '${formatDate(
      startOfDay(startDate)
    )}' AND '${formatDate(endOfDay(endDate))}'`;
};

const getCustomerBillBreakdown = (req, res) => {
    const sql = `EXEC ${
      process.env.SP_CustomerExport
    } @ServiceStartDate = '${formatDate(
      startDate
    )}', @ServiceEndDate = '${formatDate(
      endOfDay(endDate)
    )}', @customer_id = ${id}`;
};

const importToMunis = (req, res) => {
    const sql = `EXEC ${
      process.env.SP_ImportToMunis
    } @ServiceStartDate = '${formatDate(
      startDate
    )}', @ServiceEndDate = '${formatDate(endOfDay(endDate))}'`;
};

const getBreakdown = (req, res) => {
    let sql = `SELECT 
    customer_id AS 'CUSTOMER id',
    location_id AS 'ACCOUNT',
    container_id AS ' container_id',
    name AS 'FEE NAME',
    tonnage AS 'TONNAGE',
    set_date AS 'SET DATE',
    serviced_date AS 'SERVICE DATE',
    amount AS 'TOTAL' FROM transaction WHERE (customer_id = ${customerSelection[0]}`;

    for (let i = 1; i < customerSelection.length; i++) {
      sql += `OR customer_id = ${customerSelection[i]}`;
    }

    sql += ")";

    sql += `AND serviced_date BETWEEN '${formatDate(
      startDate
    )}' AND '${formatDate(endDate)}' ORDER BY customer_id, serviced_date;`;
};

-- sp_taxes_inside_outside_city_limits
CREATE PROCEDURE sp_TaxesInsideOutsideCityLimits(IN
ServiceStartDate DATETIME2, 
ServiceEndDate DATETIME2,  
TSI DECIMAl (10,4), 
TMI DECIMAl (10,4), 
TCI DECIMAl (10,4),
TII DECIMAl (10,4),
TSO DECIMAl (10,4), 
TMO DECIMAl (10,4),
TCO DECIMAl (10,4),
TIO DECIMAl (10,4))
BEGIN
    WITH TaxAgainstMonthlySum AS
(

 SELECT 
        CustomerId, 
        LocationId,
	    ContainerId,
	    SUM(Amount) AS 'Amount'

  FROM transaction
  LEFT JOIN Fees
  ON transaction.FeeId = Fee.FeeId 
  LEFT JOIN [TRASH].[dbo].[Customer]
  ON [Transactions].[CustomerId] = [Customer].[CustomerId]

 --added  [Transactions].[FeeId] <> 41 to ensure ECTOR COUNTY ASSISTANCE DISTRI is not taxed 
 -- Do not want to tax a tax.
  WHERE ([Transactions].[ServicedDate] BETWEEN @ServiceStartDate AND @ServiceEndDate) AND  [Transactions].[FeeId] <> 41 AND [Transactions].[CustomerId] <> 0  
 --Start Sub quiry: Pulls all customers that have been charged City Taxes and excludes them from (NOT IN) from list
 --This will be used to make sure people are not taxed twice  
 AND  ([Transactions].[CustomerId] NOT IN ( SELECT DISTINCT
        [Transactions].[CustomerId] 
  FROM [TRASH].[dbo].[Transactions]
  WHERE [Transactions].[ServicedDate] BETWEEN @ServiceStartDate AND @ServiceEndDate AND [Transactions].[FeeId] IN (33,34,35,36,37,38,39,40)))
 
 GROUP BY [Transactions].[LocationId], [Transactions].[CustomerId] ,[Transactions].[ContainerId]

)

INSERT INTO [dbo].[Transactions]
           ([CustomerId]
           ,[LocationId]
           ,[ContainerId]
           ,[FeeId]
           ,[Name]
           ,[Amount]
           ,[TransactionDate]
           ,[TransactionProcessed]
           ,[ServicedDate])

SELECT DISTINCT 
 TaxAgainstMonthlySum.CustomerId
,TaxAgainstMonthlySum.LocationId
,TaxAgainstMonthlySum.ContainerId
--FEEID
,CASE
--Inside
 WHEN [Location].[InsideOutsideCityTax] = 'TCI' THEN '35'
  WHEN [Location].[InsideOutsideCityTax] = 'TMI' THEN '34'
    WHEN [Location].[InsideOutsideCityTax] = 'TSI' THEN '33'
	    WHEN [Location].[InsideOutsideCityTax] = 'TII' THEN '36'
--Outside   
 WHEN [Location].[InsideOutsideCityTax] = 'TCO' THEN '39'
  WHEN [Location].[InsideOutsideCityTax] = 'TSO' THEN '37'
    WHEN [Location].[InsideOutsideCityTax] = 'TMO' THEN '38'
	    WHEN [Location].[InsideOutsideCityTax] = 'TIO' THEN '40'
 END AS 'FeeId'

--Name 
,CASE
--Inside
 WHEN [Location].[InsideOutsideCityTax] = 'TCI' THEN 'TCI'
  WHEN [Location].[InsideOutsideCityTax] = 'TMI' THEN 'TMI'
    WHEN [Location].[InsideOutsideCityTax] = 'TSI' THEN 'TSI'
	    WHEN [Location].[InsideOutsideCityTax] = 'TII' THEN 'TII'
--Outside   
 WHEN [Location].[InsideOutsideCityTax] = 'TCO' THEN 'TCO'
  WHEN [Location].[InsideOutsideCityTax] = 'TSO' THEN 'TSO'
    WHEN [Location].[InsideOutsideCityTax] = 'TMO' THEN 'TMO'
	    WHEN [Location].[InsideOutsideCityTax] = 'TIO' THEN 'TIO'
 END AS 'Name'


,CASE
--Inside
 WHEN [Location].[InsideOutsideCityTax] = 'TCI' THEN CAST(TaxAgainstMonthlySum.Amount*@TCI AS decimal (10,2)) 
  WHEN [Location].[InsideOutsideCityTax] = 'TMI' THEN CAST(TaxAgainstMonthlySum.Amount*@TMI AS decimal (10,2)) 
    WHEN [Location].[InsideOutsideCityTax] = 'TSI' THEN CAST(TaxAgainstMonthlySum.Amount*@TSI AS decimal (10,2)) 
	 WHEN [Location].[InsideOutsideCityTax] = 'TII' THEN CAST(TaxAgainstMonthlySum.Amount*@TII AS decimal (10,2)) 
--Outside
 WHEN [Location].[InsideOutsideCityTax] = 'TCO' THEN CAST(TaxAgainstMonthlySum.Amount*@TCO AS decimal (10,2))
  WHEN [Location].[InsideOutsideCityTax] = 'TSO' THEN CAST(TaxAgainstMonthlySum.Amount*@TSO AS decimal (10,2)) 
    WHEN [Location].[InsideOutsideCityTax] = 'TMO' THEN CAST(TaxAgainstMonthlySum.Amount*@TMO AS decimal (10,2)) 
	  WHEN [Location].[InsideOutsideCityTax] = 'TIO' THEN CAST(TaxAgainstMonthlySum.Amount*@TIO AS decimal (10,2)) 
 END AS 'Amount'

,@ServiceEndDate AS 'TransactionDate'
,1 AS 'TransactionProcessed'
,@ServiceEndDate As 'ServicedDate'

 FROM TaxAgainstMonthlySum

 LEFT JOIN [TRASH].[dbo].[Customer]
 ON TaxAgainstMonthlySum.CustomerId = [Customer].[CustomerId]

 LEFT JOIN [TRASH].[dbo].[Location]
 ON TaxAgainstMonthlySum.LocationId = [Location].[LocationId]

 LEFT JOIN [TRASH].[dbo].[Fees]
 ON [Location].[InsideOutsideCityTax] = [Fees].RateCode

 WHERE [Customer].[TaxExempt] = 0;
END 

-- Taxes Ector
CREATE PROCEDURE sp_TaxesEctor(IN @ServiceStartDate DATETIME2 
,@ServiceEndDate   DATETIME2 
,@EC DECIMAL (10,4))

BEGIN

WITH TaxAgainstMonthlySum AS
(
 SELECT 
        [Transactions].[CustomerId] 
       ,[Transactions].[LocationId]
	   ,[Transactions].[ContainerId]
	   ,SUM([Transactions].[Amount]) AS 'Amount'


  FROM [TRASH].[dbo].[Transactions]
  LEFT JOIN [TRASH].[dbo].[Fees]
  ON [Transactions].FeeId = [Fees].FeeId 
  LEFT JOIN [TRASH].[dbo].[Customer]
  ON [Transactions].[CustomerId] = [Customer].[CustomerId]

  WHERE ([Transactions].[ServicedDate] BETWEEN @ServiceStartDate AND @ServiceEndDate) AND [Transactions].[FeeId] NOT IN (33,34,35,36,37,38,39,40) AND [Transactions].[CustomerId] <> 0 
AND  ([Transactions].[CustomerId] NOT IN ( SELECT DISTINCT
        [Transactions].[CustomerId] 
  FROM [TRASH].[dbo].[Transactions]
WHERE [Transactions].[ServicedDate] BETWEEN @ServiceStartDate AND @ServiceEndDate AND [Transactions].[FeeId] = 41 ))
 
 GROUP BY [Transactions].[LocationId], [Transactions].[CustomerId] ,[Transactions].[ContainerId]

)

INSERT INTO [dbo].[Transactions]
           ([CustomerId]
           ,[LocationId]
           ,[ContainerId]
           ,[FeeId]
           ,[Name]
           ,[Amount]
           ,[TransactionDate]
           ,[TransactionProcessed]
           ,[ServicedDate])

SELECT DISTINCT 
 TaxAgainstMonthlySum.CustomerId
,TaxAgainstMonthlySum.LocationId
,TaxAgainstMonthlySum.ContainerId
,41 AS 'FeeId' 

,'EC' AS 'Name' 
,CAST(TaxAgainstMonthlySum.Amount*@EC AS decimal (10,2)) AS 'Amount'


,@ServiceEndDate AS 'TransactionDate'
,1 AS 'TransactionProcessed'
,@ServiceEndDate As 'ServicedDate'

 FROM TaxAgainstMonthlySum

 LEFT JOIN [TRASH].[dbo].[Customer]
 ON TaxAgainstMonthlySum.CustomerId = [Customer].[CustomerId]

 LEFT JOIN [TRASH].[dbo].[Location]
 ON TaxAgainstMonthlySum.LocationId = [Location].[LocationId]

 LEFT JOIN [TRASH].[dbo].[Fees]
 ON [Location].[InsideOutsideCityTax] = [Fees].RateCode

 WHERE [Customer].[TaxExempt] = 0 AND [Location].[EctorTax] = 'EC';
 END

-- MONTHLY SERVICE CHARGE
CREATE PROCEDURE sp_MonthlyServiceCharge(IN @ServiceStartDate DATETIME2
,@ServiceEndDate   DATETIME2
,@FeeId int
,@Name varchar(99)
,@Amount FLOAT
,@TransactionProcessed bit)

BEGIN

WITH TransactionsPullFee AS
(
--Get cuswtomers that have had a PULL FEE or SERVICE CHARGE fee
--Will use later in main query to ensure that if these cussomers have a PULL FEE that will not get charged
--also if the customer already has been charged a SERVICE CHARGE it will not add another SERVICE CHARGE
SELECT DISTINCT 
       [Transactions].[CustomerId] AS 'CustomerId' 
      ,[Transactions].[LocationId] AS 'LocationId'
      ,[Transactions].[ContainerId] AS 'ContainerId'
      
  FROM [TRASH].[dbo].[Transactions]
  WHERE ([Transactions].[FeeId] IN (12,6)) AND [Transactions].[ServicedDate] BETWEEN @ServiceStartDate AND @ServiceEndDate  -- fee is PULL FEE or SERVICE CHARGE 
)

INSERT INTO [dbo].[Transactions]
           ([CustomerId]
           ,[LocationId]
           ,[ContainerId]
           ,[FeeId]
           ,[Name]
           ,[Amount]
           ,[TransactionDate]
           ,[TransactionProcessed]
           ,[ServicedDate])


SELECT DISTINCT 
      [Container].[CustomerId]     
	 ,[Container].[Location]
     ,[Container].[ContainerId]
   ,@FeeId AS 'FeeId'
   ,@Name AS 'Name'	 
   ,@Amount AS 'Amount'
  ,@ServiceEndDate AS 'TransactionDate'
  ,@TransactionProcessed AS 'TransactionProcessed'
 ,@ServiceEndDate As 'ServicedDate'
 
--Pull from Container table. If a container is returned to stock, it is not eligible for a service charge  
  FROM [TRASH].[dbo].[Container]
  LEFT JOIN TransactionsPullFee
  ON [Container].ContainerId = TransactionsPullFee.ContainerId AND [Container].Location = TransactionsPullFee.LocationId AND [Container].CustomerId = TransactionsPullFee.CustomerId 
   WHERE [Container].[SetDate] IS NOT NULL AND DATEDIFF(day, [Container].[SetDate],@ServiceEndDate) > 29 
   --If the customer has had a pull fee or has a SERVICE CHARGE then exclude them from this list
   AND TransactionsPullFee.LocationId IS NULL;

END

-- MONTHLY RENT FEE RETURNED TO STOCK
CREATE PROCEDURE sp_MonthlyRentFeeReturnedToStock(IN @ServiceStartDate DATETIME2
,@ServiceEndDate DATETIME2
,@DAILYRENT30YDOT FLOAT
,@DAILYRENT40YDOT FLOAT
,@MONTHLYRENT30YDOT FLOAT
,@MONTHLYRENT40YDOT FLOAT
,@DAILYRENTCOMPACTOR FLOAT
,@TransactionProcessed bit) 

BEGIN

WITH ContainersWithReturnedToStock AS
 
  (
  SELECT DISTINCT  
       [Transactions].[CustomerId] AS 'CustomerId' 
      ,[Transactions].[LocationId] AS 'LocationId'
      ,[Transactions].[ContainerId] AS 'ContainerId'
	  ,[Transactions].[FeeId] AS 'FeeId'
	  , [Container].CityOwned AS 'CityOwned'
	  ,[Transactions].ServicedDate
  FROM [TRASH].[dbo].[Transactions] 
  LEFT JOIN [TRASH].[dbo].[Container]
  ON [Transactions].[ContainerId] = [Container].ContainerId
  WHERE [Transactions].[ServicedDate] BETWEEN @ServiceStartDate AND @ServiceEndDate AND [Transactions].FeeId = 42 AND [Container].CityOwned = 1
  )

  ,TransactionsCheckRent AS
 (
SELECT DISTINCT 
       [Transactions].[CustomerId] AS 'CustomerId' 
      ,[Transactions].[LocationId] AS 'LocationId'
      ,[Transactions].[ContainerId] AS 'ContainerId'
  FROM [TRASH].[dbo].[Transactions]
  WHERE ([Transactions].[FeeId] IN (7,8,9,10,11)) AND [Transactions].[ServicedDate] BETWEEN @ServiceStartDate AND @ServiceEndDate 
)

 
INSERT INTO [dbo].[Transactions]
           ([CustomerId]
           ,[LocationId]
           ,[ContainerId]
           ,[FeeId]
           ,[Name]
           ,[Amount]
           ,[TransactionDate]
           ,[TransactionProcessed]
           ,[ServicedDate])

		   

SELECT DISTINCT 
     --[CustomerId]
	   CASE
	   WHEN ContainersWithReturnedToStock.[CustomerId] IS NOT NULL THEN ContainersWithReturnedToStock.[CustomerId]
	   WHEN [Container].[CustomerId] IS NOT NULL THEN [Container].[CustomerId]
	   END AS 'CustomerId'
	--[LocationId] 
	   ,CASE
	   WHEN ContainersWithReturnedToStock.[LocationId] IS NOT NULL THEN ContainersWithReturnedToStock.[LocationId]
	   WHEN [Container].[Location] IS NOT NULL THEN [Container].[Location]
	   END AS 'LocationId'
   --[ContainerId]
      ,[Container].[ContainerId] 
	  ,CASE 
	  WHEN [Container].[Type] = 'OPEN TOP  ' AND [Container].[CubicYard] <> 40 AND (DATEDIFF(day, [Container].SetDate, @ServiceEndDate) < 30) THEN 9 -- DAILY RENT 30YD OT
	   WHEN [Container].[Type] = 'OPEN TOP  ' AND [Container].[CubicYard] = 40 AND (DATEDIFF(day, [Container].SetDate, @ServiceEndDate) < 30) THEN 10 -- DAILY RENT 40YD OT
	    WHEN [Container].[Type] = 'OPEN TOP  ' AND [Container].[CubicYard] <> 40 AND (DATEDIFF(day, [Container].SetDate, @ServiceEndDate) >= 30) THEN 7 -- MONTHLY RENT 30YD OT
		 WHEN [Container].[Type] = 'OPEN TOP  ' AND [Container].[CubicYard] = 40 AND (DATEDIFF(day, [Container].SetDate, @ServiceEndDate) >= 30) THEN 8 -- MONTHLY RENT 40YD OT
		  WHEN [Container].[Type] = 'COMPACTOR '  THEN 11 -- DAILY RENT COMPACTOR
--[Container].[ReturnedToStockDate]
	  WHEN [Container].[Type] = 'OPEN TOP  ' AND [Container].[CubicYard] <> 40 AND (DATEDIFF(day, @ServiceStartDate,[Container].[ReturnedToStockDate]) < 30) THEN 9 -- DAILY RENT 30YD OT
	   WHEN [Container].[Type] = 'OPEN TOP  ' AND [Container].[CubicYard] = 40 AND (DATEDIFF(day, @ServiceStartDate,[Container].[ReturnedToStockDate]) < 30) THEN 10 -- DAILY RENT 40YD OT
	    WHEN [Container].[Type] = 'OPEN TOP  ' AND [Container].[CubicYard] <> 40 AND (DATEDIFF(day, @ServiceStartDate,[Container].[ReturnedToStockDate]) >= 30) THEN 7 -- MONTHLY RENT 30YD OT
		 WHEN [Container].[Type] = 'OPEN TOP  ' AND [Container].[CubicYard] = 40 AND (DATEDIFF(day, @ServiceStartDate,[Container].[ReturnedToStockDate]) >= 30) THEN 8 -- MONTHLY RENT 40YD OT
	  END AS 'FeeId'
  --Name	 
	  ,CASE 
	  WHEN [Container].[Type] = 'OPEN TOP  ' AND [Container].[CubicYard] <> 40 AND (DATEDIFF(day, [Container].SetDate, @ServiceEndDate) < 30) THEN 'DAILY RENT 30YD OT' -- DAILY RENT 30YD OT
	   WHEN [Container].[Type] = 'OPEN TOP  ' AND [Container].[CubicYard] = 40 AND (DATEDIFF(day, [Container].SetDate, @ServiceEndDate) < 30) THEN 'DAILY RENT 40YD OT' -- DAILY RENT 40YD OT
	    WHEN [Container].[Type] = 'OPEN TOP  ' AND [Container].[CubicYard] <> 40 AND (DATEDIFF(day, [Container].SetDate, @ServiceEndDate) >= 30) THEN 'MONTHLY RENT 30YD OT' -- MONTHLY RENT 30YD OT
		 WHEN [Container].[Type] = 'OPEN TOP  ' AND [Container].[CubicYard] = 40 AND (DATEDIFF(day, [Container].SetDate, @ServiceEndDate) >= 30) THEN 'MONTHLY RENT 40YD OT' -- MONTHLY RENT 40YD OT
		  WHEN [Container].[Type] = 'COMPACTOR '  THEN 'DAILY RENT COMPACTOR' -- DAILY RENT COMPACTOR
--DATEDIFF(day, @ServiceStartDate,[Container].[ReturnedToStockDate]
	WHEN [Container].[Type] = 'OPEN TOP  ' AND [Container].[CubicYard] <> 40 AND (DATEDIFF(day, @ServiceStartDate,[Container].[ReturnedToStockDate]) < 30) THEN 'DAILY RENT 30YD OT' -- DAILY RENT 30YD OT
	   WHEN [Container].[Type] = 'OPEN TOP  ' AND [Container].[CubicYard] = 40 AND (DATEDIFF(day, @ServiceStartDate,[Container].[ReturnedToStockDate]) < 30) THEN 'DAILY RENT 40YD OT' -- DAILY RENT 40YD OT
	    WHEN [Container].[Type] = 'OPEN TOP  ' AND [Container].[CubicYard] <> 40 AND (DATEDIFF(day, @ServiceStartDate,[Container].[ReturnedToStockDate]) >= 30) THEN 'MONTHLY RENT 30YD OT' -- MONTHLY RENT 30YD OT
		 WHEN [Container].[Type] = 'OPEN TOP  ' AND [Container].[CubicYard] = 40 AND (DATEDIFF(day, @ServiceStartDate,[Container].[ReturnedToStockDate]) >= 30) THEN 'MONTHLY RENT 40YD OT' -- MONTHLY RENT 40YD OT
	  END AS 'Name'
  --Amount
	  ,CASE 
	  WHEN [Container].[Type] = 'OPEN TOP  ' AND [Container].[CubicYard] <> 40 AND (DATEDIFF(day, [Container].SetDate, @ServiceEndDate) < 30) THEN @DAILYRENT30YDOT*(DATEDIFF(day, [Container].SetDate, @ServiceEndDate)) -- DAILY RENT 30YD OT
	   WHEN [Container].[Type] = 'OPEN TOP  ' AND [Container].[CubicYard] = 40 AND (DATEDIFF(day, [Container].SetDate, @ServiceEndDate) < 30) THEN @DAILYRENT40YDOT*(DATEDIFF(day, [Container].SetDate, @ServiceEndDate)) -- DAILY RENT 40YD OT
	    WHEN [Container].[Type] = 'OPEN TOP  ' AND [Container].[CubicYard] <> 40 AND (DATEDIFF(day, [Container].SetDate, @ServiceEndDate) >= 30) THEN @MONTHLYRENT30YDOT -- MONTHLY RENT 30YD OT
		 WHEN [Container].[Type] = 'OPEN TOP  ' AND [Container].[CubicYard] = 40 AND (DATEDIFF(day, [Container].SetDate, @ServiceEndDate) >= 30) THEN @MONTHLYRENT40YDOT -- MONTHLY RENT 40YD OT
		  WHEN [Container].[Type] = 'COMPACTOR ' THEN @DAILYRENTCOMPACTOR*[Container].CubicYard -- DAILY RENT COMPACTOR
		 
--DATEDIFF(day, @ServiceStartDate,[Container].[ReturnedToStockDate]
	  WHEN [Container].[Type] = 'OPEN TOP  ' AND [Container].[CubicYard] <> 40 AND (DATEDIFF(day, @ServiceStartDate,[Container].[ReturnedToStockDate]) < 30) THEN @DAILYRENT30YDOT*(DATEDIFF(day, @ServiceStartDate,[Container].[ReturnedToStockDate])) -- DAILY RENT 30YD OT
	   WHEN [Container].[Type] = 'OPEN TOP  ' AND [Container].[CubicYard] = 40 AND (DATEDIFF(day, @ServiceStartDate,[Container].[ReturnedToStockDate]) < 30) THEN @DAILYRENT40YDOT*(DATEDIFF(day, @ServiceStartDate,[Container].[ReturnedToStockDate])) -- DAILY RENT 40YD OT
	    WHEN [Container].[Type] = 'OPEN TOP  ' AND [Container].[CubicYard] <> 40 AND (DATEDIFF(day, @ServiceStartDate,[Container].[ReturnedToStockDate]) >= 30) THEN @MONTHLYRENT30YDOT -- MONTHLY RENT 30YD OT
		 WHEN [Container].[Type] = 'OPEN TOP  ' AND [Container].[CubicYard] = 40 AND (DATEDIFF(day, @ServiceStartDate,[Container].[ReturnedToStockDate]) >= 30) THEN @MONTHLYRENT40YDOT -- MONTHLY RENT 40YD OT		 
	  END AS 'Amount'

  ,@ServiceEndDate AS 'TransactionDate'
  ,@TransactionProcessed AS 'TransactionProcessed'
 ,@ServiceEndDate As 'ServicedDate'


   FROM ContainersWithReturnedToStock
  LEFT JOIN [TRASH].[dbo].[Container]
  ON  ContainersWithReturnedToStock.ContainerId = [Container].ContainerId
  LEFT JOIN TransactionsCheckRent
  ON ContainersWithReturnedToStock.CustomerId = TransactionsCheckRent.CustomerId AND ContainersWithReturnedToStock.LocationId = TransactionsCheckRent.LocationId  AND ContainersWithReturnedToStock.ContainerId = TransactionsCheckRent.ContainerId


 WHERE TransactionsCheckRent.CustomerId IS NULL

END

-- MONTHLY RENT FEE CURRENT SET
CREATE PROCEDURE MonthlyRentFeeCurrentSet(@ServiceStartDate DATETIME2
,@ServiceEndDate DATETIME2
,@DAILYRENT30YDOT FLOAT
,@DAILYRENT40YDOT FLOAT
,@MONTHLYRENT30YDOT FLOAT
,@MONTHLYRENT40YDOT FLOAT
,@DAILYRENTCOMPACTOR FLOAT
,@TransactionProcessed bit) 

BEGIN

WITH TransactionsCheckRent AS
(
SELECT DISTINCT 
       [Transactions].[CustomerId] AS 'CustomerId' 
      ,[Transactions].[LocationId] AS 'LocationId'
      ,[Transactions].[ContainerId] AS 'ContainerId'
  FROM [TRASH].[dbo].[Transactions]
  WHERE ([Transactions].[FeeId] IN (7,8,9,10,11)) AND [Transactions].[ServicedDate] BETWEEN @ServiceStartDate AND @ServiceEndDate   
)

--Pulls all city owned containers that are currently set at a location
,ContainersCityOwnedSetDate AS
(
 SELECT DISTINCT  
       [Container].[CustomerId] 
      ,[Container].[Location] AS 'LocationId'
      ,[Container].[ContainerId] 
	  ,[Container].[CityOwned] 
	  ,[Container].[Type]
	  ,[Container].[CubicYard]
	  ,[Container].[SetDate] 
	  ,[Container].[ReturnedToStockDate]
	  
  FROM [TRASH].[dbo].[Container] 
  WHERE  [Container].CityOwned = 1 AND [Container].[SetDate] IS NOT NULL 
)


INSERT INTO [dbo].[Transactions]
           ([CustomerId]
           ,[LocationId]
           ,[ContainerId]
           ,[FeeId]
           ,[Name]
           ,[Amount]
           ,[TransactionDate]
           ,[TransactionProcessed]
           ,[ServicedDate])
		   

SELECT DISTINCT 
     --[CustomerId]
	   [ContainersCityOwnedSetDate].CustomerId AS 'CustomerId'
	--[LocationId] 
	   ,[ContainersCityOwnedSetDate].LocationId  AS 'LocationId'
   --[ContainerId]
      ,[ContainersCityOwnedSetDate].ContainerId AS 'ContainerId'
   --FeeId
   --A ContainersCityOwnedSetDate will either have a SetDate or a ReturnedToStockDate not both.
   --So we check for both cases 
-- [ContainersCityOwnedSetDate].SetDate
	  ,CASE 
	  WHEN [ContainersCityOwnedSetDate].[Type] = 'OPEN TOP  ' AND [ContainersCityOwnedSetDate].[CubicYard] <> 40 AND (DATEDIFF(day, [ContainersCityOwnedSetDate].SetDate, @ServiceEndDate) < 30) THEN 9 -- DAILY RENT 30YD OT
	   WHEN [ContainersCityOwnedSetDate].[Type] = 'OPEN TOP  ' AND [ContainersCityOwnedSetDate].[CubicYard] = 40 AND (DATEDIFF(day, [ContainersCityOwnedSetDate].SetDate, @ServiceEndDate) < 30) THEN 10 -- DAILY RENT 40YD OT
	    WHEN [ContainersCityOwnedSetDate].[Type] = 'OPEN TOP  ' AND [ContainersCityOwnedSetDate].[CubicYard] <> 40 AND (DATEDIFF(day, [ContainersCityOwnedSetDate].SetDate, @ServiceEndDate) >= 30) THEN 7 -- MONTHLY RENT 30YD OT
		 WHEN [ContainersCityOwnedSetDate].[Type] = 'OPEN TOP  ' AND [ContainersCityOwnedSetDate].[CubicYard] = 40 AND (DATEDIFF(day, [ContainersCityOwnedSetDate].SetDate, @ServiceEndDate) >= 30) THEN 8 -- MONTHLY RENT 40YD OT
		  WHEN [ContainersCityOwnedSetDate].[Type] = 'COMPACTOR '  THEN 11 -- DAILY RENT COMPACTOR
--[ContainersCityOwnedSetDate].[ReturnedToStockDate]
	  WHEN [ContainersCityOwnedSetDate].[Type] = 'OPEN TOP  ' AND [ContainersCityOwnedSetDate].[CubicYard] <> 40 AND (DATEDIFF(day, @ServiceStartDate,[ContainersCityOwnedSetDate].[ReturnedToStockDate]) < 30) THEN 9 -- DAILY RENT 30YD OT
	   WHEN [ContainersCityOwnedSetDate].[Type] = 'OPEN TOP  ' AND [ContainersCityOwnedSetDate].[CubicYard] = 40 AND (DATEDIFF(day, @ServiceStartDate,[ContainersCityOwnedSetDate].[ReturnedToStockDate]) < 30) THEN 10 -- DAILY RENT 40YD OT
	    WHEN [ContainersCityOwnedSetDate].[Type] = 'OPEN TOP  ' AND [ContainersCityOwnedSetDate].[CubicYard] <> 40 AND (DATEDIFF(day, @ServiceStartDate,[ContainersCityOwnedSetDate].[ReturnedToStockDate]) >= 30) THEN 7 -- MONTHLY RENT 30YD OT
		 WHEN [ContainersCityOwnedSetDate].[Type] = 'OPEN TOP  ' AND [ContainersCityOwnedSetDate].[CubicYard] = 40 AND (DATEDIFF(day, @ServiceStartDate,[ContainersCityOwnedSetDate].[ReturnedToStockDate]) >= 30) THEN 8 -- MONTHLY RENT 40YD OT
	  END AS 'FeeId'
  --Name	 
	  ,CASE 
	  WHEN [ContainersCityOwnedSetDate].[Type] = 'OPEN TOP  ' AND [ContainersCityOwnedSetDate].[CubicYard] <> 40 AND (DATEDIFF(day, [ContainersCityOwnedSetDate].SetDate, @ServiceEndDate) < 30) THEN 'DAILY RENT 30YD OT' -- DAILY RENT 30YD OT
	   WHEN [ContainersCityOwnedSetDate].[Type] = 'OPEN TOP  ' AND [ContainersCityOwnedSetDate].[CubicYard] = 40 AND (DATEDIFF(day, [ContainersCityOwnedSetDate].SetDate, @ServiceEndDate) < 30) THEN 'DAILY RENT 40YD OT' -- DAILY RENT 40YD OT
	    WHEN [ContainersCityOwnedSetDate].[Type] = 'OPEN TOP  ' AND [ContainersCityOwnedSetDate].[CubicYard] <> 40 AND (DATEDIFF(day, [ContainersCityOwnedSetDate].SetDate, @ServiceEndDate) >= 30) THEN 'MONTHLY RENT 30YD OT' -- MONTHLY RENT 30YD OT
		 WHEN [ContainersCityOwnedSetDate].[Type] = 'OPEN TOP  ' AND [ContainersCityOwnedSetDate].[CubicYard] = 40 AND (DATEDIFF(day, [ContainersCityOwnedSetDate].SetDate, @ServiceEndDate) >= 30) THEN 'MONTHLY RENT 40YD OT' -- MONTHLY RENT 40YD OT
		  WHEN [ContainersCityOwnedSetDate].[Type] = 'COMPACTOR '  THEN 'DAILY RENT COMPACTOR' -- DAILY RENT COMPACTOR
--DATEDIFF(day, @ServiceStartDate,[ContainersCityOwnedSetDate].[ReturnedToStockDate]
	WHEN [ContainersCityOwnedSetDate].[Type] = 'OPEN TOP  ' AND [ContainersCityOwnedSetDate].[CubicYard] <> 40 AND (DATEDIFF(day, @ServiceStartDate,[ContainersCityOwnedSetDate].[ReturnedToStockDate]) < 30) THEN 'DAILY RENT 30YD OT' -- DAILY RENT 30YD OT
	   WHEN [ContainersCityOwnedSetDate].[Type] = 'OPEN TOP  ' AND [ContainersCityOwnedSetDate].[CubicYard] = 40 AND (DATEDIFF(day, @ServiceStartDate,[ContainersCityOwnedSetDate].[ReturnedToStockDate]) < 30) THEN 'DAILY RENT 40YD OT' -- DAILY RENT 40YD OT
	    WHEN [ContainersCityOwnedSetDate].[Type] = 'OPEN TOP  ' AND [ContainersCityOwnedSetDate].[CubicYard] <> 40 AND (DATEDIFF(day, @ServiceStartDate,[ContainersCityOwnedSetDate].[ReturnedToStockDate]) >= 30) THEN 'MONTHLY RENT 30YD OT' -- MONTHLY RENT 30YD OT
		 WHEN [ContainersCityOwnedSetDate].[Type] = 'OPEN TOP  ' AND [ContainersCityOwnedSetDate].[CubicYard] = 40 AND (DATEDIFF(day, @ServiceStartDate,[ContainersCityOwnedSetDate].[ReturnedToStockDate]) >= 30) THEN 'MONTHLY RENT 40YD OT' -- MONTHLY RENT 40YD OT
	  END AS 'Name'
  --Amount
	  ,CASE 
	  WHEN [ContainersCityOwnedSetDate].[Type] = 'OPEN TOP  ' AND [ContainersCityOwnedSetDate].[CubicYard] <> 40 AND (DATEDIFF(day, [ContainersCityOwnedSetDate].SetDate, @ServiceEndDate) < 30) THEN @DAILYRENT30YDOT*(DATEDIFF(day, [ContainersCityOwnedSetDate].SetDate, @ServiceEndDate)) -- DAILY RENT 30YD OT
	   WHEN [ContainersCityOwnedSetDate].[Type] = 'OPEN TOP  ' AND [ContainersCityOwnedSetDate].[CubicYard] = 40 AND (DATEDIFF(day, [ContainersCityOwnedSetDate].SetDate, @ServiceEndDate) < 30) THEN @DAILYRENT40YDOT*(DATEDIFF(day, [ContainersCityOwnedSetDate].SetDate, @ServiceEndDate)) -- DAILY RENT 40YD OT
	    WHEN [ContainersCityOwnedSetDate].[Type] = 'OPEN TOP  ' AND [ContainersCityOwnedSetDate].[CubicYard] <> 40 AND (DATEDIFF(day, [ContainersCityOwnedSetDate].SetDate, @ServiceEndDate) >= 30) THEN @MONTHLYRENT30YDOT -- MONTHLY RENT 30YD OT
		 WHEN [ContainersCityOwnedSetDate].[Type] = 'OPEN TOP  ' AND [ContainersCityOwnedSetDate].[CubicYard] = 40 AND (DATEDIFF(day, [ContainersCityOwnedSetDate].SetDate, @ServiceEndDate) >= 30) THEN @MONTHLYRENT40YDOT -- MONTHLY RENT 40YD OT
		  WHEN [ContainersCityOwnedSetDate].[Type] = 'COMPACTOR ' THEN @DAILYRENTCOMPACTOR*[ContainersCityOwnedSetDate].CubicYard -- DAILY RENT COMPACTOR
		 
--DATEDIFF(day, @ServiceStartDate,[ContainersCityOwnedSetDate].[ReturnedToStockDate]
	  WHEN [ContainersCityOwnedSetDate].[Type] = 'OPEN TOP  ' AND [ContainersCityOwnedSetDate].[CubicYard] <> 40 AND (DATEDIFF(day, @ServiceStartDate,[ContainersCityOwnedSetDate].[ReturnedToStockDate]) < 30) THEN @DAILYRENT30YDOT*(DATEDIFF(day, @ServiceStartDate,[ContainersCityOwnedSetDate].[ReturnedToStockDate])) -- DAILY RENT 30YD OT
	   WHEN [ContainersCityOwnedSetDate].[Type] = 'OPEN TOP  ' AND [ContainersCityOwnedSetDate].[CubicYard] = 40 AND (DATEDIFF(day, @ServiceStartDate,[ContainersCityOwnedSetDate].[ReturnedToStockDate]) < 30) THEN @DAILYRENT40YDOT*(DATEDIFF(day, @ServiceStartDate,[ContainersCityOwnedSetDate].[ReturnedToStockDate])) -- DAILY RENT 40YD OT
	    WHEN [ContainersCityOwnedSetDate].[Type] = 'OPEN TOP  ' AND [ContainersCityOwnedSetDate].[CubicYard] <> 40 AND (DATEDIFF(day, @ServiceStartDate,[ContainersCityOwnedSetDate].[ReturnedToStockDate]) >= 30) THEN @MONTHLYRENT30YDOT -- MONTHLY RENT 30YD OT
		 WHEN [ContainersCityOwnedSetDate].[Type] = 'OPEN TOP  ' AND [ContainersCityOwnedSetDate].[CubicYard] = 40 AND (DATEDIFF(day, @ServiceStartDate,[ContainersCityOwnedSetDate].[ReturnedToStockDate]) >= 30) THEN @MONTHLYRENT40YDOT -- MONTHLY RENT 40YD OT		 
	  END AS 'Amount'

  ,@ServiceEndDate AS 'TransactionDate'
  ,@TransactionProcessed AS 'TransactionProcessed'
 ,@ServiceEndDate As 'ServicedDate'

   FROM [ContainersCityOwnedSetDate]
   LEFT JOIN TransactionsCheckRent
  ON [ContainersCityOwnedSetDate].ContainerId = TransactionsCheckRent.ContainerId

  --Case: Filter out Customer from TransactionsCheckRent query
 WHERE TransactionsCheckRent.ContainerId IS NULL

END

-- IMPORT TO MUNIS\
CREATE PROCEDURE sp_ImportToMunis (@ServiceStartDate DATETIME2
,@ServiceEndDate DATETIME2) 

BEGIN

SELECT 
       [Transactions].[LocationId] AS 'ACCOUNT'
      ,[Transactions].[CustomerId] AS 'BILLED CUSTOMER ID'
      ,[Fees].ChargeCode AS 'CHARGE CODE'
      ,[Fees].RateCode AS 'RATE CODE'
      ,SUM([Transactions].[Amount]) AS 'PRICE'
  FROM [TRASH].[dbo].[Transactions]
  LEFT JOIN [TRASH].[dbo].[Fees]
  ON [Transactions].FeeId = [Fees].FeeId 
--FeeId <> 42 "RETURN TO STOCK" This fee does not need to be included
WHERE [Transactions].FeeId <> 42 AND [Transactions].[ServicedDate] BETWEEN @ServiceStartDate AND @ServiceEndDate
GROUP BY [Transactions].[LocationId], [Transactions].[CustomerId],[Fees].ChargeCode,[Fees].RateCode
ORDER BY [Transactions].[CustomerId]

END

-- CUSTOMER EXPORT
CREATE PROCEDURE sp_CustomerExport (IN @ServiceStartDate DATETIME2
,@ServiceEndDate DATETIME2
,@CustomerId INT)

BEGIN

SELECT 
        [Transactions].[CustomerId] AS 'CUSTOMER ID'
       ,[Transactions].[LocationId] AS 'ACCOUNT'
	   ,[Transactions].ContainerId AS 'ContainerId'
	   ,[Transactions].[Name] AS 'FEE NAME'
	   ,[Transactions].Tonnage AS 'TONNAGE'
	   ,[Transactions].SetDate AS 'SET DATE'
	   ,[Transactions].ServicedDate AS 'SERVICE DATE'
       ,[Transactions].[Amount] AS 'TOTAL'
FROM [TRASH].[dbo].[Transactions]
WHERE  [Transactions].[ServicedDate] BETWEEN @ServiceStartDate AND @ServiceEndDate AND [Transactions].[CustomerId] = @CustomerId 

END