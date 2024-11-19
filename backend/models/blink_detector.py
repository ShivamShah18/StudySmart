import numpy as np
import cv2
import requests
from urllib.request import urlopen
import os
# Haar cascades for face and eye detection
 # Get the absolute path of the current script
base_path = os.path.dirname(os.path.abspath(__file__))

# Construct absolute paths to the Haar cascade files
face_cascade = cv2.CascadeClassifier(os.path.join(base_path, 'haarcascade_frontalface_default.xml'))
eye_cascade = cv2.CascadeClassifier(os.path.join(base_path, 'haarcascade_righteye_2splits.xml'))

# Blink counter and state tracking
blink_counter = 0
circle_detected = False  # Tracks if a circle (pupil) was detected in the previous frame

def process_webcam_stream(stream_url):
    global blink_counter, circle_detected
    
    # Open the MJPEG stream from the URL
    stream = urlopen(stream_url)
    byte_data = b""

    while True:
        # Read a chunk of data from the stream
        byte_data += stream.read(1024)
        a = byte_data.find(b'\xff\xd8')  # JPEG start
        b = byte_data.find(b'\xff\xd9')  # JPEG end

        if a != -1 and b != -1:
            # Extract a JPEG image
            jpg = byte_data[a:b + 2]
            byte_data = byte_data[b + 2:]

            # Decode the image
            img = cv2.imdecode(np.frombuffer(jpg, dtype=np.uint8), cv2.IMREAD_COLOR)

            if img is None:
                continue

            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            eyes = eye_cascade.detectMultiScale(gray)

            circles_detected_in_frame = False  # Tracks if circles are detected in the current frame

            # Process each detected eye
            for (ex, ey, ew, eh) in eyes:
                cv2.rectangle(img, (ex, ey), (ex + ew, ey + eh), (0, 255, 0), 2)
                roi_gray2 = gray[ey:ey + eh, ex:ex + ew]
                roi_color2 = img[ey:ey + eh, ex:ex + ew]
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

                # If circles are detected
                if circles is not None:
                    circles_detected_in_frame = True
                    for i in circles[0, :]:
                        # Draw the outer circle
                        cv2.circle(roi_color2, (int(i[0]), int(i[1])), int(i[2]), (255, 255, 255), 2)
                        # Draw the center of the circle
                        cv2.circle(roi_color2, (int(i[0]), int(i[1])), 2, (255, 255, 255), 3)

            # Blink detection logic
            if circles_detected_in_frame:
                if not circle_detected:  # Transition from no circle to circle
                    blink_counter += 1  # Count as a blink
                    print(f"Blinks detected: {blink_counter}")
                circle_detected = True  # Update state to indicate circles are detected
            else:
                circle_detected = False  # No circles detected in this frame

            # Show the blink count on the frame
            cv2.putText(img, f"Blinks: {blink_counter}", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 255), 2)

            # Display the video frame
            cv2.imshow('Blink Detection', img)
            k = cv2.waitKey(1) & 0xff
            if k == 27:  # Exit on pressing 'Esc'
                break

    cv2.destroyAllWindows()

# URL of the MJPEG stream served by FastAPI
stream_url = "http://192.168.10.101:4747"

# Start processing the stream
process_webcam_stream(stream_url)
