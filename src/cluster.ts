import cluster from "cluster";
import { availableParallelism } from "os";
import http from "http";
import dotenv from "dotenv";
import { createApp } from "./app";

dotenv.config();

const BASE_PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;

const numCPUs = Math.max(1, availableParallelism() - 1);

if (cluster.isPrimary) {
  console.log(`Master ${process.pid} is running`);
  console.log(`Load balancer running on http://localhost:${BASE_PORT}/api`);

  let workerIndex = 0;

  for (let i = 0; i < numCPUs; i++) {
    const port = BASE_PORT + i + 1;
    const env = { ...process.env, WORKER_PORT: port.toString() };

    const worker = cluster.fork(env);
    console.log(`Worker ${worker.process.pid} started on port ${port}`);
  }

  const server = http.createServer((req, res) => {
    const workers = Object.values(cluster.workers || {});

    if (workers.length === 0) {
      res.statusCode = 500;
      res.end(JSON.stringify({ message: "No workers available" }));
      return;
    }

    workerIndex = (workerIndex + 1) % workers.length;

    const targetPort = BASE_PORT + workerIndex + 1;
    const targetPath = req.url || "/";

    const options = {
      hostname: "localhost",
      port: targetPort,
      path: targetPath,
      method: req.method,
      headers: req.headers,
    };

    const proxyReq = http.request(options, (proxyRes) => {
      res.writeHead(proxyRes.statusCode || 500, proxyRes.headers);
      proxyRes.pipe(res, { end: true });
    });

    proxyReq.on("error", (err) => {
      console.error(`Proxy request error: ${err.message}`);
      res.statusCode = 500;
      res.end(JSON.stringify({ message: "Internal Server Error" }));
    });

    if (["POST", "PUT", "PATCH"].includes(req.method || "")) {
      req.pipe(proxyReq, { end: true });
    } else {
      proxyReq.end();
    }
  });

  server.listen(BASE_PORT, () => {
    console.log(`Load balancer running on port ${BASE_PORT}`);
  });

  cluster.on("exit", (worker) => {
    console.log(`Worker ${worker.process.pid} died`);

    const newWorker = cluster.fork();
    console.log(`Worker ${newWorker.process.pid} started`);
  });
} else {
  const workerPort =
    parseInt(process.env.WORKER_PORT || "", 10) || BASE_PORT + 1;
  const app = createApp(workerPort);
  app.start();

  console.log(`Worker ${process.pid} running on port ${workerPort}`);
}
