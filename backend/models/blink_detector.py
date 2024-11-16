import cv2
import dlib
from scipy.spatial import distance as dist

class BlinkDetector:
    def __init__(self):
        # Load face detector and facial landmarks predictor
        self.detector = dlib.get_frontal_face_detector()
        self.predictor = dlib.shape_predictor("shape_predictor_68_face_landmarks.dat")

        # Define eye landmarks
        self.LEFT_EYE_POINTS = list(range(36, 42))
        self.RIGHT_EYE_POINTS = list(range(42, 48))
        self.EYE_AR_THRESH = 0.25  # EAR threshold for blink
        self.EYE_AR_CONSEC_FRAMES = 2  # Consecutive frames to count as a blink
        self.counter = 0
        self.total_blinks = 0

    def eye_aspect_ratio(self, eye):
        # Compute EAR (Eye Aspect Ratio)
        A = dist.euclidean(eye[1], eye[5])
        B = dist.euclidean(eye[2], eye[4])
        C = dist.euclidean(eye[0], eye[3])
        return (A + B) / (2.0 * C)

    def detect(self, frame):
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = self.detector(gray)

        for face in faces:
            shape = self.predictor(gray, face)
            shape = [[shape.part(i).x, shape.part(i).y] for i in range(68)]
            left_eye = [shape[i] for i in self.LEFT_EYE_POINTS]
            right_eye = [shape[i] for i in self.RIGHT_EYE_POINTS]

            # Calculate EAR for both eyes
            left_ear = self.eye_aspect_ratio(left_eye)
            right_ear = self.eye_aspect_ratio(right_eye)
            ear = (left_ear + right_ear) / 2.0

            if ear < self.EYE_AR_THRESH:
                self.counter += 1
            else:
                if self.counter >= self.EYE_AR_CONSEC_FRAMES:
                    self.total_blinks += 1
                self.counter = 0

        return self.total_blinks
