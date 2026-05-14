import cv2
import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision
import asyncio
import websockets
import json
import threading

# shared finger position
finger_data = {"x": 0.5, "y": 0.5, "active": False}

def detect_hands():
    base_options = python.BaseOptions(model_asset_path='hand_landmarker.task')
    options = vision.HandLandmarkerOptions(
        base_options=base_options,
        num_hands=1,
        min_hand_detection_confidence=0.5,
        min_hand_presence_confidence=0.4,
        min_tracking_confidence=0.5
    )
    detector = vision.HandLandmarker.create_from_options(options)

    cap = cv2.VideoCapture(0)
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
    cap.set(cv2.CAP_PROP_FPS, 30)

    while True:
        ret, frame = cap.read()
        if not ret:
            continue

        frame = cv2.flip(frame, 1)
        h, w = frame.shape[:2]

        # boost brightness for better detection
        lab = cv2.cvtColor(frame, cv2.COLOR_BGR2LAB)
        l, a, b = cv2.split(lab)
        clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8, 8))
        l = clahe.apply(l)
        lab = cv2.merge((l, a, b))
        frame_enhanced = cv2.cvtColor(lab, cv2.COLOR_LAB2BGR)

        rgb = cv2.cvtColor(frame_enhanced, cv2.COLOR_BGR2RGB)
        mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb)
        result = detector.detect(mp_image)

        if result.hand_landmarks and len(result.hand_landmarks) > 0:
            lm = result.hand_landmarks[0]
            index_tip = lm[8]
            index_mid = lm[6]

            is_pointing = index_tip.y < index_mid.y

            # send raw x — browser handles mirror toggle
            finger_data["x"] = index_tip.x
            finger_data["y"] = index_tip.y
            finger_data["active"] = bool(is_pointing)
        else:
            finger_data["active"] = False

        # draw indicator on camera window
        if finger_data["active"]:
            fx = int(finger_data["x"] * w)
            fy = int(finger_data["y"] * h)
            cv2.circle(frame, (fx, fy), 12, (0, 255, 255), -1)
            cv2.putText(frame, "SLICING", (fx + 15, fy), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 255), 2)

        cv2.imshow("Hand Tracker", frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

async def handler(websocket):
    print("Browser connected!")
    try:
        while True:
            await websocket.send(json.dumps(finger_data))
            await asyncio.sleep(0.016)  # ~60fps
    except:
        pass
    print("Browser disconnected!")

async def main():
    print("Starting hand tracker on ws://localhost:8765")
    async with websockets.serve(handler, "localhost", 8765):
        await asyncio.Future()

if __name__ == "__main__":
    t = threading.Thread(target=detect_hands, daemon=True)
    t.start()
    asyncio.run(main())