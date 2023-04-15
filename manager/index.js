const express = require('express');
const taxMaster = require('./tax-master');
const spawnFava = require('./spawn-fava');
const PORT = 3000;
const app = express();

app.use(express.json());

app.post('/tax', async (req, res) => {
  try {
    console.time('taxMaster');
    console.log('req.body', req.body);

    const { id } = req.body;

    await taxMaster({ id });
    const url = await spawnFava({ id });

    console.timeEnd('taxMaster');
    res.json({ url });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

app.get('/', function (req, res) {
  res.send('Hello from OpenTax');
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
