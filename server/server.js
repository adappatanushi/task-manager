const http = require('http');
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'tasks.json');

function readTasks() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, '[]');
  }
  return JSON.parse(fs.readFileSync(DATA_FILE));
}

function writeTasks(tasks) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2));
}

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.url === '/tasks' && req.method === 'GET') {
    const tasks = readTasks();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(tasks));
  }

  else if (req.url === '/tasks' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const newTask = JSON.parse(body);
      const tasks = readTasks();
      tasks.push(newTask);
      writeTasks(tasks);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(newTask));
    });
  }

  else if (req.url.startsWith('/tasks/') && req.method === 'DELETE') {
    const id = req.url.split('/')[2];
    const tasks = readTasks().filter(task => task.id !== id);
    writeTasks(tasks);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Deleted' }));
  }

  else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
