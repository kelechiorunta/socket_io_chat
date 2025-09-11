// scripts/bundle-schema.js
import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeTypeDefs } from '@graphql-tools/merge';
import { writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load GraphQL SDL files
const loadedFiles = loadFilesSync(path.join(__dirname, '../server/schema.graphql'));
const typeDefs = mergeTypeDefs(loadedFiles);

// Output schema.js (export as string)
const output = `export default \`${typeDefs}\`;`;
writeFileSync('./server/schema.js', output);

console.log('✅ schema.js generated successfully!');
