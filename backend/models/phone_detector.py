import cv2

class PhoneDetector:
    def __init__(self):
        # Load pre-trained MobileNet SSD model
        self.net = cv2.dnn.readNetFromCaffe(
            "deploy.prototxt",  # Prototxt file for MobileNet
            "./res10_300x300_ssd_iter_140000_fp16.caffemodel"  # Model weights
        )

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
                if class_id == 1:  # Assuming "1" is the class ID for phones
                    phone_detected += 1

        return phone_detected
