import path from 'path';
import crypto from 'crypto';
import multer from 'multer';

// a partir da pasta config, voltando duas pastas (por isso duas vezes '..')
// e depois acessado a pasta 'tmp'
const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');

export default {
  tmpFolder,
  uploadsFolder: path.resolve(tmpFolder, 'uploads'),
  storage: multer.diskStorage({
    destination: tmpFolder,
    filename(request, file, callback) {
      // gerando o nome do arquivo
      const fileHash = crypto.randomBytes(10).toString('hex');
      const fileName = `${fileHash}-${file.originalname}`;
      return callback(null, fileName);
    },
  }),
};
