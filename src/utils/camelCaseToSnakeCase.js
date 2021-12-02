function camelCaseToSnakeCase(str) {
  let snakeCased = "";

  for (let i = 0; i < str.length - 1; i++) {
    if (str[i + 1] === str[i + 1].toUpperCase()) {
      if (
        str[i] === str[i].toUpperCase() &&
        str[i + 1] === str[i + 1].toUpperCase()
      ) {
        snakeCased += str[i].toUpperCase();
        continue;
      }

      snakeCased += `${str[i].toUpperCase()}_`;
    } else {
      snakeCased += str[i].toUpperCase();
    }
  }

  snakeCased += str[str.length - 1].toUpperCase();

  return snakeCased;
}

module.exports = {
  camelCaseToSnakeCase,
};
