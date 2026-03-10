const http = require("http");

class MiniExpress {
  constructor() {
    this.routes = {};
  }

  register(method, path, handler) {
    const key = `${method} ${path}`;
    this.routes[key] = handler;
  }

  get(path, handler) {
    this.register("GET", path, handler);
  }

  post(path, handler) {
    this.register("POST", path, handler);
  }

  listen(port, callback) {
    const server = http.createServer((req, res) => {
      const key = `${req.method} ${req.url}`;
      const handler = this.routes[key];

      if (handler) {
        handler(req, res);
      } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Route not found" }));
      }
    });

    server.listen(port, callback);
  }
}

// expose the class to the rest of the node application
module.exports = MiniExpress;
