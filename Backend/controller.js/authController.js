const { users, Sequelize } = require("../models")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const validator = require("validator");
const nodemailer = require('nodemailer');

const register = async (req, res) => {
  try {
    const { email, password, confirmPassword, userName, age, weight, heightFeet, heightInches, experienceLevel, gender } = req.body;
    // const userData = req.body;

    // Input Validation
    if (!email || !password || !confirmPassword || !userName || !gender || !age || !weight || !heightFeet || !heightInches || !experienceLevel) {
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
    const newUser = await users.create({ email: email, password: hashedPassword, username: userName, age: age, weight: weight, heightFeet: heightFeet, heightInches: heightInches, fitness_level: experienceLevel });

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
      message: "User logged in successfully",
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

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    let id = req.decoded.id;

    console.log(id)

    const user = await users.findByPk(id, {
      attributes: { exclude: ['password'] } // Don't send password to client
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ data: user });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    let id = req.decoded.id;
    const {
      name, username, email, bio,
      height, weight, fitnessGoals, experienceLevel,
      profileVisibility, gender
    } = req.body;

    const user = await users.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create an object with only the fields that were provided
    const updateFields = {};

    if (name !== undefined) updateFields.firstName = name;
    if (username !== undefined) updateFields.username = username;
    if (email !== undefined) updateFields.email = email;
    if (bio !== undefined) updateFields.bio = bio;
    if (height !== undefined) updateFields.heightFeet = height;
    if (weight !== undefined) updateFields.weight = weight;
    if (fitnessGoals !== undefined) updateFields.fitnessGoal = fitnessGoals;
    if (experienceLevel !== undefined) updateFields.experienceLevel = experienceLevel;
    if (profileVisibility !== undefined) updateFields.profileVisibility = profileVisibility;
    if (gender !== undefined) updateFields.gender = gender;

    const image = req.file;  // Multer file upload
    const imagePath = image?.path;  // Will be undefined if image is undefined


    // Update user fields
    await user.update({
      username,
      firstName: name,
      email,
      heightFeet: height,
      weight,
      fitnessGoal: fitnessGoals,
      experienceLevel,
      profileImage: imagePath,
      bio: bio,
      profileVisibility,
      gender
      // Add any other fields you want to update
    });


      // Handle image upload if provided
      if (req.file) {
        updateFields.profileImage = req.file.path;
      }
  
      // Update only the fields that were provided
      await user.update(updateFields);
      
      // Return updated user (without password)
      const updatedUser = await users.findByPk(id, {
        attributes: { exclude: ['password'] }
      });
      
      res.status(200).json({ 
        message: 'Profile updated successfully',
        data: updatedUser
      });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    let id = req.decoded.id;
    const { oldPassword, newPassword   } = req.body;

    // Validate input
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

     // Password strength validation
     if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 8 characters long'
      });
    }
    

    const user = await users.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    await user.update({ password: hashedPassword });

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// Delete account
const deleteAccount = async (req, res) => {
  try {
    let id = req.decoded.id;

    const user = await users.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }


    // Consider handling related data (cascade deletes or separate cleanup)
    // For example, you might want to delete user workout data, settings, etc.
    // This could be handled by database constraints (ON DELETE CASCADE) or here:
    
    // Example of manual cleanup if needed:
    // await userWorkouts.destroy({ where: { userId: id } });
    // await userSettings.destroy({ where: { userId: id } });

    // Delete the user
    await user.destroy();

    // Clear any active tokens (if you're tracking them in a database)
    // await tokens.destroy({ where: { userId: id } });

    // Return success
    res.status(200).json({ message: 'Account successfully deleted' });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
// Get user stats
const getUserStats = async (req, res) => {
  try {
    const id = req.user.id; // Assuming authentication middleware sets req.user
    const { limit = 10, startDate, endDate } = req.query;

    // Build query conditions
    const where = { id };

    if (startDate && endDate) {
      where.date = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    const stats = await UserStats.findAll({
      where,
      order: [['date', 'DESC']],
      limit: parseInt(limit)
    });

    res.status(200).json(stats);
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create user stats entry
const createUserStats = async (req, res) => {
  try {
    const id = req.user.id; // Assuming authentication middleware sets req.user
    const { weight, bodyFat, totalWorkouts, totalMinutes, totalCaloriesBurned } = req.body;

    // Create new stats entry
    const stats = await UserStats.create({
      id,
      date: new Date(),
      weight,
      bodyFat,
      totalWorkouts,
      totalMinutes,
      totalCaloriesBurned
    });

    // Update user's current weight if provided
    if (weight) {
      await User.update({ weight }, { where: { id: id } });
    }

    res.status(201).json(stats);
  } catch (error) {
    console.error('Error creating user stats:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


module.exports = {
  register,
  login,
  user_forgotPassword,
  resetPassword,
  getUserProfile,
  updateUserProfile,
  changePassword,
  deleteAccount,

}


