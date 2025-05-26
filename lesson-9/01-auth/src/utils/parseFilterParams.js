function parseYear(value) {
  if (typeof value === 'undefined') {
    return undefined;
  }

  const parsedYear = parseInt(value);

  if (Number.isNaN(parsedYear) === true) {
    return undefined;
  }

  return parsedYear;
}

export function parseFilterParams(query) {
  const { gender, minYear, maxYear } = query;

  const parsedMinYear = parseYear(minYear);
  const parsedMaxYear = parseYear(maxYear);

  return {
    gender,
    minYear: parsedMinYear,
    maxYear: parsedMaxYear,
  };
}
