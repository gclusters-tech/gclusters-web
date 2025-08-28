import http.server
import socketserver
import json
import urllib.request
import urllib.error
import os
from urllib.parse import urlparse
from pathlib import Path


# Load environment variables from .env file
def load_env():
    env_path = Path(__file__).parent / ".env"
    if env_path.exists():
        with open(env_path) as f:
            for line in f:
                line = line.strip()
                if line and "=" in line and not line.startswith("#"):
                    key, value = line.split("=", 1)
                    os.environ[key] = value


load_env()


class SPAHandler(http.server.SimpleHTTPRequestHandler):
    SPA_ROUTES = {"/method", "/aladin-bot", "/articles", "/projects", "/contact"}

    def do_GET(self):
        path = urlparse(self.path).path

        if path in self.SPA_ROUTES:
            self.serve_spa_page()
            return

        if path.endswith(".html") and path != "/index.html":
            clean_path = path[:-5]
            if clean_path in self.SPA_ROUTES:
                self.redirect_to_clean_url(clean_path)
                return

        if not self.is_static_file(path) and path not in {"/", "/index.html"}:
            self.serve_spa_page()
            return

        super().do_GET()

    def do_POST(self):
        path = urlparse(self.path).path

        if path == "/ads-proxy":
            self.handle_ads_proxy()
        else:
            self.send_error(404, "Endpoint not found")

    def do_OPTIONS(self):
        self.send_cors_response()

    def serve_spa_page(self):
        try:
            self.path = "/index.html"
            super().do_GET()
        except Exception as e:
            print(f"Error serving SPA page: {e}")
            self.send_error(500, "Internal server error")

    def redirect_to_clean_url(self, clean_path):
        self.send_response(301)
        self.send_header("Location", clean_path)
        self.end_headers()

    def is_static_file(self, path):
        static_prefixes = ("/static/", "/js/", "/css/", "/images/", "/fonts/")
        static_extensions = (
            ".js",
            ".css",
            ".png",
            ".jpg",
            ".jpeg",
            ".gif",
            ".svg",
            ".ico",
            ".woff",
            ".woff2",
            ".ttf",
            ".eot",
            ".json",
            ".xml",
        )

        return any(path.startswith(prefix) for prefix in static_prefixes) or any(
            path.endswith(ext) for ext in static_extensions
        )

    def handle_ads_proxy(self):
        try:
            content_length = int(self.headers.get("Content-Length", 0))
            if content_length == 0:
                self.send_error(400, "Missing request body")
                return

            post_data = self.rfile.read(content_length)
            request_data = json.loads(post_data.decode("utf-8"))

            target_url = request_data.get("url")
            if not target_url or not target_url.startswith(
                "https://api.adsabs.harvard.edu"
            ):
                self.send_error(400, "Invalid ADS URL")
                return

            # Get API token from environment
            ads_token = os.environ.get("ADS_TOKEN")
            if not ads_token:
                self.send_error(500, "ADS_TOKEN not configured")
                return
            if not ads_token:
                self.send_error_response(500, "ADS_TOKEN environment variable not set")
                return

            req = urllib.request.Request(target_url)
            req.add_header("Accept", "application/json")
            req.add_header("User-Agent", "GClusters-Web/1.0")
            req.add_header("Authorization", f"Bearer {ads_token}")

            with urllib.request.urlopen(req, timeout=30) as response:
                response_data = response.read()

                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.add_cors_headers()
                self.end_headers()
                self.wfile.write(response_data)

        except json.JSONDecodeError:
            self.send_error_response(400, "Invalid JSON in request")
        except urllib.error.HTTPError as e:
            self.handle_ads_error(e)
        except urllib.error.URLError as e:
            self.send_error_response(502, f"Network error: {e.reason}")
        except Exception as e:
            print(f"ADS proxy error: {e}")
            self.send_error_response(500, "Internal proxy error")

    def handle_ads_error(self, error):
        try:
            error_data = (
                error.read().decode("utf-8") if error.fp else "Unknown ADS error"
            )
            print(f"ADS API Error {error.code}: {error_data}")

            error_response = {
                "error": f"ADS API Error {error.code}",
                "message": error_data,
                "response": {"docs": [], "numFound": 0},
            }

            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.add_cors_headers()
            self.end_headers()
            self.wfile.write(json.dumps(error_response).encode("utf-8"))

        except Exception as e:
            print(f"Error handling ADS error: {e}")
            self.send_error_response(502, "ADS API unavailable")

    def send_error_response(self, status_code, message):
        error_response = {
            "error": "Request failed",
            "message": message,
            "response": {"docs": [], "numFound": 0},
        }

        self.send_response(status_code)
        self.send_header("Content-Type", "application/json")
        self.add_cors_headers()
        self.end_headers()
        self.wfile.write(json.dumps(error_response).encode("utf-8"))

    def send_cors_response(self):
        self.send_response(200)
        self.add_cors_headers()
        self.end_headers()

    def add_cors_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.send_header("Access-Control-Max-Age", "86400")  # 24 hours

    def log_message(self, format, *args):
        if "ads-proxy" in format % args or "500" in format % args:
            super().log_message(format, *args)


def main():
    PORT = int(os.environ.get("SPA_PORT", 8002))
    HOST = os.environ.get("SPA_HOST", "localhost")

    print(f"Serving SPA at http://{HOST}:{PORT}")
    print("Press Ctrl+C to stop the server")

    try:
        with socketserver.TCPServer((HOST, PORT), SPAHandler) as httpd:
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")


if __name__ == "__main__":
    main()
