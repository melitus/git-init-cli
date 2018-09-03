import fs from 'fs';
import path from 'path';


export const getCurrentDirectoryBase = async () => {
    const basepath = await path.basename(process.cwd());
    return basepath;
  };

  export const directoryExists = async (filePath) => {
    try {
      const path = await fs.statSync(filePath).isDirectory();
      return path;
    } catch (err) {
      return false;
    }
  };


