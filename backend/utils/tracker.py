import cv2
import numpy as np
import time
import copy
import logging
from routes.detection import detection_state

logger = logging.getLogger(__name__)

class HandTracker:
    """
    Tracks hand presence in video frames using background subtraction and skin detection.
    
    Attributes:
        bg_model: Background subtraction model
        kernel: Morphological operation kernel
        hand_absent_detected: Flag for current hand absence state
        last_time_checked: Timestamp of last update
        hand_count: Total count of hand absence events
    """
   
    def __init__(self):
        """Initialize the hand tracker with background subtraction model."""
        self.bg_model = cv2.createBackgroundSubtractorMOG2(0, 50)
        self.kernel = np.ones((3, 3), np.uint8)
        self.hand_absent_detected = False
        self.last_time_checked = time.time()
        self.hand_count = 0
        logger.info("Hand tracker initialized")

    def get_centroid(self, contour):
        """
        Calculate the centroid of a contour.
        
        Args:
            contour: OpenCV contour
            
        Returns:
            Tuple of (x, y) centroid coordinates or None if invalid
        """
        try:
            moments = cv2.moments(contour)
            if moments["m00"] > 0:
                cx = int(moments["m10"] / moments["m00"])
                cy = int(moments["m01"] / moments["m00"])
                return (cx, cy)
        except Exception as e:
            logger.debug(f"Error calculating centroid: {e}")
        return None

    def track_hand_movement(self, frame):
        """
        Analyze the frame for hand presence or absence.
        
        Args:
            frame: Input video frame (BGR format)
        """
        try:
            global detection_state
            if detection_state.get("hand_absent_count", 0) == 0:
                self.hand_count = 0
            
            # Apply background subtraction
            fgmask = self.bg_model.apply(frame)
            fgmask = cv2.erode(fgmask, self.kernel, iterations=1)
            img = cv2.bitwise_and(frame, frame, mask=fgmask)

            # Convert to HSV for skin detection
            hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
            lower = np.array([0, 48, 80], dtype="uint8")
            upper = np.array([20, 255, 255], dtype="uint8")
            skin_mask = cv2.inRange(hsv, lower, upper)

            # Find contours
            contours, _ = cv2.findContours(
                copy.deepcopy(skin_mask), 
                cv2.RETR_TREE, 
                cv2.CHAIN_APPROX_SIMPLE
            )
            
            if contours:
                max_area = max(contours, key=cv2.contourArea)
                # Adjust threshold for hand size detection
                if cv2.contourArea(max_area) > 1000:
                    centroid = self.get_centroid(max_area)
                    self.update_hand_absence(centroid)
                    return

            # If no contours are found
            self.update_hand_absence(None)
            
        except Exception as e:
            logger.error(f"Error in hand tracking: {e}")
            self.update_hand_absence(None)

    def update_hand_absence(self, centroid):
        """
        Update hand absence count based on the centroid detection.
        
        Args:
            centroid: Tuple of (x, y) or None if hand not detected
        """
        try:
            current_time = time.time()
            if current_time - self.last_time_checked >= 1:  # Check every second
                self.last_time_checked = current_time
                if centroid is not None:
                    if self.hand_absent_detected:
                        self.hand_absent_detected = False
                elif not self.hand_absent_detected:
                    self.hand_count += 1
                    self.hand_absent_detected = True
                    logger.debug(f"Hand absence detected. Count: {self.hand_count}")
        except Exception as e:
            logger.error(f"Error updating hand absence: {e}")