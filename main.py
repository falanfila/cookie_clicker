from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/leaderboard')
def get_leaderboard():
    # Liste şu an boş, kimse skor kaydetmedi
    data = [] 
    return jsonify(data)

if __name__ == "__main__":
    app.run(debug=True)
