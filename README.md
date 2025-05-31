# Buzzerio 🚨

An interactive online buzzer platform that brings the excitement of game shows and competitive quizzes to your digital space. Create rooms, invite participants, and enjoy real-time buzzer-based games with friends, colleagues, or students.

## 🎯 Features

- **Real-time Room Creation**: Host buzzer games instantly with unique room codes
- **Multi-participant Support**: Multiple users can join and compete simultaneously
- **Google Authentication**: Secure login with Google OAuth integration
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **Admin Controls**: Room hosts can manage participants and game flow
- **Real-time Synchronization**: Lightning-fast buzzer responses using WebSocket technology
- **Email Notifications**: Automated notifications for room invitations and updates
- **Cross-platform Compatibility**: Access from any modern web browser

## 📁 Project Structure

```
Buzzerio/
├── client/                 # Frontend React application
│   ├── src/               # Source code
│   ├── public/            # Static assets
│   ├── package.json       # Client dependencies
│   └── .env               # Client environment variables
├── server/                # Backend Node.js application
│   ├── routes/            # API endpoints
│   ├── models/            # Database models
│   ├── middleware/        # Custom middleware
│   ├── controllers/       # Route handlers
│   ├── package.json       # Server dependencies
│   └── .env               # Server environment variables
├── README.md              # Project documentation
└── .gitignore             # Git ignore rules
```

## 🚀 Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB database
- Google Developer Console account (for authentication)

### Step 1: Clone the Repository

```bash
git clone https://github.com/shsat94/Buzzerio.git
cd Buzzerio
```

### Step 2: Install Dependencies

**Install server dependencies:**
```bash
cd server
npm install
```

**Install client dependencies:**
```bash
cd ../client
npm install
```

### Step 3: Environment Configuration

Create `.env` files in both client and server directories with the required variables (see Environment Variables section below).

### Step 4: Start the Application

**Start the server (from server directory):**
```bash
node index
```

**Start the client (from client directory, in a new terminal):**
```bash
npm run dev
```

The application will be available at `http://localhost:5173` (client) with the API running on `http://localhost:5994` (server).

## ⚙️ Environment Variables

### Client `.env` File

Create a `.env` file in the `client/` directory:

```env
VITE_API_KEY=your-api-key
VITE_HOST_NAME=http://localhost:5994
VITE_GOOGLE_AUTH=your-google-client-id.googleusercontent.com
```

### Server `.env` File

Create a `.env` file in the `server/` directory:

```env
PORT=5994
MONGO_URI=your-mongodb-connection-string
JWT_AUTHENTICATION_KEY=your-jwt-string
ADMIN_EMAIL=your-admin-email@gmail.com
NODEMAILER_PASSWORD=your-app-password
NODEMAILER_PORT=587
BACKEND_API_KEY=your-api-key
GOOGLE_CLIENT_ID=your-google-client-id.googleusercontent.com
```

## 🔐 Obtaining Required Credentials

### Google Authentication Setup

1. **Go to the Google Developer Console:**
   - Visit [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one

2. **Enable Google+ API:**
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it

3. **Create OAuth 2.0 Credentials:**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:5173` (for development for frontend)
     - `http://localhost:5994` (for development for backend)
     - Your production domain (for deployment)

4. **Copy the Client ID:**
   - Use the generated Client ID for both `GOOGLE_CLIENT_ID` and `VITE_GOOGLE_AUTH`

### Nodemailer Configuration

1. **Enable 2-Factor Authentication:**
   - Go to your Gmail account settings
   - Enable 2-factor authentication

2. **Generate App Password:**
   - Go to "Security" > "App passwords"
   - Generate a new app password for "Mail"
   - Use this password for `NODEMAILER_PASSWORD`

3. **Configure SMTP Settings:**
   - Use Gmail's SMTP server: `smtp.gmail.com`
   - Port: `587` (already configured)
   - Your Gmail address for `ADMIN_EMAIL`

### MongoDB Setup

1. **MongoDB Atlas (Recommended):**
   - Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a new cluster
   - Get connection string for `MONGO_URI`

2. **Local MongoDB:**
   - Install MongoDB locally
   - Use `mongodb://localhost:27017/buzzerio` for `MONGO_URI`

## 🎮 Usage

### Creating a Room

1. **Sign in** with your Google account
2. **Click "Create Room"** on the dashboard
3. **Share the room code** with participants
4. **Start the game** when all participants have joined

### Joining a Room

1. **Sign in** with your Google account
2. **Enter the room code** provided by the host
3. **Wait for the game** to begin
4. **Press your buzzer** when ready to answer

### Game Controls

- **Host Controls**: Start/stop games, manage participants, view responses
- **Participant Actions**: Buzz in, view leaderboard, chat with other players
- **Real-time Updates**: All actions are synchronized across all participants instantly

## 🤝 Contributing

We welcome contributions to Buzzerio! Here's how you can help:

### Getting Started

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** and commit them: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Code Standards

- Follow existing code style and conventions
- Write clear, descriptive commit messages
- Add comments for complex logic
- Test your changes thoroughly before submitting
- Update documentation if necessary

### Issues and Bugs

- Use GitHub Issues to report bugs or request features
- Provide detailed descriptions and steps to reproduce
- Include screenshots or error logs when applicable

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Socket.io** for real-time communication capabilities
- **Google OAuth** for secure authentication services
- **MongoDB** for reliable data storage
- **React** and **Node.js** communities for excellent documentation and support
- **Contributors** who have helped improve this project
- **Open Source Community** for the amazing libraries and tools that made this project possible

## 📞 Support

If you encounter any issues or have questions:

- **GitHub Issues**: [Report bugs or request features](https://github.com/shsat94/Buzzerio/issues)
- **Documentation**: Check this README for setup and usage instructions
- **Community**: Join discussions in the repository's discussion section

---

**Happy Buzzing! 🎉**

Made with ❤️ by the Velociraptor.