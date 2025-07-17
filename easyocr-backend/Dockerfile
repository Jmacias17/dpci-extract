FROM python:3.11-slim

WORKDIR /app
COPY . .

# Install dependencies
RUN apt-get update && apt-get install -y build-essential libgl1-mesa-glx libglib2.0-0 libsm6 libxext6 libxrender-dev \
 && rm -rf /var/lib/apt/lists/*
RUN pip install --no-cache-dir --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# Limit to 1 worker
ENV WEB_CONCURRENCY=1

# Run
CMD exec gunicorn --workers 1 --threads 1 --timeout 0 -b 0.0.0.0:$PORT app:app
