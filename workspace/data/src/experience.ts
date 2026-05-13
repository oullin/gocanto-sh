import type { ExperienceFixture } from "./types"

export const experience = {
  "version": "1.0.4",
  "data": [
    {
      "uuid": "172a1fd4-49c1-4515-8731-feffc809d5d6",
      "company": "Ollin Labs",
      "employment_type": "Full-Time",
      "location_type": "On-Site",
      "position": "Founder & Principal Engineer",
      "start_date": "December, 2025",
      "end_date": "Present",
      "summary": "Founded Ollin Labs to deliver production-grade backends for regulated industries — fintech, banking, and e-commerce — with agent-accelerated engineering and audit-trail-by-default architecture.<br/><br/>Architecting custom AI products and high-throughput data aggregation pipelines in Go, with low-latency delivery and idempotent processing at the core. Building an internal agent platform (oag) that powers fixed-scope, fixed-price service offerings: payment integrations (hara.sh), event pipelines (kuda.sh), and legacy modernization pilots (toku.sh).<br/><br/>Driving end-to-end product development hands-on across Go, PHP, Node.js, JavaScript, Vue, Vite, and Java (Spring Boot). Every shipped artifact is reproducible, signed, and reviewable — production hardening for high-stakes, regulated systems where strict security, data integrity, and operational continuity are non-negotiable.<br/><br/>Also building Madora — prompt-first hiring SaaS sealed by AI — applying the same immutable audit-trail discipline from payments to people decisions.",
      "country": "Singapore",
      "city": "Singapore",
      "skills": "Founder, Software Architecture, Agentic AI, GO, TypeScript, Apache Kafka, PostgreSQL, Payment Systems, Audit-trail Systems, Regulated Industries."
    },
    {
      "uuid": "73c68950-5a10-43bc-a5b2-e45544e140e6",
      "company": "Silverlake",
      "employment_type": "Contract",
      "location_type": "On-Site",
      "position": "Technical Lead",
      "start_date": "June, 2025",
      "end_date": "November, 2025",
      "summary": "Led a 5-engineer squad migrating legacy core banking apps (Java, C, AS400, MySQL) onto a modern stack of React, TypeScript, Go, Python and Kafka, de-risking cutover while maintaining service continuity. Designed real-time Kafka + Go pipelines consolidating ATM streams, account transactions and cross-border payments, with back-pressure handling and exactly-once consumer semantics.<br/><br/>Authored a Go reverse proxy to the VCOS (C, AS400) banking core, plus a multi-protocol ingress layer (HTTP, Kafka, Redis Streams, RabbitMQ) with caching and rate limiting to protect downstream services. Built an end-to-end monitoring console covering ATM low-level processes, CPU and daemon health, core configuration snapshots, channel/host interfaces and alerting.<br/><br/>Established delivery foundations — Docker multi-stage releases, automated rollouts/rollbacks, zero-downtime deploys across prod and staging — and cut CI minutes by ≈30% by moving the banking dashboard to Vite. Oversaw the UI strategy for a Vue/TypeScript real-time data system with a tree-based exploration model (TreeJS) and a modular widget SDK backed by Pinia, feature flags and design tokens for brandable deployments. Drove weekly stakeholder cadence, coaching and growth plans for the team.",
      "country": "Singapore",
      "city": "Singapore",
      "skills": "Software Architecture, Leadership, GO (Programming Language), PostgreSQL, C (Programming Language), Python (Programming Language), AS/400, Apache Kafka, Vue, TypeScript."
    },
    {
      "uuid": "c17a68bc-8832-4d44-b2ed-f9587cf14cd1",
      "company": "Perx Technologies",
      "employment_type": "Full-Time",
      "location_type": "On-Site",
      "position": "Engineering Head",
      "start_date": "June, 2024",
      "end_date": "April, 2025",
      "summary": "Architected a high-throughput priority rewards delivery service in Go, with idempotent orchestration, back-pressure control and SLA-driven retries for timely, accurate fulfillment. Led the Vue 3 + TypeScript migration of white-label microsites from Angular, introducing a design system and strict typing to lift performance, resilience and maintainability.<br/><br/>Built and operated scalable Node.js APIs for e-commerce and complex third-party integrations (points and rewards), adding circuit breakers, retries and observability for reliability at scale. Optimised cloud spend through rightsizing, autoscaling policies, storage tiering and egress reduction — lower costs without trading off performance.<br/><br/>Led cross-functional engineering teams (DevOps, Infrastructure, Data, Frontend, Backend, Support) across time zones with shared SLAs, clear working agreements, OKRs, runbooks and post-mortems. Partnered with the CEO and C-level leaders on expansion plans, team cohesion and scaling engineering in lockstep with growth.",
      "country": "Singapore",
      "city": "Singapore",
      "skills": "Executive Leadership, Strategic Planning, Engineering Management, GO, Vue 3, TypeScript, Node.js, Cloud Cost Optimisation."
    },
    {
      "uuid": "99db1ca0-948e-40b1-984f-e3b157a5d336",
      "company": "Aspire Financial Technologies",
      "employment_type": "Full-Time",
      "location_type": "On-Site",
      "position": "Senior Software Engineer & Manager",
      "start_date": "January, 2022",
      "end_date": "March, 2024",
      "summary": "Cut DB queries from 3s to 800ms and API latency from 2s to 100ms by profiling hot paths, tuning queries and adding caching — then set SLOs and alerting to hold the gains. Scaled the engineering group from 10+ to 20+ with bar-raising hiring, onboarding playbooks and growth paths, running follow-the-sun operations from Singapore.<br/><br/>Launched SEA wallets and adjacent products end-to-end — from domain modelling and system design to provider API integrations. Built a payment request queue prioritisation system that lifted throughput and reduced contention during peaks. Automated credit schema actions (freeze/pay), unified payment flows behind a single orchestration layer, and synced local ledger events with external providers using idempotent, retryable workflows.<br/><br/>Drove the monolith-to-microservices migration to unlock independent scaling and clearer ownership boundaries, halving API latency (3s → 1.5s) on critical paths and centralising permissions behind a high-performance authorisation gateway. Defined the UI/UX architecture for a core banking platform and led 4 engineers across APAC on a shared TypeScript monorepo. Delivered a platform-agnostic design system with clear API contracts powering web (Vue 3) and mobile (React Native).",
      "country": "Singapore",
      "city": "Singapore",
      "skills": "Leadership, Engineering Management, Payment Systems, Microservices, SLO Engineering, TypeScript, Vue 3, React Native, Cross-Border Payments."
    },
    {
      "uuid": "01e33400-6957-4d16-8edb-0802a49e445e",
      "company": "BeMyGuest - Tours & Activities",
      "employment_type": "Full-Time",
      "location_type": "On-Site",
      "position": "Engineering Lead",
      "start_date": "September, 2017",
      "end_date": "November, 2021",
      "summary": "Operated a multi-currency eWallet for partner payments with clear ledgering and finance reports for accurate reconciliation. Led multi-tenant integrations with 10+ payment gateways (Adyen, Stripe, PayPal, WeChat, PayDollar) for e-commerce and marketplace flows, standardising contracts and failover paths to keep checkout resilient. Built the inventory subsystem end-to-end — availability math, capacity management and time-slot handling for high-throughput scenarios — and designed the Capacity Calendar & Reservation Portal for real-time slot discovery, booking and capacity controls.<br/><br/>Published and maintained OpenAPI-driven endpoints so partners could sync catalogue, pricing, availability and payments with strict contract tests. Owned subscription billing with proration and upgrade/downgrade rules, status control for eTickets (issue, fulfill, refund, cancel) with audit trails, and retired tech debt across customer/supplier/agent bookings with immutability for critical records.<br/><br/>Integrated third-party supplier APIs across all channels (B2B, B2C, white-label, public API, supplier console) with contract tests and idempotent sync jobs, unblocking SEA market launches by completing mission-critical platform integrations and compliance checks. Enforced engineering standards with GitHub Actions for linting, testing and dependency health, and ran code reviews, CI pipelines and gated releases.",
      "country": "Singapore",
      "city": "Singapore",
      "skills": "Leadership, Payment Systems, Multi-Currency eWallet, OpenAPI, E-commerce Platforms, Vue.js, PHP, Laravel."
    },
    {
      "uuid": "1ba5d878-3c48-4d94-aded-4a4294c26e12",
      "company": "Freelance",
      "employment_type": "Contractor",
      "location_type": "Remote",
      "position": "Web Developer",
      "start_date": "June, 2014",
      "end_date": "September, 2017",
      "summary": "Built diverse web applications for SMEs, including e-commerce, POS, medical history, and neighbourhood feedback platforms, using PHP, Laravel, VueJS, and MySQL.<br/><br/>I also designed and delivered a multi-city drop-shipment warehouse management system, enabling real-time inventory control linked to financial reporting and distribution across multiple locations.",
      "country": "United States",
      "city": "Oklahoma City",
      "skills": "Leadership, Strategic Planning, Strategy Alignment, Cross-functional Team Leadership, Complexity Management"
    },
    {
      "uuid": "8501d986-144d-4f4d-bd3f-7fb066028142",
      "company": "Websarrollo",
      "employment_type": "Full-Time",
      "location_type": "On-Site",
      "position": "Founder & Software Engineer",
      "start_date": "February, 2011",
      "end_date": "May, 2014",
      "summary": "Led a team of designers and PHP developers, managing nationwide client projects and overseeing the full app development lifecycle, including iOS and Android social networking apps.<br/><br/>I built CMS, shipping-tracking, e-commerce, web portfolio, college enrolment, and university survey systems, plus a City Hall Administrative System covering accounts payable, HR, payroll, treasury, and tax modules. My work leveraged PHP, jQuery (and jQuery Mobile), Cordova-JS, MySQL, HTML5, AngularJS, and Laravel 5, integrating third-party APIs and Facebook and Twitter logins within a SCRUM framework.",
      "country": "Venezuela",
      "city": "Valencia",
      "skills": "Leadership, Strategic Planning, Strategy Alignment, Team Development, Complexity Management."
    },
    {
      "uuid": "82076e4e-6099-457f-8ed5-b10585125ce5",
      "company": "Encava",
      "employment_type": "Full-Time",
      "location_type": "On-Site",
      "position": "Web Developer",
      "start_date": "May, 2009",
      "end_date": "February, 2011",
      "summary": "Maintained the company’s AS400 administrative system and spearheaded development of department-specific applications—an e-commerce inventory control for retail, web reporting for production-line quality control, an online appointment system for the medical department, and a visitor registration/management tool.<br/><br/>I leveraged PHP, jQuery, MySQL, HTML5, and AS400 within a SCRUM framework.",
      "country": "Venezuela",
      "city": "Valencia",
      "skills": "Creative Problem Solving, Analytical Skills, Strategy Alignment, Strategic Planning, Complexity Management."
    },
    {
      "uuid": "d8c3957c-99dd-401a-9d95-f2b6b1dc021a",
      "company": "Forja Centro",
      "employment_type": "Full-Time",
      "location_type": "On-Site",
      "position": "Web Developer",
      "start_date": "March, 2008",
      "end_date": "April, 2009",
      "summary": "Maintained a Visual Basic administrative system and built internal applications to streamline operations—mail management, mechanical design support, sales-report automation, and web-based customer invoicing.<br/><br/>I trained staff on these tools and provided technical support for Windows 8 and PC servers using PHP, jQuery, MySQL, HTML, and SQL Server.",
      "country": "Venezuela",
      "city": "Valencia",
      "skills": "Creative Problem Solving, Analytical Skills, Strategy Alignment, Strategic Planning, Complexity Management."
    }
  ]
} as const satisfies ExperienceFixture
