import axios from "axios";
import fsp from 'node:fs/promises';
import fs from 'node:fs'
import { constants } from 'node:fs';
import { cwd } from 'node:process';
import cheerio from 'cheerio';
import * as utils from './utils.js';

export const isDomain = (src, url) => {
  const srcUrl = new URL(src, url);
  const pageUrl = new URL(url);
  return srcUrl.hostname === pageUrl.hostname;
};

const mapping = {
  'img': 'src',
  'link': 'href',
  'script': 'src',
};

const uploading = ($, dirPath, url) => {
  const tags = Object.entries(mapping);
  tags.map(([tag, value]) => {
    Array.from($(tag))
    .map(link => {
      const tagValue = $(link).attr(value);
      if (isDomain(tagValue, url) && tagValue) {
        const newLink = utils.filePaths(dirPath, utils.nameFromLink(tagValue));

        axios({
          method: 'get',
          url: tagValue,
          responseType: 'stream',
        })
        .then(response => {
          const filestream = fs.createWriteStream(newLink);
          response.data.pipe(filestream);
        })
        $(link).attr(value, newLink);
      }
    })
  });
  return $.html();
};

const createDir = (url, defaultPath) => {
  const dirName = utils.buildDirName(url);
  const dirPath = utils.filePaths(defaultPath, dirName)
  fsp.access(dirPath, constants.F_OK)
  .catch(() => {
    fsp.mkdir(dirPath);
  });
  return dirPath
};

export default (url, defaultPath = cwd()) => {
  return axios.get(url)
    .then(response => {
      const data = response.data;
      const $ = cheerio.load(data);

      const dirPath = createDir(url, defaultPath)
      const newHtml = uploading($, dirPath, url);

      const fileName = utils.nameFromLink(url);
      const filePath = utils.filePaths(defaultPath, fileName);
      fsp.writeFile(filePath, newHtml);
      console.log(filePath); 
      console.log(`\nopen ${filePath}`);
    })
    .catch(error => {
      throw new Error(error);
    }).finally()
};
