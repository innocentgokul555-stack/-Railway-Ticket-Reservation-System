"""
Deploy the railway site to Netlify using their API.
Creates a zip of the site files and uploads via the Netlify API.
No API key needed for anonymous deploys.
"""

import zipfile
import os
import urllib.request
import json
import io

SITE_DIR = r"c:\Users\HP\Desktop\railway"
FILES_TO_DEPLOY = ["index.html", "style.css", "app.js"]

# Create zip in memory
zip_buffer = io.BytesIO()
with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zf:
    for fname in FILES_TO_DEPLOY:
        fpath = os.path.join(SITE_DIR, fname)
        if os.path.exists(fpath):
            zf.write(fpath, fname)
            print(f"  Added: {fname}")
        else:
            print(f"  MISSING: {fname}")

zip_data = zip_buffer.getvalue()
print(f"\nZip size: {len(zip_data)} bytes")

# Deploy to Netlify
print("\nDeploying to Netlify...")
req = urllib.request.Request(
    "https://api.netlify.com/api/v1/sites",
    data=zip_data,
    headers={
        "Content-Type": "application/zip",
    },
    method="POST",
)

try:
    with urllib.request.urlopen(req, timeout=60) as resp:
        result = json.loads(resp.read().decode())
        url = result.get("ssl_url") or result.get("url")
        site_id = result.get("id")
        print(f"\n{'='*50}")
        print(f"  DEPLOYED SUCCESSFULLY!")
        print(f"  Live URL: {url}")
        print(f"  Site ID:  {site_id}")
        print(f"{'='*50}")
except Exception as e:
    print(f"\nError deploying: {e}")
