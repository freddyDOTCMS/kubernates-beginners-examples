const express = require('express');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const fetch = require('node-fetch');
const LuckyPage = require('./component/LuckyPage.jsx').default;

const app = express();
const PORT = process.env.PORT || 4000;
const LUCKY_API_URL = process.env.LUCKY_API_URL || 'http://lucky-number-app/lucky';
const PING_URL = (LUCKY_API_URL.replace(/\/lucky$/, '/ping'));

async function checkLuckyNumberApp() {
  try {
    const res = await fetch(PING_URL, { timeout: 2000 });
    if (!res.ok) throw new Error('Ping failed');
    const data = await res.json();
    if (data.status !== 'ok') throw new Error('Ping returned unexpected status');
    return true;
  } catch (err) {
    console.error('Could not reach lucky-number-app /ping endpoint:', err.message);
    return false;
  }
}

app.get('/', async (req, res) => {
  try {
    const response = await fetch(LUCKY_API_URL);
    const data = await response.json();
    const html = ReactDOMServer.renderToString(<LuckyPage number={data.luckyNumber} />);
    
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Your Lucky Number</title>
          <style>
            body { font-family: sans-serif; text-align: center; margin-top: 3em; }
            .number { font-size: 3em; color: #2b7a78; }
          </style>
        </head>
        <body>
          ${html}
        </body>
      </html>
    `);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to fetch lucky number');
  }
});

checkLuckyNumberApp().then((ok) => {
  if (!ok) {
    console.error('Startup aborted: lucky-number-app is not reachable.');
    process.exit(1);
  }
  app.listen(PORT, () => {
    console.log(`Lucky Web App running on port ${PORT}`);
  });
});
