# 📜 **Ansible Cheatsheet**  

![ansible](https://imgur.com/XwECXoK.png)

## **🔹 Introduction to Ansible**  

### ✅ What is Ansible?  

Ansible is an **open-source automation engine** by Red Hat used for:  
* ✅ **Configuration Management** (e.g., configuring operating systems, installing & managing software packages)  
* ✅ **Application Deployment** (e.g., zero-downtime rolling updates across web clusters)  
* ✅ **Orchestration** (e.g., coordinating multi-tier applications like load balancers + app + database)  
* ✅ **Provisioning** (e.g., provisioning cloud infrastructure on AWS, Azure, GCP, or bare metal)  

### ✅ Why Use Ansible?  

* 🔹 **Agentless:** No daemons or agents to install on managed nodes (uses native SSH on Linux/Unix and WinRM on Windows)  
* 🔹 **Idempotent:** Running tasks repeatedly guarantees the desired state without unwanted duplicate changes  
* 🔹 **Human-Readable:** Written in clear, declarative YAML syntax  
* 🔹 **Extensible:** Massive ecosystem of pre-built modules and collections on **Ansible Galaxy**  
* 🔹 **Cross-Platform:** Supports Linux, Windows, macOS, networking appliances (Cisco, Juniper, Arista), and cloud platforms  

---

## **🛠️ 1. Installing & Setting Up Ansible**  

### ✅ Installing Ansible on Control Node  

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install -y ansible

# CentOS/RHEL 8/9
sudo dnf install -y epel-release
sudo dnf install -y ansible

# Using Python pip (platform independent)
python3 -m pip install --user ansible ansible-lint
```

### ✅ Checking Installation & Environment  

```bash
ansible --version
```

### ✅ Ansible Configuration (`ansible.cfg`)

Ansible searches for `ansible.cfg` in the following precedence order:
1. `ANSIBLE_CONFIG` (environment variable)
2. `./ansible.cfg` (current working directory)
3. `~/.ansible.cfg` (user home directory)
4. `/etc/ansible/ansible.cfg` (global fallback)

Example project `./ansible.cfg`:

```ini
[defaults]
inventory = ./inventory.ini
remote_user = ubuntu
private_key_file = ~/.ssh/id_rsa
host_key_checking = False
forks = 10
retry_files_enabled = False

[privilege_escalation]
become = True
become_method = sudo
become_user = root
become_ask_pass = False

[ssh_connection]
pipelining = True
```

---

## **🌐 2. Managing Inventories (INI & YAML Formats)**

### ✅ INI Format (`inventory.ini`)

```ini
[webservers]
web1 ansible_host=192.168.1.10 ansible_user=ubuntu
web2 ansible_host=192.168.1.11 ansible_user=ubuntu

[dbservers]
db1 ansible_host=192.168.1.20 ansible_user=ubuntu

[production:children]
webservers
dbservers

[production:vars]
ansible_python_interpreter=/usr/bin/python3
env=production
```

### ✅ YAML Format (`inventory.yml`)

```yaml
all:
  children:
    webservers:
      hosts:
        web1:
          ansible_host: 192.168.1.10
        web2:
          ansible_host: 192.168.1.11
      vars:
        http_port: 80
    dbservers:
      hosts:
        db1:
          ansible_host: 192.168.1.20
      vars:
        db_port: 5432
  vars:
    ansible_user: ubuntu
    env: production
```

### ✅ Testing Connectivity with `ping`

```bash
# Ping all managed hosts
ansible all -i inventory.ini -m ping

# Ping only webservers
ansible webservers -m ping
```

---

## **🚀 3. Running Ad-Hoc Commands**  

Ad-hoc commands are ideal for quick one-off administrative tasks. Modern Ansible encourages using Fully Qualified Collection Names (FQCN) like `ansible.builtin.<module>`.

```bash
# Check disk usage on all nodes
ansible all -m ansible.builtin.command -a "df -h"

# Check system uptime
ansible all -m ansible.builtin.command -a "uptime"

# Run command with shell pipes/redirection
ansible all -m ansible.builtin.shell -a "grep -i error /var/log/syslog | tail -n 20"

# Create a directory on remote hosts
ansible all -m ansible.builtin.file -a "path=/opt/app state=directory mode=0755" --become

# Copy file to remote servers
ansible all -m ansible.builtin.copy -a "src=./app.conf dest=/etc/app.conf mode=0644" --become

# Install a package (e.g., nginx) on webservers
ansible webservers -m ansible.builtin.apt -a "name=nginx state=present update_cache=yes" --become

# Restart a service
ansible webservers -m ansible.builtin.service -a "name=nginx state=restarted" --become

# Gather and filter system facts
ansible all -m ansible.builtin.setup -a "filter=ansible_distribution*"
```

---

## **📜 4. Writing Ansible Playbooks**  

### ✅ Basic Playbook Structure with Handlers

Handlers run only once at the end of a play, and only when a task reporting a change triggers them via `notify`.

```yaml
---
- name: Configure Web Server with Nginx
  hosts: webservers
  become: true

  vars:
    server_name: example.com
    document_root: /var/www/html

  tasks:
    - name: Ensure Nginx is installed
      ansible.builtin.apt:
        name: nginx
        state: present
        update_cache: true

    - name: Deploy custom index page from template
      ansible.builtin.template:
        src: templates/index.html.j2
        dest: "{{ document_root }}/index.html"
        owner: www-data
        group: www-data
        mode: '0644'
      notify: Restart Nginx

    - name: Ensure Nginx service is running and enabled
      ansible.builtin.service:
        name: nginx
        state: started
        enabled: true

  handlers:
    - name: Restart Nginx
      ansible.builtin.service:
        name: nginx
        state: restarted
```

---

## **🧩 5. Jinja2 Templates (`template` Module)**

Templates let you generate dynamic configuration files with embedded variables, conditions, and loops.

Example template: `templates/index.html.j2`

```html
<!DOCTYPE html>
<html>
<head>
  <title>Welcome to {{ server_name }}</title>
</head>
<body>
  <h1>Managed by Ansible</h1>
  <p>Server Hostname: {{ ansible_hostname }}</p>
  <p>IP Address: {{ ansible_default_ipv4.address }}</p>
  <p>Operating System: {{ ansible_distribution }} {{ ansible_distribution_version }}</p>

  {% if env == 'production' %}
  <p><strong>Environment: PRODUCTION</strong></p>
  {% else %}
  <p>Environment: {{ env | default('development') }}</p>
  {% endif %}
</body>
</html>
```

---

## **🔹 6. Loops, Conditionals & Registers**  

### ✅ Loop Example (`loop`)

```yaml
- name: Install multiple packages
  ansible.builtin.apt:
    name: "{{ item }}"
    state: present
  loop:
    - nginx
    - git
    - curl
    - htop
    - ufw
```

### ✅ Register & Conditional Execution (`when`)

```yaml
- name: Check if application configuration exists
  ansible.builtin.stat:
    path: /etc/myapp/config.json
  register: config_file

- name: Initialize configuration if missing
  ansible.builtin.template:
    src: templates/config.json.j2
    dest: /etc/myapp/config.json
    mode: '0600'
  when: not config_file.stat.exists
```

---

## **📂 7. Ansible Roles (Organizing Complex Projects)**  

Roles allow you to automatically load related vars, files, tasks, handlers, and templates based on a known directory structure.

### ✅ Generate Role Skeleton

```bash
ansible-galaxy role init roles/nginx
```

Directory Structure:

```plaintext
roles/nginx/
├── defaults/       # Default variables (lowest precedence)
│   └── main.yml
├── vars/           # Role variables (high precedence)
│   └── main.yml
├── tasks/          # Main list of tasks executed by the role
│   └── main.yml
├── handlers/       # Handlers triggered by notify
│   └── main.yml
├── templates/      # Jinja2 templates (.j2)
│   └── nginx.conf.j2
├── files/          # Static files copied to target machines
├── meta/           # Role dependencies and author info
│   └── main.yml
└── README.md
```

### ✅ Using Roles in a Playbook

```yaml
---
- name: Deploy Production Application Stack
  hosts: webservers
  become: true
  roles:
    - role: common
    - role: nginx
      vars:
        nginx_port: 8080
    - role: myapp
```

---

## **🔐 8. Ansible Vault (Encrypting Sensitive Data)**  

Ansible Vault encrypts sensitive variables, passwords, SSH keys, or entire files.

```bash
# Create a new encrypted file
ansible-vault create vars/secrets.yml

# Edit an existing encrypted file
ansible-vault edit vars/secrets.yml

# Encrypt an existing plaintext file
ansible-vault encrypt credentials.txt

# Decrypt an encrypted file
ansible-vault decrypt credentials.txt

# View encrypted file contents without editing
ansible-vault view vars/secrets.yml

# Re-key with a new password
ansible-vault rekey vars/secrets.yml
```

### ✅ Running Playbooks with Vault

```bash
# Prompt for password interactively
ansible-playbook site.yml --ask-vault-pass

# Read password from a secure file
ansible-playbook site.yml --vault-password-file ~/.vault_pass.txt
```

---

## **🎯 9. Playbook Execution Flags & Workflow Control**  

| Command / Flag | Purpose |
| --- | --- |
| `ansible-playbook site.yml --syntax-check` | Check playbook for syntax errors without running |
| `ansible-playbook site.yml --check` | **Dry run** mode: simulate changes without modifying systems |
| `ansible-playbook site.yml --check --diff` | Simulate changes and show a unified diff of file alterations |
| `ansible-playbook site.yml --limit web1` | Limit execution to specific host(s) or group (`-l`) |
| `ansible-playbook site.yml --tags "deploy"` | Run only tasks tagged with `deploy` (`-t`) |
| `ansible-playbook site.yml --skip-tags "cleanup"` | Skip tasks tagged with `cleanup` |
| `ansible-playbook site.yml --step` | Interactive execution: confirm each task one by one |
| `ansible-playbook site.yml --start-at-task "Start Service"` | Resume playbook execution from a specific task |
| `ansible-playbook site.yml -e "version=2.1.0"` | Pass extra runtime variables (`--extra-vars`) |

---

## **📦 10. Ansible Galaxy Collections**

Ansible modularized features into collections (`namespace.collection`).

```bash
# Install a collection from Galaxy
ansible-galaxy collection install amazon.aws
ansible-galaxy collection install community.docker
ansible-galaxy collection install kubernetes.core

# Install all dependencies from a requirements.yml file
ansible-galaxy install -r requirements.yml
```

Example `requirements.yml`:

```yaml
---
roles:
  - name: geerlingguy.docker
    version: 7.4.4

collections:
  - name: amazon.aws
    version: 7.3.0
```

---

## **🧠 Tips & Production Best Practices**

1. **Always Use FQCN**: Specify `ansible.builtin.copy` rather than short name `copy` to avoid namespace collisions.
2. **Lint Every Commit**: Use `ansible-lint` in CI pipelines to catch anti-patterns and deprecations.
3. **Use Handlers for Restarts**: Avoid restarting services inside tasks; notify handlers so services only restart when configuration files change.
4. **Never Store Secrets in Plaintext**: Use `ansible-vault` for tokens, passwords, and private keys.
5. **Always Set File Permissions**: Always declare `mode: '0644'` or `mode: '0755'` when creating files and directories.
6. **Set `ansible_managed` Header**: Add `{{ ansible_managed }}` at the top of templates to warn users against manual edits.

---

## 📚 **Learning Resources**

* 🔗 [Official Ansible Documentation](https://docs.ansible.com/ansible/latest/)
* 📦 [Ansible Galaxy](https://galaxy.ansible.com/)
* 🔍 [Ansible Module Index](https://docs.ansible.com/ansible/latest/collections/ansible/builtin/index.html)
* 🧪 [Ansible Lint Guide](https://ansible.readthedocs.io/projects/lint/)
