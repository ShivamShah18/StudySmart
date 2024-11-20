import io
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np

# Directory to save the graph image
GRAPH_OUTPUT_PATH = "static"

def calculate_focus_score(blink_rate, hand_absence_rate):
    """
    Calculate the focus score based on blink rate and hand absence rate.
    """
    focus_score = 1  # Start with a perfect focus score of 1

    # Decrease focus score proportionally
    focus_score -= 0.5 * (blink_rate / 20)  # Normalize blink rate (baseline: 20 blinks/min)
    focus_score -= 0.5 * (hand_absence_rate / 10)  # Normalize hand absence rate (baseline: 10 absences/min)

    # Ensure the score is within 0 and 1
    return max(0, min(focus_score, 1))


def generate_focus_data(session_duration, blink_count, hand_absent_count):
    """
    Generate focus level data at regular intervals.
    """
    if session_duration <= 0:
        return {"message": "No session data available."}

    intervals = np.arange(0, session_duration, 5)  # 5-second intervals
    focus_scores = []
    for t in intervals:
        # Calculate blink and hand absence rates
        blinks_per_minute = (blink_count / session_duration) * 60
        hand_absences_per_minute = (hand_absent_count / session_duration) * 60

        # Compute the focus score
        focus_score = calculate_focus_score(blinks_per_minute, hand_absences_per_minute)
        focus_scores.append(focus_score)

    return intervals, focus_scores




def generate_focus_data(session_duration, blink_count, hand_absent_count):
    """
    Generate intervals and focus scores based on session data.

    Args:
        session_duration (int): Total duration of the session in seconds.
        blink_count (list): List of blink counts for each 5-second interval.
        hand_absent_count (list): List of counts of "hands absent" for each 5-second interval.

    Returns:
        intervals (list): Time intervals in seconds.
        focus_scores (list): Calculated focus scores for each interval.
    """
    # Calculate the number of intervals (5 seconds each)
    num_intervals = session_duration // 5

    # Generate intervals (start time of each 5-second interval)
    intervals = [i * 5 for i in range(num_intervals)]

    # Ensure blink_count and hand_absent_count are the same length as intervals
    if len(blink_count) != num_intervals or len(hand_absent_count) != num_intervals:
        raise ValueError("blink_count and hand_absent_count must match the number of intervals.")

    # Calculate focus scores (example formula)
    focus_scores = [
        max(0, 100 - (blinks * 2 + hands_absent * 5))  # Adjust weights as needed
        for blinks, hands_absent in zip(blink_count, hand_absent_count)
    ]

    return intervals, focus_scores

def plot_focus_graph(sessionScoreList):
    """
    Generate the focus graph from a session score list and return it as a byte stream.

    Args:
        sessionScoreList (list): List of focus scores for each 5-second interval.

    Returns:
        BytesIO: A byte stream of the generated plot.
    """
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