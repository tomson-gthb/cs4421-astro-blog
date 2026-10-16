# ADR-OO1: Transition to server side rendering and containers

## Status: 
Accepted

## Context
Our Astro application previously used Static site generation we need dynamic server side capabilities , application observability
(health probes), and containerized deployments.

## Decision
we will transition Astro from static output to dynamic server side rendering('output: 'server') using '@astrojs/node'
in standalone mode, and wrap the runtime in production container images.

## Consequences
- Positive: allows real time API endpoints(eg /api/health) dynamic rendering and , standard container orchestrator integration
(aws app runner/ ECS)
- Negative: Requires running node.js compute instances rather than serving static files directly from s3/cdn
