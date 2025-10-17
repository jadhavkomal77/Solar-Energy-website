const express = require("express");
const router = express.Router();
const { createContact, getAllContacts, deleteContact } = require("../controller/contactController");
const auth = require("../middleware/auth");

// Public
router.post("/", createContact);

// Admin protected
router.get("/", auth, getAllContacts);
router.delete("/:id", auth, deleteContact);

module.exports = router;
