# 📜 **Ansible Cheatsheet**  

![ansible](https://imgur.com/XwECXoK.png)

## **🔹 Introduction to Ansible**  

### ✅ What is Ansible?  

Ansible is an **open-source automation tool** used for:  
✅ **Configuration Management** (e.g., installing & managing software on servers)  
✅ **Application Deployment** (e.g., deploying a web app on multiple servers)  
✅ **Orchestration** (e.g., managing multi-tier applications like load balancer + DB)  
✅ **Provisioning** (e.g., setting up cloud infrastructure with AWS, Azure, GCP)  

### ✅ Why Use Ansible?  

🔹 **Agentless:** No need to install agents on target machines (uses SSH & WinRM)  
🔹 **Idempotent:** Runs multiple times without unwanted changes  
🔹 **Human-Readable:** Uses YAML playbooks  
🔹 **Cross-Platform:** Works on **Linux, Windows, macOS, Cloud Servers**  

---

## **🛠️ 1. Installing & Setting Up Ansible**  

### ✅ Installing Ansible on Linux  

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install -y ansible

# CentOS/RHEL
sudo yum install -y ansible
```

### ✅ Checking Installation  

```bash
ansible --version
```

### ✅ Setting Up an Inventory File  

An **inventory file** (`/etc/ansible/hosts`) tells Ansible where to connect.  
Example:  

```ini
[webservers]
server1 ansible_host=192.168.1.10 ansible_user=ubuntu
server2 ansible_host=192.168.1.11 ansible_user=ubuntu

[dbservers]
db1 ansible_host=192.168.1.20 ansible_user=root
```

### ✅ Testing Connectivity with `ping`  

```bash
ansible all -m ping
```

📌 If successful, you'll see:  

```bash
server1 | SUCCESS => {"changed": false, "ping": "pong"}
server2 | SUCCESS => {"changed": false, "ping": "pong"}
```

---

## **🚀 2. Running Ad-Hoc Commands (Quick Tasks Without a Playbook)**  

✅ **Check disk usage**  

```bash
ansible all -m command -a "df -h"
```

✅ **Check system uptime**  

```bash
ansible all -m command -a "uptime"
```

✅ **Create a directory on remote hosts**  

```bash
ansible all -m file -a "path=/opt/newdir state=directory"
```

✅ **Copy files to remote servers**  

```bash
ansible all -m copy -a "src=/tmp/file.txt dest=/home/ubuntu/file.txt"
```

✅ **Install a package (e.g., nginx) on all web servers**  

```bash
ansible webservers -m apt -a "name=nginx state=present" --become
```

✅ **Restart a service (e.g., nginx)**  

```bash
ansible webservers -m service -a "name=nginx state=restarted" --become
```

---

## **📜 3. Writing Ansible Playbooks (Automation Scripts)**  

✅ **What is a Playbook?**  
A **playbook** is a YAML file that contains tasks to **automate configuration**.  

### **🔹 Basic Playbook Example**  

```yaml
- name: Install and Start Nginx
  hosts: webservers
  become: yes  # Run as sudo
  tasks:
    - name: Install Nginx
      apt:
        name: nginx
        state: present

    - name: Start Nginx
      service:
        name: nginx
        state: started
```

✅ **Run the Playbook**  

```bash
ansible-playbook playbook.yml
```

---

## **🔹 4. Using Variables in Ansible**  

✅ **Define Variables in a Playbook**  

```yaml
- name: Install a Package with a Variable
  hosts: webservers
  vars:
    package_name: nginx
  tasks:
    - name: Install Package
      apt:
        name: "{{ package_name }}"
        state: present
```

✅ **Use Built-in Ansible Facts**  

```bash
ansible all -m setup
```

Example Fact Usage in Playbook:  

```yaml
- name: Display System Information
  hosts: all
  tasks:
    - debug:
        msg: "This server is running {{ ansible_distribution }} {{ ansible_distribution_version }}"
```

---

## **🔹 5. Loops & Conditionals**  

✅ **Loop Example (Install Multiple Packages)**  

```yaml
- name: Install Multiple Packages
  hosts: webservers
  become: yes
  tasks:
    - name: Install Packages
      apt:
        name: "{{ item }}"
        state: present
      loop:
        - nginx
        - curl
        - unzip
```

✅ **Conditional Execution**  

```yaml
- name: Restart Nginx Only If Needed
  hosts: webservers
  become: yes
  tasks:
    - name: Check if Nginx is Running
      shell: pgrep nginx
      register: nginx_running
      ignore_errors: yes

    - name: Restart Nginx
      service:
        name: nginx
        state: restarted
      when: nginx_running.rc == 0
```

---

## **📂 6. Ansible Roles (Best Practices for Large Projects)**  

✅ **Generate an Ansible Role Structure**  

```bash
ansible-galaxy init my_role
```

📌 This creates a structured directory like:  

```plaintext
my_role/
├── tasks/
│   └── main.yml
├── handlers/
│   └── main.yml
├── templates/
├── files/
├── vars/
│   └── main.yml
├── defaults/
│   └── main.yml
├── meta/
│   └── main.yml
├── README.md
```

✅ **Use Roles in a Playbook**  

```yaml
- name: Deploy Web Server
  hosts: webservers
  roles:
    - nginx_role
```

---

## **🔐 7. Ansible Vault (Encrypting Secrets)**  

✅ **Create an Encrypted File**  

```bash
ansible-vault create secrets.yml
```

✅ **Edit an Encrypted File**  

```bash
ansible-vault edit secrets.yml
```

✅ **Use Vault in Playbooks**  

```yaml
- name: Deploy with Encrypted Secrets
  hosts: webservers
  vars_files:
    - secrets.yml
  tasks:
    - debug:
        msg: "The secret password is {{ secret_password }}"
```

✅ **Run Playbook with Vault Password Prompt**  

```bash
ansible-playbook playbook.yml --ask-vault-pass
```

---

## **🎯 8. Useful Ansible Commands**  

✅ **Check Playbook Syntax**  

```bash
ansible-playbook playbook.yml --syntax-check
```

✅ **Dry Run (Test Without Executing Changes)**  

```bash
ansible-playbook playbook.yml --check
```

✅ **List All Available Modules**  

```bash
ansible-doc -l
```

✅ **Get Help for a Specific Module**  

```bash
ansible-doc apt
```

---

## 🎯 **Conclusion**  

This **Ansible Cheatsheet** provides a **step-by-step guide** from **beginner to advanced**.  

🚀 **Next Steps:**  
✅ **Practice with real-world playbooks**  
✅ **Use roles for better structuring**  
✅ **Secure credentials with Ansible Vault**  
✅ **Automate cloud infrastructure with Terraform + Ansible**  

🔗 **Contribute to the Cheatsheet Collection:** [GitHub Repo](https://github.com/NotHarshhaa/devops-cheatsheet)  
