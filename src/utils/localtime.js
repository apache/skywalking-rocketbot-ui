const getLocalTime = (i, t) => {
  // 参数i为时区值数字，比如北京为东八区则输进8,西5输入-5
  if (typeof i !== 'number') return;
  const d = new Date(t);
  // 得到1970年一月一日到现在的秒数
  const len = d.getTime();
  // 本地时间与GMT时间的时间偏移差
  const offset = d.getTimezoneOffset() * 60000;
  // 得到现在的格林尼治时间
  const utcTime = len + offset;
  return new Date(utcTime + (3600000 * i));
};

export default getLocalTime;
