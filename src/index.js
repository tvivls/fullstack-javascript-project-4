import axios from "axios";
import fsp from 'node:fs/promises'; 
import { cwd } from 'node:process';
import path from "node:path";

export default (url, defaultPath = cwd()) => {
    return axios.get(url)
    .then(response => {
      const data = response.data;
        const [, fileString] = url.split(new URL(url).protocol);
        const fileName =`${fileString.replace(/[^a-zа-яё0-9]/gi, '-').slice(2)}.html`;
        const filePath = path.join(defaultPath, fileName);
        fsp.writeFile(filePath, data);
        console.log(filePath); 
        console.log(`\nopen ${filePath}`);
    })
    .catch(error => {
      throw new Error(error);
    }).finally()
}