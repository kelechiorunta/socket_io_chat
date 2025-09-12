// server/redisClient.js
import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

let pubClient;
let subClient;
let isReady = false;

export async function getRedisClients() {
  if (isReady) {
    return { pubClient, subClient };
  }

  const redisUrl = process.env.REDIS_URL || process.env.UPSTASH_REDIS_REST_URL;

  pubClient = createClient({ url: redisUrl });
  subClient = pubClient.duplicate();

  pubClient.on('error', (err) => console.error(`❌ Redis Pub Error (worker ${process.pid}):`, err));
  subClient.on('error', (err) => console.error(`❌ Redis Sub Error (worker ${process.pid}):`, err));

  await Promise.all([pubClient.connect(), subClient.connect()]);

  console.log(`✅ Redis connected in worker ${process.pid}`);
  isReady = true;

  return { pubClient, subClient };
}
