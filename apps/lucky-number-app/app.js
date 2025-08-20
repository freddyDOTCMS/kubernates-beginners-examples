const express = require('express');

const app = express();
const PORT = process.env.PORT || 3001;

// Simulate startup delay
const startupDelay = async () => {
  console.log('App is starting... please wait');
  await new Promise(resolve => setTimeout(resolve, 5000)); // 5 seconds delay
  console.log('App2 is ready!');
};


function busyWait(ms) {
    const start = Date.now();
    while (Date.now() - start < ms) {
      // Do nothing — just keep checking time
    }
  }

app.get('/lucky', async (req, res) => {
  const podName = process.env.POD_NAME;
  console.log("Running on pod:", podName);

  console.log(`Received request for lucky number in pod ${podName}...`);
  
  // Simulate request processing time
  busyWait(5000); // 5 seconds delay

  const luckyNumber = Math.floor(10 + Math.random() * 90); // 2-digit number
  console.log(`Generated lucky number: ${luckyNumber} in pod ${podName}`);

  res.json({ luckyNumber });
});

app.get('/ping', (req, res) => {
  res.json({ status: 'ok' });
});


startupDelay().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
