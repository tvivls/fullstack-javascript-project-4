import path from 'node:path';

export const filePaths = (defaultPath, fileName) => path.join(defaultPath, fileName);

export const buidNames = (url) => {
  const [, fileString] = url.split(new URL(url).protocol);
  return `${fileString.replace(/^\/+/, '').replace(/\W/g, '-')}`;
};
export const buildFileName = (url) => buidNames(url).concat('.html');
export const buildDirName = (url) => buidNames(url).concat('_files');

export const nameFromLink = (url) => {
  const { dir, name, ext } = path.parse(url);
  if (ext === '') return buildFileName(url);
  const newUrl = buidNames(filePaths(dir, name));
  return newUrl.concat(ext);
};
