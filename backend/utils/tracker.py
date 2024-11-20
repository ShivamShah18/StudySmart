import cv2
import numpy as np
import time
import copy
from routes.detection import detection_state
class HandTracker:
   
    def __init__(self):
        self.bg_model = cv2.createBackgroundSubtractorMOG2(0, 50)
        self.kernel = np.ones((3, 3), np.uint8)
        self.hand_absent_detected = False
        self.last_time_checked = time.time()
        self.hand_count = 0

    def get_centroid(self, contour):
        moments = cv2.moments(contour)
        if moments["m00"] > 0:
            cx = int(moments["m10"] / moments["m00"])
            cy = int(moments["m01"] / moments["m00"])
            return (cx, cy)
        return None

    def track_hand_movement(self, frame):
        
        global detection_state
        if detection_state["hand_absent_count"] == 0:
            self.hand_count = 0
        """Analyze the frame for hand presence or absence."""
        fgmask = self.bg_model.apply(frame)
        fgmask = cv2.erode(fgmask, self.kernel, iterations=1)
        img = cv2.bitwise_and(frame, frame, mask=fgmask)

        hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
        lower = np.array([0, 48, 80], dtype="uint8")
        upper = np.array([20, 255, 255], dtype="uint8")
        skin_mask = cv2.inRange(hsv, lower, upper)

        contours, _ = cv2.findContours(copy.deepcopy(skin_mask), cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
        if contours:
            max_area = max(contours, key=cv2.contourArea)
            if cv2.contourArea(max_area) > 1000:  # Adjust threshold for hand size
                centroid = self.get_centroid(max_area)
                self.update_hand_absence(centroid)
                return

        # If no contours are found
        self.update_hand_absence(None)

    def update_hand_absence(self, centroid):
        """Update hand absence count based on the centroid."""
        current_time = time.time()
        if current_time - self.last_time_checked >= 1:  # Check every second
            self.last_time_checked = current_time
            if centroid is not None:
                if self.hand_absent_detected:
                    self.hand_absent_detected = False
            elif not self.hand_absent_detected:
                self.hand_count += 1
                self.hand_absent_detected = True