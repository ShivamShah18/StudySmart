import matplotlib.pyplot as plt
import numpy as np
import os

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


import io
from flask import Flask, jsonify, send_file

def plot_focus_graph(session_duration, blink_count, hand_absent_count):
    """
    Generate the focus graph and return it as a byte stream.
    """
    intervals, focus_scores = generate_focus_data(session_duration, blink_count, hand_absent_count)
    plt.figure(figsize=(10, 6))
    plt.plot(intervals, focus_scores, label="Focus Score", color="blue")
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