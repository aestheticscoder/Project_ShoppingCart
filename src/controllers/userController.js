const userModel = require("../models/userModel");
const validator = require("validator");
const bcrypt = require("bcrypt");
const { uploadFiles } = require("../aws/aws");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../../config");
const { ObjectId } = require("mongodb");
const { ObjectIdCheck } = require("../utils/validation");

// Create User

const createUser = async (req, res) => {
  try {
    const { fname, lname, phone, email, password, address } = req.body;

    if (!fname || !lname || !phone || !email || !password || !address) {
      return res
        .status(400)
        .json({ status: false, message: "Please enter all fields" });
    }

    if (phone.length !== 10) {
      return res
        .status(400)
        .json({ status: false, message: "Please enter a valid phone number" });
    }

    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ status: false, message: "Please enter a valid email" });
    }

    if (password.length < 8 || password.length > 15) {
      return res
        .status(400)
        .json({ status: false, message: "Please enter a valid password" });
    }

    if (!address.shipping || !address.billing) {
      return res
        .status(400)
        .json({ status: false, message: "Please enter the required data" });
    }

    if (
      !address.shipping.street ||
      !address.billing.street ||
      !address.shipping.city ||
      !address.billing.city ||
      !address.shipping.pincode ||
      !address.billing.pincode
    ) {
      return res
        .status(400)
        .json({ status: false, message: "Please enter the required data" });
    }

    const existingUser = await userModel.findOne({
      $or: [{ phone }, { email }],
    });
    if (existingUser) {
      if (existingUser.phone === phone) {
        return res
          .status(400)
          .json({ status: false, message: "Phone number already exists" });
      } else if (existingUser.email === email) {
        return res
          .status(400)
          .json({ status: false, message: "Email already exists" });
      }
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const url = await uploadFiles(req.files[0]); // Assuming only one file is uploaded

    const userDetail = {
      fname,
      lname,
      phone,
      email,
      password: hashedPassword,
      address: {
        shipping: {
          street: address.shipping.street,
          city: address.shipping.city,
          pincode: address.shipping.pincode,
        },
        billing: {
          street: address.billing.street,
          city: address.billing.city,
          pincode: address.billing.pincode,
        },
      },
      profileImage: url,
    };

    const user = await userModel.create(userDetail);
    return res
      .status(200)
      .json({ status: true, message: "User created successfully", data: user });
  } catch (error) {
    if (
      error.message.includes("duplicate") ||
      error.message.includes("validation")
    ) {
      return res.status(400).json({ status: false, message: error.message });
    }
    return res.status(500).json({ status: false, message: error.message });
  }
};

// Login User

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ status: false, message: "Please enter email and password" });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid email or password" });
    }

    const token = jwt.sign({ _id: user._id }, SECRET_KEY, { expiresIn: "24h" });

    if (!token) {
      return res.status(400).json({ status: false, message: "Invalid token" });
    }

    res.setHeader("x-api-key", token);
    return res.status(200).json({
      status: true,
      message: "User logged in successfully",
      data: { userId: user._id, token },
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

// Get User by ID

const getUserById = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      res.status(400).json({ status: false, message: "Please enter user id" });
    }
    if (!ObjectIdCheck(userId)) {
      return res
        .status(400)
        .json({ status: false, message: "Please enter valid UserId" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      res.status(404).json({ status: false, message: "User not found" });
    }
    res
      .status(200)
      .json({ status: true, message: "User Profile Details", data: user });
  } catch (error) {
    if (error.message.includes("duplicate")) {
      res.status(400).json({ status: false, message: error.message });
    } else if (error.message.includes("validation")) {
      res.status(400).json({ status: false, message: error.message });
    } else {
      res.status(500).json({ status: false, message: error.message });
    }
  }
};

// Update User

const updateUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const data = req.body;

    if (!userId) {
      return res
        .status(400)
        .json({ status: false, message: "Please enter UserId" });
    }

    if (!ObjectId.isValid(userId)) {
      return res
        .status(400)
        .json({ status: false, message: "Please enter valid UserId" });
    }

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ status: false, message: "No User Found" });
    }

    if (data.email && data.email !== user.email) {
      const emailCheck = await userModel.findOne({ email: data.email });

      if (emailCheck) {
        return res
          .status(400)
          .json({ status: false, message: "Email already exists" });
      }
    }

    if (data.phone && data.phone !== user.phone) {
      const phoneCheck = await userModel.findOne({ phone: data.phone });

      if (phoneCheck) {
        return res
          .status(400)
          .json({ status: false, message: "Phone Number Already Exists" });
      }
    }

    if (data.password) {
      if (data.password.length < 8 || data.password.length > 15) {
        return res
          .status(400)
          .json({ status: false, message: "Please enter a valid Password" });
      }

      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(data.password, salt);
      user.password = hashedPassword;
    }

    if (req.files && req.files.length > 0) {
      const url = await uploadFiles(req.files[0]);
      user.profileImage = url;
    }

    user.fname = data.fname || user.fname;
    user.lname = data.lname || user.lname;
    user.phone = data.phone || user.phone;
    user.email = data.email || user.email;
    user.address.shipping.street =
      data.address?.shipping?.street || user.address.shipping.street;
    user.address.shipping.city =
      data.address?.shipping?.city || user.address.shipping.city;
    user.address.shipping.pincode =
      data.address?.shipping?.pincode || user.address.shipping.pincode;
    user.address.billing.street =
      data.address?.billing?.street || user.address.billing.street;
    user.address.billing.city =
      data.address?.billing?.city || user.address.billing.city;
    user.address.billing.pincode =
      data.address?.billing?.pincode || user.address.billing.pincode;

    const updatedUser = await user.save();

    res.status(200).json({
      status: true,
      message: "User Updated Successfully",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = {
  createUser,
  loginUser,
  getUserById,
  updateUser,
};
