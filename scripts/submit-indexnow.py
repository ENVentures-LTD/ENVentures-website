"""Submit the live sitemap to IndexNow after GitHub Pages deployment."""

import argparse
import json
from pathlib import Path
import sys
from urllib.error import HTTPError, URLError
from urllib.parse import urlsplit
from urllib.request import Request, urlopen
import xml.etree.ElementTree as ET


ROOT = Path(__file__).resolve().parents[1]
HOST = "enventures.co.uk"
ORIGIN = f"https://{HOST}"
KEY = "c13d6ef208f342b5be62f1004fc88f42"
KEY_LOCATION = f"{ORIGIN}/{KEY}.txt"
ENDPOINT = "https://api.indexnow.org/indexnow"


def read_url(url):
    request = Request(url, headers={"User-Agent": "ENVentures-IndexNow/1.0"})
    with urlopen(request, timeout=30) as response:
        if response.geturl() != url:
            raise ValueError(f"Unexpected redirect: {url} -> {response.geturl()}")
        return response.read()


def make_payload(sitemap):
    root = ET.fromstring(sitemap)
    namespace = "{http://www.sitemaps.org/schemas/sitemap/0.9}"
    urls = list(dict.fromkeys(
        node.text.strip() for node in root.findall(f"{namespace}url/{namespace}loc")
        if node.text and node.text.strip()
    ))
    if not 1 <= len(urls) <= 10000:
        raise ValueError("Sitemap must contain between 1 and 10,000 URLs.")
    for url in urls:
        parsed = urlsplit(url)
        if parsed.scheme != "https" or parsed.netloc != HOST or parsed.fragment:
            raise ValueError(f"Unexpected sitemap URL: {url}")
    return {"host": HOST, "key": KEY, "keyLocation": KEY_LOCATION, "urlList": urls}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--dry-run", action="store_true", help="Validate local files without network requests")
    args = parser.parse_args()
    if (ROOT / f"{KEY}.txt").read_text(encoding="utf-8").strip() != KEY:
        raise ValueError("Local verification key does not match.")
    if args.dry_run:
        print(json.dumps(make_payload((ROOT / "sitemap.xml").read_bytes()), indent=2))
        return
    if read_url(KEY_LOCATION).decode("utf-8").strip() != KEY:
        raise ValueError("Live verification key does not match; deploy the key file first.")
    payload = make_payload(read_url(f"{ORIGIN}/sitemap.xml"))
    request = Request(ENDPOINT, data=json.dumps(payload).encode("utf-8"), headers={
        "Content-Type": "application/json; charset=utf-8",
        "User-Agent": "ENVentures-IndexNow/1.0",
    }, method="POST")
    with urlopen(request, timeout=30) as response:
        if response.status not in (200, 202):
            raise ValueError(f"Unexpected IndexNow status: {response.status}")
        detail = "received" if response.status == 200 else "received; key validation pending"
        print(f"IndexNow: {len(payload['urlList'])} URLs {detail} (HTTP {response.status}).")
        print("Receipt does not guarantee crawling or indexing.")


if __name__ == "__main__":
    try:
        main()
    except (HTTPError, URLError, ValueError, OSError, ET.ParseError) as error:
        print(f"IndexNow submission failed: {error}", file=sys.stderr)
        sys.exit(1)
