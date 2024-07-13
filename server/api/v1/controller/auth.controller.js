const fs = require("fs");
const Auth = require("../model/auth.model");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
module.exports.authRegister = async (req, res) => {
  try {
    const id = uuidv4(); // Tạo ID duy nhất cho người dùng mới
    const { lastname, firstname, school, email, username, password } = req.body;
    let avatarBase64 = null;

    // Nếu có file ảnh được upload
    if (req.file) {
      const avatarPath = req.file.path;
      const avatarData = fs.readFileSync(avatarPath);
      avatarBase64 = avatarData.toString("base64"); // Chuyển đổi thành chuỗi base64
    }

    const register = await Auth.authRegister(
      id,
      lastname,
      firstname,
      school,
      email,
      username,
      password,
      avatarBase64 // Truyền chuỗi base64 vào hàm authRegister
    );
    console.log("register", register);
    // Khóa bí mật
    const secretKey = "vanphutin-2004-29-02";
    // // Tạo token
    const token = jwt.sign({ id: id }, secretKey, { expiresIn: "1h" });
    console.log("token", token, "id", id);

    res.status(201).json({
      code: 201,
      message: "Đăng ký người dùng thành công",
      token,
    });
  } catch (error) {
    console.error("Lỗi khi tạo người dùng:", error);
    res.status(500).json({
      code: 500,
      message: "Lỗi máy chủ nội bộ",
      error: error.message,
    });
  }
};

module.exports.authLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Gọi phương thức authLogin từ model để kiểm tra thông tin đăng nhập
    const login = await Auth.authLogin(email, password);
    console.log("login", login);
    // Khóa bí mật
    const secretKey = "vanphutin-2004-29-02";
    if (login) {
      // Tạo token nếu đăng nhập thành công
      const token = jwt.sign(
        { email: login.email, userId: login.idUser },
        secretKey,
        {
          expiresIn: "1h",
        }
      );

      // Trả về token và thông tin người dùng
      res.status(200).json({
        code: 200,
        success: true,
        message: "Đăng nhập thành công",
        token,
        user: {
          id: login.idUser,
          email: login.email,
          lastname: login.lastname,
          firstname: login.firstname,
          school: login.school,
          avatar: login.avatar,
          // Các thông tin khác của người dùng nếu cần
        },
      });
    } else {
      // Trả về lỗi nếu thông tin đăng nhập không hợp lệ
      res.status(401).json({
        success: false,
        message: "Email hoặc mật khẩu không đúng",
      });
    }
  } catch (error) {
    console.log("Lỗi khi xử lý đăng nhập:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi máy chủ nội bộ",
    });
  }
};
