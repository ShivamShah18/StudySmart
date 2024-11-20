import math

def calculate_focus_score(blink_count, hand_absent_count):
    """
    Calculates the focus score based on blink count and hand absence count.

    Args:
        blink_count (int): Number of blinks detected during the session.
        hand_absent_count (int): Number of frames where the hand was absent.

    Returns:
        float: The focus score as a percentage (0.0 to 1.0).
    """
    # Define weights for each metric
    BLINK_WEIGHT = 0.4  # Blinks contribute 40% to the focus score
    HAND_ABSENCE_WEIGHT = 0.6  # Hand absence contributes 60% to the focus score

    # Normalize blink count and hand absence count to a scale of 0 to 1
    max_blinks = 20  # Assume 20 blinks is the maximum normal blink count
    max_hand_absence = 10  # Assume 10 frames is the maximum acceptable absence

    normalized_blinks = max(0, 1 - (blink_count / max_blinks))
    normalized_hand_absence = max(0, 1 - (hand_absent_count / max_hand_absence))

    # Calculate weighted focus score
    focus_score = (
        (normalized_blinks * BLINK_WEIGHT) +
        (normalized_hand_absence * HAND_ABSENCE_WEIGHT)
    )

    # Clamp focus score to a range of 0 to 1
    return min(max(focus_score, 0.0), 1.0)

def calculate_session_average(focus_scores):
    """
    Calculates the average focus score for a session.

    Args:
        focus_scores (list of float): List of focus scores recorded during the session.

    Returns:
        float: The average focus score for the session.
    """
    if not focus_scores:
        return 0.0
    return sum(focus_scores) / len(focus_scores)

def classify_focus_level(focus_score):
    """
    Classifies the focus level based on the focus score.

    Args:
        focus_score (float): The focus score as a percentage (0.0 to 1.0).

    Returns:
        str: A description of the focus level (e.g., "High", "Medium", "Low").
    """
    if focus_score > 0.8:
        return "High"
    elif focus_score > 0.5:
        return "Medium"
    else:
        return "Low"
