const http = require('http');
const url = require('url');

let tasks = [];
const PORT = 5000;

function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  });
  res.end(JSON.stringify(data));
}
function isAuthenticated(req) {
  const authHeader = req.headers['authorization'];
  return !!authHeader;
}
const server = http.createServer((req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    });
    return res.end();
  }

  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;

  // LOGIN route
  if (req.method === 'POST' && path === '/login') {
  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', () => {
    try {
      // Accept ANY username/password
      JSON.parse(body); // just to validate JSON
      return sendJSON(res, 200, { success: true });
    } catch {
      return sendJSON(res, 400, { error: 'Invalid JSON' });
    }
  });
  return;
}


  // Auth check for all /tasks routes
  if (path.startsWith('/tasks')) {
    if (!isAuthenticated(req)) {
      return sendJSON(res, 401, { error: 'Unauthorized' });
    }
  }

  // GET /tasks
  if (req.method === 'GET' && path === '/tasks') {
    return sendJSON(res, 200, tasks);
  }

  // POST /tasks
  if (req.method === 'POST' && path === '/tasks') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { title, description, day, date, time } = JSON.parse(body);
if (!title) {
  return sendJSON(res, 400, { error: 'Title is required' });
}
const newTask = {
  id: Date.now(),
  title,
  description: description || '',
  day,
  date,
  time
};
        tasks.push(newTask);
        sendJSON(res, 201, newTask);
      } catch {
        sendJSON(res, 400, { error: 'Invalid JSON' });
      }
    });
    return;
  }

  // DELETE /tasks/:id
  if (req.method === 'DELETE' && path.startsWith('/tasks/')) {
    const idStr = path.split('/')[2];
    const id = parseInt(idStr);
    if (isNaN(id)) return sendJSON(res, 400, { error: 'Invalid ID' });
    tasks = tasks.filter(task => task.id !== id);
    return sendJSON(res, 200, { message: 'Task deleted' });
  }

  sendJSON(res, 404, { error: 'Not Found' });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
