const db = require("../../../config/database.config");
const { promisify } = require("util");
const query = promisify(db.query).bind(db);
const md5 = require("md5");

const Auth = {
  // Hàm thực hiện đăng ký người dùng
  authRegister: async (
    id,
    lastname,
    firstname,
    school,
    email,
    username,
    password,
    avatar
  ) => {
    const sql_register =
      "INSERT INTO users (id, lastname, firstname, school, email, username, password, avatar) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    try {
      const result = await query(sql_register, [
        id,
        lastname,
        firstname,
        school,
        email,
        username,
        md5(password), // Mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu
        avatar, // Tên file ảnh, có thể là null nếu không có ảnh
      ]);
      return result;
    } catch (error) {
      console.log("Lỗi khi thực hiện truy vấn:", error);
      throw error; // Ném lỗi để controller hoặc route bắt được và xử lý
    }
  },
  authLogin: async (email, password) => {
    const sql_login = "SELECT * FROM users WHERE email=? AND password=?";
    try {
      const result = await query(sql_login, [email, md5(password)]);
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.log("Lỗi khi thực hiện truy vấn:", error);
      throw error; // Ném lỗi để controller hoặc route bắt được và xử lý
    }
  },
  authForgotPassword: async (email) => {
    const sql_forgotpass = "SELECT * FROM users WHERE email=?";
    try {
      const result = await query(sql_forgotpass, [email]);
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.log("Lỗi khi thực hiện truy vấn:", error);
      throw error;
    }
  },
};

module.exports = Auth;
