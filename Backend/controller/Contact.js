const { contact } = require("../models")
const adminNotificationController = require('./admin/adminNotificationController');


const addContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Create the new user
    const newContact = await contact.create({ name, email, subject, message });

     // Send notification to admin about the new contact submission
     try {
      await adminNotificationController.notifyNewContactSubmission({
        id: newContact.id,
        name: name,
        email: email,
        subject: subject,
        message: message,
      });
      console.log(`Admin notification sent for new contact submission from: ${email}`);
    } catch (notificationError) {
      // Don't let notification errors affect the contact submission process
      console.error("Error sending admin notification:", notificationError);
    }


    return res.status(201).json({
      message: "Message saved successful!",
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


