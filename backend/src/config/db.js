const mysql = require("mysql2/promise");

const pool = mysql.createPool({
    host: "localhost",       // nếu Workbench đang chạy local thì giữ nguyên
    user: "root",            // user MySQL của bạn
    password: "101747",            // mật khẩu MySQL (nếu có thì điền)
    database: "quan_ly_chi_tieu"  // đúng tên schema bạn đã import
});

module.exports = pool;


