# focus_calculator.py

def calculate_focus(eye_focus, phone, hand_movements, talk, get_up):
    """
    Calculate the percentage of time someone stays focused during their study session.

    Parameters:
        eye_focus (float): Percentage of time eyes are focused on the task (0-100).
        phone (float): Percentage of time spent using the phone (0-100).
        hand_movements (float): Percentage of time hands are moving unrelated to the task (0-100).
        talk (float): Percentage of time spent talking (0-100).
        get_up (float): Percentage of time spent out of frame (0-100).

    Returns:
        float: Calculated focus percentage (0-100).
    """
    # Weights for each feature
    weights = {
        "eye_focus": 0.5,  # Positive contribution
        "hand_movements": -0.1,  # Negative contribution
        
    }

    # Calculate focus based on the formula
    focus = (
        weights["eye_focus"] * eye_focus +
        weights["phone"] * (100 - phone) +  # Subtract phone use from focus
        weights["hand_movements"] * (100 - hand_movements) +
        weights["talk"] * (100 - talk) +
        weights["get_up"] * (100 - get_up)
    )

    # Ensure the focus percentage is between 0 and 100
    focus = max(0, min(100, focus))
    return focus


if __name__ == "__main__":
    # Example inputs
    eye_focus = 80.0  # Example: 80% of the session eyes are focused
    phone = 10.0      # Example: 10% of the session spent on phone
    hand_movements = 15.0  # Example: 15% of the session hands are moving
    talk = 5.0        # Example: 5% of the session spent talking
    get_up = 10.0     # Example: 10% of the session spent out of frame

    # Calculate focus
    focus_percentage = calculate_focus(eye_focus, phone, hand_movements, talk, get_up)

    print(f"Focus Percentage: {focus_percentage:.2f}%")
