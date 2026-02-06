import { Project } from '../types';

// BLOGS are now fetched from API via useBlogData hook.
export const BLOGS = [];

export const PROJECTS: Project[] = [
  {
    id: 'p1',
    title: 'taeyun.com',
    description: 'An autonomous conversational agent capable of understanding complex context and maintaining long-term memory.',
    techStack: ['Python', 'TensorFlow', 'React'],
    category: 'Dev',
    linkType: 'site',
    link: 'https://taeyunryu.vercel.app/',
    sourceLink: 'https://github.com/tyroneryu/portfolio_dev.taeyun',
    image: '/images/taeyun_com.png',
    content: `
The Eco-Future Expo wasn't just a trade show; it was a statement. The goal was to prove that large-scale exhibitions could be environmentally responsible.

### Sustainability First
We replaced all printed signage with **E-Ink displays** and LED walls. Carpeting was eliminated in favor of polished concrete to reduce single-use waste. All food served was locally sourced within 100km.

### Key Deliverables
*   **Green Logistics**: Consolidated freight shipping to reduce carbon footprint by 40%.
*   **Digital Lead Retrieval**: Eliminated paper business cards with NFC badges.
*   **Impact Reporting**: Published a comprehensive ISO 20121 compliance report post-event.
    `
  },
  {
    id: 'm1',
    title: 'Korea MICE Expo 2024',
    description: 'Orchestrated a 3-day international conference for 5,000+ attendees. Managed end-to-end logistics, from venue selection to keynote speaker coordination.',
    techStack: ['Event Planning', 'Logistics', 'Budgeting'],
    category: 'MICE',
    linkType: 'site',
    image: '/images/kme.png',
    content: `
The Eco-Future Expo wasn't just a trade show; it was a statement. The goal was to prove that large-scale exhibitions could be environmentally responsible.

### Sustainability First
We replaced all printed signage with **E-Ink displays** and LED walls. Carpeting was eliminated in favor of polished concrete to reduce single-use waste. All food served was locally sourced within 100km.

### Key Deliverables
*   **Green Logistics**: Consolidated freight shipping to reduce carbon footprint by 40%.
*   **Digital Lead Retrieval**: Eliminated paper business cards with NFC badges.
*   **Impact Reporting**: Published a comprehensive ISO 20121 compliance report post-event.
    `
  },
  {
    id: 'p2',
    title: 'Trigger Forge',
    description: 'High-performance video streaming platform using WebRTC and edge computing for sub-second latency.',
    techStack: ['Go', 'WebRTC', 'Next.js'],
    category: 'Dev',
    linkType: 'architecture',
    sourceLink: 'https://github.com/tyroneryu/trigger_forge',
    image: '/images/trigger_forge.png',
    content: `
# TriggerForge: Event-Driven Infrastructure & CI/CD
**Built & Automated — From Provisioning to Deployment**

TriggerForge is a comprehensive framework designed to automate the entire lifecycle of event-driven cloud environments. It bridges the gap between raw infrastructure provisioning and application-level configuration management.

### 🏗️ System Architecture
*   \\'terraform /\\': Core infrastructure definition (S3 Buckets, IAM Roles, VPC Networking).
*   \\'
serverless /\\': AWS SAM templates orchestrating Lambda functions triggered by S3 events.
*   \\'
ansible /\\': Configuration management for administration EC2 instances (Nginx/UI deployment).
*   \\'.github / workflows /\\': Robust CI/CD pipeline for automated testing and validation.

### 🛠️ Core Engineering Pillars

#### 1. Infrastructure as Code (Terraform)
We utilize Terraform to maintain a deterministic state of the cloud environment. By using modular components, we ensure that S3 buckets and cross-account IAM roles are provisioned with strict adherence to the **Principle of Least Privilege (PoLP)**.

#### 2. Serverless Orchestration (AWS SAM)
The application layer leverages AWS SAM for rapid deployment of serverless functions. This project demonstrates high-performance Lambda handlers capable of processing S3 event streams in real-time with sub-second latency.

#### 3. Configuration Automation (Ansible)
Unlike static images, we use Ansible for dynamic configuration management. The playbook automates the installation of Nginx and the deployment of health-check UIs on management nodes, ensuring **idempotency** across all environments (Dev/Prod).

#### 4. Local Emulation (LocalStack & Docker)
To reduce AWS cost overhead and enable offline development, the environment is fully emulated using **LocalStack**. This allows for 100% fidelity testing of S3 triggers and Lambda interactions without hitting live cloud endpoints.

#### 5. CI/CD & Security (GitHub Actions)
The pipeline performs static analysis (\\'
terraform
fmt\\'), security linting, and automated \\'
plan\\' validation. Sensitive credentials never touch the repository; they are dynamically injected via **GitHub Secrets** and **AWS Secrets Manager**.

### 📈 Monitoring & Observability
Full integration with **CloudWatch Logs** and custom metrics, providing real-time telemetry on Lambda execution success rates and system throughput.

### 🚀 Future Roadmap
*   Migration of heavy compute workloads from Lambda to **AWS Fargate**.
*   Implementation of **ArgoCD** for a full GitOps-driven reconciliation loop.
    `
  },
  {
    id: 'm2',
    title: 'ICCZ Fam Tour',
    description: 'Designed and executed a sustainable trade show featuring 200+ exhibitors. Implemented zero-waste protocols and digital registration systems.',
    techStack: ['Exhibition Management', 'Sustainability', 'Operations'],
    category: 'MICE',
    linkType: 'site',
    image: '/images/iccz.png',
    content: `
The Eco-Future Expo wasn't just a trade show; it was a statement. The goal was to prove that large-scale exhibitions could be environmentally responsible.

### Sustainability First
We replaced all printed signage with **E-Ink displays** and LED walls. Carpeting was eliminated in favor of polished concrete to reduce single-use waste. All food served was locally sourced within 100km.

### Key Deliverables
*   **Green Logistics**: Consolidated freight shipping to reduce carbon footprint by 40%.
*   **Digital Lead Retrieval**: Eliminated paper business cards with NFC badges.
*   **Impact Reporting**: Published a comprehensive ISO 20121 compliance report post-event.
    `
  },
  {
    id: 'p3',
    title: 'GitKubeOps',
    description: 'Decentralized exchange aggregator visualizing arbitrage opportunities in a 3D interactive environment.',
    techStack: ['Solidity', 'Three.js', 'Rust'],
    category: 'Dev',
    linkType: 'architecture',
    sourceLink: 'https://github.com/tyroneryu/gitkubeops',
    image: '/images/gitkubeops.png',
    content: `
# GitKubeOps: Declarative Kubernetes Deployment via GitOps

GitKubeOps is a reference implementation of a modern GitOps workflow. This project demonstrates how to deploy a containerized Python Flask application to a Kubernetes cluster with a fully automated CI/CD pipeline leveraging **Docker**, **Helm**, **GitHub Actions**, and **Argo CD**.

### 🏗️ Project Architecture
The repository is structured to separate application logic, infrastructure templating, and environment manifests:
*   \\' / app\\': Flask application source code and Dockerfile.
*   \\' / chart\\': Custom Helm charts for Kubernetes resource abstraction.
*   \\' /
.
github / workflows\\': CI pipelines for automated image building and registry push.
*   \\' / manifests\\': Argo CD Application manifests defining the desired state of the cluster.

### 🛠️ Core Engineering Components

#### 1. Containerized Microservice (\\' / app\\')
The core is a Python-based Flask API. It is optimized for Kubernetes environments with health check endpoints and a lightweight Docker configuration based on the Alpine Linux footprint.

#### 2. Continuous Integration (GitHub Actions)
The \\'
ci - build - push.yml\\' workflow is triggered on every push to the main branch. It automates:
*   Code linting and unit testing.
*   Docker image synthesis.
*   Secure image distribution to **GitHub Container Registry (GHCR)**.

#### 3. Infrastructure Abstraction (Helm)
Instead of static YAML, we utilize Helm to manage the application lifecycle. The chart includes:
*   **Deployment**: Manages pod replicas and rolling updates.
*   **Service**: Exposes the application internally or externally.
*   **HPA (Horizontal Pod Autoscaler)**: Automatically scales resources based on real-time traffic telemetry.

#### 4. Continuous Delivery (Argo CD)
The \\'
application.yaml\\' manifest defines the GitOps reconciliation loop. Argo CD monitors the Git repository and ensures the Kubernetes cluster state matches the declarative code in the repository. It enables:
*   **Auto-Sync**: Immediate deployment upon Git commit.
*   **Self-Healing**: Automatic correction of manual cluster drifts.

### 🚀 Implementation Guide
1.  **Fork the Repository**: Clone the GitKubeOps DNA to your own namespace.
2.  **Configure Manifests**: Update the \\'
repoURL\\' in the Argo CD application manifest.
3.  **Bootstrap Cluster**: Apply the manifest using \\'
kubectl
apply - f
manifests / argocd / application.yaml\\'.
4.  **Observe Automation**: Push a change to \\'
app.py\\' and watch as the GitHub Action builds the image and Argo CD triggers the cluster update in real-time.
    `
  },
  {
    id: 'p4',
    title: 'Tech Blog',
    description: 'Real-time speech synthesis engine for accessibility tools, providing natural sounding voice generation.',
    techStack: ['C++', 'WASM', 'AudioWorklet'],
    category: 'Dev',
    linkType: 'site',
    sourceLink: 'https://github.com/tyroneryu/gitkubeops',
    image: '/images/blog_taeyun.png',
    content: `
The Eco-Future Expo wasn't just a trade show; it was a statement. The goal was to prove that large-scale exhibitions could be environmentally responsible.

### Sustainability First
We replaced all printed signage with **E-Ink displays** and LED walls. Carpeting was eliminated in favor of polished concrete to reduce single-use waste. All food served was locally sourced within 100km.

### Key Deliverables
*   **Green Logistics**: Consolidated freight shipping to reduce carbon footprint by 40%.
*   **Digital Lead Retrieval**: Eliminated paper business cards with NFC badges.
*   **Impact Reporting**: Published a comprehensive ISO 20121 compliance report post-event.
    `
  },
  {
    id: 'm3',
    title: 'Seoul Hiking Tourism Center (Gwanak-mountain)',
    description: 'Decetralized exchange aggregator visualizing arbitrage opportunities in a 3D interactive environment.',
    techStack: ['Sustainability', 'Operations'],
    category: 'MICE',
    linkType: 'site',
    image: '/images/gwanak.png',
    content: `
The Eco-Future Expo wasn't just a trade show; it was a statement. The goal was to prove that large-scale exhibitions could be environmentally responsible.

### Sustainability First
We replaced all printed signage with **E-Ink displays** and LED walls. Carpeting was eliminated in favor of polished concrete to reduce single-use waste. All food served was locally sourced within 100km.

### Key Deliverables
*   **Green Logistics**: Consolidated freight shipping to reduce carbon footprint by 40%.
*   **Digital Lead Retrieval**: Eliminated paper business cards with NFC badges.
*   **Impact Reporting**: Published a comprehensive ISO 20121 compliance report post-event.
    `
  },
  {
    id: 'p5',
    title: 'Malware Analysis Service',
    description: 'Real-time malware analysis service via AWS CI/CD automatiation.',
    techStack: ['Python','Tensorflow'],
    category: 'Dev',
    linkType: 'architecture',
    architectureImage: '/images/malware_architecture.png',
    sourceLink: 'https://github.com/tyroneryu/malware-analysis-service',
    image: '/images/malware_analysis.png',
    content: `
The Eco-Future Expo wasn't just a trade show; it was a statement. The goal was to prove that large-scale exhibitions could be environmentally responsible.

### Sustainability First
We replaced all printed signage with **E-Ink displays** and LED walls. Carpeting was eliminated in favor of polished concrete to reduce single-use waste. All food served was locally sourced within 100km.

### Key Deliverables
*   **Green Logistics**: Consolidated freight shipping to reduce carbon footprint by 40%.
*   **Digital Lead Retrieval**: Eliminated paper business cards with NFC badges.
*   **Impact Reporting**: Published a comprehensive ISO 20121 compliance report post-event.
    `
  }
];