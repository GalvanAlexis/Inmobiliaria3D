import cv2
import sys
import os
import argparse

def main():
    parser = argparse.ArgumentParser(description="Image Stitching Worker for Inmobiliaria3D")
    parser.add_argument("--mode", default="panorama", choices=["panorama", "scans"],
                        help="Stitcher mode: 'panorama' (outdoor/360) or 'scans' (flat/indoor). Default: panorama")
    parser.add_argument("--job-id", required=True, help="The UUID of the stitch job")
    parser.add_argument("--output", required=True, help="Path to save the stitched image")
    parser.add_argument("--inputs", required=True, nargs='+', help="List of input image paths")
    
    args = parser.parse_args()
    
    job_id = args.job_id
    output_path = args.output
    input_paths = args.inputs

    # Validate and load inputs
    images = []
    for path in input_paths:
        if not os.path.exists(path):
            print(f"ERROR: Image not found at {path}")
            sys.exit(1)
        img = cv2.imread(path)
        if img is None:
            print(f"ERROR: Could not read image at {path}")
            sys.exit(1)
        # Auto-rotate portrait photos to landscape — panorama stitching works much
        # better with landscape orientation (wider horizontal FoV between shots).
        h, w = img.shape[:2]
        if h > w:
            img = cv2.rotate(img, cv2.ROTATE_90_CLOCKWISE)
        images.append(img)
        
    print(f"[{job_id}] Loaded {len(images)} images (auto-rotated portrait → landscape if needed).")

    # Create Stitcher Object (OpenCV 4.x+)
    mode = cv2.Stitcher_SCANS if args.mode == "scans" else cv2.Stitcher_PANORAMA
    stitcher = cv2.Stitcher_create(mode)
    
    print(f"[{job_id}] Attempting to stitch images... This may take a while.")
    status, pano = stitcher.stitch(images)
    
    if status != cv2.Stitcher_OK:
        # Stitcher status returns: Error Codes: 1: ERR_NEED_MORE_IMGS, 2: ERR_HOMOGRAPHY_EST_FAIL, 3: ERR_CAMERA_PARAMS_ADJUST_FAIL
        print(f"ERROR: Image stitching failed with code {status}")
        sys.exit(2)
        
    print(f"[{job_id}] Stitching successful! Saving to {output_path}")
    
    # Save output
    cv2.imwrite(output_path, pano)
    print(f"[{job_id}] Done.")
    sys.exit(0)

if __name__ == "__main__":
    main()
