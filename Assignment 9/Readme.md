🛠️ Dependency Analyzer: Your Node_Modules Auditor

Let's be honest: your node_modules folder is a black box. This tool shines a light on that box, making security, compliance, and package integrity checks simple, fast, and reliable. It's an essential utility for anyone serious about their JavaScript project's supply chain health.

✨ Why You Need This (The Features)

This isn't just a basic dependency tree. We dive deep into every package to give you crucial audit points:

🔍 Deep Package Discovery: We automatically find and process all installed packages, no matter how deeply nested they are in your node_modules directory.

🌳 Clear Dependency Graph: We map out the relationships between packages, so you know exactly how everything connects. Say goodbye to the dependency mystery!

🔐 Integrity Check (SHA-256 Hashing): Concerned about package tampering? We compute a unique SHA-256 hash for the entire content of every package. This lets you quickly verify if any files have been modified or corrupted since installation.

📄 License Compliance Check: Stay out of legal trouble. We actively flag packages that are missing a clear license definition, making open-source compliance straightforward.

📊 Clean, Actionable Reporting: Get a comprehensive summary delivered right to your console, plus a structured JSON file perfect for sharing with your team or feeding into your automated tools.

💻 Getting Started (Installation & Requirements)

Good news! This is a zero-dependency tool. It uses only built-in Node.js modules, so there's nothing extra to install.

What You'll Need:

Node.js v18.0.0 or higher (for modern ES module support).

Read access to the node_modules directory you want to scan.

🚀 How To Run The Analysis

Command Line Interface (CLI)

Need a quick audit? Just run it from your terminal:

# 1. Audit the 'node_modules' right here (Default)
node dependency-analyzer.js

# 2. Point it to a specific project's modules
node dependency-analyzer.js /path/to/another/project/node_modules

# 3. Scan and save the detailed report to a custom path
node dependency-analyzer.js ./node_modules ./reports/audit-2024.json


Programmatic Usage

Integrate the DependencyAnalyzer class directly into your existing scripts or build tools:

import { DependencyAnalyzer } from './dependency-analyzer.js';

// The path to your node_modules
const analyzer = new DependencyAnalyzer('./path/to/my/node_modules');

console.log('Starting dependency analysis...');

try {
  // Runs discovery, hashing, and license checks
  const results = await analyzer.analyze();

  // Optionally, get a readable console view of the package relationships
  analyzer.printDependencyGraph();

  // Save the full audit results to a file
  await analyzer.saveResults('./latest-analysis.json');

  console.log(`Total packages successfully analyzed: ${results.totalPackages}`);
  
} catch (error) {
  console.error('Whoops, the analysis failed:', error.message);
}


📑 Understanding The Output

Console Summary (Your Quick Status Check)

The CLI gives you an immediate summary so you can spot red flags right away:

🔍 Analyzing dependencies in: /project/node_modules
📦 Found 15 top-level packages
🔐 Computing package hashes and checking licenses...

📊 Analysis Complete!
==================================================
Total packages analyzed: 127
Packages with licenses: 125
Packages without licenses: 2

⚠️  Packages without licenses:
  - some-package@1.0.0 (Time to find a license!)
  - another-package@2.1.0

🔐 Package hashes computed for all packages


JSON Report (dependency-analysis.json)

This is the detailed source of truth—perfect for CI/CD integration, compliance checks, or version control of your package integrity.

{
  "timestamp": "2025-10-25T15:00:00.000Z",
  "nodeModulesPath": "/path/to/node_modules",
  "totalPackages": 127,
  "packagesWithLicenses": 125,
  "packagesWithoutLicenses": 2,
  "dependencyGraph": {
    "package-name": {
      "version": "1.0.0",
      "path": "/path/to/package",
      "dependencies": [
        {
          "name": "dependency-name",
          "version": "^2.0.0",
          "type": "dependencies"
        }
      ],
      "packageJson": { /* full package.json object */ }
    }
  },
  "packageHashes": {
    "package-name": "sha256-hash-here"
  },
  "missingLicenses": [
    {
      "name": "package-name",
      "version": "1.0.0",
      "path": "/path/to/package"
    }
  ]
}


🔎 How We Check for Licenses

We try multiple methods to confirm a package is licensed:

package.json Fields: We check for the explicit license or licenses fields.

Common License Files: We also scan the root of the package for the most common license document names:

LICENSE, LICENSE.txt, LICENSE.md

LICENCE, LICENCE.txt, LICENCE.md

COPYING, COPYING.txt

UNLICENSE, UNLICENSE.txt

🛡️ Top Reasons to Use This Tool

Security Auditing: Identify and address potential security or legal risks posed by unlicensed code.

Supply Chain Integrity: Establish a baseline of hashes. If the hash ever changes without a version update, you know your package contents have been compromised!

Compliance Reporting: Generate professional, standardized reports to satisfy legal and technical requirements for open-source usage.

Developer Insight: Get a level of clarity into your project's structure that NPM/Yarn don't natively provide.
