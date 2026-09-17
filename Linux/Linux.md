# Linux Cheatsheet

> 🐧 A comprehensive quick-reference guide to Linux commands for DevOps Engineers, Sysadmins, and Developers.

---

## 1. Introduction to Linux

### What is Linux?

- **Linux** is an open-source, Unix-like operating system kernel created by Linus Torvalds in 1991. It powers everything from personal computers and servers to cloud infrastructure, containers, and embedded systems.

### Key Concepts

- **Kernel**: The core of the OS that manages hardware resources and system calls.
- **Shell**: A command-line interpreter (e.g., Bash, Zsh) that lets users interact with the OS.
- **File System**: Linux uses a hierarchical directory structure rooted at `/`.
- **Process**: A running instance of a program, identified by a PID (Process ID).
- **User & Group**: Linux is multi-user; every file has an owner and an associated group.
- **Permissions**: Controls read (`r`), write (`w`), and execute (`x`) access per user, group, and others.

### Linux Directory Structure

```
/               → Root of the filesystem
├── bin/        → Essential user binaries (ls, cp, mv)
├── sbin/       → System binaries (for root)
├── etc/        → Configuration files
├── home/       → User home directories
├── var/        → Variable data (logs, caches)
├── tmp/        → Temporary files
├── usr/        → User programs and libraries
├── opt/        → Optional/third-party software
├── proc/       → Virtual FS for process/kernel info
├── dev/        → Device files
├── mnt/        → Mount points
└── lib/        → Shared libraries
```

---

## 2. File & Directory Operations

### Navigation

```bash
pwd                        # Print current working directory
ls                         # List files and directories
ls -la                     # List all files with details (including hidden)
ls -lh                     # Human-readable file sizes
cd /path/to/dir            # Change directory
cd ~                       # Go to home directory
cd -                       # Go to previous directory
tree                       # Display directory tree
tree -L 2                  # Limit tree depth to 2 levels
```

### Creating & Removing

```bash
mkdir mydir                # Create a directory
mkdir -p a/b/c             # Create nested directories
touch file.txt             # Create an empty file
rm file.txt                # Remove a file
rm -rf mydir/              # Remove directory and contents (use with caution!)
rmdir mydir                # Remove empty directory
```

### Copying & Moving

```bash
cp file.txt /tmp/          # Copy file to /tmp
cp -r dir/ /tmp/           # Copy directory recursively
mv file.txt /tmp/          # Move file
mv oldname.txt newname.txt # Rename a file
```

### Finding Files

```bash
find / -name "file.txt"           # Find file by name (from root)
find . -name "*.log"              # Find all .log files in current dir
find /var -mtime -7               # Files modified in last 7 days
find . -size +100M                # Files larger than 100MB
find . -type d -name "config"     # Find directories named "config"
locate file.txt                   # Fast file search using index (requires updatedb)
which python3                     # Find path of a command
whereis nginx                     # Find binary, source, and man page locations
```

---

## 3. File Viewing & Editing

### Viewing Files

```bash
cat file.txt               # Print file contents
less file.txt              # Page through file (q to quit)
more file.txt              # Page through file (space to scroll)
head file.txt              # Show first 10 lines
head -n 20 file.txt        # Show first 20 lines
tail file.txt              # Show last 10 lines
tail -n 50 file.txt        # Show last 50 lines
tail -f /var/log/syslog    # Follow a log file in real time
```

### Text Searching

```bash
grep "error" file.txt              # Search for "error" in file
grep -i "error" file.txt           # Case-insensitive search
grep -r "TODO" ./src/              # Recursive search in directory
grep -n "pattern" file.txt         # Show matching line numbers
grep -v "debug" file.txt           # Show lines NOT matching
grep -l "keyword" *.txt            # List files that match
grep -c "error" file.txt           # Count matching lines
grep -A 3 "error" file.txt         # Show 3 lines after match
grep -B 2 "error" file.txt         # Show 2 lines before match
```

### Text Processing

```bash
awk '{print $1}' file.txt          # Print first column
awk -F: '{print $1}' /etc/passwd   # Use : as delimiter
sed 's/old/new/g' file.txt         # Replace all occurrences
sed -i 's/old/new/g' file.txt      # Replace in-place
sed -n '5,10p' file.txt            # Print lines 5 to 10
cut -d: -f1 /etc/passwd            # Cut first field by delimiter
sort file.txt                      # Sort lines alphabetically
sort -n numbers.txt                # Sort numerically
sort -r file.txt                   # Reverse sort
uniq file.txt                      # Remove duplicate lines
uniq -c file.txt                   # Count occurrences
wc -l file.txt                     # Count lines
wc -w file.txt                     # Count words
tr 'a-z' 'A-Z' < file.txt         # Convert to uppercase
```

### File Editors (Quick Reference)

```bash
nano file.txt              # Simple terminal editor
vim file.txt               # Advanced editor
  i                        # Enter insert mode
  Esc                      # Exit insert mode
  :w                       # Save
  :q                       # Quit
  :wq                      # Save and quit
  :q!                      # Quit without saving
  /pattern                 # Search
  dd                       # Delete line
  yy                       # Copy (yank) line
  p                        # Paste
```

---

## 4. File Permissions & Ownership

### Understanding Permissions

```
-rwxr-xr--  1  user  group  size  date  filename
 |||||||||||
 |└┬┘└┬┘└┬┘
 | │  │  └──  Others:  r-- = read only
 | │  └─────  Group:   r-x = read + execute
 | └────────  Owner:   rwx = read + write + execute
 └──────────  File type: - = file, d = directory, l = symlink
```

### chmod – Change Permissions

```bash
chmod 755 file.sh          # rwxr-xr-x (owner=rwx, group=rx, others=rx)
chmod 644 file.txt         # rw-r--r-- (owner=rw, group=r, others=r)
chmod 600 secret.key       # rw------- (owner only)
chmod +x script.sh         # Add execute permission
chmod -w file.txt          # Remove write permission
chmod -R 755 ./mydir/      # Apply recursively
```

### chown & chgrp – Change Ownership

```bash
chown user file.txt            # Change file owner
chown user:group file.txt      # Change owner and group
chown -R user:group ./mydir/   # Change recursively
chgrp devops file.txt          # Change group only
```

### Special Permissions

```bash
chmod u+s script.sh        # Set SUID bit (run as file owner)
chmod g+s directory/       # Set SGID bit (inherit group)
chmod +t /tmp/             # Set Sticky bit (only owner can delete)
```

---

## 5. User & Group Management

### User Operations

```bash
whoami                          # Show current user
id                              # Show UID, GID, and groups
id username                     # Show info for specific user
adduser john                    # Create user with home dir (Debian/Ubuntu)
useradd -m -s /bin/bash john    # Create user (RHEL/CentOS)
passwd john                     # Set or change user password
usermod -aG sudo john           # Add user to sudo group
usermod -aG docker john         # Add user to docker group
userdel john                    # Delete user
userdel -r john                 # Delete user and home directory
su - john                       # Switch to user john
sudo command                    # Run command as root
sudo -i                         # Open root shell
```

### Group Operations

```bash
groups                          # List groups for current user
groups john                     # List groups for user john
groupadd devops                 # Create a new group
groupdel devops                 # Delete a group
gpasswd -a john devops          # Add user to group
gpasswd -d john devops          # Remove user from group
cat /etc/passwd                 # List all users
cat /etc/group                  # List all groups
```

---

## 6. Process Management

### Viewing Processes

```bash
ps                              # Show current user's processes
ps aux                          # Show all running processes
ps aux | grep nginx             # Filter processes by name
pgrep nginx                     # Get PID of process by name
top                             # Real-time process monitor
htop                            # Enhanced process monitor (install separately)
pidof nginx                     # Find PID of a running program
```

### Controlling Processes

```bash
kill 1234                       # Send SIGTERM to PID 1234 (graceful stop)
kill -9 1234                    # Send SIGKILL to PID 1234 (force kill)
killall nginx                   # Kill all processes named nginx
pkill -f "python script.py"     # Kill by name pattern
```

### Background & Foreground Jobs

```bash
command &                       # Run command in background
jobs                            # List background jobs
fg %1                           # Bring job 1 to foreground
bg %1                           # Resume job 1 in background
nohup command &                 # Run command immune to hangups
disown %1                       # Remove job from shell's job list
```

### Process Priority

```bash
nice -n 10 command              # Run command with lower priority (10)
nice -n -10 command             # Run with higher priority (needs root)
renice 15 -p 1234               # Change priority of running process
```

---

## 7. Disk & Storage Management

### Disk Usage

```bash
df -h                           # Show disk space usage (human-readable)
df -h /home                     # Show usage for specific mount point
du -sh /var/log/                # Total size of directory
du -sh *                        # Size of each item in current dir
du -sh * | sort -h              # Sort by size
lsblk                           # List block devices (disks/partitions)
fdisk -l                        # List all disk partitions (root)
blkid                           # Show block device UUIDs
```

### Mount & Unmount

```bash
mount /dev/sdb1 /mnt/data       # Mount partition to mount point
umount /mnt/data                # Unmount
mount -a                        # Mount all entries in /etc/fstab
cat /etc/fstab                  # View persistent mount configuration
```

### Disk Management

```bash
fdisk /dev/sdb                  # Partition disk interactively
parted /dev/sdb                 # Advanced partitioning tool
mkfs.ext4 /dev/sdb1             # Format partition as ext4
mkfs.xfs /dev/sdb1              # Format partition as XFS
e2fsck -f /dev/sdb1             # Check/repair ext filesystem
resize2fs /dev/sdb1             # Resize ext filesystem
```

---

## 8. Networking

### Network Info

```bash
ip addr                         # Show IP addresses (modern)
ip addr show eth0               # Show info for specific interface
ifconfig                        # Show network interfaces (legacy)
hostname -I                     # Show all IP addresses
ip route                        # Show routing table
ip link                         # Show link layer info
ss -tuln                        # Show listening ports (modern)
netstat -tuln                   # Show listening ports (legacy)
netstat -anp | grep :80         # Find what's using port 80
```

### Connectivity Testing

```bash
ping google.com                 # Test reachability
ping -c 4 8.8.8.8               # Ping 4 times
traceroute google.com           # Trace route to destination
mtr google.com                  # Combined ping + traceroute
curl -I https://example.com     # Fetch HTTP headers only
curl -O https://example.com/file.zip  # Download file
wget https://example.com/file.zip     # Download file
nslookup google.com             # DNS lookup
dig google.com                  # Detailed DNS lookup
dig +short google.com           # Short DNS answer
```

### Firewall

```bash
# UFW (Ubuntu/Debian)
ufw status                      # Show firewall status
ufw enable                      # Enable firewall
ufw allow 22/tcp                # Allow SSH
ufw allow 80/tcp                # Allow HTTP
ufw deny 3306                   # Block MySQL port
ufw delete allow 80/tcp         # Remove a rule

# Firewalld (RHEL/CentOS)
firewall-cmd --state                                  # Show status
firewall-cmd --list-all                               # List all rules
firewall-cmd --add-port=80/tcp --permanent            # Allow port permanently
firewall-cmd --reload                                 # Reload rules

# iptables
iptables -L -n -v                                     # List all rules
iptables -A INPUT -p tcp --dport 22 -j ACCEPT         # Allow SSH
iptables -A INPUT -j DROP                             # Drop all other input
iptables-save > /etc/iptables/rules.v4               # Save rules
```

### SSH

```bash
ssh user@host                         # Connect to remote host
ssh -p 2222 user@host                 # Connect on custom port
ssh -i ~/.ssh/id_rsa user@host        # Connect with specific key
ssh -L 8080:localhost:80 user@host    # Local port forwarding
scp file.txt user@host:/tmp/          # Copy file to remote host
scp -r dir/ user@host:/tmp/           # Copy directory to remote
rsync -avz ./dir/ user@host:/remote/  # Sync files to remote

# SSH Key Management
ssh-keygen -t ed25519           # Generate Ed25519 SSH key pair
ssh-copy-id user@host           # Copy public key to remote host
chmod 600 ~/.ssh/id_rsa         # Set correct key permissions
```

---

## 9. System Information

### Hardware & OS Info

```bash
uname -a                        # Kernel name, version, architecture
uname -r                        # Kernel version only
cat /etc/os-release             # OS name and version
lscpu                           # CPU information
lsmem                           # Memory information
lspci                           # List PCI devices
dmidecode -t system             # System hardware info (root)
uptime                          # System uptime and load averages
```

### Memory & CPU

```bash
free -h                         # Show RAM usage (human-readable)
vmstat 1                        # Virtual memory statistics (every 1s)
cat /proc/meminfo               # Detailed memory info
cat /proc/cpuinfo               # Detailed CPU info
nproc                           # Number of CPU cores
```

### System Logs

```bash
journalctl                      # View systemd logs
journalctl -u nginx             # Logs for specific service
journalctl -f                   # Follow live logs
journalctl --since "1 hour ago" # Logs from last hour
journalctl -p err               # Show only error-level logs
cat /var/log/syslog             # Syslog (Debian/Ubuntu)
cat /var/log/messages           # System messages (RHEL/CentOS)
dmesg                           # Kernel ring buffer (boot messages)
dmesg | grep -i error           # Filter kernel errors
```

---

## 10. Service & System Management (systemd)

### Service Control

```bash
systemctl start nginx                # Start a service
systemctl stop nginx                 # Stop a service
systemctl restart nginx              # Restart a service
systemctl reload nginx               # Reload config without restart
systemctl status nginx               # Check service status
systemctl enable nginx               # Enable service at boot
systemctl disable nginx              # Disable service at boot
systemctl is-active nginx            # Check if service is running
systemctl is-enabled nginx           # Check if service is enabled
systemctl list-units --type=service  # List all running services
```

### System Power

```bash
shutdown -h now                 # Shutdown immediately
shutdown -r now                 # Reboot immediately
shutdown -h +10                 # Shutdown in 10 minutes
reboot                          # Reboot the system
```

---

## 11. Package Management

### Debian / Ubuntu (apt)

```bash
apt update                      # Update package index
apt upgrade                     # Upgrade all packages
apt install nginx               # Install a package
apt remove nginx                # Remove a package
apt purge nginx                 # Remove package + config files
apt autoremove                  # Remove unused dependencies
apt search nginx                # Search for a package
apt show nginx                  # Show package details
dpkg -l                         # List installed packages
dpkg -l | grep nginx            # Check if package is installed
```

### RHEL / CentOS / Fedora (dnf / yum)

```bash
dnf update                      # Update all packages
dnf install nginx               # Install a package
dnf remove nginx                # Remove a package
dnf search nginx                # Search for a package
dnf info nginx                  # Show package details
dnf list installed              # List installed packages
rpm -qa                         # List all installed RPMs
rpm -qi nginx                   # Info about installed RPM
```

---

## 12. Archiving & Compression

```bash
# tar
tar -cvf archive.tar dir/           # Create tar archive
tar -xvf archive.tar                # Extract tar archive
tar -czvf archive.tar.gz dir/       # Create gzipped tar archive
tar -xzvf archive.tar.gz            # Extract gzipped archive
tar -cjvf archive.tar.bz2 dir/      # Create bzip2 compressed archive
tar -xjvf archive.tar.bz2           # Extract bzip2 archive
tar -tf archive.tar                 # List archive contents (no extract)

# gzip / gunzip
gzip file.txt                       # Compress to file.txt.gz
gunzip file.txt.gz                  # Decompress
gzip -k file.txt                    # Compress, keep original

# zip / unzip
zip archive.zip file1 file2         # Create zip
zip -r archive.zip dir/             # Zip a directory
unzip archive.zip                   # Extract zip
unzip -l archive.zip                # List zip contents
```

---

## 13. Environment Variables & Shell

### Environment Variables

```bash
env                                        # List all environment variables
printenv PATH                              # Print specific variable
echo $HOME                                 # Print variable value
export MY_VAR="hello"                      # Set variable for session
echo 'export MY_VAR="hello"' >> ~/.bashrc  # Persist variable
source ~/.bashrc                           # Reload shell config
unset MY_VAR                               # Remove variable
```

### Shell Shortcuts

```bash
!!                              # Repeat last command
!nginx                          # Repeat last command starting with "nginx"
history                         # Show command history
history | grep ssh              # Search history
Ctrl + R                        # Reverse search command history
Ctrl + C                        # Interrupt running command
Ctrl + Z                        # Suspend running command
Ctrl + L                        # Clear screen
Ctrl + A                        # Move cursor to start of line
Ctrl + E                        # Move cursor to end of line
```

### Aliases

```bash
alias ll='ls -la'                          # Create an alias
alias k='kubectl'
unalias ll                                 # Remove alias
echo "alias ll='ls -la'" >> ~/.bashrc      # Persist alias
```

### Shell Scripting Basics

```bash
#!/bin/bash                     # Shebang line

# Variables
NAME="DevOps"
echo "Hello, $NAME"

# Conditionals
if [ -f "/etc/nginx/nginx.conf" ]; then
  echo "Nginx config exists"
else
  echo "Not found"
fi

# For loop
for i in 1 2 3 4 5; do
  echo "Number: $i"
done

# While loop
COUNT=0
while [ $COUNT -lt 5 ]; do
  echo "Count: $COUNT"
  ((COUNT++))
done

# Functions
greet() {
  echo "Hello, $1!"
}
greet "World"

# Exit codes
command && echo "Success" || echo "Failed"
```

---

## 14. Cron Jobs & Scheduling

```bash
crontab -e                      # Edit current user's crontab
crontab -l                      # List current user's crontab
crontab -r                      # Remove current user's crontab

# Cron Syntax:
# MIN  HOUR  DAY  MONTH  WEEKDAY  COMMAND
# 0-59  0-23  1-31   1-12   0-7 (0 and 7 = Sunday)

# Examples:
* * * * * /script.sh            # Every minute
0 * * * * /script.sh            # Every hour
0 0 * * * /script.sh            # Every day at midnight
0 9 * * 1 /script.sh            # Every Monday at 9 AM
*/5 * * * * /script.sh          # Every 5 minutes
0 0 1 * * /script.sh            # First day of every month

# at - run once at a specific time
at 14:30                        # Schedule command at 2:30 PM
atq                             # List pending jobs
atrm 1                          # Remove job #1
```

---

## 15. Performance & Troubleshooting

### System Performance

```bash
top                             # Live system performance
htop                            # Enhanced top (needs install)
iostat -xz 1                    # I/O statistics every 1 second
iotop                           # I/O usage per process
vmstat 1 5                      # VM stats, 5 iterations
mpstat -P ALL 1                 # Per-CPU statistics
```

### Network Troubleshooting

```bash
ss -s                           # Socket statistics summary
ss -tp                          # TCP connections with process info
tcpdump -i eth0 port 80         # Capture packets on port 80
tcpdump -i any -w capture.pcap  # Write capture to file
nmap -sV host                   # Port scan with version detection
```

### Common Debugging

```bash
strace command                  # Trace system calls
lsof                            # List open files
lsof -i :80                     # What's using port 80
lsof -p 1234                    # Files opened by PID 1234
fuser -n tcp 80                 # Which process uses TCP port 80
```

---

## 16. Linux Best Practices for DevOps

### Security

- **Use SSH keys** instead of password authentication; disable `PasswordAuthentication` in `/etc/ssh/sshd_config`.
- **Disable root login** via SSH: set `PermitRootLogin no` in sshd config.
- **Apply least privilege**: grant users only the permissions they need.
- **Keep systems updated**: run `apt upgrade` or `dnf update` regularly.
- **Use `sudo` instead of logging in as root** for administrative tasks.
- **Configure UFW/firewalld** to restrict access to only necessary ports.

### Performance

- **Monitor with `top`, `htop`, `iostat`, and `vmstat`** to identify bottlenecks.
- **Use `nice` and `renice`** to manage process priorities on busy systems.
- **Tune `/etc/sysctl.conf`** for network and kernel performance settings.

### Automation

- **Write idempotent shell scripts**: ensure scripts can be run multiple times safely.
- **Use `systemd` timers** instead of cron for more control over scheduled tasks.
- **Use environment variables** for configuration instead of hardcoding values.
- **Always test scripts** in a staging environment before running in production.

### Logging

- **Centralize logs** using tools like the ELK Stack or a log shipping agent.
- **Use `logrotate`** to prevent logs from filling up disk space.
- **Monitor logs in real-time** with `tail -f` or `journalctl -f` during incidents.

---

## 17. References

### Official Documentation

- [Linux man-pages](https://man7.org/linux/man-pages/)
- [GNU Core Utilities](https://www.gnu.org/software/coreutils/manual/)
- [Bash Reference Manual](https://www.gnu.org/software/bash/manual/bash.html)
- [systemd Documentation](https://systemd.io/)

### Community Resources

- [Linux Journey](https://linuxjourney.com/) – Interactive Linux learning
- [The Linux Command Line (book)](https://linuxcommand.org/tlcl.php) – Free online book
- [Arch Linux Wiki](https://wiki.archlinux.org/) – Excellent reference for all distros
- [OverTheWire: Bandit](https://overthewire.org/wargames/bandit/) – Practice Linux skills
