from flask import Blueprint, send_file
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from routes.detection import detection_state
import io
graph_blueprint = Blueprint('graph', __name__)

@graph_blueprint.route('/focus', methods=['GET'])
def plot_focus_graph():
    """
    Generate the focus graph from a session score list and return it as a byte stream.

    Args:
        sessionScoreList (list): List of focus scores for each 5-second interval.

    Returns:
        BytesIO: A byte stream of the generated plot.
    """
    global detection_state 
    sessionScoreList = detection_state["sessionScoreList"]
    # Generate the x-axis (time in seconds) based on the length of sessionScoreList
    intervals = [i * 5 for i in range(len(sessionScoreList))]
    
    # Plot the focus scores over time
    plt.figure(figsize=(10, 6))
    plt.plot(intervals, sessionScoreList, label="Focus Score", color="blue")
    plt.xlabel("Time (seconds)")
    plt.ylabel("Focus Score")
    plt.title("Focus Score Over Time")
    plt.grid(True)
    plt.legend()

    # Save the plot to a BytesIO stream
    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)  # Rewind the buffer to the beginning
    plt.close()

    return buf
