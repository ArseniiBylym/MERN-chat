const gfs = require('../config/gfs.config');

exports.getImage = (req, res, next) => {
    gfs.get().files.findOne({filename: req.params.filename}, (err, file) => {
        if (file) {
            const readstream = gfs.get().createReadStream(file.filename);
            readstream.pipe(res.set('Content-Type', 'image/jpeg'))
        } else {
            res.status(404).json({message: 'Image not found'})
        }
    })
}

exports.postImage = (req, res, next) => {
    res.status(201).json({message: 'Avatar save', fileName: req.file.filename})
}