import config from '../config';

export const generateKey = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let res = '';

  while (res.length < length) {
	res += chars[Math.floor(Math.random() * chars.length)];
  }
  return res;
};

export const getMonthName = (month: number) => {
  const date = new Date();
  date.setMonth(month);

  const localeString = date.toLocaleDateString('uk-UA', {
	month: 'long'
  });

  return localeString[0].toUpperCase() + localeString.slice(1);
};

export const normFile = e => {
  if (Array.isArray(e)) {
	return e;
  }
  return e && e.fileList;
};

export const buildServerPath = () => {
  const { useHTTPS, host, port } = config.api;
  return `${useHTTPS ? 'https' : 'http'}://${host}:${port}`;
};

export const range = (from, to) => {
  if (to < from) return [];
  const len = to - from + 1;
  const range = new Array(len);
  for (let i = from; i <= to; i++) {
    range[i - from] = i;
  }
  return range;
};

export const isWeekend = ({ day, month, year }) => {
  const date = new Date(year, month, day);
  // 6 - Saturday, 0 - Sunday
  return [6, 0].includes(date.getDay());
};
