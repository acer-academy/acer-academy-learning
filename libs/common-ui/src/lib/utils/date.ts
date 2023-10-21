export function getOrdinalSuffix(number: number) {
  const j = number % 10;
  const k = number % 100;

  if (j === 1 && k !== 11) {
    return 'st';
  }
  if (j === 2 && k !== 12) {
    return 'nd';
  }
  if (j === 3 && k !== 13) {
    return 'rd';
  }
  return 'th';
}

export function formatDate(dateString: string) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const date = new Date(dateString);

  const day = date.getDate();
  const formattedDay = day + getOrdinalSuffix(day);

  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();

  return `${formattedDay} ${month} ${year}`;
}
