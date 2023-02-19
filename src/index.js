import axios from "axios";
import fsp from 'node:fs/promises';
import fs from 'node:fs'
import { constants } from 'node:fs';
import { cwd } from 'node:process';
import cheerio from 'cheerio';
import * as utils from './utils.js';

const uploadImages = ($, dirPath) => {
  Array.from($('img'))
  .map(link => {
    const imgSrc = $(link).attr('src');
    axios({
      method: 'get',
      url: imgSrc,
      responseType: 'stream',
    })
      .then(imgResponse => {
        const srcPath = utils.filePaths(dirPath, utils.nameFromLink(imgSrc));
        const filestream = fs.createWriteStream(srcPath);
        imgResponse.data.pipe(filestream)
      })
  });
}

export default (url, defaultPath = cwd()) => {
  return axios.get(url)
    .then(response => {
      const data = response.data;
      const $ = cheerio.load(data); 
      const dirName = utils.buildDirName(url);
      const dirPath = utils.filePaths(defaultPath, dirName)
      fsp.access(dirPath, constants.F_OK)
      .catch(() => {
        fsp.mkdir(dirPath);
      });
      uploadImages($, dirPath);

      const fileName = utils.buildFileName(url);
      const filePath = utils.filePaths(defaultPath, fileName);
      fsp.writeFile(filePath, data);
      console.log(filePath); 
      console.log(`\nopen ${filePath}`);
      return filePath;
    })
    .catch(error => {
      throw new Error(error);
    }).finally()
}
