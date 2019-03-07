const getLocalTime = (i: number, t: Date | number) => {
  const d = new Date(t);
  const len = d.getTime();
  const offset = d.getTimezoneOffset() * 60000;
  const utcTime = len + offset;
  return new Date(utcTime + (3600000 * i));
};

export default getLocalTime;
