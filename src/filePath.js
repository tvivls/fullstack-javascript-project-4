import { cwd } from 'node:process';
import path from 'node:path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default (filepath, fileName) => {
    if (filepath !== cwd()) (path.isAbsolute(filepath) ? filepath : path.resolve(cwd(), filepath, fileName));
}