import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from extensions import mongo, jwt
import requests

load_dotenv()

app = Flask(__name__)
app.config["MONGO_URI"] = os.getenv("MONGO_URI")
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET")

mongo.init_app(app)
jwt.init_app(app)
CORS(app)

# Register blueprints
from auth import auth_bp
from user import user_bp
from investment import investment_bp
from transaction import transaction_bp
from recommendation import recommendation_bp

app.register_blueprint(auth_bp)
app.register_blueprint(user_bp)
app.register_blueprint(investment_bp)
app.register_blueprint(transaction_bp)
app.register_blueprint(recommendation_bp)

if __name__ == "__main__":
    app.run(debug=True, port=5050) 