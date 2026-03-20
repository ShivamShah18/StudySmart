# StudySmart Setup Instructions

## Quick Start Guide

### Prerequisites
- **Node.js** (v16+) and npm
- **Python** (v3.8+) and pip
- **Docker** and **Docker Compose** (optional, for containerized setup)
- **Git**

---

## Option 1: Local Development Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/ShivamShah18/StudySmart.git
cd StudySmart
```

### Step 2: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create a virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate

# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create a .env file with your configuration
cp .env.example .env

# Create logs directory
mkdir -p logs
```

### Step 3: Download ML Models

The backend requires the dlib shape predictor model for face landmark detection:

1. Download: https://github.com/davisking/dlib-models/raw/master/shape_predictor_68_face_landmarks.dat.bz2
2. Extract the file
3. Place `shape_predictor_68_face_landmarks.dat` in `backend/models/`

### Step 4: Start the Backend Server

```bash
# From the backend directory (with venv activated)
python app.py
```

Expected output: `Running on http://0.0.0.0:5000`

### Step 5: Frontend Setup (New Terminal)

```bash
# Navigate to frontend directory from the root
cd new-app

# Install dependencies
npm install

# Create .env.local file with configuration
cd ..
cat > new-app/.env.local << EOF
REACT_APP_API_BASE_URL=http://localhost:5000
REACT_APP_ENV=development
EOF

# Start the frontend development server
cd new-app
npm start
```

Expected: Browser opens to `http://localhost:3000`

---

## Option 2: Docker Compose Setup (Recommended)

### Prerequisites
- Docker and Docker Compose installed

### Setup Steps

```bash
# From the root directory
cd StudySmart

# Build and start containers
docker-compose up --build

# In another terminal, download the ML model
# (Or add it to backend/models/ before running docker-compose)
```

Access the app at `http://localhost:3000`

---

## Configuration

### Backend Configuration (.env)

```env
FLASK_ENV=development
FLASK_DEBUG=True
HOST=0.0.0.0
PORT=5000
CORS_ORIGINS=http://localhost:3000
LOG_LEVEL=INFO
```

### Frontend Configuration (.env.local)

```env
REACT_APP_API_BASE_URL=http://localhost:5000
REACT_APP_ENV=development
```

---

## Environment Setup

### Windows Troubleshooting

1. **Python not found**
   ```bash
   # Install Python from python.org or use Windows Store
   # Add Python to PATH
   ```

2. **Virtual environment activation**
   ```bash
   # Use this instead:
   python -m venv venv
   venv\Scripts\activate
   ```

3. **Port already in use**
   ```bash
   # Change PORT in backend/.env or use:
   lsof -i :5000  # Find process on port 5000
   kill -9 <PID>
   ```

### macOS/Linux Troubleshooting

1. **Permission denied**
   ```bash
   chmod +x venv/bin/activate
   ```

2. **cmake build issues**
   ```bash
   # Install via homebrew
   brew install cmake
   ```

---

## Verifying the Setup

### Backend Health Check

```bash
curl http://localhost:5000/health
# Expected response: {"status": "healthy"}
```

### Frontend Health Check

1. Open `http://localhost:3000`
2. You should see the StudySmart dashboard
3. All components should load without console errors

---

## Troubleshooting

### Backend Issues

**Error: `shape_predictor_68_face_landmarks.dat` not found**
- Download from: https://github.com/davisking/dlib-models/raw/master/shape_predictor_68_face_landmarks.dat.bz2
- Extract and place in `backend/models/`

**Error: `No module named 'dlib'`**
```bash
pip install dlib-bin  # Instead of regular pip install
```

**Port 5000 already in use**
```bash
# Backend .env:
PORT=5001  # Use different port
# Frontend .env.local:
REACT_APP_API_BASE_URL=http://localhost:5001
```

### Frontend Issues

**Error: Cannot connect to backend**
- Ensure backend is running on the correct URL
- Check `REACT_APP_API_BASE_URL` in `.env.local`
- Check browser console for CORS errors

**Camera not working**
- Grant camera permissions to the browser
- Check HTTPS requirement (localhost http should work)

---

## Development Workflow

### Running Both Services

**Terminal 1 (Backend):**
```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
python app.py
```

**Terminal 2 (Frontend):**
```bash
cd new-app
npm start
```

### Making Changes

- Backend changes require server restart
- Frontend changes hot-reload automatically
- Check browser console for errors

---

## Production Deployment

### Backend Deployment

```bash
# Use gunicorn instead of Flask dev server
gunicorn --bind 0.0.0.0:5000 --workers 4 app:app

# Or via Docker:
docker build -t studysmart-backend ./backend
docker run -p 5000:5000 studysmart-backend
```

### Frontend Deployment

```bash
# Build for production
npm run build

# Deploy 'build' folder to hosting (Netlify, Vercel, etc.)
```

---

## Additional Resources

- [Flask Documentation](https://flask.palletsprojects.com/)
- [React Documentation](https://react.dev/)
- [dlib Documentation](http://dlib.net/python/index.html)
- [OpenCV Documentation](https://docs.opencv.org/)

---

## Getting Help

- Check existing GitHub issues
- Create a new issue with detailed error messages
- Include system info (OS, Python version, Node version)

---

*Last Updated: March 2026*
