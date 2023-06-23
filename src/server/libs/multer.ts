import path from 'path';
import koaMulter from '@koa/multer';
import config from 'config';
import { getUniqueFilename } from '../../services/functions';

const upload = koaMulter({
  storage: koaMulter.diskStorage({
    destination: (req, file, callback) => {
      const dest = config.get('server.imagePath');
      callback(null, dest);
    },
    filename: (req, file, callback) => {
      const fileSplitArr = file.originalname.split('.');
      const extension = fileSplitArr[fileSplitArr.length - 1] || 'jpg';
      const fileName = getUniqueFilename(file.fieldname, extension);
      callback(null, fileName);
    },
  }),
  fileFilter: (req, file, callback) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const err = ['.jpg', '.jpeg', '.png'].includes(ext) ? null : new Error('Only JPG, PNG are allowed');
    callback(err, true);
  },
  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB
  },
}).single('image');

export default upload;
