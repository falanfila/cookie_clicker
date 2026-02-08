from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Skorları geçici olarak tutacak liste (Vercel her kapandığında sıfırlanır)
# Kalıcı olması için ileride veritabanı bağlarız.
leaderboard_data = []

@app.route('/api/leaderboard', methods=['GET', 'POST'])
def handle_leaderboard():
    global leaderboard_data
    
    if request.method == 'POST':
        new_data = request.json
        # Aynı isimle gelen eski skoru varsa silelim (Güncelleme yapmak için)
        leaderboard_data = [item for item in leaderboard_data if item['name'] != new_data['name']]
        
        # Yeni veriyi ekle
        leaderboard_data.append(new_data)
        
        # Skorları büyükten küçüğe sırala
        leaderboard_data.sort(key=lambda x: x['score'], reverse=True)
        
        return jsonify({"status": "success"}), 200

    # GET isteği gelirse en iyi 10 kişiyi gönder
    return jsonify(leaderboard_data[:10])
