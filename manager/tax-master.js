const path = require('path');
const { spawn } = require('child_process');

async function taxMaster({ id, wallets, currency }) {
  return new Promise((resolve, reject) => {
    const pyScriptPath = path.join(
      __dirname,
      '..',
      '..',
      'open-tax-py',
      'tax-master.py',
    );
    const py = spawn('python3', [
      pyScriptPath,
      JSON.stringify({ id, wallets, currency }),
    ]);
    py.stdout.on('data', function (data) {
      console.log(data.toString());
      console.log('got data NOT resolving================');
      //   resolve();
    });

    py.stderr.on('data', (data) => {
      console.error(`Standard Error: ${data}`);
      reject(data);
    });

    py.on('error', (error) => {
      console.error(`Error executing command: ${error}`);
      reject(error);
    });

    py.on('close', (code) => {
      console.log(`Child process exited with code ${code}`);
      if (code === 0) {
        resolve(code);
      }
    });
  });
}

module.exports = taxMaster;
