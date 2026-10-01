const { spawn } = require('child_process');

console.log('Starting Backend & Client dev servers...\n');

const server = spawn('node server/server.js', {
  stdio: 'inherit',
  shell: true,
});

const client = spawn('npm --prefix client run dev', {
  stdio: 'inherit',
  shell: true,
});

const cleanup = () => {
  try { server.kill(); } catch (e) {}
  try { client.kill(); } catch (e) {}
  process.exit();
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('exit', cleanup);
