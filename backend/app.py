import os
import logging
from flask import Flask, render_template
from flask_cors import CORS
from dotenv import load_dotenv
from routes import timer_blueprint, detection_blueprint, video_blueprint, graph_blueprint

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=os.getenv('LOG_LEVEL', 'INFO'),
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(os.getenv('LOG_FILE', 'logs/app.log')),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__, template_folder=os.path.join(os.path.dirname(__file__), 'templates'))

# Configure CORS
cors_origins = os.getenv('CORS_ORIGINS', '*').split(',')
CORS(app, resources={r"/*": {"origins": cors_origins}})

# Configure app settings
app.config['JSON_SORT_KEYS'] = False
app.config['PROPAGATE_EXCEPTIONS'] = True

# Register Blueprints
app.register_blueprint(timer_blueprint, url_prefix='/timer')
app.register_blueprint(detection_blueprint, url_prefix='/detection')
app.register_blueprint(video_blueprint, url_prefix='/video')
app.register_blueprint(graph_blueprint, url_prefix='/graph')

# Error handlers
@app.errorhandler(400)
def bad_request(error):
    logger.warning(f"Bad request: {error}")
    return {'error': 'Bad request'}, 400

@app.errorhandler(404)
def not_found(error):
    logger.warning(f"Not found: {error}")
    return {'error': 'Endpoint not found'}, 404

@app.errorhandler(500)
def internal_error(error):
    logger.error(f"Internal server error: {error}")
    return {'error': 'Internal server error'}, 500

@app.route('/')
def index():
    logger.info("Serving index page")
    return render_template("index.html")

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint for monitoring"""
    return {'status': 'healthy'}, 200

if __name__ == "__main__":
    host = os.getenv('HOST', '0.0.0.0')
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'
    
    logger.info(f"Starting StudySmart backend on {host}:{port}")
    app.run(host=host, port=port, debug=debug)