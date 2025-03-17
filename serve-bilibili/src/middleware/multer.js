const multer = require('multer');
const singleUpload = multer({ 
    dest: 'public/web/avatarUpload/',
    limits: {
        fileSize: 1024 * 512 * 1, // 限制文件大小为10M
    },
}).single('file');
module.exports = {
    singleUpload
}