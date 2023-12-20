const safe_ips = [
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
const safe_destination_ips = [
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
const users = ["user123", "anonymous", "admin", "guest"];
const device = ["DeviceXYZ", "ServerABC", "Workstation123"];
const event_description_templates = {
  "auth-failed":
    "Failed login attempt for user '{username}' from IP {source_ip}",
  "auth-success": "Successful login for user '{username}' from IP {source_ip}",
  "auth-lockout":
    "User '{username}' locked out after multiple failed login attempts from IP {source_ip}",
  "network-connected":
    "Device '{device}' connected to the network at IP {source_ip}",
  "network-disconnected":
    "Device '{device}' disconnected from the network at IP {source_ip}",
  "dns-queries": "DNS query from IP {source_ip} for domain '{domain}'",
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

  "malware-detection":
    "Malware detected: File '{file_path}' found on device '{device}' access revoked for {device}",
  "permission-changes":
    "User '{username}' tried changing permissions for file '{file_path}' access revoked",
  "firewall-change":
    "Firewall rule change: Port {port} opened for IP {source_ip} access revoked",
  "stuxnet-error":
    "Device '{device}' contains Stuxnet access revoked for {device}",
  "conficker-error":
    "Device '{device}' contains Conficker access revoked for {device}",
  "melissa-error":
    "Device '{device}' contains Melissa access revoked for {device}",
  "malware-download-attempt":
    "User {username} tried downloading file containing {malware} download revoked",
};

const event_types = [
  "auth-failed",
  "auth-failed",
  "auth-success",
  "auth-success",
  "auth-success",
  "auth-success",
  "auth-success",
  "auth-success",
  "auth-success",
  "auth-lockout",
  "auth-lockout",
  "network-connected",
  "network-connected",
  "network-connected",
  "network-connected",
  "network-disconnected",
  "network-disconnected",
  "firewall-change",
  "dns-queries",
  "malware-detection",
  "system-shutdown",
  "system-shutdown",
  "system-shutdown",
  "system-restart",
  "system-restart",
  "system-restart",
  "system-failure",
  "application-errors",
  "application-errors",
  "application-usage",
  "api-called",
  "file-access",
  "file-access",
  "permission-changes",
  "software-update",
  "software-update",
  "malware-detection",
  "permission-changes",
  "firewall-change",
  "stuxnet-error",
  "conficker-error",
  "melissa-error",
  "malware-download-attempt",
];
const event_severity = [
  "informational",
  "informational",
  "informational",
  "informational",
  "informational",
  "informational",
  "informational",
  "informational",
  "informational",
  "informational",
  "warning",
  "warning",
  "warning",
  "warning",
  "warning",
  "error",
  "error",
  "critical",
];
const campLocation = ["Delhi", "Mumbai", "Bangalore"];
event_type_threat = {
  "auth-failed": 0.8,
  "auth-success": 0.1,
  "auth-lockout": 0.9,
  "network-connected": 0.2,
  "network-disconnected": 0.2,
  "firewall-change": 0.7,
  "dns-queries": 0.3,
  "malware-detection": 0.9,
  "system-shutdown": 0.8,
  "system-restart": 0.7,
  "system-failure": 0.9,
  "application-errors": 0.6,
  "application-usage": 0.2,
  "api-called": 0.4,
  "file-access": 0.5,
  "permission-changes": 0.3,
  "software-update": 0.6,
};

ip_threat = {
  malicious: 0.9,
  safe: 0.1,
};
let action = [
  "malware-detection",
  "permission-changes",
  "firewall-change",
  "stuxnet-error",
  "conficker-error",
  "melissa-error",
  "malware-download-attempt",
];
module.exports = {
  action,
  campLocation,
  event_severity,
  event_types,
  event_description_templates,
  device,
  users,
  safe_destination_ips,
  safe_ips,
  event_type_threat,
  ip_threat,
};
