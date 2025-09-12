import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

let pubClient;
let subClient;
let redisReady = false;

async function setupRedisAdapter(io) {
  if (redisReady) {
    console.log(`⚡ Redis already connected in worker ${process.pid}, skipping...`);
    return;
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

    // ✅ Only connect if not already connected
    if (pubClient.status !== 'ready' && pubClient.status !== 'connecting') {
      await pubClient.connect();
    }
    if (subClient.status !== 'ready' && subClient.status !== 'connecting') {
      await subClient.connect();
    }

    console.log(`✅ Redis connected in worker ${process.pid}`);
  }

  io.adapter(createAdapter(pubClient, subClient));
  redisReady = true;
}

export default setupRedisAdapter;
