# Use an official Python image as the base image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Install required system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    libopenblas-dev \
    liblapack-dev \
    libx11-dev \
    libgtk-3-dev \
    libstdc++6 \
    python3-dev \
    wget \
    && rm -rf /var/lib/apt/lists/*

# Alternatively, install the latest version of CMake if apt-get's version is too old
RUN wget https://github.com/Kitware/CMake/releases/download/v3.27.0/cmake-3.27.0-linux-x86_64.sh \
    && chmod +x cmake-3.27.0-linux-x86_64.sh \
    && ./cmake-3.27.0-linux-x86_64.sh --skip-license --prefix=/usr/local \
    && rm cmake-3.27.0-linux-x86_64.sh

# Verify cmake installation
RUN cmake --version

# Install Python dependencies
COPY requirements.txt /app/requirements.txt
RUN pip install -U pip wheel cmake
RUN pip install --no-cache-dir -r requirements.txt

# Copy application files
COPY . /app

# Expose the port the Flask app runs on
EXPOSE 5000

# Define the command to run the application
CMD ["python", "app.py"]