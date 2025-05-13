# Secure Document Sharing Application

A web application for securely storing and sharing government documents with family members. Built with Node.js, Express, MongoDB, and modern web technologies.

## Features

- User authentication (signup/login)
- Secure document upload and storage
- Document sharing with family members
- Role-based access control
- File encryption
- Modern and responsive UI
- Real-time updates

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd secure-doc-share
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
MONGODB_URI=mongodb://localhost:27017/secure-doc-share
JWT_SECRET=your-secret-key
PORT=5000
```

4. Create the uploads directory:
```bash
mkdir uploads
```

## Running the Application

1. Start the development server:
```bash
npm run dev
```

2. Open your browser and navigate to `http://localhost:5000`

## Project Structure

```
secure-doc-share/
├── models/
│   ├── User.js
│   └── Document.js
├── routes/
│   ├── auth.js
│   └── documents.js
├── public/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── app.js
│   │   ├── auth.js
│   │   └── documents.js
│   └── index.html
├── uploads/
├── server.js
├── package.json
└── README.md
```

## Security Features

- Password hashing using bcrypt
- JWT-based authentication
- File encryption for stored documents
- Role-based access control
- Secure file upload validation
- XSS protection
- CORS configuration

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - User login
- GET `/api/auth/verify` - Verify JWT token

### Documents
- POST `/api/documents/upload` - Upload new document
- GET `/api/documents/my-documents` - Get user's documents
- GET `/api/documents/shared-with-me` - Get shared documents
- POST `/api/documents/share/:documentId` - Share document
- DELETE `/api/documents/:documentId` - Delete document

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. "# TitleSecure-Share-Govt-Document-with-Family-Members" 
