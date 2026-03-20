from flask import Blueprint, send_file
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from routes.detection import detection_state
import io
import logging

logger = logging.getLogger(__name__)

graph_blueprint = Blueprint('graph', __name__)

@graph_blueprint.route('/focus', methods=['GET'])
def plot_focus_graph():
    """
    Generate the focus graph from a session score list and return it as a byte stream.

    Returns:
        Response: A PNG image of the focus score graph
    """
    try:
        global detection_state 
        sessionScoreList = detection_state.get("sessionScoreList", [100, 100])
        
        if not sessionScoreList or len(sessionScoreList) < 2:
            logger.warning("Insufficient data for graph generation")
            return {'error': 'Insufficient data for graph'}, 400
        
        # Generate the x-axis (time in seconds) based on the length of sessionScoreList
        intervals = [i * 5 for i in range(len(sessionScoreList))]
        
        # Create figure and plot
        fig, ax = plt.subplots(figsize=(10, 6))
        ax.plot(intervals, sessionScoreList, label="Focus Score", color="#005ea6", linewidth=2, marker='o')
        ax.fill_between(intervals, sessionScoreList, alpha=0.3, color="#005ea6")
        ax.set_xlabel("Time (seconds)", fontsize=12)
        ax.set_ylabel("Focus Score (%)", fontsize=12)
        ax.set_title("Focus Score Over Time", fontsize=14, fontweight='bold')
        ax.grid(True, alpha=0.3)
        ax.legend(fontsize=10)
        ax.set_ylim([0, 105])
        
        # Add styling
        fig.patch.set_facecolor('white')
        
        # Save the plot to a BytesIO stream
        buf = io.BytesIO()
        plt.savefig(buf, format='png', dpi=100, bbox_inches='tight')
        buf.seek(0)  # Rewind the buffer to the beginning
        plt.close(fig)
        
        logger.info("Focus graph generated successfully")
        
        return send_file(
            buf,
            mimetype='image/png',
            as_attachment=False,
            download_name='focus_graph.png'
        )
        
    except Exception as e:
        logger.error(f"Error generating focus graph: {str(e)}")
        return {'error': 'Failed to generate graph'}, 500
