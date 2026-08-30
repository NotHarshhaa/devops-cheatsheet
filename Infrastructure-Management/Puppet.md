# 🤖 Puppet Cheat Sheet

[![puppet-cheat.png](https://i.postimg.cc/HkpyTqyw/puppet-cheat.png)](https://postimg.cc/8j05Hnwc)

## 📘 Introduction

[Puppet](https://puppet.com) is an **enterprise-grade configuration management tool** that automates the provisioning, configuration, and compliance of infrastructure across multi-cloud and on-premises environments.

Puppet uses a **declarative domain-specific language (DSL)** based on Ruby to model system state. It can be deployed in an **agent-server (primary/agent)** architecture or run standalone using **Puppet Apply** or **Puppet Bolt** (agentless task runner).

---

## 🧠 Key Concepts

| Term | Description |
| --- | --- |
| **Manifest** | A file containing Puppet DSL code with the `.pp` file extension. |
| **Resource** | The basic unit of configuration representing a system element (`package`, `file`, `service`, `user`). |
| **Class** | A named, reusable block of Puppet code representing a singleton configuration component. |
| **Defined Type** | Reusable block that can be instantiated multiple times with unique titles. |
| **Module** | A structured package containing manifests, templates, files, and metadata. |
| **Facts** | System metadata automatically gathered from managed nodes using **Facter**. |
| **Catalog** | Compiled dependency graph representing the desired state for a specific node. |
| **Hiera** | Key-value hierarchical data lookup tool separating code from configuration data. |

---

## 🧾 Puppet Commands Quick Reference

<details>
<summary>🟢 Beginner Commands (Click to Expand)</summary>

### 🔹 Check Version & Environment

```bash
puppet --version
facter --version
```

### 🔹 Apply Manifest Locally

```bash
puppet apply manifest.pp
puppet apply --noop manifest.pp   # Dry-run mode (no changes applied)
```

### 🔹 Syntax Validation & Linting

```bash
puppet parser validate manifest.pp
puppet-lint manifest.pp
```

### 🔹 Inspect & Query System Resources

```bash
puppet resource user root
puppet resource service sshd
puppet resource package nginx
```

### 🔹 View System Facts

```bash
facter
facter os.family
facter networking.ip
facter memory.system.available
```

</details>

---

<details>
<summary>🟡 Intermediate Commands (Click to Expand)</summary>

### 🔹 PDK (Puppet Development Kit)

```bash
pdk new module my_module
pdk new class my_class
pdk validate                      # Syntax, linting, metadata check
pdk test unit                     # Run RSpec unit tests
```

### 🔹 Manage Modules

```bash
puppet module list
puppet module install puppetlabs-apt
puppet module install puppetlabs-docker
puppet module upgrade puppetlabs-apt
```

### 🔹 Trigger Agent Run Manually

```bash
# Run agent once and print verbose output
puppet agent -t

# Dry-run agent execution
puppet agent -t --noop

# Enable debug logging
puppet agent -t --debug
```

</details>

---

<details>
<summary>🔴 Advanced Commands (Click to Expand)</summary>

### 🔹 Certificate Authority Management (`puppetserver ca`)

```bash
# List all pending certificate signing requests (CSRs)
puppetserver ca list

# Sign an agent certificate
puppetserver ca sign --certname node1.example.com

# Sign all pending certificates
puppetserver ca sign --all

# Revoke and clean a decommissioned node certificate
puppetserver ca revoke --certname node1.example.com
puppetserver ca clean --certname node1.example.com
```

### 🔹 PuppetDB & PQL Queries

```bash
# Query nodes by operating system
puppet query 'inventory[certname] { facts.os.family = "Debian" }'

# Query nodes where a specific package is installed
puppet query 'resources[certname] { type = "Package" and title = "openssl" }'
```

### 🔹 Hiera CLI Lookup

```bash
puppet lookup my_module::port --node web1.example.com --explain
```

### 🔹 Puppet Bolt (Agentless Task Execution)

```bash
bolt command run "uptime" --targets linux_servers
bolt task run package action=install name=curl --targets web1.example.com
bolt plan run myplan::deploy --targets all
```

</details>

---

## 🟢 Beginner Level: Syntax & Resources

### 🔹 Basic Resource Declaration

```puppet
# Manage file
file { '/etc/motd':
  ensure  => file,
  owner   => 'root',
  group   => 'root',
  mode    => '0644',
  content => "Authorized Access Only - Managed by Puppet\n",
}

# Manage package
package { 'nginx':
  ensure => installed,
}

# Manage service
service { 'nginx':
  ensure => running,
  enable => true,
}
```

---

## 🔗 Resource Relationships & Chaining

In Puppet, resources do not execute in linear top-to-bottom order by default. You must declare explicit dependencies using metaparameters or chaining arrows.

### 🔹 Relationship Metaparameters

| Metaparameter | Behavior |
| --- | --- |
| `require` | Current resource applies **after** specified resource |
| `before` | Current resource applies **before** specified resource |
| `notify` | Current resource applies **before** and sends a refresh trigger if changed |
| `subscribe` | Current resource applies **after** and refreshes if target changed |

```puppet
package { 'nginx':
  ensure => installed,
}

file { '/etc/nginx/nginx.conf':
  ensure  => file,
  source  => 'puppet:///modules/nginx/nginx.conf',
  require => Package['nginx'],
  notify  => Service['nginx'],
}

service { 'nginx':
  ensure => running,
  enable => true,
}
```

### 🔹 Chaining Arrows

Use `->` (ordering) and `~>` (ordering with notification):

```puppet
Package['nginx'] -> File['/etc/nginx/nginx.conf'] ~> Service['nginx']
```

---

## 🟡 Intermediate Level: Classes, Defined Types & Modules

### 🔸 Classes vs Defined Types

* **Class**: Singleton. Can only be declared once per node.
* **Defined Type**: Reusable prototype. Can be instantiated multiple times with different titles.

#### Class Example:

```puppet
class nginx (
  Integer $port = 80,
  String $package_name = 'nginx',
) {
  package { $package_name:
    ensure => installed,
  }

  file { '/etc/nginx/sites-available/default':
    ensure  => file,
    content => epp('nginx/vhost.epp', { 'port' => $port }),
    notify  => Service['nginx'],
  }

  service { 'nginx':
    ensure => running,
    enable => true,
  }
}
```

#### Defined Resource Type Example:

```puppet
define nginx::vhost (
  Integer $port,
  String $docroot,
) {
  file { "/etc/nginx/conf.d/${title}.conf":
    ensure  => file,
    content => epp('nginx/vhost_snippet.epp', {
      'server_name' => $title,
      'port'        => $port,
      'docroot'     => $docroot,
    }),
    notify  => Service['nginx'],
  }
}

# Invoking multiple instances:
nginx::vhost { 'blog.example.com':
  port    => 80,
  docroot => '/var/www/blog',
}

nginx::vhost { 'shop.example.com':
  port    => 8080,
  docroot => '/var/www/shop',
}
```

---

### 🔸 Templates: EPP (Embedded Puppet) vs ERB

Modern Puppet favors **EPP (`.epp`)** templates using native Puppet DSL over legacy ERB.

File: `templates/vhost.epp`:

```puppet
<%- | String $server_name, Integer $port, String $docroot | -%>
server {
    listen <%= $port %>;
    server_name <%= $server_name %>;
    root <%= $docroot %>;
}
```

Usage in manifest:

```puppet
file { '/etc/nginx/conf.d/site.conf':
  ensure  => file,
  content => epp('nginx/vhost.epp', {
    'server_name' => 'example.com',
    'port'        => 80,
    'docroot'     => '/var/www/html',
  }),
}
```

---

## 🔴 Advanced Level: Hiera & Directory Environments

### 🔹 Modern Hiera 5 Configuration (`hiera.yaml`)

Hiera separates code logic from site-specific data:

```yaml
version: 5
defaults:
  datadir: data
  data_hash: yaml_data

hierarchy:
  - name: "Per-node secrets (eyaml)"
    lookup_key: eyaml_lookup_key
    path: "nodes/%{trusted.certname}.eyaml"
  - name: "Per-node data"
    path: "nodes/%{trusted.certname}.yaml"
  - name: "Environment data"
    path: "environments/%{server_facts.environment}.yaml"
  - name: "Operating System Family"
    path: "os/%{facts.os.family}.yaml"
  - name: "Common data"
    path: "common.yaml"
```

Lookup data directly in Hiera YAML:

```yaml
# data/common.yaml
nginx::port: 80
app::db_user: 'app_admin'
```

---

### 🔹 Encrypted Secrets with Hiera-eYAML

Encrypt passwords directly in your git repository:

```bash
# Encrypt a secret string
eyaml encrypt -s 'SuperSecretPassword123'
```

Output stored safely in `data/common.eyaml`:

```yaml
app::db_password: >
  ENC[PKCS7,MIIBeQYJKoZIhvcNAQcDoIIBajCCAWYCAQAxggEhMIIBHQIBADAFMAACAQEw...==]
```

---

## 📌 Puppet Best Practices

1. **Use PDK for Module Authoring**: Standardize code style, unit tests, and validation.
2. **Always Declare Explicit Dependencies**: Use `require`, `notify`, or chaining arrows (`->`, `~>`) rather than relying on evaluation order.
3. **Prefer EPP over ERB**: EPP ensures type validation and syntax consistency with Puppet DSL.
4. **Use Trusted Facts**: Rely on `$trusted['certname']` for node identification to prevent fact spoofing.
5. **Keep Manifests Generic**: Store all environment-specific values in Hiera data files, not hardcoded in `.pp` files.

---

## 📚 Learning Resources

* 📘 [Official Puppet Documentation](https://puppet.com/docs/puppet/latest/puppet_index.html)
* 📦 [Puppet Forge (Community Modules)](https://forge.puppet.com/)
* 🛠️ [Puppet Development Kit (PDK)](https://puppet.com/docs/pdk/latest/pdk.html)
* 🧪 [Puppet Bolt Task Runner](https://puppet.com/docs/bolt/latest/bolt.html)
