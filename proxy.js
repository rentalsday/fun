// api/proxy.js
export default async function handler(req, res) {
  // Only allow POST requests (for security)
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Forward the request body to xAI API
  try {
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.XAI_API_KEY}`,  // Key from Vercel env vars
      },
      body: JSON.stringify(req.body),  // Pass user's body (prompt, model, etc.)
    });

    if (!response.ok) {
      throw new Error(`xAI API error: ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json(data);  // Send back the AI response
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Proxy failed - check logs or key' });
  }
}
