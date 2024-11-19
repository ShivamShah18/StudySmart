import os
import cv2
import numpy as np


class BlinkDetector:
    def __init__(self):
        # Get the absolute path of the current script
        base_path = os.path.dirname(os.path.abspath(__file__))
    
        # Construct absolute paths to the Haar cascade files
        self.face_cascade = cv2.CascadeClassifier(os.path.join(base_path, 'haarcascade_frontalface_default.xml'))
        self.eye_cascade = cv2.CascadeClassifier(os.path.join(base_path, 'haarcascade_righteye_2splits.xml'))

        # Verify that the cascades loaded correctly
        if self.face_cascade.empty():
            raise IOError("Failed to load face cascade. Check the file path.")
        if self.eye_cascade.empty():
            raise IOError("Failed to load eye cascade. Check the file path.")

    def are_eyes_open(self, img):
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        eyes = self.eye_cascade.detectMultiScale(gray)

        # Process each detected eye
        for (ex, ey, ew, eh) in eyes:
            roi_gray2 = gray[ey:ey+eh, ex:ex+ew]
            roi_color2 = img[ey:ey+eh, ex:ex+ew]
            circles = cv2.HoughCircles(
                roi_gray2,
                cv2.HOUGH_GRADIENT,
                1,
                200,
                param1=200,
                param2=1,
                minRadius=0,
                maxRadius=0
            )

            # If circles are detected, eyes are open
            if circles is not None:
                return True

        # If no circles are detected, eyes are closed
        return False
