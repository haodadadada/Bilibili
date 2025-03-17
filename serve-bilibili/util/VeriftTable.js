const connQuery = require('./ConnQuery');
const createTable = tableName => {
    if(tableName === 'News') {
        let sql = `
            CREATE TABLE IF NOT EXISTS news(id INT AUTO_INCREMENT PRIMARY KEY, editTime datetime not null, type char(30) not null, cover char(100), content varchar(255));
        `
        connQuery(sql);
    }
}
createTable('News');