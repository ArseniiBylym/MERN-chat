let gfs;

module.exports = {
    init: (db, mongo) => {
        gfs = require('gridfs-stream')(db, mongo); 
        return gfs;
    },
    get: () => {
        if (!gfs) {
            throw new Error('Gfs not initialized!');
        }
        return gfs;
    }
};
  