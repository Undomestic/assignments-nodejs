import { resolve } from 'path';
import { pathToFileURL } from 'url';
import { readFileSync } from 'fs';

/**
 * Dynamically import ESM files with JSON import assertions and fallback
 * @param {string} file - The file path to import
 * @returns {Promise<any>} - The imported module or its exports
 */
export async function dynamicImport(file) {
  try {
    // Check if the file is a JSON file
    if (file.endsWith('.json')) {
      // Read JSON file directly - much simpler and more reliable
      const absolutePath = resolve(file);
      const jsonContent = readFileSync(absolutePath, 'utf8');
      return JSON.parse(jsonContent);
    }
    
    // For .mjs and .js files, convert to file:// URL for Windows compatibility
    let importPath = file;
    
    // Convert relative paths to absolute, then to file:// URL
    if (file.startsWith('./') || file.startsWith('../') || !file.includes('/')) {
      const absolutePath = resolve(file);
      importPath = pathToFileURL(absolutePath).href;
    } else if (!file.startsWith('file://')) {
      // Handle absolute paths on Windows
      importPath = pathToFileURL(file).href;
    }
    
    const module = await import(importPath);
    
    // Graceful fallback: try to get default export first, then named exports
    if (module.default !== undefined) {
      return module.default;
    }
    
    // If no default export, return the entire module object
    // This allows access to named exports
    return module;
    
  } catch (error) {
    console.error(`Failed to import ${file}:`, error.message);
    throw new Error(`Dynamic import failed for ${file}: ${error.message}`);
  }
}

/**
 * Helper function to get a specific named export from a dynamically imported module
 * @param {string} file - The file path to import
 * @param {string} exportName - The name of the export to retrieve
 * @returns {Promise<any>} - The specific named export
 */
export async function getNamedExport(file, exportName) {
  const module = await dynamicImport(file);
  
  // If module is the default export, try to access the named export from it
  if (typeof module === 'object' && module !== null && exportName in module) {
    return module[exportName];
  }
  
  // If module is the entire module object, access the named export directly
  if (exportName in module) {
    return module[exportName];
  }
  
  throw new Error(`Export '${exportName}' not found in ${file}`);
}

/**
 * Helper function to check if a file can be dynamically imported
 * @param {string} file - The file path to check
 * @returns {boolean} - True if the file can be imported
 */
export function isImportable(file) {
  const supportedExtensions = ['.js', '.mjs', '.json'];
  return supportedExtensions.some(ext => file.endsWith(ext));
}