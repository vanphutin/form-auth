const fs = require("fs");
const db = require("../../../config/database.config");
const Auth = require("../model/auth.model");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const generateHelper = require("../../../helper/generate");
const sendMailHelper = require("../../../helper/sendMail");
const { promisify } = require("util");
const query = promisify(db.query).bind(db);

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
    // console.log("login", login);
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
      res.cookie("token", token, { httpOnly: true });
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
module.exports.authForgotPassword = async (req, res) => {
  try {
    const id = uuidv4();
    const { email } = req.body;
    const user = await Auth.authForgotPassword(email);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const secretKey = "vanphutin-2004-29-02";
    const token = jwt.sign({ email: user.email, userId: user.id }, secretKey, {
      expiresIn: "1h",
    });

    const timeExpire = 5; // 5 phút
    const otp = generateHelper.generateRandomNumber(4);
    const expiresAt = new Date(Date.now() + timeExpire * 60 * 1000);

    await query(
      "INSERT INTO password_resets (id,email, token, otp, expires_at) VALUES (?,?, ?, ?, ?)",
      [id, email, token, otp, expiresAt]
    );

    const subject = "Mã OTP xác minh lấy lại mật khẩu";
    const text = `Mã OTP để lấy lại mật khẩu của bạn là <b>${otp}</b>(sử dụng trong ${timeExpire} phút), không chia sẻ mã này với ai!`;
    sendMailHelper.sendEmail(email, subject, text);

    res.json({
      code: 200,
      message: "Đã gửi mã qua mail!",
      email,
    });
  } catch (error) {
    console.error("Lỗi khi xử lý quên mật khẩu:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi máy chủ nội bộ",
    });
  }
};

module.exports.authEnterOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const enterotp = await Auth.authEnterOtp(otp, email);
    if (!enterotp) {
      return res.status(404).json({ message: "Otp or email not found" });
    }
    const secretKey = "vanphutin-2004-29-02";
    const token = jwt.sign(
      { email: enterotp.email, otp: enterotp.otp },
      secretKey,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({
      code: 200,
      message: "Login success !",
      token,
    });
  } catch (error) {
    console.error("Lỗi khi xử lý quên mật khẩu:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi máy chủ nội bộ",
    });
  }
};

module.exports.authResetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    const resetPass = await Auth.authResetPassword(email, password);

    if (!resetPass) {
      return res.status(404).json({ code: 400, message: "error" });
    }

    const secretKey = "vanphutin-2004-29-02";
    const token = jwt.sign(
      { email: resetPass.email, password: resetPass.password },
      secretKey,
      {
        expiresIn: "1h",
      }
    );
    res.status(200).json({
      code: 200,
      message: "password change success",
      token,
    });
  } catch (error) {
    console.error("Lỗi khi xử lý reset mật khẩu:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi máy chủ nội bộ",
    });
  }
};

module.exports.authVeryToken = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const secretKey = "vanphutin-2004-29-02";
    jwt.verify(token, secretKey, async (err, decoded) => {
      if (err) {
        return res
          .status(401)
          .json({ message: "Failed to authenticate token" });
      }

      // Giả sử bạn có hàm này để lấy thông tin người dùng từ ID
      const user = await Auth.authVeryToken(decoded?.email);
      console.log("decoded.userId:", decoded?.email);
      console.log("user:", user);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({
        code: 200,
        success: true,
        message: "Đăng nhập thành công",
        user: {
          id: user.idUser,
          email: user.email,
          lastname: user.lastname,
          firstname: user.firstname,
          school: user.school,
          avatar: user.avatar,
        },
        token,
      });
    });
  } catch (error) {
    console.error("Error in authVeryToken:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
