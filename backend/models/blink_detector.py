import cv2
from scipy.spatial import distance as dist



face_cascade = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')
eye_cascade = cv2.CascadeClassifier('haarcascade_righteye_2splits.xml')
class BlinkDetector:
    def __init__(self):
        # Load face and eye cascades
        self.face_cascade = face_cascade
        self.eye_cascade = eye_cascade

        # Blink detection thresholds
        self.counter = 0  # Counter for consecutive frames where eyes are not detected
        self.total_blinks = 0  # Total number of blinks detected
        self.eye_detected = False  # Track if eyes were detected in the previous frame

    def detect(self, frame):
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        # Detect eyes in the current frame
        eyes = self.eye_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

        if len(eyes) > 0:
            self.eye_detected = True
            self.counter = 0  # Reset counter when eyes are detected
            for (ex, ey, ew, eh) in eyes:
                # Optional: Draw rectangle around eyes
                cv2.rectangle(frame, (ex, ey), (ex + ew, ey + eh), (0, 255, 0), 2)
        else:
            # If no eyes are detected but were previously visible, count as a blink
            if self.eye_detected:
                self.total_blinks += 1
                self.eye_detected = False  # Reset the flag

        return self.total_blinks
