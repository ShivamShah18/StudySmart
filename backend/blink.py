import numpy as np
import cv2
import os
base_path = os.path.dirname(os.path.abspath(__file__))

# Construct absolute paths to the Haar cascade files

face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
eye_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_righteye_2splits.xml')

# Number signifies the camera
cap = cv2.VideoCapture(0)

blink_counter = 0  # Counter for blinks
circle_detected = False  # Tracks if a circle (pupil) was detected in the previous frame

while True:
    ret, img = cap.read()
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    eyes = eye_cascade.detectMultiScale(gray)
    
    circles_detected_in_frame = False  # Tracks if circles are detected in the current frame

    # Process each detected eye
    for (ex, ey, ew, eh) in eyes:
        cv2.rectangle(img, (ex, ey), (ex + ew, ey + eh), (0, 255, 0), 2)
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
    cv2.imshow('img', img)
    k = cv2.waitKey(30) & 0xff
    if k == 27:  # Exit on pressing 'Esc'
        break

cap.release()
cv2.destroyAllWindows()