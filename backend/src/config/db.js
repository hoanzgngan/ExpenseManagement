const mysql = require("mysql2/promise");

const pool = mysql.createPool({
    host: "localhost",         
    user: "root",             
    password: "quan2006",              
    database: "quan_ly_chi_tieu" 
});
module.exports = pool;