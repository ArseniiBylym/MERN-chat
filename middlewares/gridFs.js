const path = require('path');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');

const storage = new GridFsStorage({
    url: process.env.MONGO_DB_URI,
    file: (req, file) => {
        const fileName = req.user.id + path.extname(file.originalname)
        return {
                filename: fileName,
                bucketName: 'avatars'
        };
    }
});

  module.exports = multer({ storage });