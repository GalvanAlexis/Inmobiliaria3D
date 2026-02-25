"""
Diagnostic Script v2: Try different scales, install stitching package and test.
"""
import cv2
import os
import numpy as np

test_dir = r'C:\Users\PC Blado\Desktop\AIDO\2-Proyectos\Inmobiliaria3D\test'

# Load all images
originals = [cv2.imread(os.path.join(test_dir, f'{i}.jpg')) for i in range(1, 12)]
print(f'Loaded {len(originals)} images, size: {originals[0].shape[1]}x{originals[0].shape[0]}')

# Attempt 1: Scale down to 50% and try PANORAMA
print('\n--- Attempt 1: Scale 50% + PANORAMA ---')
small = [cv2.resize(img, (img.shape[1]//2, img.shape[0]//2)) for img in originals]
st, p = cv2.Stitcher_create(cv2.Stitcher_PANORAMA).stitch(small)
print(f'Status: {st} ({"OK" if st == 0 else "ERROR"})')
if st == 0:
    cv2.imwrite(os.path.join(test_dir, 'panorama_50pct.jpg'), p)
    print(f'Saved panorama_50pct.jpg: {p.shape[1]}x{p.shape[0]}')

# Attempt 2: Scale down 25% + PANORAMA
print('\n--- Attempt 2: Scale 25% + PANORAMA ---')
tiny = [cv2.resize(img, (img.shape[1]//4, img.shape[0]//4)) for img in originals]
st2, p2 = cv2.Stitcher_create(cv2.Stitcher_PANORAMA).stitch(tiny)
print(f'Status: {st2} ({"OK" if st2 == 0 else "ERROR"})')
if st2 == 0:
    cv2.imwrite(os.path.join(test_dir, 'panorama_25pct.jpg'), p2)
    print(f'Saved panorama_25pct.jpg: {p2.shape[1]}x{p2.shape[0]}')

# Attempt 3: Rotate all photos 90 degrees (portrait -> landscape) + PANORAMA
print('\n--- Attempt 3: Rotate to landscape + PANORAMA ---')
landscape = [cv2.rotate(img, cv2.ROTATE_90_CLOCKWISE) for img in originals]
st3, p3 = cv2.Stitcher_create(cv2.Stitcher_PANORAMA).stitch(landscape)
print(f'Status: {st3} ({"OK" if st3 == 0 else "ERROR"})')
if st3 == 0:
    cv2.imwrite(os.path.join(test_dir, 'panorama_landscape.jpg'), p3)
    print(f'Saved panorama_landscape.jpg: {p3.shape[1]}x{p3.shape[0]}')

# Better keypoint analysis using SIFT
print('\n--- Keypoint analysis: SIFT between image 1 and 2 ---')
try:
    sift = cv2.SIFT_create()
    g1 = cv2.cvtColor(originals[0], cv2.COLOR_BGR2GRAY)
    g2 = cv2.cvtColor(originals[1], cv2.COLOR_BGR2GRAY)
    kp1, d1 = sift.detectAndCompute(g1, None)
    kp2, d2 = sift.detectAndCompute(g2, None)
    print(f'SIFT keypoints img1: {len(kp1)}, img2: {len(kp2)}')
    bf = cv2.BFMatcher()
    matches = bf.knnMatch(d1, d2, k=2)
    good = [m for m,n in matches if m.distance < 0.75*n.distance]
    print(f'Good matches (Lowe ratio test): {len(good)}')
except Exception as e:
    print(f'SIFT not available: {e}')
