export function createTimeLabel() {
  const date = new Date();
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
