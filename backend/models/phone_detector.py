import cv2
import os

class PhoneDetector:
    def __init__(self):
        # Absolute paths to the model files
        prototxt_path = os.path.abspath("./deploy.prototxt")
        model_path = os.path.abspath("./res10_300x300_ssd_iter_140000_fp16.caffemodel")
        
        # Load the model
        self.net = cv2.dnn.readNetFromCaffe(prototxt_path, model_path)

    def detect(self, frame):
        h, w = frame.shape[:2]
        blob = cv2.dnn.blobFromImage(frame, 1.0, (300, 300), (104.0, 177.0, 123.0))
        self.net.setInput(blob)
        detections = self.net.forward()

        phone_detected = 0
        for i in range(detections.shape[2]):
            confidence = detections[0, 0, i, 2]
            if confidence > 0.5:  # Confidence threshold
                class_id = int(detections[0, 0, i, 1])
                if class_id == 1:  # Update based on your model's class mapping
                    phone_detected += 1

        return phone_detected
