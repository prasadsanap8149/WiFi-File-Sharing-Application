const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const QRCode = require('qrcode');
const http = require('http');
const socketIO = require('socket.io');
const os = require('os');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3000;

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Keep original filename with timestamp to avoid conflicts
    const timestamp = Date.now();
    const originalName = file.originalname;
    cb(null, `${timestamp}-${originalName}`);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit
  }
});

// Get local IP address
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const devName in interfaces) {
    const iface = interfaces[devName];
    for (let i = 0; i < iface.length; i++) {
      const alias = iface[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        return alias.address;
      }
    }
  }
  return 'localhost';
}

// Store uploaded files info
let uploadedFiles = [];

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Upload endpoint
app.post('/upload', upload.array('files', 10), (req, res) => {
  try {
    const files = req.files.map(file => ({
      id: Date.now() + Math.random(),
      originalName: file.originalname,
      filename: file.filename,
      size: file.size,
      mimetype: file.mimetype,
      uploadTime: new Date().toISOString()
    }));
    
    uploadedFiles.push(...files);
    
    // Emit to all connected clients
    io.emit('fileUploaded', files);
    
    res.json({
      success: true,
      message: 'Files uploaded successfully',
      files: files
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Upload failed',
      error: error.message
    });
  }
});

// Get all files
app.get('/files', (req, res) => {
  res.json({
    success: true,
    files: uploadedFiles
  });
});

// Download file
app.get('/download/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'uploads', filename);
  
  if (fs.existsSync(filePath)) {
    const fileInfo = uploadedFiles.find(f => f.filename === filename);
    const originalName = fileInfo ? fileInfo.originalName : filename;
    
    res.download(filePath, originalName, (err) => {
      if (err) {
        res.status(500).json({
          success: false,
          message: 'Download failed'
        });
      }
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'File not found'
    });
  }
});

// Delete file
app.delete('/delete/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'uploads', filename);
  
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      uploadedFiles = uploadedFiles.filter(f => f.filename !== filename);
      
      // Emit to all connected clients
      io.emit('fileDeleted', filename);
      
      res.json({
        success: true,
        message: 'File deleted successfully'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Delete failed',
      error: error.message
    });
  }
});

// Generate QR code for easy access
app.get('/qr', async (req, res) => {
  try {
    const localIP = getLocalIP();
    const url = `http://${localIP}:${PORT}`;
    const qrCode = await QRCode.toDataURL(url);
    
    res.json({
      success: true,
      qrCode: qrCode,
      url: url
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'QR code generation failed'
    });
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start server
server.listen(PORT, () => {
  const localIP = getLocalIP();
  console.log('🚀 File Sharing Server Started!');
  console.log('📱 Access from any device on your WiFi network:');
  console.log(`   Local: http://localhost:${PORT}`);
  console.log(`   Network: http://${localIP}:${PORT}`);
  console.log('📋 Scan QR code: GET /qr endpoint');
  console.log('===============================================');
});

module.exports = app;
