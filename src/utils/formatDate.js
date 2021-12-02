function formatDate(m) {
  if (!m) return null;

  if (typeof m === "string") {
    m = new Date(m);
  }

  const localOffset = new Date().getTimezoneOffset() * 60 * 1000;

  const newDateFromMillis = new Date(m.getTime() + localOffset);

  const newDate =
    ("0" + (newDateFromMillis.getMonth() + 1)).slice(-2) +
    "/" +
    ("0" + newDateFromMillis.getDate()).slice(-2) +
    "/" +
    newDateFromMillis.getFullYear();

  return newDate;
}

module.exports = {
  formatDate,
};
