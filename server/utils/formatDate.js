function formatDate(m) {
  if (!m) return null;

  if (typeof m === "string") {
    m = new Date(m);
  }

  const newDate =
    m.getFullYear() +
    "/" +
    ("0" + (m.getMonth() + 1)).slice(-2) +
    "/" +
    ("0" + m.getDate()).slice(-2) +
    " " +
    ("0" + m.getHours()).slice(-2) +
    ":" +
    ("0" + m.getMinutes()).slice(-2) +
    ":" +
    ("0" + m.getSeconds()).slice(-2);

  return newDate;
}

module.exports = {
  formatDate,
};
