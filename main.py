from flask import Flask, jsonify, request
from flask_cors import CORS
from upstash_redis import Redis
import os

app = Flask(__name__)
CORS(app)

# Vercel'in atadığı gizli şifreleri bulur
def get_redis_client():
    # Vercel KV veya Upstash Redis isimlerinden hangisi varsa onu kullanır
    url = os.environ.get("KV_REST_API_URL") or os.environ.get("UPSTASH_REDIS_REST_URL")
    token = os.environ.get("KV_REST_API_TOKEN") or os.environ.get("UPSTASH_REDIS_REST_TOKEN")
    
    if url and token:
        return Redis(url=url, token=token)
    return None

redis = get_redis_client()

@app.route('/api/leaderboard', methods=['GET', 'POST'])
def handle_leaderboard():
    if not redis:
        return jsonify({"error": "Veritabanı bağlantısı henüz hazır değil!"}), 500
        
    try:
        if request.method == 'POST':
            new_entry = request.json
            name = new_entry.get('name', 'Adsız Oyuncu')
            score = int(new_entry.get('score', 0))

            data = redis.get('leaderboard') or []
            data = [item for item in data if item.get('name') != name]
            data.append({"name": name, "score": score})
            
            data.sort(key=lambda x: x.get('score', 0), reverse=True)
            data = data[:10]
            
            redis.set('leaderboard', data)
            return jsonify({"status": "success"}), 200

        leaderboard = redis.get('leaderboard') or []
        return jsonify(leaderboard)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

app = app
