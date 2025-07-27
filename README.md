# WiFi File Sharing Application

A modern, responsive file sharing application that allows you to share files across devices connected to the same WiFi network.

## Features

- 📁 **Easy File Upload**: Drag & drop or click to select multiple files
- 📱 **Cross-Device Access**: Access from any device on the same WiFi network
- 📊 **Real-time Updates**: Live updates when files are uploaded/deleted
- 🔗 **QR Code Access**: Generate QR codes for easy mobile access
- 📥 **Direct Downloads**: Download files with original names
- 🗑️ **File Management**: Delete files when no longer needed
- 📈 **Statistics**: View total files and storage usage
- 🔄 **Real-time Sync**: Socket.IO for instant updates across devices

## Installation

1. **Clone or create the project directory:**
   ```bash
   mkdir file-sharing-app
   cd file-sharing-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the server:**
   ```bash
   npm start
   ```

   For development with auto-restart:
   ```bash
   npm run dev
   ```

## Usage

1. **Start the server** and note the IP addresses shown in the console
2. **Access the application:**
   - From the same computer: `http://localhost:3000`
   - From other devices: `http://YOUR_LOCAL_IP:3000`
3. **Generate QR code** for easy mobile access
4. **Upload files** by dragging & dropping or clicking "Choose Files"
5. **Download files** from any connected device
6. **Delete files** when no longer needed

## API Endpoints

- `GET /` - Main application interface
- `POST /upload` - Upload files (multipart/form-data)
- `GET /files` - Get list of all uploaded files
- `GET /download/:filename` - Download a specific file
- `DELETE /delete/:filename` - Delete a specific file
- `GET /qr` - Generate QR code for network access

## Technical Details

### Backend (Node.js)
- **Express.js** - Web framework
- **Multer** - File upload handling
- **Socket.IO** - Real-time communication
- **QRCode** - QR code generation
- **CORS** - Cross-origin resource sharing

### Frontend
- **Vanilla JavaScript** - No framework dependencies
- **Socket.IO Client** - Real-time updates
- **Modern CSS** - Responsive design with gradients and animations
- **Drag & Drop API** - Intuitive file uploading

### File Storage
- Files are stored in the `uploads/` directory
- Original filenames are preserved with timestamp prefixes
- File metadata is stored in memory (resets on server restart)

## Configuration

### File Upload Limits
- Maximum file size: 100MB (configurable in `server.js`)
- Maximum files per upload: 10 (configurable)

### Network Configuration
- Default port: 3000 (set via `PORT` environment variable)
- Automatically detects local IP address
- CORS enabled for all origins

## Security Considerations

⚠️ **Important**: This application is designed for local network use only:

- No authentication or authorization
- Files are publicly accessible to anyone on the network
- No encryption of uploaded files
- No user management or access control

**Recommendations for production use:**
- Add user authentication
- Implement file encryption
- Add access controls and permissions
- Use HTTPS with proper certificates
- Implement rate limiting
- Add virus scanning for uploaded files

## Troubleshooting

### Common Issues

1. **Cannot access from other devices:**
   - Ensure all devices are on the same WiFi network
   - Check firewall settings
   - Verify the IP address is correct

2. **File upload fails:**
   - Check file size (must be under 100MB)
   - Ensure sufficient disk space
   - Check file permissions on uploads directory

3. **QR code not generating:**
   - Ensure the server can detect your local IP
   - Check if you're connected to a WiFi network

### Port Issues
If port 3000 is already in use:
```bash
PORT=8080 npm start
```

## Development

### Project Structure
```
file-sharing-app/
├── package.json          # Dependencies and scripts
├── server.js             # Main server file
├── public/
│   └── index.html        # Frontend application
├── uploads/              # Uploaded files storage (created automatically)
└── README.md            # This file
```

### Adding Features
- **Database Integration**: Replace in-memory storage with a database
- **User Authentication**: Add login/register functionality
- **File Encryption**: Encrypt files before storage
- **Thumbnails**: Generate thumbnails for images/videos
- **Search**: Add file search functionality
- **Folders**: Organize files in folders

## License

MIT License - Feel free to modify and distribute.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Enjoy sharing files seamlessly across your WiFi network! 🚀**
