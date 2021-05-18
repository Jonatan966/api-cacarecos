import multer from 'multer'
import path from 'path'

export const multerService = multer({
  dest: path.join(__dirname, '..', '..', '..', 'temp')
})
