# E-Nagarpalika - Digital Municipal Services Platform

![E-Nagarpalika](https://img.shields.io/badge/E--Nagarpalika-Digital%20Municipal%20Services-blue)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-LTS-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

A modern digital platform for streamlining municipal services, enabling citizens to access and manage their municipal requirements efficiently.

## 🌟 Features

- **User Authentication**
  - Secure login and registration system
  - Role-based access control (Citizen, Officer, Admin)
  - Session management

- **Application Management**
  - Submit new applications
  - Track application status
  - View application history
  - Real-time status updates

- **Dashboard**
  - Officer dashboard for application processing
  - Citizen dashboard for application tracking
  - Analytics and reporting

- **Modern UI/UX**
  - Responsive design
  - Dark/Light mode support
  - Intuitive navigation
  - Real-time notifications

## 🚀 Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- React Router
- Axios
- Lucide Icons

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- RESTful API

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## 🛠️ Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/e-nagarpalika.git
cd e-nagarpalika
```

2. Install dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Environment Setup
```bash
# In backend directory
cp .env.example .env
# Update the .env file with your configuration
```

4. Start the development servers
```bash
# Start backend server (from backend directory)
npm run dev

# Start frontend server (from frontend directory)
npm run dev
```

## 🔧 Configuration

### Backend Environment Variables
```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

### Frontend Configuration
Update the API endpoint in `frontend/src/config.js` if needed.

## 📱 Usage

1. **Citizen Access**
   - Register/Login to your account
   - Submit new applications
   - Track application status
   - View application history

2. **Officer Access**
   - Login to officer dashboard
   - Process pending applications
   - Update application status
   - Add remarks and comments

3. **Admin Access**
   - Manage users and roles
   - View system analytics
   - Configure system settings

## 🧪 Testing

```bash
# Run backend tests
cd backend
npm test

# Run frontend tests
cd frontend
npm test
```

## 📦 Deployment

### Backend Deployment
1. Build the application
```bash
cd backend
npm run build
```

2. Start the production server
```bash
npm start
```

### Frontend Deployment
1. Build the application
```bash
cd frontend
npm run build
```

2. Deploy the `dist` folder to your hosting service

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.



## 🙏 Acknowledgments

- Thanks to all contributors who have helped shape this project

