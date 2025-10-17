const Contact = require("../module/Contact");

// Submit contact form (public)
exports.createContact = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: "Name, email and message are required." });
    }

    const contact = await Contact.create({ name, email, phone, message });
    res.status(201).json({ success: true, message: "Message submitted successfully.", data: contact });
  } catch (error) {
    console.error("Contact form error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// Fetch all contact entries (admin only)
exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: contacts.length, data: contacts });
  } catch (error) {
    console.error("Fetch contacts error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// Delete a contact (admin only)
exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) return res.status(404).json({ success: false, message: "Contact not found." });

    res.status(200).json({ success: true, message: "Contact deleted successfully." });
  } catch (error) {
    console.error("Delete contact error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};
