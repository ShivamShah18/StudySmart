# Use an official Python image as the base image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Install system dependencies required for dlib and OpenCV
RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    libopenblas-dev \
    liblapack-dev \
    libx11-dev \
    libgtk-3-dev \
    libstdc++6 \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements file to the container
COPY StudyNew/backend/requirements.txt /app/requirements.txt

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of your application code into the container
COPY StudyNew/backend /app

# Expose the port your Flask app runs on
EXPOSE 5000

# Define the command to run your app
CMD ["python", "app.py"]
