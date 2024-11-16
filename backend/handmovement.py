import cv2
import numpy as np
import copy

class HandTracker:
    def __init__(self):
        # Initialize camera
        self.camera = cv2.VideoCapture(0)
        self.camera.set(10, 200)
        self.bg_model = cv2.createBackgroundSubtractorMOG2(0, 50)
        self.kernel = np.ones((3, 3), np.uint8)

        # Movement tracking variables
        self.hand_present = False
        self.hand_count = 0
        self.last_position = None

    def get_centroid(self, contour):
        # Calculate the centroid of a contour
        moments = cv2.moments(contour)
        if moments["m00"] > 0:
            cx = int(moments["m10"] / moments["m00"])
            cy = int(moments["m01"] / moments["m00"])
            return (cx, cy)
        return None

    def track_hand_movement(self, centroid):
        # Determine if hand has moved across the frame
        if centroid is not None:
            cx, _ = centroid  # Only consider horizontal movement
            if self.last_position is not None:
                last_cx, _ = self.last_position
                # Check if hand moved out of the frame (crossing certain thresholds)
                if last_cx < 100 and cx > 400:  # Hand enters the frame from left
                    self.hand_count += 1
                    print("Hand entered the frame!")
                elif last_cx > 400 and cx < 100:  # Hand exits the frame to the left
                    self.hand_count += 1
                    print("Hand exited the frame!")
            self.last_position = centroid
        else:
            self.last_position = None

    def process_frame(self):
        while self.camera.isOpened():
            ret, frame = self.camera.read()
            if not ret:
                break

            # Smoothing and flipping
            frame = cv2.bilateralFilter(frame, 5, 50, 100)
            frame = cv2.flip(frame, 1)
            cv2.imshow('Original', frame)

            # Background removal
            fgmask = self.bg_model.apply(frame)
            fgmask = cv2.erode(fgmask, self.kernel, iterations=1)
            img = cv2.bitwise_and(frame, frame, mask=fgmask)

            # Skin detection
            hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
            lower = np.array([0, 48, 80], dtype="uint8")
            upper = np.array([20, 255, 255], dtype="uint8")
            skin_mask = cv2.inRange(hsv, lower, upper)
            cv2.imshow('Threshold Hands', skin_mask)

            # Contour detection
            contours, _ = cv2.findContours(
                copy.deepcopy(skin_mask), cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE
            )
            if contours:
                max_area = max(contours, key=cv2.contourArea)

                # Ensure contour is large enough
                if cv2.contourArea(max_area) > 1000:  # Adjust threshold
                    # Simplify the contour to remove noise
                    epsilon = 0.02 * cv2.arcLength(max_area, True)
                    approx = cv2.approxPolyDP(max_area, epsilon, True)

                    # Track hand movement
                    centroid = self.get_centroid(max_area)
                    self.track_hand_movement(centroid)

                    # Draw centroid for debugging
                    if centroid:
                        cv2.circle(frame, centroid, 5, (255, 0, 0), -1)

                    cv2.imshow('Output', frame)

            # Exit on 'ESC'
            if cv2.waitKey(10) & 0xFF == 27:
                break

        print(f"Total hand movements (entering/exiting the frame): {self.hand_count}")
        self.camera.release()
        cv2.destroyAllWindows()

if __name__ == "__main__":
    hand_tracker = HandTracker()
    hand_tracker.process_frame()
