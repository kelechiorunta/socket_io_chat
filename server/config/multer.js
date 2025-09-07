// src/config/multerConfig.ts
import multer from 'multer';

// Store in memory so we can manually stream to GridFS
const storage = multer.memoryStorage();

export const upload = multer({ storage });
