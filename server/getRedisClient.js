// server/redisClient.js
import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

let pubClient;
let subClient;
let isReady = false;

export async function getRedisClients() {
  if (isReady && pubClient && subClient) {
    return { pubClient, subClient };
  }

  if (!pubClient) {
    pubClient = createClient({
      url: process.env.REDIS_URL || process.env.UPSTASH_REDIS_REST_URL
    });
    subClient = pubClient.duplicate();

    pubClient.on('error', (err) =>
      console.error(`❌ Redis Pub Error in worker ${process.pid}:`, err)
    );
    subClient.on('error', (err) =>
      console.error(`❌ Redis Sub Error in worker ${process.pid}:`, err)
    );

    if (pubClient.status !== 'ready' && pubClient.status !== 'connecting') {
      await pubClient.connect();
    }
    if (subClient.status !== 'ready' && subClient.status !== 'connecting') {
      await subClient.connect();
    }

    console.log(`✅ Redis connected in worker ${process.pid}`);
    isReady = true;
  }

  return { pubClient, subClient };
}
