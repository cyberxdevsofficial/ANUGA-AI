// api/proxy.js
export const config = {
  runtime: 'edge', // Use Edge runtime for faster response
};

export default async function handler(req) {
  // Allow only POST requests for security
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    const { mode, query } = await req.json();
    let apiUrl = '';
    let resultKey = 'result'; // Default key to look for

    // Determine API URL based on mode
    if (mode === 'image') {
      apiUrl = `https://dtz-ai-api-new.vercel.app/api/ai/ai-image?prompt=${encodeURIComponent(query)}`;
      // Image APIs often return { url: "..." } or just the URL string
    } else if (mode === 'chat') {
      apiUrl = `https://www.movanest.xyz/v2/powerbrainai?query=${encodeURIComponent(query)}`;
      resultKey = 'result'; // As per your requirement
    } else if (mode === 'text') {
      apiUrl = `https://www.movanest.xyz/v2/pollination?text=${encodeURIComponent(query)}`;
      resultKey = 'result'; // As per your requirement
    } else {
      return new Response(JSON.stringify({ error: 'Invalid mode' }), { status: 400 });
    }

    // Fetch from the external API
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    let data;

    // Handle different response types
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
      
      // Extract the actual answer based on the mode
      if (mode === 'image') {
        // Try common keys for image URLs
        data = data.url || data.image || data.results || data; 
      } else {
        // For chat/text, you specified the answer is in 'result'
        // If 'result' doesn't exist, fallback to 'results' or the whole object
        data = data.result || data.results || JSON.stringify(data);
      }
    } else {
      // If it returns plain text
      data = await response.text();
    }

    return new Response(JSON.stringify({ success: true, data: data }), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Proxy Error:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
