#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class DependencyAnalyzer {
  constructor(nodeModulesPath = './node_modules') {
    this.nodeModulesPath = path.resolve(nodeModulesPath);
    this.dependencyGraph = new Map();
    this.packageHashes = new Map();
    this.packagesWithoutLicense = [];
    this.analysisResults = {
      totalPackages: 0,
      packagesWithLicenses: 0,
      packagesWithoutLicenses: 0,
      dependencyGraph: {},
      packageHashes: {},
      missingLicenses: []
    };
  }

  /**
   * Main analysis function
   */
  async analyze() {
    console.log(`🔍 Analyzing dependencies in: ${this.nodeModulesPath}`);
    
    try {
      // Check if node_modules exists
      await fs.access(this.nodeModulesPath);
    } catch (error) {
      throw new Error(`node_modules directory not found at: ${this.nodeModulesPath}`);
    }

    // Read top-level packages
    const topLevelPackages = await this.readTopLevelPackages();
    console.log(`📦 Found ${topLevelPackages.length} top-level packages`);

    // Build dependency graph
    await this.buildDependencyGraph(topLevelPackages);
    
    // Compute hashes and check licenses
    await this.analyzePackages();
    
    // Generate report
    this.generateReport();
    
    return this.analysisResults;
  }

  /**
   * Read all top-level packages from node_modules
   */
  async readTopLevelPackages() {
    const entries = await fs.readdir(this.nodeModulesPath, { withFileTypes: true });
    const packages = [];

    for (const entry of entries) {
      if (entry.isDirectory() && !entry.name.startsWith('.')) {
        const packagePath = path.join(this.nodeModulesPath, entry.name);
        const packageJsonPath = path.join(packagePath, 'package.json');
        
        try {
          const packageJson = await this.readPackageJson(packageJsonPath);
          if (packageJson) {
            packages.push({
              name: packageJson.name || entry.name,
              version: packageJson.version || 'unknown',
              path: packagePath,
              packageJson
            });
          }
        } catch (error) {
          console.warn(`⚠️  Could not read package.json for ${entry.name}: ${error.message}`);
        }
      }
    }

    return packages;
  }

  /**
   * Read and parse package.json file
   */
  async readPackageJson(packageJsonPath) {
    try {
      const content = await fs.readFile(packageJsonPath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      return null;
    }
  }

  /**
   * Recursively build dependency graph
   */
  async buildDependencyGraph(packages, visited = new Set()) {
    for (const pkg of packages) {
      if (visited.has(pkg.name)) continue;
      visited.add(pkg.name);

      const dependencies = this.extractDependencies(pkg.packageJson);
      this.dependencyGraph.set(pkg.name, {
        version: pkg.version,
        path: pkg.path,
        dependencies: dependencies,
        packageJson: pkg.packageJson
      });

      // Recursively process dependencies
      if (dependencies.length > 0) {
        const dependencyPackages = await this.resolveDependencies(dependencies);
        await this.buildDependencyGraph(dependencyPackages, visited);
      }
    }
  }

  /**
   * Extract dependencies from package.json
   */
  extractDependencies(packageJson) {
    const deps = [];
    const dependencyTypes = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'];
    
    for (const depType of dependencyTypes) {
      if (packageJson[depType]) {
        for (const [name, version] of Object.entries(packageJson[depType])) {
          deps.push({ name, version, type: depType });
        }
      }
    }
    
    return deps;
  }

  /**
   * Resolve dependencies to actual package paths
   */
  async resolveDependencies(dependencies) {
    const resolvedPackages = [];

    for (const dep of dependencies) {
      const depPath = path.join(this.nodeModulesPath, dep.name);
      const packageJsonPath = path.join(depPath, 'package.json');
      
      try {
        const packageJson = await this.readPackageJson(packageJsonPath);
        if (packageJson) {
          resolvedPackages.push({
            name: packageJson.name || dep.name,
            version: packageJson.version || 'unknown',
            path: depPath,
            packageJson
          });
        }
      } catch (error) {
        // Dependency not found in node_modules, skip
      }
    }

    return resolvedPackages;
  }

  /**
   * Analyze packages for hashes and licenses
   */
  async analyzePackages() {
    console.log('🔐 Computing package hashes and checking licenses...');
    
    for (const [packageName, packageInfo] of this.dependencyGraph) {
      try {
        // Compute SHA-256 hash of package files
        const hash = await this.computePackageHash(packageInfo.path);
        this.packageHashes.set(packageName, hash);
        
        // Check for license
        const hasLicense = await this.checkPackageLicense(packageInfo.path, packageInfo.packageJson);
        if (!hasLicense) {
          this.packagesWithoutLicense.push({
            name: packageName,
            version: packageInfo.version,
            path: packageInfo.path
          });
        }
        
        this.analysisResults.totalPackages++;
        if (hasLicense) {
          this.analysisResults.packagesWithLicenses++;
        } else {
          this.analysisResults.packagesWithoutLicenses++;
        }
        
      } catch (error) {
        console.warn(`⚠️  Error analyzing ${packageName}: ${error.message}`);
      }
    }
  }

  /**
   * Compute SHA-256 hash of package directory
   */
  async computePackageHash(packagePath) {
    const hash = crypto.createHash('sha256');
    
    try {
      const files = await this.getAllFiles(packagePath);
      const fileHashes = [];
      
      for (const file of files) {
        try {
          const content = await fs.readFile(file);
          const fileHash = crypto.createHash('sha256').update(content).digest('hex');
          const relativePath = path.relative(packagePath, file);
          fileHashes.push(`${relativePath}:${fileHash}`);
        } catch (error) {
          // Skip files that can't be read
        }
      }
      
      // Sort file hashes for consistent output
      fileHashes.sort();
      hash.update(fileHashes.join('\n'));
      
      return hash.digest('hex');
    } catch (error) {
      return 'error';
    }
  }

  /**
   * Get all files in a directory recursively
   */
  async getAllFiles(dirPath, files = []) {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      
      if (entry.isDirectory()) {
        // Skip node_modules subdirectories to avoid infinite recursion
        if (entry.name !== 'node_modules') {
          await this.getAllFiles(fullPath, files);
        }
      } else {
        files.push(fullPath);
      }
    }
    
    return files;
  }

  /**
   * Check if package has a license
   */
  async checkPackageLicense(packagePath, packageJson) {
    // Check package.json for license field
    if (packageJson.license || packageJson.licenses) {
      return true;
    }
    
    // Check for common license files
    const licenseFiles = [
      'LICENSE', 'LICENSE.txt', 'LICENSE.md',
      'LICENCE', 'LICENCE.txt', 'LICENCE.md',
      'COPYING', 'COPYING.txt',
      'UNLICENSE', 'UNLICENSE.txt'
    ];
    
    for (const licenseFile of licenseFiles) {
      try {
        await fs.access(path.join(packagePath, licenseFile));
        return true;
      } catch (error) {
        // File doesn't exist, continue
      }
    }
    
    return false;
  }

  /**
   * Generate analysis report
   */
  generateReport() {
    // Convert Maps to objects for JSON serialization
    this.analysisResults.dependencyGraph = Object.fromEntries(this.dependencyGraph);
    this.analysisResults.packageHashes = Object.fromEntries(this.packageHashes);
    this.analysisResults.missingLicenses = this.packagesWithoutLicense;
    
    console.log('\n📊 Analysis Complete!');
    console.log('='.repeat(50));
    console.log(`Total packages analyzed: ${this.analysisResults.totalPackages}`);
    console.log(`Packages with licenses: ${this.analysisResults.packagesWithLicenses}`);
    console.log(`Packages without licenses: ${this.analysisResults.packagesWithoutLicenses}`);
    
    if (this.packagesWithoutLicense.length > 0) {
      console.log('\n⚠️  Packages without licenses:');
      this.packagesWithoutLicense.forEach(pkg => {
        console.log(`  - ${pkg.name}@${pkg.version}`);
      });
    }
    
    console.log('\n🔐 Package hashes computed for all packages');
    console.log('📁 Dependency graph built successfully');
  }

  /**
   * Save results to file
   */
  async saveResults(outputPath = './dependency-analysis.json') {
    const output = {
      timestamp: new Date().toISOString(),
      nodeModulesPath: this.nodeModulesPath,
      ...this.analysisResults
    };
    
    await fs.writeFile(outputPath, JSON.stringify(output, null, 2));
    console.log(`\n💾 Results saved to: ${outputPath}`);
  }

  /**
   * Print dependency graph in a readable format
   */
  printDependencyGraph() {
    console.log('\n🌳 Dependency Graph:');
    console.log('='.repeat(50));
    
    for (const [packageName, packageInfo] of this.dependencyGraph) {
      console.log(`\n📦 ${packageName}@${packageInfo.version}`);
      if (packageInfo.dependencies.length > 0) {
        console.log('  Dependencies:');
        packageInfo.dependencies.forEach(dep => {
          console.log(`    - ${dep.name}@${dep.version} (${dep.type})`);
        });
      } else {
        console.log('  No dependencies');
      }
    }
  }
}

// CLI usage
async function main() {
  const args = process.argv.slice(2);
  const nodeModulesPath = args[0] || './node_modules';
  const outputFile = args[1] || './dependency-analysis.json';
  
  try {
    const analyzer = new DependencyAnalyzer(nodeModulesPath);
    await analyzer.analyze();
    
    // Save results
    await analyzer.saveResults(outputFile);
    
    // Print dependency graph
    analyzer.printDependencyGraph();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Export for use as module
export { DependencyAnalyzer };

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

