from flask import Flask, jsonify, request
from flask_cors import CORS
from upstash_redis import Redis
import os

app = Flask(__name__)
CORS(app)

# Vercel'in projeye bağladığı gizli anahtarları otomatik okur
try:
    redis = Redis.from_env()
except Exception as e:
    print(f"Bağlantı Hatası: {e}")

@app.route('/api/leaderboard', methods=['GET', 'POST'])
def handle_leaderboard():
    try:
        if request.method == 'POST':
            new_entry = request.json
            name = new_entry.get('name', 'Anonymous')
            score = int(new_entry.get('score', 0))

            # Veriyi Redis'ten çek (yoksa boş liste)
            data = redis.get('leaderboard') or []
            
            # Aynı isimli oyuncuyu güncelle
            data = [item for item in data if item['name'] != name]
            data.append({"name": name, "score": score})
            
            # Sırala ve ilk 10'u tut
            data.sort(key=lambda x: x['score'], reverse=True)
            data = data[:10]
            
            # Redis'e geri kaydet
            redis.set('leaderboard', data)
            return jsonify({"status": "success"}), 200

        # Skorları getir
        leaderboard = redis.get('leaderboard') or []
        return jsonify(leaderboard)
        
    except Exception as e:
        # Hata olursa konsola yazdır ki görebilelim
        print(f"Sunucu Hatası: {e}")
        return jsonify({"error": str(e)}), 500

app = app
