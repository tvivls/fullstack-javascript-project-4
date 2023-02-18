import axios from "axios";
import fsp from 'node:fs/promises';
import { constants } from 'node:fs';
import { cwd } from 'node:process';
import cheerio from 'cheerio';
import * as utils from './utils.js';

export default (url, defaultPath = cwd()) => {
  let $;
  return axios.get(url)
    .then(response => {
      const data = response.data;
      $ = cheerio.load(data);
      const dirName = utils.buildDirName(url);
      const dirPath = utils.filePaths(defaultPath, dirName)
      fsp.access(dirPath, constants.F_OK)
      .catch(() => {
        fsp.mkdir(dirPath);
      });
      const imges = Array.from($('img'))
      .map((el) => {
        const srcs = $(el).attr('src');
        const srcValue = utils.filePaths('', utils.nameFromLink(srcs))
        
      });
      
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
