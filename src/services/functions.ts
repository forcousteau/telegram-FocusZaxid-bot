import fs from 'fs';
import path from 'path';
import axios from 'axios';
import stream from 'stream';
import Bot from '../telegram/init/bot';
import { promisify } from 'util';
import { MINUTES_ROUND } from '../constants';

const Duplex = stream.Duplex;

export function isObject(obj) {
  return (typeof obj === 'object' || typeof obj === 'function') && obj !== null;
}

export const bufferToStream = (buffer: Buffer) => {
  const stream = new Duplex();
  stream.push(buffer);
  stream.push(null);
  return stream;
};

export const getDaysNumberInMonth = (month: number) => {
  const now = new Date();
  return new Date(now.getFullYear(), month + 1, 0).getDate();
};

export const getHoursDifference = (date1, date2) => {
  return roundMinutes((date1 - date2) / 1e3 / 60) / 60;
};

export const isToday = date => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

export const isWeekend = date => {
  const day = date.getDay();
  return day === 6 || day === 0;
};

export const isSunday = date => {
  const day = date.getDay();
  return day === 0;
};

export const roundFloat = (num, decimals) => Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);

export const roundMinutes = num => Math.round(num / MINUTES_ROUND) * MINUTES_ROUND;

export async function getFilesRecursively(dir, fileList = null) {
  const files = await promisify(fs.readdir)(dir);

  fileList = fileList || [];
  for (const file of files) {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      fileList = await getFilesRecursively(dir + file + '/', fileList);
    } else {
      fileList.push(dir + file);
    }
  }

  return fileList;
}

export function getRandomString(length) {
  const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let str = '';

  for (let i = 1; i <= length; i++) {
    str += alphabet[Math.floor(Math.random() * alphabet.length)];
  }

  return str;
}

export async function getFileBotUrl(ctx, fileId: string): Promise<string> {
  const file = await ctx.telegram.getFile(fileId);
  const filePath = file.file_path;
  return `https://api.telegram.org/file/bot${Bot.token}/${filePath}`;
}

export async function dowloadFile(url: string, directory: string): Promise<string> {
  const urlSplit = url.split('.');
  const extension = urlSplit[urlSplit.length - 1];
  const fileName = getUniqueFilename(getRandomString(5), extension);
  const filePath = path.join(directory, fileName);
  const file = fs.createWriteStream(filePath);

  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream',
  });

  response.data.pipe(file);

  return new Promise((resolve, reject) => {
    file.on('finish', () => {
      resolve(fileName);
    });
    file.on('error', err => {
      reject(err);
    });
  });
}

export function getUniqueFilename(filename: string, extension: string) {
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  return `${filename}-${uniqueSuffix}.${extension}`;
}

export function capitalizeWordsFirstLetters(str) {
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.substr(1).toLowerCase())
    .join(' ');
}
