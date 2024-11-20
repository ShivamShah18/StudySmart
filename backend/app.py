from flask import Flask
from flask_cors import CORS
from routes import timer_blueprint, detection_blueprint, video_blueprint, graph_blueprint
import os
# Initialize Flask app
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Register Blueprints
app.register_blueprint(timer_blueprint, url_prefix='/timer')
app.register_blueprint(detection_blueprint, url_prefix='/detection')
app.register_blueprint(video_blueprint, url_prefix='/video')
app.register_blueprint(graph_blueprint, url_prefix='/graph')

if __name__ == "__main__":
    app.run(port=os.getenv("PORT", default=5000))