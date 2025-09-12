// server/redisClient.js

import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();


let pubClient;
let subClient;

export function getRedisClients() {
  if (!pubClient || !subClient) {
    const redisUrl = process.env.REDIS_URL || process.env.UPSTASH_REDIS_REST_URL;

    pubClient = new Redis(redisUrl, { lazyConnect: true });
    subClient = new Redis(redisUrl, { lazyConnect: true });

    pubClient.on('error', (err) =>
      console.error(`❌ Redis Pub error (worker ${process.pid}):`, err)
    );
    subClient.on('error', (err) =>
      console.error(`❌ Redis Sub error (worker ${process.pid}):`, err)
    );
  }

  return { pubClient, subClient };
}
