import { Duration } from '@/store/interfaces/options';

const dateFormate = (date: Date, step: String) => {
  const year = date.getFullYear();
  const monthTemp = date.getMonth() + 1;
  let month: String = `${monthTemp}`;
  if (monthTemp < 10) {
    month = `0${monthTemp}`;
  }
  if (step === 'MONTH') {
    return `${year}-${month}`;
  }
  const dayTemp = date.getDate();
  let day: String = `${dayTemp}`;
  if (dayTemp < 10) day = `0${dayTemp}`;
  if (step === 'DAY') return `${year}-${month}-${day}`;
  const hourTemp = date.getHours();
  let hour: String = `${hourTemp}`;
  if (hourTemp < 10) hour = `0${hourTemp}`;
  if (step === 'HOUR') return `${year}-${month}-${day} ${hour}`;
  const minuteTemp = date.getMinutes();
  let minute: String = `${minuteTemp}`;
  if (minuteTemp < 10) minute = `0${minuteTemp}`;
  if (step === 'MINUTE') return `${year}-${month}-${day} ${hour}${minute}`;
};
const dateCook = (i: Duration) => {
  const startTemp = new Date(i.start);
  const endTemp = new Date(i.end);
  return {
    start: dateFormate(startTemp, i.step),
    end: dateFormate(endTemp, i.step),
    step: i.step,
  };
};

export default dateCook;
