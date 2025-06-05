# 1️⃣ Base image
FROM python:3.10-slim

# 2️⃣ Set working directory
WORKDIR /app

# 3️⃣ Install system dependencies (needed for mysqlclient)
RUN apt-get update && apt-get install -y \
    gcc \
    python3-dev \
    default-libmysqlclient-dev \
    build-essential \
    pkg-config \
 && apt-get clean

# 4️⃣ Copy only requirements file first (for better caching)
COPY requirements.txt .

# 5️⃣ Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# 6️⃣ Copy everything into container
COPY . .

# 7️⃣ Expose port for Django
EXPOSE 8000

# 8️⃣ Run development server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
