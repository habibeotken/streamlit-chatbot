FROM python:3.11-slim

WORKDIR /app
COPY . .

RUN pip install --no-cache-dir -r requirements.txt

CMD ["streamlit", "run", "streamlit-chatbot.py", "--server.port=8501", "--server.address=0.0.0.0"]
