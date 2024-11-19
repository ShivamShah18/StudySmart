import cv2
import dlib

class FrameAnalyzer:
    def __init__(self):
        # Load face detector
        self.detector = dlib.get_frontal_face_detector()

    def detect_exit(self, frame):
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = self.detector(gray)

        # If no faces are detected, the person has left the frame
        return len(faces) == 0
