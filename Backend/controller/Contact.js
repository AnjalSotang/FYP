const { contact } = require("../models")

const addContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Create the new user
    const newContact = await contact.create({ name, email, subject, message });

    return res.status(201).json({
      message: "Message saved successful!",
      data: {
        id: newContact
    },
    });
  } catch (error) {
    console.error("Error during registration:", error.message);
    return res.status(500).json({
      message: "An internal server error occurred. Please try again later.",
    });
  }
};



    module.exports = {
        addContact
    }


