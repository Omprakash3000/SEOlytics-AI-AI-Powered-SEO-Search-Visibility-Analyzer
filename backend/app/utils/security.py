import ipaddress
import socket
from urllib.parse import urlparse
from typing import Tuple

# Private and reserved IP networks for SSRF protection
PRIVATE_IP_NETWORKS = [
    ipaddress.ip_network("0.0.0.0/8"),
    ipaddress.ip_network("10.0.0.0/8"),
    ipaddress.ip_network("100.64.0.0/10"),
    ipaddress.ip_network("127.0.0.0/8"),
    ipaddress.ip_network("169.254.0.0/16"),
    ipaddress.ip_network("172.16.0.0/12"),
    ipaddress.ip_network("192.0.0.0/24"),
    ipaddress.ip_network("192.0.2.0/24"),
    ipaddress.ip_network("192.88.99.0/24"),
    ipaddress.ip_network("192.168.0.0/16"),
    ipaddress.ip_network("198.18.0.0/15"),
    ipaddress.ip_network("198.51.100.0/24"),
    ipaddress.ip_network("203.0.113.0/24"),
    ipaddress.ip_network("224.0.0.0/4"),
    ipaddress.ip_network("240.0.0.0/4"),
    ipaddress.ip_network("255.255.255.255/32"),
    ipaddress.ip_network("::/128"),
    ipaddress.ip_network("::1/128"),
    ipaddress.ip_network("fc00::/7"),
    ipaddress.ip_network("fe80::/10"),
]

def normalize_and_validate_url(url: str, allow_private: bool = False) -> Tuple[bool, str, str]:
    """
    Validates and normalizes a user provided URL.
    Returns (is_valid, normalized_url, error_message).
    Protects against SSRF by checking resolved IPs against private ranges.
    """
    if not url or not isinstance(url, str):
        return False, "", "URL must be a non-empty string."
    
    url = url.strip()
    if not url.startswith(("http://", "https://")):
        url = "https://" + url

    try:
        parsed = urlparse(url)
        hostname = parsed.hostname
        if not hostname:
            return False, "", "Invalid URL format: Hostname missing."
        
        # Check domain format
        if "." not in hostname and hostname != "localhost":
            return False, "", "Invalid domain name."

        # SSRF checks
        if not allow_private:
            if hostname.lower() in ("localhost", "127.0.0.1", "::1", "0.0.0.0"):
                return False, "", "Access to localhost and internal addresses is prohibited for security (SSRF protection)."

            # Resolve DNS to check if it points to private IP space
            try:
                ip_list = socket.getaddrinfo(hostname, None)
                for addr in ip_list:
                    ip_str = addr[4][0]
                    ip_obj = ipaddress.ip_address(ip_str)
                    for priv_net in PRIVATE_IP_NETWORKS:
                        if ip_obj in priv_net:
                            return False, "", f"Target URL resolves to a prohibited internal IP ({ip_str})."
            except socket.gaierror:
                return False, "", f"Could not resolve host '{hostname}'. Please check if the domain exists."
            except Exception as e:
                return False, "", f"DNS validation error: {str(e)}"

        # Rebuild clean normalized URL
        normalized = parsed.geturl()
        return True, normalized, ""

    except Exception as e:
        return False, "", f"URL validation failed: {str(e)}"
