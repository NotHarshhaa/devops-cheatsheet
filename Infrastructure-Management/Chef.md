# 🧑‍🍳 Chef Cheat Sheet

[![chef-cheat.png](https://i.postimg.cc/SsthzhnB/chef-cheat.png)](https://postimg.cc/hzxwHNbs)

## 📘 Introduction

Chef (now part of Progress) is a powerful **Infrastructure as Code (IaC)** and configuration management tool written in Ruby and Erlang. It automates the process of provisioning, configuring, and maintaining servers and hybrid cloud infrastructure.

Chef operates under an **agent-server** (Chef Infra Server + Chef Infra Client) or **standalone local mode** architecture.

---

## 🟢 Beginner Level

### 🔹 Key Concepts

* **Node**: A physical server, virtual machine, or container managed by Chef Infra Client.
* **Cookbook**: The fundamental unit of distribution and configuration containing recipes, attributes, templates, and files.
* **Recipe**: A file (`.rb`) containing declarative Ruby instructions specifying resources to manage.
* **Resource**: A statement of configuration describing the desired state of a system component (`package`, `service`, `file`, `template`, etc.).
* **Run-list**: An ordered list of recipes and roles executed by the client on a specific node.
* **Ohai**: The system profiling tool that automatically detects node attributes (OS, IP, CPU, memory).

---

## 🍳 Chef Commands Quick Reference

<details>
<summary>🟢 Beginner Commands (Click to Expand)</summary>

### 🔹 Check Version

```bash
chef -v
chef-client -v
```

### 🔹 Generate Cookbook & Recipe

```bash
chef generate cookbook my_cookbook
chef generate recipe my_cookbook default
```

### 🔹 Run Chef Client (Local Mode)

```bash
chef-client --local-mode --runlist 'recipe[my_cookbook]'
```

### 🔹 Lint with Cookstyle

```bash
cookstyle
cookstyle -a   # Auto-correct linting errors
```

</details>

---

<details>
<summary>🟡 Intermediate Commands (Click to Expand)</summary>

### 🔹 Knife Bootstrap Node

```bash
knife bootstrap 192.168.1.50 -U ubuntu --sudo -N web-node-01 -r 'recipe[my_cookbook]'
```

### 🔹 Upload Cookbooks to Server

```bash
knife cookbook upload my_cookbook
knife cookbook list
```

### 🔹 Node & Role Management

```bash
knife node show web-node-01
knife node list
knife role list
knife role show webserver
```

### 🔹 Run Chef Client Remotely

```bash
knife ssh 'name:web-node-*' 'sudo chef-client' -x ubuntu
```

</details>

---

<details>
<summary>🔴 Advanced Commands (Click to Expand)</summary>

### 🔹 Knife Search

```bash
knife search node 'role:webserver AND platform:ubuntu'
knife search node 'ohai_time:[* TO 1600000000]'
```

### 🔹 Data Bags

```bash
knife data bag create secrets
knife data bag from file secrets db_creds.json --secret-file /path/to/encrypted_data_bag_secret
knife data bag show secrets db_creds
```

### 🔹 Policyfiles

```bash
chef install Policyfile.rb
chef update Policyfile.rb
chef push production Policyfile.lock.json
```

### 🔹 Automated Testing (ChefSpec & Test Kitchen)

```bash
chef exec rspec                               # Run ChefSpec unit tests
kitchen test                                  # Full integration test cycle
kitchen converge && kitchen verify            # Fast development iteration
```

</details>

---

## 🛠️ Installation & Setup

### 🔹 Install Chef Workstation

Chef Workstation includes the Chef CLI, Knife, Test Kitchen, Cookstyle, InSpec, and embedded Ruby.

```bash
# Ubuntu / Debian
curl https://omnitruck.chef.io/install.sh | sudo bash -s -- -P chef-workstation

# CentOS / RHEL / Fedora
curl https://omnitruck.chef.io/install.sh | sudo bash -s -- -P chef-workstation

# Verify installation
chef -v
```

---

## 📦 Cookbooks & Core Resources

### 🔹 Generate Cookbook

```bash
chef generate cookbook my_cookbook
cd my_cookbook
```

Cookbook Directory Structure:

```plaintext
my_cookbook/
├── Policyfile.rb
├── README.md
├── attributes/
│   └── default.rb
├── recipes/
│   └── default.rb
├── templates/
├── files/
├── resources/
└── test/
```

### 🔹 Core Resource Examples

```ruby
# recipes/default.rb

# Install package
package 'nginx' do
  action :install
end

# Manage file
file '/var/www/html/index.html' do
  content '<h1>Deployed by Chef Infra!</h1>'
  mode '0644'
  owner 'www-data'
  group 'www-data'
end

# Manage service
service 'nginx' do
  action [:enable, :start]
end
```

---

## 🔔 Notifications & Subscriptions

Notifications allow resources to communicate changes and trigger actions on other resources (e.g. restart a service when its configuration file updates).

### 🔹 Forward Notification (`notifies`)

```ruby
template '/etc/nginx/nginx.conf' do
  source 'nginx.conf.erb'
  mode '0644'
  notifies :restart, 'service[nginx]', :delayed  # :delayed (default) or :immediate
end

service 'nginx' do
  action [:enable, :start]
end
```

### 🔹 Reverse Notification (`subscribes`)

```ruby
service 'nginx' do
  action :nothing
  subscribes :restart, 'template[/etc/nginx/nginx.conf]', :delayed
end
```

---

## 🟡 Intermediate Level

### 🔸 Attributes & Precedence

Attributes are variables defined across cookbooks, environments, or roles.

```ruby
# attributes/default.rb
default['web']['port'] = 80
default['web']['docroot'] = '/var/www/html'
override['web']['max_clients'] = 250
```

**Attribute Precedence Order (Lowest to Highest):**
1. Default (`default`)
2. Force Default (`force_default`)
3. Normal (`normal`)
4. Override (`override`)
5. Force Override (`force_override`)
6. Automatic (read-only from Ohai)

Access attributes in recipes:

```ruby
file "#{node['web']['docroot']}/index.html" do
  content "Port configured: #{node['web']['port']}"
end
```

---

### 🔸 Templates (Embedded Ruby - ERB)

Create dynamic configuration files based on node attributes:

```bash
chef generate template my_cookbook nginx.conf
```

Template file (`templates/nginx.conf.erb`):

```erb
server {
    listen <%= node['web']['port'] %>;
    server_name <%= node['fqdn'] %>;
    root <%= node['web']['docroot'] %>;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

Recipe usage:

```ruby
template '/etc/nginx/sites-available/default' do
  source 'nginx.conf.erb'
  owner 'root'
  group 'root'
  mode '0644'
  notifies :reload, 'service[nginx]'
end
```

---

### 🔸 Data Bags & Encrypted Secrets

Data bags store global JSON data accessible by any node in your infrastructure.

```json
// data_bags/users/deploy.json
{
  "id": "deploy",
  "uid": 2001,
  "shell": "/bin/bash",
  "comment": "Deployment Service Account"
}
```

Accessing in recipes:

```ruby
deploy_user = data_bag_item('users', 'deploy')

user deploy_user['id'] do
  uid deploy_user['uid']
  shell deploy_user['shell']
  comment deploy_user['comment']
  manage_home true
end
```

---

## 🔴 Advanced Level

### 🔹 Modern Custom Resources (Chef 17/18)

Custom resources allow you to build reusable domain-specific abstractions.

File: `resources/website.rb`:

```ruby
resource_name :my_website
provides :my_website
unified_mode true

property :site_name, String, name_property: true
property :port, Integer, default: 80

action :create do
  directory "/var/www/#{new_resource.site_name}" do
    owner 'www-data'
    mode '0755'
    recursive true
  end

  file "/var/www/#{new_resource.site_name}/index.html" do
    content "<h1>Welcome to #{new_resource.site_name} on port #{new_resource.port}</h1>"
  end
end

action :delete do
  directory "/var/www/#{new_resource.site_name}" do
    action :delete
    recursive true
  end
end
```

Usage in recipe:

```ruby
my_website 'internal-portal' do
  port 8080
  action :create
end
```

---

### 🔹 Policyfiles (Modern Replacement for Roles & Environments)

Policyfiles lock cookbook dependencies and run-lists into an immutable, versioned artifact (`Policyfile.lock.json`).

File: `Policyfile.rb`:

```ruby
name 'webserver_policy'
default_source :supermarket
run_list 'my_cookbook::default'

cookbook 'my_cookbook', path: '.'
cookbook 'nginx', '~> 12.0'
```

CLI commands:

```bash
# Compile and lock dependencies
chef install Policyfile.rb

# Push policy to Chef Infra Server
chef push production Policyfile.lock.json
```

---

### 🔹 Testing with InSpec & Test Kitchen

File: `.kitchen.yml`:

```yaml
---
driver:
  name: vagrant

provisioner:
  name: chef_zero
  enforce_idempotency: true

platforms:
  - name: ubuntu-22.04

suites:
  - name: default
    verifier:
      inspec_tests:
        - test/integration/default
```

Run tests:

```bash
kitchen converge   # Boots VM and runs Chef Client
kitchen verify     # Executes InSpec compliance tests
kitchen destroy    # Tears down test VM
```

InSpec Test Example (`test/integration/default/default_test.rb`):

```ruby
describe package('nginx') do
  it { should be_installed }
end

describe service('nginx') do
  it { should be_running }
  it { should be_enabled }
end

describe port(80) do
  it { should be_listening }
end
```

---

## 📌 Best Practices

1. **Always enable `unified_mode true`**: Ensures execution phase matches compile phase behavior in modern Chef.
2. **Lint with Cookstyle**: Run `cookstyle` before committing code to enforce RuboCop and Chef standards.
3. **Prefer Policyfiles over Berkshelf/Roles**: Provides deterministic builds and eliminates environment dependency conflicts.
4. **Use `:delayed` Notifications**: Prevents repeated service restarts during cookbook runs.
5. **Encrypt Sensitive Data**: Always use Encrypted Data Bags or HashiCorp Vault integrations for passwords and keys.

---

## 📚 Learning Resources

* 🔗 [Official Chef Documentation](https://docs.chef.io/)
* 📦 [Chef Supermarket (Community Cookbooks)](https://supermarket.chef.io/)
* 🛡️ [Chef InSpec Documentation](https://docs.chef.io/inspec/)
* 🧪 [Test Kitchen](https://kitchen.ci/)
