from flask import Flask, jsonify, request
from flask_cors import CORS
from upstash_redis import Redis

app = Flask(__name__)
CORS(app)

# Vercel'in otomatik eklediği bilgilerle Redis'e bağlanır
redis = Redis.from_env()

@app.route('/api/leaderboard', methods=['GET', 'POST'])
def handle_leaderboard():
    try:
        if request.method == 'POST':
            new_entry = request.json
            name = new_entry.get('name', 'Anonymous')
            score = int(new_entry.get('score', 0))

            # Veritabanından mevcut listeyi çek
            data = redis.get('leaderboard') or []
            
            # Aynı isimde biri varsa eskisini sil, yenisini ekle
            data = [item for item in data if item['name'] != name]
            data.append({"name": name, "score": score})
            
            # Skorları büyükten küçüğe sırala ve en iyi 10'u tut
            data.sort(key=lambda x: x['score'], reverse=True)
            final_data = data[:10]
            
            # Veritabanına kalıcı olarak kaydet
            redis.set('leaderboard', final_data)
            
            return jsonify({"status": "success"}), 200

        # GET isteği: Skorları veritabanından getir
        leaderboard = redis.get('leaderboard') or []
        return jsonify(leaderboard)
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Vercel için gerekli
app = app
