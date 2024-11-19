import cv2
import numpy as np
import copy
import time

class HandTracker:
    def __init__(self):
        # Initialize camera
        self.camera = cv2.VideoCapture(0)
        self.camera.set(10, 200)  # Set brightness
        self.bg_model = cv2.createBackgroundSubtractorMOG2(0, 50)
        self.kernel = np.ones((3, 3), np.uint8)

        # Movement tracking variables
        self.hand_count = 0
        self.last_position = None
        self.hand_absent_detected = False
        self.last_time_checked = time.time()

    def get_centroid(self, contour):
        # Calculate the centroid of a contour
        moments = cv2.moments(contour)
        if moments["m00"] > 0:
            cx = int(moments["m10"] / moments["m00"])
            cy = int(moments["m01"] / moments["m00"])
            return (cx, cy)
        return None

    def track_hand_movement(self, centroid):
        # Track hand movement or absence
        current_time = time.time()
        if current_time - self.last_time_checked >= 1:  # Check every second
            self.last_time_checked = current_time
            if centroid is not None:
                if self.hand_absent_detected:
                    self.hand_absent_detected = False  # Reset the flag when hand is detected again
                self.last_position = centroid
            elif not self.hand_absent_detected:
                # Increment the counter if no centroid (hand) is found and it was not previously detected as absent
                self.hand_count += 1
                print("No hand detected, incrementing the counter.")
                self.hand_absent_detected = True  # Set the flag to avoid multiple counts

    def process_frame(self):
        while self.camera.isOpened():
            ret, frame = self.camera.read()
            if not ret:
                break

            # Smoothing and flipping
            frame = cv2.bilateralFilter(frame, 5, 50, 100)
            frame = cv2.flip(frame, 1)

            # Background removal
            fgmask = self.bg_model.apply(frame)
            fgmask = cv2.erode(fgmask, self.kernel, iterations=1)
            img = cv2.bitwise_and(frame, frame, mask=fgmask)

            # Skin detection
            hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
            lower = np.array([0, 48, 80], dtype="uint8")
            upper = np.array([20, 255, 255], dtype="uint8")
            skin_mask = cv2.inRange(hsv, lower, upper)

            # Contour detection
            contours, _ = cv2.findContours(
                copy.deepcopy(skin_mask), cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE
            )
            centroid_drawn = False
            if contours:
                max_area = max(contours, key=cv2.contourArea)
                if cv2.contourArea(max_area) > 1000:  # Adjust threshold
                    centroid = self.get_centroid(max_area)
                    if centroid:
                        cv2.circle(frame, centroid, 5, (255, 0, 0), -1)
                        centroid_drawn = True

            # Track movement or absence only every second
            self.track_hand_movement(centroid if centroid_drawn else None)

            # Display updates
            cv2.imshow('Original', frame)
            cv2.imshow('Threshold Hands', skin_mask)
            cv2.imshow('Output', frame)

            # Exit on 'ESC'
            if cv2.waitKey(10) & 0xFF == 27:
                break

        print(f"Total times the hand was detected absent: {self.hand_count}")
        self.camera.release()
        cv2.destroyAllWindows()

if __name__ == "__main__":
    hand_tracker = HandTracker()
    hand_tracker.process_frame()
