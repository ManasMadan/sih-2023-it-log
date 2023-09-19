export const safe_ips = [
  "192.168.1.100",
  "10.0.0.2",
  "172.16.0.10",
  "10.10.10.10",
  "192.168.0.1",
  "192.168.2.5",
  "10.1.1.1",
  "172.16.1.100",
  "192.168.10.5",
  "10.0.0.100",
];
export const safe_destination_ips = [
  "192.168.0.2",
  "10.0.0.3",
  "172.16.0.20",
  "10.10.10.20",
  "192.168.0.3",
  "192.168.2.6",
  "10.1.1.2",
  "172.16.1.101",
  "192.168.10.6",
  "10.0.0.101",
];
export const users = ["user123", "anonymous", "admin", "guest"];
export const device = ["DeviceXYZ", "ServerABC", "Workstation123"];
export const event_description_templates = {
  "auth-failed":
    "Failed login attempt for user '{username}' from IP {source_ip}",
  "auth-success": "Successful login for user '{username}' from IP {source_ip}",
  "auth-lockout":
    "User '{username}' locked out after multiple failed login attempts from IP {source_ip}",
  "network-connected":
    "Device '{device}' connected to the network at IP {source_ip}",
  "network-disconnected":
    "Device '{device}' disconnected from the network at IP {source_ip}",
  "firewall-change":
    "Firewall rule change: Port {port} opened for IP {source_ip}",
  "dns-queries": "DNS query from IP {source_ip} for domain '{domain}'",
  "malware-detection":
    "Malware detected: File '{filename}' found on device '{device}'",
  "system-shutdown": "System shutdown: {reason}",
  "system-restart": "System restart: {reason}",
  "system-failure": "Critical system failure: {error_message}",
  "application-errors": "Application error: {error_message}",
  "application-usage": "User '{username}' used application '{app_name}'",
  "api-called": "API called: {api_name} from IP {source_ip}",
  "file-access":
    "File access: {access_type} to file '{file_path}' by user '{username}' from IP {source_ip}",
  "permission-changes":
    "User '{username}' changed permissions for file '{file_path}'",
  "software-update":
    "Software update: {software_name} updated to version {version}",
};
export const event_types = [
  "auth-failed",
  "auth-success",
  "auth-lockout",
  "network-connected",
  "network-disconnected",
  "firewall-change",
  "dns-queries",
  "malware-detection",
  "system-shutdown",
  "system-restart",
  "system-failure",
  "application-errors",
  "application-usage",
  "api-called",
  "file-access",
  "permission-changes",
  "software-update",
];
export const event_severity = ["informational", "warning", "error", "critical"];
export const campLocation = ["Delhi", "Mumbai", "Bangalore"];
