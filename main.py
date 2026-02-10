from flask import Flask, jsonify, request
from flask_cors import CORS
from upstash_redis import Redis
import os

app = Flask(__name__)
CORS(app)

# Vercel'in projeye yeni eklediği gizli anahtarları otomatik okur
redis = Redis.from_env()

@app.route('/api/leaderboard', methods=['GET', 'POST'])
def handle_leaderboard():
    try:
        if request.method == 'POST':
            new_entry = request.json
            name = new_entry.get('name', 'Anonymous')
            score = int(new_entry.get('score', 0))

            # Redis'ten mevcut veriyi çek (yoksa boş liste)
            data = redis.get('leaderboard') or []
            
            # Aynı isimli oyuncuyu listeden çıkar (varsa güncellemiş oluyoruz)
            data = [item for item in data if item.get('name') != name]
            data.append({"name": name, "score": score})
            
            # Skorları büyükten küçüğe sırala ve ilk 10'u tut
            data.sort(key=lambda x: x.get('score', 0), reverse=True)
            data = data[:10]
            
            # Veriyi Redis'e geri kaydet
            redis.set('leaderboard', data)
            return jsonify({"status": "success"}), 200

        # GET isteği: Skorları göster
        leaderboard = redis.get('leaderboard') or []
        return jsonify(leaderboard)
        
    except Exception as e:
        print(f"HATA: {e}")
        return jsonify({"error": str(e)}), 500

# Vercel'in uygulamayı tanıması için
app = app
