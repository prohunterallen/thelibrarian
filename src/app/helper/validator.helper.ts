import { extname } from 'path';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export function IsValidEmail(email: string): boolean {
  // Use a regular expression to validate the email format
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export function isValidUsername(username: string): boolean {
  const usernameRegex = /^[a-zA-Z0-9_.]+$/;
  return usernameRegex.test(username);
}

export const removeZeroFill = (str) => {
  if (str.charAt(0) === '0') {
    return str.replace(/^0+/, '');
  }
  return str;
};

export const isNumeric = (str) => {
  const numStr = removeZeroFill(str);
  return /^\d+$/.test(numStr);
};

export const isValidId = (id: string): boolean => {
  const idRegex = /^[a-zA-Z0-9]+$/;
  return idRegex.test(id);
};

export const validateImageFile = (file: any): boolean => {
  // Check the file extension
  const validExtensions = ['.png', '.jpg', '.jpeg', '.gif'];
  const fileExt = extname(file.originalname).toLowerCase();
  return !validExtensions.includes(fileExt);
};

export const validateFileSize = (file: any): boolean => {
  // Check the file size
  return file.size > MAX_FILE_SIZE;
};
