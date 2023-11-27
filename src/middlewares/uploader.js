const multer = require('multer');

const folders = {
	profiles: './src/public/img/profiles',
	products: './src/public/img/products',
	documents: './src/public/img/documents'
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
	const {type} = req.body
	const destinationFolder = folders[type]//lo que llegue al body asigna el destino del archivo
    cb(null, destinationFolder);
  },

  filename: function (req, file, cb) {
	const {uid} = req.params
	const uniqueFileName = `${uid}_${file.originalname}`//indentifica al usuario que le pertenece el doc
    cb(null,uniqueFileName);
  }
});

const uploader = multer({ storage });

module.exports = uploader;