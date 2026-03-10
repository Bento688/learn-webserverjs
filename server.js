const http = require("http");

const mockDB = [
  { id: 1, name: "Keyboard" },
  { id: 2, name: "Mouse" },
];

const server = http.createServer((req, res) => {
  // === set default headers for our api ===
  res.setHeader("Content-Type", "application/json");

  // manually checking the route and method
  if (req.url === "/api/items" && req.method === "GET") {
    res.writeHead(200);

    res.end(JSON.stringify(mockDB));
  } else if (req.url === "/api/items" && req.method === "POST") {
    // body parsing, handling the data stream manually
    let body = "";

    req.on("error", (err) => {
      console.error("Request stream error: ", err);
      if (!res.headersSent) {
        res.writeHead(400);
        res.end(JSON.stringify({ message: "error receiving data" }));
      }
    });

    res.on("error", (err) => {
      console.error("Response stream error ", err);
    });

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      try {
        const parsedData = JSON.parse(body);

        // create a new item and push to mockDB
        const newItem = {
          id: mockDB.length + 1,
          ...parsedData,
        };
        mockDB.push(newItem);

        res.writeHead(201);
        res.end(JSON.stringify(newItem));
      } catch (error) {
        res.writeHead(400);
        res.end(JSON.stringify({ message: "Invalid JSON payload" }));
      }
    });
  } else {
    //fallback route 404
    res.writeHead(404);
    res.end(JSON.stringify({ message: "Route not found" }));
  }
});

const PORT = 3000;

server.listen(PORT, () => {
  console.log(`Native HTTP server running on port ${PORT}`);
});
