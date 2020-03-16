export function createTimeLabel() {
  const date = new Date();
  date.setHours(
    date.getHours()
    + date.getTimezoneOffset() / 60
    + 9,
  );
  const hour = date
    .getHours()
    .toString()
    .padStart(2, '0');
  const min = date
    .getMinutes()
    .toString()
    .padStart(2, '0');

  return `${hour}시 ${min}분`;
}
