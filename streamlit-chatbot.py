import streamlit as st
import requests
import json

# Ollama sunucusuna bağlantı
OLLAMA_URL = "http://host.docker.internal:11434/api/chat"
MODEL_NAME = "gemma3:1b"

def get_ollama_response(user_input, chat_history):
    """Ollama API'den yanıt al"""
    try:
        response = requests.post(
            OLLAMA_URL,
            json={
                "model": MODEL_NAME,
                "messages": chat_history + [
                    {"role": "user", "content": user_input}
                ],
                "stream": False
            },
            timeout=120
        )
        
        if response.status_code == 404:
            st.error(f"Model '{MODEL_NAME}' bulunamadı. Lütfen modeli yüklediğinizden emin olun.")
            st.code("docker exec -it chatbot-streamlit-ollama-1 ollama pull gemma3:1b")
            return None
            
        response.raise_for_status()
        return response.json()

    except requests.exceptions.ConnectionError:
        st.error("Ollama sunucusuna bağlanılamıyor. Host makine üzerinde Ollama'nın çalıştığından emin olun.")
    except Exception as e:
        st.error(f"❌ Hata: {str(e)}")
        st.error("API Yanıtı:", response.text if 'response' in locals() else "Yanıt alınamadı")
    return None

# API endpoint için yeni yapı
def handle_chat_request():
    if st.query_params.get("api") == "true":
        try:
            user_input = st.query_params.get("message", "")
            if user_input:
                response_data = get_ollama_response(user_input, st.session_state.chat_history)
                st.json(response_data)
                return
        except Exception as e:
            st.error(str(e))
            return

# Ana akışı güncelle
st.set_page_config(page_title="Gemma 3 Chatbot", layout="wide")

# API isteği kontrolü
handle_chat_request()

# Normal UI akışı
if "chat_history" not in st.session_state:
    st.session_state.chat_history = [
        {
            "role": "system",
            "content": (
                "Sen detaylı, açıklayıcı, mantıklı ve sadece Türkçe cevaplar veren bir yapay zeka asistanısın. "
                "Kullanıcının sorularına nazik, bilgilendirici ve anlaşılır yanıtlar ver."
            )
        }
    ]

# Kullanıcıdan mesaj al
user_input = st.chat_input("Bir şeyler yaz...")

if user_input:
    with st.spinner("Yanıt bekleniyor..."):
        response_placeholder = st.empty()
        response_data = get_ollama_response(user_input, st.session_state.chat_history)
        
        if response_data and "message" in response_data and "content" in response_data["message"]:
            reply = response_data["message"]["content"]
            response_placeholder.markdown(reply)
            
            st.session_state.chat_history.extend([
                {"role": "user", "content": user_input},
                {"role": "assistant", "content": reply}
            ])
        elif response_data:
            st.error("Beklenmeyen API yanıtı:", response_data)

# Geçmişi göster
for msg in st.session_state.chat_history:
    with st.chat_message(msg["role"]):
        st.markdown(msg["content"])
    for msg in st.session_state.chat_history:
        with st.chat_message(msg["role"]):
            st.markdown(msg["content"])
