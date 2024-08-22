# Nagios Cheatsheet

![text](https://imgur.com/O9DGMee.png)

**1. Introduction:**

- **Nagios** is a powerful open-source monitoring tool that provides comprehensive monitoring of systems, networks, and infrastructure. It is known for its robustness, flexibility, and extensive plugin system.

**2. Installation:**

- **Installing Nagios Core:**

  ```bash
  sudo apt-get update
  sudo apt-get install -y build-essential libgd2-xpm-dev openssl libssl-dev xinetd apache2-utils unzip
  wget https://assets.nagios.com/downloads/nagioscore/releases/nagios-4.4.6.tar.gz
  tar -xzf nagios-4.4.6.tar.gz
  cd nagios-4.4.6/
  ./configure --with-httpd-conf=/etc/apache2/sites-enabled
  make all
  sudo make install
  sudo make install-commandmode
  sudo make install-init
  sudo make install-config
  sudo make install-webconf
  ```

- **Starting Nagios:**

  ```bash
  sudo systemctl start nagios
  sudo systemctl enable nagios
  ```

**3. Configuration:**

- **Basic Configuration:**
  - Nagios configuration files are typically located in `/usr/local/nagios/etc/`.

- **Defining a Host:**

  ```cfg
  define host {
    use             linux-server
    host_name       myserver
    alias           My Linux Server
    address         192.168.1.1
    }
  ```

- **Defining a Service:**

  ```cfg
  define service {
    use                     generic-service
    host_name               myserver
    service_description     HTTP
    check_command           check_http
    }
  ```

**4. Nagios Plugins:**

- **Installing Plugins:**

  ```bash
  wget https://nagios-plugins.org/download/nagios-plugins-2.3.3.tar.gz
  tar -xzf nagios-plugins-2.3.3.tar.gz
  cd nagios-plugins-2.3.3/
  ./configure
  make
  sudo make install
  ```

- **Common Plugins:**
  - **check_ping:** Monitors network connectivity.
  - **check_http:** Monitors HTTP servers.
  - **check_disk:** Monitors disk usage.

**5. Notifications:**

- **Setting Up Email Notifications:**
  - Configure email settings in `/usr/local/nagios/etc/objects/contacts.cfg`:

  ```cfg
  define contact {
    contact_name                    nagiosadmin
    use                             generic-contact
    alias                           Nagios Admin
    email                           nagios@yourdomain.com
  }
  ```

- **Notification Commands:**
  - Use commands like `notify-host-by-email` and `notify-service-by-email` to define how notifications are sent.

**6. Web Interface:**

- **Accessing Nagios Web Interface:**
  - Nagios web interface is usually accessible at `http://<your-server-ip>/nagios`.
  - Default credentials: `nagiosadmin` and the password set during installation.

- **Customizing the Interface:**
  - Modify the theme and layout by editing files in `/usr/local/nagios/share`.

**7. Monitoring Remote Hosts:**

- **NRPE (Nagios Remote Plugin Executor):**
  - **Installing NRPE:**

    ```bash
    sudo apt-get install nagios-nrpe-server nagios-plugins
    sudo systemctl start nagios-nrpe-server
    ```

  - **Configuring NRPE:**
    - Edit `/etc/nagios/nrpe.cfg` to define allowed hosts and monitored services.

    ```cfg
    allowed_hosts=127.0.0.1,192.168.1.100
    command[check_disk]=/usr/lib/nagios/plugins/check_disk -w 20% -c 10% -p /dev/sda1
    ```

  - **Monitoring with NRPE:**
    - Add a service in Nagios to monitor a remote host using NRPE.

    ```cfg
    define service {
      use                     generic-service
      host_name               remotehost
      service_description     Disk Usage
      check_command           check_nrpe!check_disk
    }
    ```

**8. Nagios XI:**

- **Introduction to Nagios XI:**
  - Nagios XI is the commercial version of Nagios Core, providing additional features like a more user-friendly interface, reporting, and advanced monitoring capabilities.

- **Differences from Nagios Core:**
  - Built-in wizards, easier configuration, and more extensive support.

**9. Advanced Nagios Concepts:**

- **Passive Checks:**
  - Useful for monitoring systems where Nagios cannot initiate checks, but the system can send results to Nagios.

- **Distributed Monitoring:**
  - Implement distributed monitoring by setting up multiple Nagios servers and configuring them to send data to a central Nagios server.

**10. Securing Nagios:**

- **Enabling HTTPS:**
  - Configure Apache to serve Nagios over HTTPS.

  ```bash
  sudo a2enmod ssl
  sudo service apache2 restart
  ```

  - Update Nagios configuration in `/etc/apache2/sites-available/nagios.conf` to use SSL certificates.

- **User Authentication:**
  - Use `.htpasswd` files to manage user access to the Nagios web interface.

**11. Troubleshooting Nagios:**

- **Common Issues:**
  - **Service Check Failing:** Ensure plugins are executable and paths are correct.
  - **Email Notifications Not Working:** Verify the mail server configuration and check the `maillog` for errors.

- **Debugging:**
  - Use the Nagios log file at `/usr/local/nagios/var/nagios.log` to troubleshoot issues.
  - Run checks manually to verify plugin output.

  ```bash
  /usr/local/nagios/libexec/check_http -I 127.0.0.1
  ```

**12. Nagios and Docker:**

- **Running Nagios in Docker:**

  ```bash
  docker run --name nagios -p 0.0.0.0:8080:80 jasonrivers/nagios
  ```

- **Customizing Dockerized Nagios:**
  - Mount volumes to add custom configurations and plugins.

  ```bash
  docker run --name nagios -v /path/to/nagios.cfg:/usr/local/nagios/etc/nagios.cfg jasonrivers/nagios
  ```
