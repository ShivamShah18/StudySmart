import numpy as np
import cv2

face_cascade = cv2.CascadeClassifier('./haarcascade_frontalface_default.xml')
eye_cascade = cv2.CascadeClassifier('./haarcascade_righteye_2splits.xml')

# Number signifies the camera
cap = cv2.VideoCapture(0)

blink_counter = 0  # Counter for blinks
eye_detected = False  # To track whether an eye was detected in the previous frame

while True:
    ret, img = cap.read()
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    eyes = eye_cascade.detectMultiScale(gray)
    
    # Check if eyes are detected in the current frame
    if len(eyes) > 0:
        eye_detected = True
        for (ex, ey, ew, eh) in eyes:
            cv2.rectangle(img, (ex, ey), (ex + ew, ey + eh), (0, 255, 0), 2)
            roi_gray2 = gray[ey:ey+eh, ex:ex+ew]
            roi_color2 = img[ey:ey+eh, ex:ex+ew]
            circles = cv2.HoughCircles(roi_gray2, cv2.HOUGH_GRADIENT, 1, 200, param1=200, param2=1, minRadius=0, maxRadius=0)
            try:
                for i in circles[0, :]:
                    # Draw the outer circle
                    cv2.circle(roi_color2, (int(i[0]), int(i[1])), int(i[2]), (255, 255, 255), 2)
                    print("drawing circle")
                    # Draw the center of the circle
                    cv2.circle(roi_color2, (int(i[0]), int(i[1])), 2, (255, 255, 255), 3)
            except Exception as e:
                print(e)
    else:
        # If no eyes are detected but were previously visible, count as a blink
        if eye_detected:
            blink_counter += 1
            print(f"Blinks detected: {blink_counter}")
        eye_detected = False

    # Show the blink count on the frame
    cv2.putText(img, f"Blinks: {blink_counter}", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 255), 2)

    cv2.imshow('img', img)
    k = cv2.waitKey(30) & 0xff
    if k == 27:  # Exit on pressing 'Esc'
        break

cap.release()
cv2.destroyAllWindows()