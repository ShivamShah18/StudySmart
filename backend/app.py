from flask import Flask, render_template
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

@app.route('/')
def index():
    return render_template("index.html")
if __name__ == "__main__":
    app.run(host = "0.0.0.0", port = 5000, debug = True)