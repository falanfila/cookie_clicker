from flask import Flask, jsonify, request
from flask_cors import CORS
from upstash_redis import Redis

app = Flask(__name__)
CORS(app)

# Senin 21:26'daki ekran görüntünden aldığım kesin bilgiler:
URL = "https://pleased-stinkbug-52622.upstash.io"
TOKEN = "Ac20AAIncDJhZmRhZGVkYzcyOTU0NmVjOThjZTc5OTlhNzFjZTYwZThhNTI2MjI="

# Doğrudan bağlantı kuruyoruz
redis = Redis(url=URL, token=TOKEN)

@app.route('/api/leaderboard', methods=['GET', 'POST'])
def handle_leaderboard():
    try:
        if request.method == 'POST':
            new_entry = request.json
            name = new_entry.get('name', 'Adsız Oyuncu')
            score = int(new_entry.get('score', 0))

            # Veritabanına kaydet
            data = redis.get('leaderboard') or []
            if not isinstance(data, list):
                data = []
                
            data = [item for item in data if item.get('name') != name]
            data.append({"name": name, "score": score})
            data.sort(key=lambda x: x.get('score', 0), reverse=True)
            data = data[:10]
            
            redis.set('leaderboard', data)
            return jsonify({"status": "success"}), 200

        # GET isteği: Skorları göster
        leaderboard = redis.get('leaderboard') or []
        if not isinstance(leaderboard, list):
            leaderboard = []
        return jsonify(leaderboard)
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

app = app
