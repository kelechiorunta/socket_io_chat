import cluster from 'cluster';
import os from 'os';
import net from 'net';
import dotenv from 'dotenv';

dotenv.config();

// const numCPUs = process.env.WEB_CONCURRENCY || os.cpus().length;
const numCPUs = Math.min(os.cpus().length, 1);
const PORT = process.env.PORT || 7334;

if (cluster.isPrimary) {
  console.log(`🚀 Master ${process.pid} running with ${numCPUs} workers`);

  // Start workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // Restart workers if they die
  cluster.on('exit', (worker, code, signal) => {
    console.error(`❌ Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });

  // Create TCP server (sticky session balancer)
  const workers = [];
  let current = 0;

  function getWorker() {
    const worker = workers[current];
    current = (current + 1) % workers.length;
    return worker;
  }

  // Collect all workers
  for (const id in cluster.workers) {
    workers.push(cluster.workers[id]);
  }

  // Rebalance when new worker joins
  cluster.on('online', (worker) => {
    workers.push(worker);
  });

  // TCP server that proxies sockets to workers
  net
    .createServer({ pauseOnConnect: true }, (connection) => {
      const worker = getWorker();
      worker.send('sticky-session:connection', connection);
    })
    .listen(PORT, () => {
      console.log(`📡 Sticky balancer listening on port ${PORT}`);
    });
} else {
  // Workers run Express/Socket.IO server
  await import('./index.js');
}
