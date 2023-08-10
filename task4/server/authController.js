const User = require("./models/User");
const Role = require("./models/Role");
const bcrypt = require("bcryptjs");
const {validationResult} = require("express-validator");

class authController {
  async registration(req, res) {
    try {
      const errors = validationResult(req);
      if(!errors.isEmpty()){
        return res.status(400).json({message:"Registrator error occured", errors})
      }
      const { email, password } = req.body;
      const candidate = await User.findOne({email});
      if (candidate) {
        return res.status(400).json({ message: "Email is already registered" });
      }
      const hashPassword = bcrypt.hashSync(password, 7);
      const userRole = await Role.findOne({ value: "USER" });
      const user = new User({ email,password: hashPassword, roles: [userRole.value] });
      await user.save();
      return res.json({ message: "Registration successful" });
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "Registration error" });
    }
  }
  async login(req, res) {
    try {
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "Login error" });
    }
  }
  async getUsers(req, res) {
    try {
      // const userRole = new Role();  TO initialize user roles in mongoDB collections
      // const adminRole = new Role({value:"ADMIN"})
      // await userRole.save()
      // await adminRole.save()
      res.json("server works!");
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = new authController();
