const path = require('path');
const { spawn } = require('child_process');
const host = '65.109.81.69';

// new port for each url is needed
let port = 3001;

const runningFavaInstances = {};

function getUrl(id) {
  return `http://${host}:${port}/${id}`;
}

async function spawnFava({ id }) {
  if (runningFavaInstances[id]) {
    return getUrl(id);
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

  runningFavaInstances[id] = fava;

  // to kill fava
  // fava.kill();

  return getUrl(id);
}

module.exports = spawnFava;
