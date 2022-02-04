module.exports = function (date) {
  let endOfDayDate = date;

  if (typeof date === "string") {
    endOfDayDate = new Date(date);
  }

  return endOfDayDate.setHours(23, 00, 00);
};
