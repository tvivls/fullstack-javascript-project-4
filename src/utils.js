import path from "node:path";

export const buidNames = (url) => {
    const [, fileString] = url.split(new URL(url).protocol);
    return `${fileString.replace(/\W/g, '-').slice(2)}`;
  };
export const buildFileName = (url) => buidNames(url).concat('.html');
export const buildDirName = (url) => buidNames(url).concat('_files');
  
export const nameFromLink = (url) => {
      const { dir, name, ext } = path.parse(url);
      const newUrl = buidNames(dir.concat(name));
      return newUrl.concat(ext);
  };
  
export const filePaths = (defaultPath, fileName) => path.join(defaultPath, fileName);