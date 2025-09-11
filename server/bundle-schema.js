// scripts/bundle-schema.js
import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeTypeDefs } from '@graphql-tools/merge';
import { print } from 'graphql';
import { writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .graphql files
const loadedFiles = loadFilesSync(path.join(__dirname, '../server/schema.graphql'));
const typeDefs = mergeTypeDefs(loadedFiles);

// Convert AST → SDL string
const printedSchema = print(typeDefs);

// Write to schema.js
const output = `export default \`${printedSchema}\`;`;
writeFileSync('./server/schema.js', output);

console.log('✅ schema.js generated successfully!');
