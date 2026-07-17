# Karate & Azure Progress Hub — v1.9.6


## v1.9.6 root-page repair

Version 1.9.6 restores the Progress Hub as the repository root application. The uploaded repository had the Support Operations Runbook `index.html` copied over the root `index.html`, which caused GitHub Pages to load the Runbook shell while using the Progress Hub assets.

The Runbook remains available under `Runbook/`. No authentication, OneDrive, Supabase, state schema, or stored progress data was changed. The service-worker cache was advanced to v1.9.6 so browsers fetch the repaired entry page.

An offline-first Progressive Web App for:

- Azure and Microsoft cloud study on Friday, Saturday and Sunday;
- Jion kata and JKA 3rd Dan preparation on Saturday and Sunday;
- evidence-based certification mastery, labs, reviews, retention and long-term career planning.

Monday to Thursday remain unscheduled. Friday contains Azure only. Saturday and Sunday each contain flexible Azure, Jion and 3rd Dan blocks with no fixed time.

## AZ-104 ordered learning-path checklist

Version 1.9.4 replaces the previous broad AZ-104 placeholders with André’s exact Microsoft Learn order.

### 1. Prerequisites for Azure administrators — content completed

- Introduction to Azure Cloud Shell
- Deploy Azure infrastructure by using JSON ARM templates

### 2. Manage identities and governance in Azure — current path

1. Understand Microsoft Entra ID — immediate next module
2. Create, configure, and manage identities
3. Describe the core architectural components of Azure
4. Azure Policy initiatives
5. Secure your Azure resources with Azure role-based access control
6. Allow users to reset their password with Microsoft Entra self-service password reset

### 3. Implement and manage storage in Azure

1. Configure storage accounts
2. Configure Azure Blob Storage
3. Configure Azure Storage security
4. Configure Azure Files

### 4. Deploy and manage Azure compute resources

1. Introduction to Azure virtual machines
2. Configure virtual machine availability
3. Configure Azure App Service plans
4. Configure Azure App Service
5. Configure Azure Container Instances

### 5. Configure and manage virtual networks

1. Configure virtual networks
2. Configure network security groups
3. Host your domain on Azure DNS
4. Configure Azure Virtual Network peering
5. Manage and control traffic flow with routes
6. Introduction to Azure Load Balancer
7. Introduction to Azure Application Gateway
8. Introduction to Azure Network Watcher

### 6. Monitor and back up Azure resources

1. Introduction to Azure Backup
2. Protect your virtual machines by using Azure Backup
3. Monitor your Azure virtual machines with Azure Monitor

Each module has a prominent **Microsoft Learn module completed** checkbox. Checking it records content completion only. Full mastery still requires:

`Learn → Understand → Perform → Test → Review → Retain`

The app automatically advances the current module in the defined order after module content is checked off.

## Roadmap status

- Prerequisites: completed
- Manage identities and governance: next/current
- Storage: not started
- Compute: not started
- Networking: not started
- Monitor and backup: not started

The AZ-104 page includes a roadmap-position summary showing path order, completed modules and the current path.

## Weekly schedule

| Day | Main focus |
|---|---|
| Monday–Thursday | Unscheduled / recovery |
| Friday | Azure study only |
| Saturday | Flexible Azure + Jion kata + 3rd Dan |
| Sunday | Flexible Azure + Jion kata + 3rd Dan |

The Weekly Plan starts on the current `Pacific/Auckland` date and displays the next seven days.

## Intensive cloud programme

The existing 30–42 month programme remains available, including:

- AZ-104 → SC-300 → MD-102 → MS-102 → AZ-700 → Bicep/Terraform → Terraform Associate 004 → AZ-305 → SC-500;
- PowerShell, Graph, Azure CLI, Git, CI/CD, Microsoft 365, Linux and German skills;
- weekly technical/German targets;
- labs, assessments, independent performance, portfolio and automation records;
- recovery weeks, fatigue controls, forecasts and exam-readiness gates.

## Cloud storage

Available providers remain:

- Local device only
- Microsoft OneDrive app folder
- Supabase

OneDrive continues to use `Files.ReadWrite.AppFolder` and `karate-azure-progress-state.json`.

## Data compatibility

- App version: `1.9.4`
- State schema: `8`
- Local state key: `ka_progress_hub_state_v1`
- Supabase table: `user_app_state`

Schema 8 is additive. It replaces the AZ-104 module catalogue with the ordered roadmap, records prerequisite content as completed, sets **Understand Microsoft Entra ID** as the next module, maps compatible legacy module/lab references and preserves daily history, karate records, cloud data and configuration.

## Installation

Read `INSTALLATION.md`. Export a JSON backup before deploying, and preserve production values in `js/microsoft-config.js` and any existing `js/config.js`.

## Validation

```text
node --check app.js
node --check service-worker.js
node tests/smoke-test.cjs
node tests/file-integrity-test.cjs
node tests/onedrive-sync-test.cjs
```
