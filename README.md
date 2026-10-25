# Resilient Astro SSR Blog (AWS ECS Fargate & SRE Pipeline)

A highly resilient, production-grade **Astro SSR (Server-Side Rendered)** travel platform deployed via **AWS CDK** onto a containerized **AWS ECS Fargate** cluster. This infrastructure architecture is explicitly designed, structured, and validated to satisfy strict **Site Reliability Engineering (SRE)** metric parameters, automated fault isolation loops, and zero-downtime availability targets.

---

## 🏗️ Architectural Topology

The codebase sits within a single unified repository separating application code from Infrastructure-as-Code (IaC) templates:

```text
├── .github/
│   └── workflows/
│       ├── ci.yml              # Continuous Integration (Lints & Tests)
│       └── deploy-ecs.yml      # Continuous Delivery Pipeline (AWS CDK)
├── hello-cdk/                  # Infrastructure-as-Code Framework
│   ├── lib/
│   │   └── hello-cdk-stack.ts  # AWS CDK ECS Fargate Stack Blueprint
├── src/
│   ├── components/             # Front-End UI Components
│   │   └── WeatherCard.astro   # Runtime Climate Fetch Engine
│   ├── content/                # Markdown Content Collections
│   │   ├── citiesAndRegions/
│   │   ├── islands/
│   │   ├── parks/
│   │   └── sports/
│   ├── layouts/
│   │   └── BlogPost.astro      # Shared SSR Article Layout (prerender = false)
│   └── pages/
│       ├── api/
│       │   └── health.ts       # Deep Dependency Health Telemetry Router
│       ├── citiesAndRegions/
│       │   └── [...slug].astro # Dynamic Route Catchment
│       ├── islands/
│       │   └── [...slug].astro
│       ├── parks/
│       │   └── [...slug].astro
│       ├── sports/
│       │   └── [...slug].astro
│       ├── about.astro
│       └── index.astro         # Main Target Entry Homepage
└── Dockerfile                  # Secure Multi-Stage Alpine Production Runner


```

---

## 📈 SRE Operational Framework (SLI / SLO Fluency)

This architecture maintains high reliability by directly mapping engineering choices to core **Service Level Indicators (SLIs)** and **Service Level Objectives (SLOs)**:

### 1. Service Availability SLI
* **Indicator Metric:** `Good Requests (HTTP 200) / Total Requests` tracked via the AWS Application Load Balancer (ALB).
* **Telemetry Implementation:** The ALB target group skips shallow process validation and hooks directly into the **Deep Health Probe** (`/api/health`). If a critical infrastructure environment key dependency (e.g., `OPENWEATHER_API_KEY`) is missing, invalid, or corrupted, the endpoint responds with an immediate **`HTTP 503 Service Unavailable`**, isolating the failure domain before it hits end-users.

### 2. Zero-Downtime Deployment Strategy
* **Rolling Updates:** Configured with `minHealthyPercent: 100` and `maxHealthyPercent: 200`. During updates, AWS Fargate provisions the incoming version capsule in parallel. Traffic is only shifted *after* the new container successfully clears its initialization state and passes its telemetry probes over a 15-second evaluation window.
* **Automated Cloud Rollbacks:** AWS Deployment Circuit Breakers are activated (`rollback: true`). If a newly pushed image tag introduces an unhandled exception or failed database state, the platform halts progression and instantly triggers an automated rollback to the previous successful atomic Git Commit SHA image.

---

## 🧪 Shift-Left Validation & Chaos Testing Manual

### 1. Local Shift-Left Synthesis (Pre-Flight)
Validate infrastructure types, TypeScript compliance, and build layers locally before pushing code to the remote server:
```bash
# Validate AWS CDK CloudFormation Compilation
cd hello-cdk && npx cdk synth --context imageTag=mock-sha-12345

# Build Node 24 Production Container Securely (Secrets Isolated via .dockerignore)
docker build -t astro-blog-local:test .
```

### 2. Running the Production Parity Container Locally
Test the absolute isolation space capsule locally by injecting runtime environment flags manually:
```bash
docker run -d -p 4321:4321 \
  -e OPENWEATHER_API_KEY="\$(grep OPENWEATHER_API_KEY .env | cut -d '=' -f2)" \
  --name my-blog astro-blog:v1.0.0

# Verify Deep Telemetry Output
curl -i http://localhost:4321/api/health
```

### 3. Executing a Live Fault Injection Test
1. Navigate to the **Actions** tab inside the GitHub repository UI.
2. Select the **Deploy SSR Blog to ECS via AWS CDK** workflow.
3. Click the **Run workflow** dropdown configuration toggle.
4. Set the `fault_injection` boolean parameter string to **`true`** and click execute.

* **Expected Lifecycle Result:** The pipeline will push a toxic image layer token to Amazon ECR. When the Fargate task initiates, the deep health route will trigger an internal `ERROR` log trace visible in Amazon CloudWatch. The ALB target probe will receive a `503` error code, flag the task as unhealthy, prevent traffic routing to preserve the site's Availability SLO, and trigger a graceful automated circuit-breaker rollback.

