# ShambaSmart AI Service

This is a lightweight Flask microservice that provides mock AI-driven crop recommendations based on soil and weather data.

## 🚀 Run locally

```bash
pip install -r requirements.txt
python app.py
```

Then test it:
```bash
curl -X POST http://localhost:8000/api/analyze -H "Content-Type: application/json" -d '{"ph": 6.2, "nitrogen": 0.4, "rainfall": 700}'
```
