const User = require("./models/User");
const Role = require("./models/Role");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { secret } = require("./config");

const generateAccessToken = (id, roles) => {
  const payload = {
    id,
    roles,
  };
  return jwt.sign(payload, secret, { expiresIn: "24h" });
};

class authController {
  async registration(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ message: "Password should be longer than 4 and less than 20 characters", errors });
      }
      const { email, password } = req.body;
      if (!/\S+@\S+\.\S+/.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }
      const candidate = await User.findOne({ email });

      if (candidate) {
        return res.status(400).json({ message: "Email is already registered" });
      }
      const hashPassword = bcrypt.hashSync(password, 7);
      const userRole = await Role.findOne({ value: "USER" });
      const user = new User({ email, password: hashPassword, roles: [userRole.value] });
      await user.save();
      return res.json({ message: "Registration successful" });
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "Registration error" });
    }
  }
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: `Email ${email} not found` });
      }
      const validPassword = bcrypt.compareSync(password, user.password);
      if (!validPassword) {
        return res.status(400).json({ message: `Password or email is not valid` });
      }
      const token = generateAccessToken(user._id, user.roles);
      return res.json({ token });
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "Login error" });
    }
  }
  async checkAuthStatus(req, res) {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return res.status(401).json({ message: "No token provided" });
      }
      jwt.verify(token, secret, (err, decoded) => {
        if (err) {
          return res.status(401).json({ message: "Invalid token" });
        }
        // Token is valid, user is authenticated
        return res.status(200).json({ authenticated: true });
      });
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Server error" });
    }
  }
  async getUsers(req, res) {
    try {
      // TO initialize user roles in mongoDB collections
      // const userRole = new Role();
      // const adminRole = new Role({value:"ADMIN"})
      // await userRole.save()
      // await adminRole.save()

      const users = await User.find();
      res.json(users);
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = new authController();
