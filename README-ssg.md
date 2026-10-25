# Archived Astro SSG Static Site Infrastructure (Legacy Time Capsule)

This directory houses the frozen, historical **Astro Static Site Generation (SSG)** architecture. It has been decoupled from the primary `main` production branch and archived as an immutable Git Tag (`v1.0.0-ssg-legacy`). This allows it to be checked out, built, and deployed at any point in the future into the same AWS account without causing configuration drift or resource collisions with the active SSR Fargate cluster.

---

## 🏗️ Static Architecture Topology

This map reflects the exact directory layout preserved within this legacy time capsule branch:
```
├── .github/
│   └── workflows/
│       ├── ci.yml              # Continuous Integration Validation
│       └── deploy-static.yml   # Continuous Static Site Delivery (AWS S3)
├── hello-cdk/                  # Infrastructure-as-Code Framework
│   ├── lib/
│   │   └── hello-cdk-stack.ts  # Declares StaticSiteStack (S3 + CloudFront CDN)
├── public/                     # Public Static Assets (Favicons, Robots.txt, Images)
├── src/
│   ├── assets/                 # Optimized Internal Media Assets
│   ├── components/             # Pure Static UI Components
│   │   ├── AuthorBio.astro
│   │   ├── BaseHead.astro
│   │   ├── Footer.astro
│   │   ├── FormattedDate.astro
│   │   ├── Header.astro
│   │   └── HeaderLink.astro
│   ├── content/                # Static Markdown Content Collections
│   │   ├── citiesAndRegions/
│   │   ├── islands/
│   │   ├── parks/
│   │   └── sports/
│   ├── layouts/                # Base Blog Layout Templates
│   ├── pages/                  # Static File-Based Pages (No API Routes)
│   │   ├── citiesAndRegions/
│   │   ├── islands/
│   │   ├── parks/
│   │   ├── sports/
│   │   ├── about.astro
│   │   ├── index.astro
│   │   └── rss.xml.js
│   ├── styles/                 # Global Application Stylesheets
│   ├── utils/                  # Legacy Local Test Utilities
│   └── consts.ts               # Global Site Metadata Constants
├── .gitignore                  # Git Exclusion Policies
├── astro.config.mjs            # Hardcoded Config for output: "static"
├── package.json                # Project Dependencies and Scripts
├── tsconfig.json               # TypeScript Compiler Configuration
└── vitest.config.ts            # Unit Test Environment Configuration
```
---

## 🔒 Coexistence & Collision Protections

To safely deploy this infrastructure into the **same AWS account** as the live SSR blog (`HelloEcsStack`), this stack enforces complete namespace isolation:

1. **Stack Namespace:** The infrastructure class is isolated under **`StaticSiteStack`**. It does not share cloud state files or parameters with `HelloEcsStack`.
2. **S3 Bucket Isolation:** The deployment utilizes a dedicated, uniquely-named storage repository (`SiteBucket`) configured with `cdk.RemovalPolicy.DESTROY` and `autoDeleteObjects: true` to prevent orphaned state resource locking during decommissioning phases.
3. **Edge Optimization:** Includes an inline CloudFront Function (`RewriteFunction`) that intercepts viewer requests to automatically append `index.html` to clean Astro directory URLs, guaranteeing flawless static link routing without server compute dependencies.

---

## 🚀 Future Deployment Operations Manual

Whenever you need to spin up or update this static site instance alongside your live SSR site, execute these exact sequential commands from your Fedora terminal:

### 1. Checkout the Immutable Tag
Jumping to the tag places your local workspace into a clean, detached tracking frame representing this exact point in historical time:
```bash
git checkout tags/v1.0.0-ssg-legacy
```

### 2. Build the Static Assets Locally
```bash
# Install root project frontend dependencies
npm ci

# Compile pages into optimized static HTML/CSS/JS assets
npm run build
```
*Verification:* Confirm that a populated `/dist` folder has been generated in your root directory.

### 3. Provision the Cloud CDN Infrastructure
Navigate to your IaC directory, initialize project dependencies, and execute the deployment loop:
```bash
cd hello-cdk

# Install CDK stack dependencies
npm ci

# Deploy the static architecture infrastructure into your AWS account
npx cdk deploy StaticSiteStack --require-approval never
```

### 4. Return to Active SSR Development
Once your deployment task is finished, return your local shell tracking back to your primary daily development environment:
```bash
git checkout main
```

