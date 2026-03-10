const MiniExpress = require("./miniexpress");

const MiniExpress = new MiniExpress();

const mockDB = [
  { id: 1, name: "Keyboard" },
  { id: 2, name: "Mouse" },
];

app.get("/api/items", (req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(mockDB));
});

app.post("/api/items", (req, res) => {
  let body = "";

  req.on("data", (chunk) => (body += chunk.toString()));

  req.on("end", () => {
    try {
      const parsedData = JSON.parse(body);
      const newItem = { id: mockDB.length + 1, ...parsedData };
      mockDB.push(newItem);

      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify(newItem));
    } catch (error) {
      res.writeHead(400);
      res.end(JSON.stringify({ message: "Invalid JSON" }));
    }
  });
});

app.listen(3000, () => {
  console.log("Mini Express running on port 3000");
});
