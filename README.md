# Gemma 3 Chatbot (Streamlit + Ollama)

Bu proje, Ollama üzerinde çalışan `gemma3:1b` modelini kullanarak Streamlit tabanlı bir yapay zeka sohbet uygulamasıdır. Kullanıcıdan gelen mesajları analiz eder, anlamlı cevaplar üretir ve yanıtları sohbet arayüzünde gösterir.

---

## Özellikler

- 📦 Ollama ile yerel LLM çalıştırma
- 🧠 `gemma3:1b` modeliyle Türkçe destekli chatbot
- 🖥️ Streamlit arayüzü ile kolay kullanım
- 💬 Chat geçmişini korur, bağlamlı cevaplar üretir
- ⚙️ API çağrısı üzerinden de erişilebilir (`?api=true&message=`)

---

## 🛠 Gereksinimler

- Docker (Ollama ve/veya Streamlit için)
- Python 3.10+
- [Ollama](https://ollama.com) (lokal model çalıştırmak için)

---

##  Kurulum

1. Ollama'yı indir ve başlat:

```bash
ollama run gemma3:1b
