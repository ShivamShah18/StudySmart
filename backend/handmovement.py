import cv2
import numpy as np
import math
import copy

class HandTracker:
    def __init__(self):
        # Initialize camera
        self.camera = cv2.VideoCapture(0)
        self.camera.set(10, 200)
        self.bg_model = cv2.createBackgroundSubtractorMOG2(0, 50)
        self.kernel = np.ones((3, 3), np.uint8)

    def calculate_fingers(self, res, drawing):
        # Convexity defect-based finger counting
        hull = cv2.convexHull(res, returnPoints=False)
        if len(hull) > 3:
            defects = cv2.convexityDefects(res, hull)
            if defects is not None:
                cnt = 0
                for i in range(defects.shape[0]):  # calculate the angle
                    s, e, f, d = defects[i][0]
                    start = tuple(res[s][0])
                    end = tuple(res[e][0])
                    far = tuple(res[f][0])
                    a = math.sqrt((end[0] - start[0]) ** 2 + (end[1] - start[1]) ** 2)
                    b = math.sqrt((far[0] - start[0]) ** 2 + (far[1] - start[1]) ** 2)
                    c = math.sqrt((end[0] - far[0]) ** 2 + (end[1] - far[1]) ** 2)
                    angle = math.acos((b ** 2 + c ** 2 - a ** 2) / (2 * b * c))  # cosine theorem
                    if angle <= math.pi / 2:  # angle less than 90 degrees
                        cnt += 1
                        cv2.circle(drawing, far, 8, [211, 84, 0], -1)
                return True, cnt + 1
        return False, 0

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

            # Contour and hull detection
            contours, _ = cv2.findContours(
                copy.deepcopy(skin_mask), cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE
            )
            if contours:
                max_area = max(contours, key=cv2.contourArea)
                hull = cv2.convexHull(max_area)
                drawing = np.zeros(img.shape, np.uint8)
                cv2.drawContours(drawing, [max_area], 0, (0, 255, 0), 2)
                cv2.drawContours(drawing, [hull], 0, (0, 0, 255), 3)

                # Finger counting
                is_finish_cal, cnt = self.calculate_fingers(max_area, drawing)
                if is_finish_cal:
                    print("Fingers:", cnt)
                cv2.imshow('Output', drawing)

            # Exit on 'ESC'
            if cv2.waitKey(10) & 0xFF == 27:
                break

        self.camera.release()
        cv2.destroyAllWindows()

if __name__ == "__main__":
    hand_tracker = HandTracker()
    hand_tracker.process_frame()
