module.exports = function (date) {
  let startOfDayDate = date;

  if (typeof date === "string") {
    startOfDayDate = new Date(date);
  }

  return startOfDayDate.setHours(0, 0, 0);
};
