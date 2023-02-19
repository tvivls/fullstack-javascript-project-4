import axios from "axios";
import fsp from 'node:fs/promises';
import fs from 'node:fs'
import { constants } from 'node:fs';
import { cwd } from 'node:process';
import cheerio from 'cheerio';
import * as utils from './utils.js';

const images = ($, dirPath) => {
  Array.from($('img'))
    .map(link => {
      const imgSrc = $(link).attr('src');
      const newSrc = utils.filePaths(dirPath, utils.nameFromLink(imgSrc));
      axios({
        method: 'get',
        url: imgSrc,
        responseType: 'stream',
      })
      .then(imgResponse => {
        const filestream = fs.createWriteStream(newSrc);
        imgResponse.data.pipe(filestream)
      })
      $(link).attr("src", newSrc);   
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
      const newHtml = images($, dirPath);

      const fileName = utils.buildFileName(url);
      const filePath = utils.filePaths(defaultPath, fileName);
      fsp.writeFile(filePath, newHtml);
      console.log(filePath); 
      console.log(`\nopen ${filePath}`);
    })
    .catch(error => {
      throw new Error(error);
    }).finally()
};
