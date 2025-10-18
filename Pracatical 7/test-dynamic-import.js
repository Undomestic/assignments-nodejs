import { dynamicImport, getNamedExport, isImportable } from './Dynamicimport.js';
import { writeFileSync, mkdirSync } from 'fs';
import { join, resolve } from 'path';
import { fileURLToPath } from 'url';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, '..');

// Create test files
const testDir = join(__dirname, 'test-modules');
mkdirSync(testDir, { recursive: true });

// Test JSON file
const testJson = { name: 'Test JSON', version: '1.0.0', data: [1, 2, 3] };
writeFileSync(join(testDir, 'config.json'), JSON.stringify(testJson, null, 2));

// Test ESM module with default export
const testModule1 = `export default {
  name: 'Test Module',
  version: '1.0.0',
  getData: () => 'Hello from default export'
};`;
writeFileSync(join(testDir, 'module1.mjs'), testModule1);

// Test ESM module with named exports
const testModule2 = `export const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000
};

export const utils = {
  formatDate: (date) => date.toISOString(),
  validateEmail: (email) => /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)
};

export default {
  version: '2.0.0',
  description: 'Module with named exports'
};`;
writeFileSync(join(testDir, 'module2.js'), testModule2);

// Test mixed exports
const testModule3 = `export const PI = 3.14159;
export const E = 2.71828;

export function add(a, b) {
  return a + b;
}

export default function multiply(a, b) {
  return a * b;
}`;
writeFileSync(join(testDir, 'math.mjs'), testModule3);

async function runTests() {
  console.log('🧪 Testing dynamicImport function...\n');
  
  try {
    // Test 1: Import JSON file
    console.log('1. Testing JSON import:');
    const jsonData = await dynamicImport(join(testDir, 'config.json'));
    console.log('✅ JSON imported:', jsonData);
    console.log();
    
    // Test 2: Import module with default export
    console.log('2. Testing default export:');
    const module1 = await dynamicImport(join(testDir, 'module1.mjs'));
    console.log('✅ Module1 imported:', module1);
    console.log('✅ Calling getData():', module1.getData());
    console.log();
    
    // Test 3: Import module with named exports
    console.log('3. Testing named exports:');
    const module2 = await dynamicImport(join(testDir, 'module2.js'));
    console.log('✅ Module2 imported:', module2);
    console.log('✅ Config:', module2.config);
    console.log('✅ Utils:', module2.utils);
    console.log();
    
    // Test 4: Get specific named export
    console.log('4. Testing getNamedExport:');
    const config = await getNamedExport(join(testDir, 'module2.js'), 'config');
    console.log('✅ Named export "config":', config);
    console.log();
    
    // Test 5: Test mixed exports
    console.log('5. Testing mixed exports:');
    const math = await dynamicImport(join(testDir, 'math.mjs'));
    console.log('✅ Math module imported:', math);
    console.log('✅ PI constant:', math.PI);
    console.log('✅ Add function:', math.add(5, 3));
    console.log('✅ Default multiply function:', math(4, 6));
    console.log();
    
    // Test 6: Test isImportable function
    console.log('6. Testing isImportable:');
    console.log('✅ config.json:', isImportable('config.json'));
    console.log('✅ module.mjs:', isImportable('module.mjs'));
    console.log('✅ script.js:', isImportable('script.js'));
    console.log('✅ file.txt:', isImportable('file.txt'));
    console.log();
    
    console.log('🎉 All tests passed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

runTests();