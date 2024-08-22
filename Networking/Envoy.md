# Envoy Cheatsheet

![text](https://imgur.com/iw5sG1a.png)

## **Overview**

Envoy is a high-performance, open-source edge and service proxy. Originally developed by Lyft, Envoy is now widely adopted for managing microservices communication, especially within service meshes. Envoy handles tasks such as load balancing, security, observability, and routing.

### **Basic Concepts**

- **Proxy:** Envoy acts as a proxy, sitting between services and managing all incoming and outgoing traffic. It intercepts, processes, and forwards requests based on predefined configurations.

- **Listener:** A listener is a configuration that defines how Envoy should accept incoming connections. It specifies the port and protocols (e.g., HTTP, TCP) Envoy listens to.

- **Cluster:** In Envoy, a cluster represents a group of upstream services that Envoy proxies traffic to. A cluster typically consists of multiple instances of a service, allowing Envoy to distribute requests across them.

- **Route:** Routes define how requests are processed and forwarded by Envoy. A route maps incoming requests to the appropriate cluster based on various criteria like URL paths or headers.

### **Traffic Management**

- **Load Balancing:** Envoy provides several load balancing algorithms to distribute traffic across service instances. Common algorithms include round-robin, least-request, and ring-hash. Load balancing ensures that no single instance is overwhelmed with too much traffic.

- **Retries:** Envoy can automatically retry failed requests based on configurable policies. For example, if an upstream service fails to respond, Envoy can retry the request on a different instance.

- **Circuit Breakers:** Circuit breakers prevent a service from becoming overwhelmed by limiting the number of concurrent connections or requests. If a service exceeds the defined thresholds, Envoy will stop sending traffic to it until it recovers.

- **Rate Limiting:** Envoy allows you to define rate limits on incoming requests, controlling how many requests are allowed over a given period. This is useful for preventing abuse or overloading of services.

### **Security**

- **TLS Termination:** Envoy can handle TLS termination, decrypting inbound traffic, and encrypting outbound traffic. This simplifies the management of secure communications within your services.

- **mTLS (Mutual TLS):** Envoy supports mutual TLS for securing service-to-service communication. This ensures that both parties in a communication exchange authenticate each other and that their communication is encrypted.

- **RBAC (Role-Based Access Control):** Envoy implements RBAC to control access to services based on predefined roles and permissions. This adds an additional layer of security, ensuring that only authorized services or users can access specific resources.

### **Observability**

- **Metrics:** Envoy provides detailed metrics about network traffic, including request counts, latency, error rates, and more. These metrics are essential for monitoring the health and performance of your services.

- **Access Logs:** Envoy generates detailed access logs for each request it handles. These logs include information about the request’s origin, the response status, and any errors encountered. Access logs are valuable for auditing and debugging.

- **Tracing:** Envoy integrates with distributed tracing systems like Jaeger and Zipkin. Tracing provides a detailed view of a request’s journey through various services, helping you identify bottlenecks and failures in your application.

### **Advanced Concepts**

- **Filter Chains:** Envoy’s filter chains allow for complex request processing. Filters can modify, route, or reject requests based on various conditions. Common filters include authentication, rate limiting, and request transformation.

- **Dynamic Configuration with xDS APIs:** Envoy supports dynamic configuration through a set of APIs known as xDS (e.g., ADS, CDS, LDS, RDS, EDS). These APIs allow Envoy to update its configuration in real-time without restarting. This capability is crucial for environments where services are constantly changing.

- **Sidecar Proxy:** In a service mesh, Envoy is typically deployed as a sidecar proxy alongside each microservice. The sidecar intercepts all traffic to and from the service, providing security, observability, and traffic management features.

### **Example Use Case**

Imagine you are running an e-commerce application with multiple microservices such as payment, inventory, and user services. Here’s how

 Envoy can help:

1. **Secure Communication:** Use Envoy’s TLS termination to encrypt all traffic between the microservices.
2. **Load Balancing:** Distribute incoming requests evenly across multiple instances of the payment service using Envoy’s round-robin load balancing.
3. **Rate Limiting:** Protect the user service from abuse by setting a rate limit on login attempts.
4. **Observability:** Monitor the health of all microservices using Envoy’s metrics and integrate with Prometheus for alerting.
5. **Resilience:** Use circuit breakers to prevent the inventory service from becoming overwhelmed during high traffic periods.
