const express = require('express');
const router = express.Router();
const multer = require('multer');
const crypto = require('crypto');
const path = require('path');
const Document = require('../models/Document');
const User = require('../models/User');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.jpg', '.jpeg', '.png'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// Middleware to verify JWT token
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findOne({ _id: decoded.userId });
    
    if (!user) {
      throw new Error();
    }
    
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Please authenticate' });
  }
};

// Upload document
router.post('/upload', auth, upload.single('document'), async (req, res) => {
  try {
    const { title, description, documentType } = req.body;
    const file = req.file;

    // Generate encryption key
    const encryptionKey = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);

    // Create new document
    const document = new Document({
      title,
      description,
      documentType,
      fileUrl: file.path,
      encryptedKey: encryptionKey.toString('hex'),
      owner: req.user._id
    });

    await document.save();
    res.status(201).json(document);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's documents
router.get('/my-documents', auth, async (req, res) => {
  try {
    const documents = await Document.find({ owner: req.user._id });
    res.json(documents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Share document
router.post('/share/:documentId', auth, async (req, res) => {
  try {
    const { email, accessLevel } = req.body;
    const document = await Document.findById(req.params.documentId);

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    if (document.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const sharedUser = await User.findOne({ email });
    if (!sharedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    document.sharedWith.push({
      user: sharedUser._id,
      accessLevel
    });

    await document.save();
    res.json(document);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get shared documents
router.get('/shared-with-me', auth, async (req, res) => {
  try {
    const documents = await Document.find({
      'sharedWith.user': req.user._id
    }).populate('owner', 'name email');
    res.json(documents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 