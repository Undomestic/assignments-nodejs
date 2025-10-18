# Dynamic Import Utility

A robust JavaScript utility for dynamically importing ESM (ECMAScript Module) files with support for JSON import assertions and graceful fallback mechanisms.

## Features

- ✅ **ESM Support**: Import `.mjs` and `.js` ESM modules
- ✅ **JSON Import**: Import JSON files using direct file reading (more reliable than import assertions)
- ✅ **Graceful Fallback**: Handle both default and named exports seamlessly
- ✅ **Error Handling**: Comprehensive error handling with descriptive messages
- ✅ **Windows Compatibility**: Proper file:// URL handling for Windows paths

## Installation

This is a pure ESM module. Ensure your project has `"type": "module"` in `package.json`:

```json
{
  "type": "module"
}
```

## Usage

### Basic Import

```javascript
import { dynamicImport } from './Dynamicimport.js';

// Import a JSON file
const config = await dynamicImport('./config.json');
console.log(config); // { name: "My App", version: "1.0.0" }

// Import an ESM module
const utils = await dynamicImport('./utils.mjs');
console.log(utils); // Default export or entire module object
```

### Working with Named Exports

```javascript
import { dynamicImport, getNamedExport } from './Dynamicimport.js';

// Get a specific named export
const { formatDate } = await getNamedExport('./dateUtils.js', 'formatDate');

// Or access from the full module
const dateUtils = await dynamicImport('./dateUtils.js');
const formatted = dateUtils.formatDate(new Date());
```

### File Type Support

```javascript
import { isImportable } from './Dynamicimport.js';

console.log(isImportable('config.json')); // true
console.log(isImportable('module.mjs'));  // true
console.log(isImportable('script.js'));   // true
console.log(isImportable('file.txt'));    // false
```

## API Reference

### `dynamicImport(file)`

Dynamically imports a file and returns its exports.

**Parameters:**
- `file` (string): The file path to import

**Returns:**
- `Promise<any>`: The imported module's default export (if available) or the entire module object

**Supported file types:**
- `.json` - Read directly from filesystem
- `.mjs` - ESM modules
- `.js` - ESM modules (when project is configured as ESM)

### `getNamedExport(file, exportName)`

Retrieves a specific named export from a dynamically imported module.

**Parameters:**
- `file` (string): The file path to import
- `exportName` (string): The name of the export to retrieve

**Returns:**
- `Promise<any>`: The specific named export

### `isImportable(file)`

Checks if a file can be dynamically imported.

**Parameters:**
- `file` (string): The file path to check

**Returns:**
- `boolean`: True if the file can be imported

## Examples

### Example 1: Configuration Loading

```javascript
// config.json
{
  "apiUrl": "https://api.example.com",
  "timeout": 5000,
  "retries": 3
}

// app.js
import { dynamicImport } from './Dynamicimport.js';

const config = await dynamicImport('./config.json');
console.log(`API URL: ${config.apiUrl}`);
```

### Example 2: Plugin System

```javascript
// plugins/logger.mjs
export const log = (message) => console.log(`[LOG] ${message}`);
export const error = (message) => console.error(`[ERROR] ${message}`);

export default {
  name: 'Logger Plugin',
  version: '1.0.0'
};

// app.js
import { dynamicImport } from './Dynamicimport.js';

const logger = await dynamicImport('./plugins/logger.mjs');
logger.log('Application started');
```

## Testing

Run the test suite to verify functionality:

```bash
node test-dynamic-import.js
```

## Requirements

- Node.js 18.17+ (for ESM support)
- ESM project configuration (`"type": "module"` in package.json)

## License

MIT License - feel free to use in your projects!
