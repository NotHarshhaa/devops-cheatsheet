# 🖥️ Nagios Cheatsheet

![text](https://imgur.com/O9DGMee.png)

**Nagios Core** is a battle-tested, open-source host, service, and network monitoring system. It monitors specified hosts and services, alerting administrators when things go wrong and notifying them again when issues are resolved.

---

## **1. Core Concepts & Exit Codes**

### 🔹 Service Status Return Codes

Nagios plugins communicate health status back to the core daemon via strict exit codes:

| Code | Status | Meaning |
| --- | --- | --- |
| `0` | **OK** | Service or host is functioning within normal parameters. |
| `1` | **WARNING** | Service is operational but approaching critical thresholds. |
| `2` | **CRITICAL** | Service has failed, is down, or has crossed dangerous thresholds. |
| `3` | **UNKNOWN** | Plugin encountered an error or unable to determine status. |

### 🔹 Key Terminology

* **Host**: A physical server, VM, network switch, or IP device.
* **Service**: An endpoint, daemon, or attribute associated with a host (e.g. HTTP, SSH, CPU, Disk).
* **Plugin**: Standalone executable or script returning status codes and optional performance data.
* **Check Command**: Template definition mapping a command name to a plugin binary with arguments.
* **Contact & Contactgroup**: Recipients who receive notification alerts during state transitions.

---

## **2. Essential CLI & Pre-Flight Verification**

> [!IMPORTANT]
> **Always run a configuration verification check** before restarting or reloading Nagios to avoid stopping the daemon with syntax errors!

```bash
# Verify configuration files for syntax errors
sudo /usr/local/nagios/bin/nagios -v /usr/local/nagios/etc/nagios.cfg

# If verification succeeds (Total Warnings: 0, Total Errors: 0), restart Nagios:
sudo systemctl restart nagios

# Reload configuration without dropping state
sudo systemctl reload nagios

# Check daemon runtime status
sudo systemctl status nagios
```

---

## **3. Installation Quickstart (Nagios Core 4.5.x)**

```bash
# Install build dependencies (Ubuntu / Debian)
sudo apt-get update
sudo apt-get install -y autoconf gcc libc6 make wget unzip apache2 apache2-utils \
  php libgd-dev libssl-dev libmcrypt-dev bc gawk dc build-essential

# Download & extract latest Nagios Core
cd /tmp
wget -O nagioscore.tar.gz https://github.com/NagiosEnterprises/nagioscore/archive/nagios-4.5.2.tar.gz
tar xzf nagioscore.tar.gz
cd nagioscore-nagios-4.5.2/

# Compile & install
./configure --with-httpd-conf=/etc/apache2/sites-enabled
make all
sudo make install-groups-users
sudo usermod -a -G nagios www-data
sudo make install
sudo make install-daemoninit
sudo make install-commandmode
sudo make install-config
sudo make install-webconf

# Set web administrative password
sudo htpasswd -c /usr/local/nagios/etc/htpasswd.users nagiosadmin

# Enable Apache modules & start services
sudo a2enmod rewrite cgi
sudo systemctl restart apache2
sudo systemctl enable --now nagios
```

---

## **4. Configuration Objects Reference**

All object definitions reside under `/usr/local/nagios/etc/objects/`.

### 🔹 Defining a Host (`hosts.cfg`)

```cfg
define host {
    use                     linux-server
    host_name               web-prod-01
    alias                   Production Web Server 01
    address                 192.168.1.50
    max_check_attempts      3
    check_interval          5
    retry_interval          1
    check_period            24x7
    notification_interval   60
    notification_period     24x7
    contact_groups          admins
}
```

### 🔹 Defining a Service (`services.cfg`)

```cfg
define service {
    use                     generic-service
    host_name               web-prod-01
    service_description     Nginx HTTP Health
    check_command           check_http!-u /healthz -e "OK"
    check_interval          2
    retry_interval          1
    max_check_attempts      3
    notification_period     24x7
    notification_options    w,u,c,r
    contact_groups          admins
}
```

### 🔹 Grouping Hosts & Services (`groups.cfg`)

```cfg
define hostgroup {
    hostgroup_name          web-servers
    alias                   Linux Production Web Cluster
    members                 web-prod-01,web-prod-02,web-prod-03
}

define servicegroup {
    servicegroup_name       critical-web-services
    alias                   Critical Web Endpoints
}
```

### 🔹 Contacts & Notifications (`contacts.cfg`)

```cfg
define contact {
    contact_name            oncall-devops
    use                     generic-contact
    alias                   On-Call DevOps Engineer
    email                   devops-alerts@example.com
    service_notification_period     24x7
    host_notification_period        24x7
    service_notification_options    w,u,c,r
    host_notification_options       d,u,r
}

define contactgroup {
    contactgroup_name       admins
    alias                   Nagios Administrators
    members                 oncall-devops
}
```

---

## **5. Remote Agent Monitoring with NRPE**

NRPE (Nagios Remote Plugin Executor) allows the central Nagios server to execute plugins securely on remote target hosts.

### 🔹 On Remote Target Host (`/etc/nagios/nrpe.cfg`)

```bash
sudo apt-get install -y nagios-nrpe-server monitoring-plugins
```

Edit `/etc/nagios/nrpe.cfg`:

```cfg
allowed_hosts=127.0.0.1,::1,192.168.1.10   # 192.168.1.10 is Nagios server IP
dont_blame_nrpe=0

command[check_users]=/usr/lib/nagios/plugins/check_users -w 5 -c 10
command[check_load]=/usr/lib/nagios/plugins/check_load -r -w .15,.10,.05 -c .30,.25,.20
command[check_disk_root]=/usr/lib/nagios/plugins/check_disk -w 20% -c 10% -p /
```

Restart remote daemon:

```bash
sudo systemctl restart nagios-nrpe-server
```

### 🔹 On Nagios Server

Test connectivity:

```bash
/usr/local/nagios/libexec/check_nrpe -H 192.168.1.50
# Returns: NRPE v4.1.0
```

Define service in Nagios config:

```cfg
define service {
    use                     generic-service
    host_name               web-prod-01
    service_description     Root Disk Space
    check_command           check_nrpe!check_disk_root
}
```

---

## **6. Writing Custom Nagios Plugins**

A plugin can be written in any scripting language (Bash, Python, Go).

### Standard Format

1. Print one line of human-readable text to `stdout`.
2. Optionally append performance data formatted as: `| 'label'=value[UOM];[warn];[crit];[min];[max]`.
3. Exit with the appropriate return code (`0`, `1`, `2`, or `3`).

### Example: Memory Check Script (`check_mem.sh`)

```bash
#!/usr/bin/env bash

WARN_THRESHOLD=${1:-80}
CRIT_THRESHOLD=${2:-90}

MEM_TOTAL=$(free -m | awk '/Mem:/ {print $2}')
MEM_USED=$(free -m | awk '/Mem:/ {print $3}')
MEM_PERCENT=$(( MEM_USED * 100 / MEM_TOTAL ))

# Format performance data
PERF_DATA="mem_percent=${MEM_PERCENT}%;${WARN_THRESHOLD};${CRIT_THRESHOLD};0;100"

if [ "$MEM_PERCENT" -ge "$CRIT_THRESHOLD" ]; then
    echo "CRITICAL - Memory usage is ${MEM_PERCENT}% (${MEM_USED}MB / ${MEM_TOTAL}MB) | ${PERF_DATA}"
    exit 2
elif [ "$MEM_PERCENT" -ge "$WARN_THRESHOLD" ]; then
    echo "WARNING - Memory usage is ${MEM_PERCENT}% (${MEM_USED}MB / ${MEM_TOTAL}MB) | ${PERF_DATA}"
    exit 1
else
    echo "OK - Memory usage is ${MEM_PERCENT}% (${MEM_USED}MB / ${MEM_TOTAL}MB) | ${PERF_DATA}"
    exit 0
fi
```

Make it executable:

```bash
chmod +x /usr/local/nagios/libexec/check_mem.sh
```

---

## **7. Troubleshooting & Diagnostics**

* **Inspect Core Log**:
  ```bash
  tail -f /usr/local/nagios/var/nagios.log
  ```
* **Test Plugins Directly from CLI**:
  ```bash
  /usr/local/nagios/libexec/check_http -H example.com -u /api/health -p 443 -S --sni
  ```
* **Check Permission Errors**: Ensure files in `/usr/local/nagios/etc/` and `/usr/local/nagios/libexec/` are owned by user `nagios` and group `nagios`.

---

## **8. Modern Landscape: Nagios vs Modern Observability**

| Feature | Nagios Core | Prometheus + Grafana |
| --- | --- | --- |
| **Primary Model** | State checks (OK / WARN / CRIT) | Time-series metrics collection |
| **Data Storage** | Transient state (no historical TSDB) | High-performance TSDB (PromQL) |
| **Dynamic Cloud / K8s** | Static host definitions | Dynamic service discovery |
| **Best Use Case** | Legacy datacenter networks, hardware ping/SNMP, on-prem appliances | Modern cloud-native microservices, containers, Kubernetes |

---

## 📚 **Learning Resources**

* 🔗 [Official Nagios Core Documentation](https://library.nagios.com/)
* 📦 [Nagios Exchange (Plugins & Extensions)](https://exchange.nagios.com/)
* 📘 [Nagios Plugin API Development Guidelines](https://nagios-plugins.org/doc/guidelines.html)
