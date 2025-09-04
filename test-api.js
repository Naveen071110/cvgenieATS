
const fetch = require('node-fetch');

async function testAPI() {
  try {
    console.log('Testing health endpoint...');
    const healthResponse = await fetch('http://localhost:5000/api/health');
    const healthData = await healthResponse.json();
    console.log('Health check:', healthData);

    console.log('\nTesting diagnostics endpoint...');
    const diagResponse = await fetch('http://localhost:5000/api/diagnostics');
    const diagData = await diagResponse.json();
    console.log('Diagnostics:', diagData);

    console.log('\nTesting generate endpoint...');
    const generateResponse = await fetch('http://localhost:5000/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalInfo: JSON.stringify({
          fullName: 'Test User',
          email: 'test@example.com',
          phone: '123-456-7890'
        }),
        jobDescription: 'Software Developer position requiring JavaScript and React skills.'
      })
    });

    const generateData = await generateResponse.json();
    console.log('Generate response status:', generateResponse.status);
    console.log('Generate response:', generateData);

  } catch (error) {
    console.error('Test error:', error);
  }
}

testAPI();
