# StudySmart 🎯

**StudySmart** is a comprehensive productivity web application designed to help students and professionals manage tasks, track focus time, and monitor study sessions through live video analysis. Combining intelligent task management, real-time focus monitoring, and advanced focus tracking with AI-powered computer vision.

**Live Demo**: https://studysmartapp.netlify.app/

---

## ✨ Features

### 📝 Task Management
- **Add, edit, and delete tasks** - Intuitive task list interface with persistent storage
- **Task completion tracking** - Mark tasks complete and track progress visually
- **Auto-sorting** - Completed tasks are grayed out for easy distinction
- **Local storage** - Tasks persist across sessions

### ⏱️ Focus Timer
- **Customizable focus sessions** - Set focus periods (Pomodoro-style sessions)
- **Full timer controls** - Start, pause, reset, and stop with intuitive buttons
- **Real-time display** - View elapsed time in an easy-to-read format
- **Session tracking** - Monitor total focus time across sessions

### 📹 Live Video Monitoring
- **Real-time camera feed** - Monitor your workspace during study sessions
- **Face detection** - Detect if you're actively studying
- **Blink detection** - Track focus level through eye tracking
- **Hand absence tracking** - Get notified when hands leave keyboard/desk

### 📊 Focus Analytics
- **Focus score calculation** - AI-powered focus level scoring (0-100%)
- **Session statistics** - Track face detection, blinks, and hand presence
- **Focus graph** - Visual representation of focus trends
- **Performance metrics** - Detailed session analysis

---

## 🚀 Installation

### Prerequisites
- **Node.js** (v16+) and npm
- **Python** (v3.8+) and pip
- **FFmpeg** (for video processing)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

2. Download required models:
   ```bash
   # Download dlib shape predictor model (required for face landmarks)
   # Place in backend/models folder
   ```

3. Start the backend server:
   ```bash
   python app.py
   ```
   The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd new-app
   npm install
   ```

2. Create a `.env.local` file in `new-app/` directory:
   ```env
   REACT_APP_API_BASE_URL=http://localhost:5000
   ```

3. Start the development server:
   ```bash
   npm start
   ```
   The app will run on `http://localhost:3000`

---

## 📋 Project Structure

```
StudySmart/
├── backend/                 # Python Flask backend
│   ├── app.py              # Main Flask application
│   ├── routes/             # API endpoints
│   │   ├── timer.py        # Timer management
│   │   ├── video.py        # Video processing
│   │   ├── detection.py    # Detection state
│   │   └── graph.py        # Analytics graphs
│   ├── algo/               # Focus algorithms
│   ├── utils/              # Utility functions
│   ├── models/             # ML models
│   └── requirements.txt    # Python dependencies
│
├── new-app/                # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── App.js          # Main app component
│   │   └── App.css         # Styling
│   ├── public/             # Static assets
│   ├── package.json        # Node dependencies
│   └── .env.local         # Environment variables
│
└── README.md              # This file
```

---

## 🔧 API Endpoints

### Timer Endpoints
- `POST /timer/start` - Start the focus timer
- `POST /timer/stop` - Stop the timer
- `GET /timer/time` - Get elapsed time
- `POST /timer/reset` - Reset timer and detection state

### Detection Endpoints
- `GET /detection/state` - Get current detection state (face, blinks, hands)

### Video Endpoints
- `POST /video/process` - Send frame for analysis

### Graph Endpoints
- `GET /graph/focus` - Generate focus score graph

---

## 🛠️ Development

### Running Locally with Docker Compose

```bash
docker-compose up
```

### Available npm Scripts (Frontend)
```bash
npm start       # Start development server
npm build       # Build for production
npm test        # Run tests
npm eject       # Eject from create-react-app
```

### Backend Development
```bash
python app.py                    # Run with debug mode
python -m pytest tests/          # Run tests
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👨‍💻 Authors

- **Tanush Srivastava**
- **ShivamShah18**

---

## 🐛 Known Issues & Future Improvements

- [ ] Add user authentication
- [ ] Implement data persistence (database)
- [ ] Add more granular focus metrics
- [ ] Mobile app optimization
- [ ] Real-time notifications
- [ ] Export session reports
- [ ] Dark mode support
- [ ] Offline mode support

---

## 📞 Support

For issues and questions, please open an issue on GitHub or contact the development team.

---

*Last updated: March 2026*

