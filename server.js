require('dotenv').config(); // Load environment variables
const express = require('express');
const path = require('path');
const fetch = require('node-fetch'); // Only if you're using Node.js < 18
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.static(path.join(__dirname)));
app.use(bodyParser.json()); // Parse JSON bodies

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/api/openai', async (req, res) => {
  const apiKey = process.env.OPENAI_API_KEY;
  const apiUrl = 'https://api.openai.com/v1/chat/completions';

  try {
    const payload = {
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a financial advisor. Analyze the following financial information and provide advice."
        },
        {
          role: "user",
          content: JSON.stringify(req.body)
        }
      ]
    };

    console.log('Sending request to OpenAI:', JSON.stringify(payload, null, 2));

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('OpenAI API error response:', errorBody);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('OpenAI API response:', JSON.stringify(result, null, 2));

    if (result.choices && result.choices.length > 0 && result.choices[0].message) {
      res.json({ response: result.choices[0].message.content });
    } else {
      res.status(500).json({ error: 'Unexpected API response structure' });
    }
  } catch (error) {
    console.error('Error in OpenAI API call:', error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});