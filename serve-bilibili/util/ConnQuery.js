const { conn_mydatabase, conn_database_bili } = require('../config/mysql.config');
function connQuery_mydatabase(sql, arr) {
    return new Promise((res, rej) => {
        conn_mydatabase.query(sql, arr, (err, result) => {
            if(err) {
                rej(err);
            }
            else {
                res(result);
            }
        })
    })

}
function connQuery_database_bili(sql, arr) {
    return new Promise((res, rej) => {
        conn_database_bili.query(sql, arr, (err, result) => {
            if(err) {
                rej(err);
            }
            else {
                res(result);
            }
        })
    })

}
module.exports = { connQuery_mydatabase, connQuery_database_bili };