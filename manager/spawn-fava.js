const path = require('path');
const { spawn } = require('child_process');
const host = '65.109.81.69';

// new port for each url is needed
let port = 3002;

const runningFavaInstances = {};

function getUrl(id, port) {
  return `http://${host}:${port}/${id}`;
}

async function spawnFava({ id }) {
  if (runningFavaInstances[id]) {
    return getUrl(id, runningFavaInstances[id].port);
  }
  port++;
  // fava example.beancount --port 5001 --prefix /open
  const fileName = path.join(__dirname, '..', `${id}.beancount`);
  const fava = spawn('fava', [
    fileName,
    '--port',
    port,
    '--host',
    '0.0.0.0',
    // 'localhost',
    '--prefix',
    `/${id}`,
  ]);
  fava.stdout.on('data', function (data) {
    console.log(data.toString());
  });

  fava.stderr.on('data', (data) => {
    console.error(`Standard Error for ${id}: ${data}`);
  });

  fava.on('error', (error) => {
    console.error(`Error executing command for ${id}: ${error}`);
  });

  fava.on('close', (code) => {
    console.log(`Child process exited for ${id} with code ${code}`);
  });

  runningFavaInstances[id] = { fava, port };

  // to kill fava
  // fava.kill();

  return getUrl(id, port);
}

process.on('SIGTERM', () => {
  console.log('SIGTERM received, killing all fava instances');
  Object.keys(runningFavaInstances).forEach((id) => {
    const { fava } = runningFavaInstances[id];
    fava.kill();
  });
  console.log('done, exiting');
  process.exit(0);
});

module.exports = spawnFava;
