const { users, Sequelize } = require("../models")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const validator = require("validator");
const nodemailer = require('nodemailer');

const register = async (req, res) => {
  try {
    const { email, password, confirmPassword, userName, age, weight, heightFeet, heightInches, experienceLevel } = req.body;
    // const userData = req.body;

    // Input Validation
    if (!email || !password || !confirmPassword || !userName || !age || !weight || !heightFeet || !heightInches || !experienceLevel) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters long." });
    }

    // Check if the user already exists
    const existingUser = await users.findOne({ where: { email } });
    if (existingUser) {
      console.warn(`Duplicate registration attempt for email: ${email}`);
      return res.status(409).json({ message: "Email is already in use.", data: existingUser });
    }
    
    //  console.log("Received User Data:", userData);
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 8);

    // Create the new user
    const newUser = await users.create({ email: email, password: hashedPassword,  name: userName, age: age, weight: weight, heightFeet: heightFeet, heightInches: heightInches, fitness_level: experienceLevel });

    return res.status(201).json({
      message: "Registration successful!",
      user: {
        id: newUser.id
      },
    });

  } catch (erroror) {
    console.erroror("erroror during registration:", erroror);
    return res.status(500).json({
      message: "An internal server erroror occurred. Please try again later.",
    });
  }
};


const login = async (req, res) => {
    try {
      const { email, password } = req.body;
      const userData = req.body;

      console.log("Received User Data:", userData);
  
      // Validate inputs
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
      }
  
      // Check if the user exists
      const existingUser = await users.findOne({ where: { email } });
  
      if (!existingUser) {
        return res.status(404).json({ message: "User with this email is not registered." });
      }
  
      // Validate password
      const isPasswordValid = await bcrypt.compare(password, existingUser.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Incorrect password." });
      }
  
      // Generate JWT
      const token = jwt.sign(
        { id: existingUser.id, role: existingUser.role },
        process.env.JWT_SECRET || "default-secret",
        { expiresIn: "30d" }
      );
      
       // ✅ Remove password before sending user data
    const { password: _, ...safeUserData } = existingUser.dataValues;

      return res.status(200).json({
        message : "User logged in successfully",
        token: token,
        user: existingUser,
      });
    } catch (erroror) {
      console.erroror("erroror during login:", erroror.message);
      res.status(500).json({
        message: "An erroror occurred during login. Please try again later.",
      });
    }
  };
  
  const userName = async (req, res) => {
    try {
        const { email, name } = req.body;

        if (!email || !name) {
            return res.status(400).json({ message: "Email and name are required." });
        }

        const user = await users.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Check if the user's name is already set
        if (user.name) {
            return res.status(400).json({ message: "Username has already been added." });
        }

        // Update the user's name
        await users.update(
            { name: name }, // Fields to update
            { where: { email } } // Where condition
        );
        res.status(200).json({ message: "Username added successfully!" });
    } catch (erroror) {
        console.erroror("erroror while adding username:", erroror);
        res.status(500).json({ message: "An erroror occurred. Please try again later." });
    }
};

const userHealth = async(req, res) => {
    try {
        const { email,  Gender,
            Age,
            Weight,
            HeightFeet,
            HeightInches, } = req.body;

        if (!email || !Age || !Weight || !HeightFeet || !HeightInches || !Gender) {
            return res.status(400).json({ message: "Fill up th input Fields." });
        }

        const user = await users.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // // Check if the user's name is already set
        // if (user.age || user.gender || user.weight || user.height_feet || user.height_inches) {
        //     return res.status(400).json({ message: "Already added" });
        // }

        // Update the user's name
        await users.update(
            { age:Age, gender: Gender, weight: Weight, height_feet: HeightFeet, height_inches: HeightInches }, // Fields to update
            { where: { email } } // Where condition
        );

        res.status(200).json({ message: "Health details added successfully!" });
    } catch (erroror) {
        console.erroror("erroror while adding health details:", erroror);
        res.status(500).json({ message: "An erroror occurred. Please try again later." });
    }
};

const experience = async (req, res) => {
    try {
        const { email, experience } = req.body;

        // Validate required fields
        if (!email || !experience) {
            return res.status(400).json({ message: "Fill up the input fields." });
        }

        // Fetch user from the database
        const user = await users.findOne({ where: { email } });

        // Check if user exists
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Check if the user's experience is already set
        if (user.fitness_level) {
            return res.status(400).json({ message: "Experience already added." });
        }

        // Update the user's experience
        await users.update(
            { fitness_level: experience }, // Fields to update
            { where: { email } } // Where condition
        );

        // Success response
        return res.status(200).json({ message: "Experience added successfully!" });
    } catch (erroror) {
        console.erroror("erroror while adding experience:", erroror);
        return res.status(500).json({ message: "An erroror occurred. Please try again later." });
    }
};


const user_forgotPassword = async (req, res) => {
    let { email } = req.body;

    try {
        const existingEmail = await users.findOne({ where: { email: email } });

        if (!existingEmail) {
            return res.status(400).json({
                message: "Email doesnot found"
            });
        }

        const otp = Math.floor(1000 + Math.random() * 9000);
        const otpExpire = new Date();
        otpExpire.setMinutes(otpExpire.getMinutes() + 1);

        const [updated] = await users.update(
            { otp: otp, otpExpire: otpExpire },
            { where: { email: email } }
        );

       console.log(existingEmail)

        if (updated === 0) {
            return res.status(500).json({
                message: "Something went wrong"
            });
        }

        const transporter = nodemailer.createTransport({
            service: "Gmail",
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: "anjalsotang26@gmail.com",
                pass: "yvjw aloi gewu dfrq",
            },
        });

        const mailOptions = {
            from: "anjalsotang26@gmail.com",
            to: email,
            subject: "Please reset OTP",
            text: `Your OTP (It expires after 1 min) : ${otp}`
        };

        transporter.sendMail(mailOptions, (erroror, info) => {
            if (erroror) {
                return res.status(500).json({
                    message: `Something went wrong: ${erroror}`
                });
            } else {
                return res.status(200).json({
                    message: `OTP has been send to ${email}`
                });
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong"
        });
    }
};

const resetPassword = async (req, res) => {
    let { password, confirmPassword, otp } = req.body;

    if (!password || !confirmPassword || !otp) {
        return res.status(400).json({
            erroror: "Form data not found"
        });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({
            erroror: "Passwords are not equal"
        });
    }

    try {
        // Check if OTP is valid and not expired
        const record = await users.findOne({
            where: {
                otp: otp,
                otpExpire: {
                    [Sequelize.Op.gt]: new Date() // Check if OTP has not expired
                }
            }
        });

        if (!record) {
            return res.status(400).json({
                erroror: 'Invalid OTP'
            });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 8);

        // Update the user's password and reset OTP fields
        await users.update(
            {
                password: hashedPassword,
                otp: null,
                otpExpire: null
            },
            {
                where: { otp: otp }
            }
        );

        return res.status(201).json({
            message: 'Password reset successful'
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Something went wrong",
            error: error
        });
    }
};




    module.exports = {
        register,
        login,
        user_forgotPassword,
        resetPassword,
        userName,
        userHealth,
        experience
    }


