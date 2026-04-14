// api/proxy.js
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// Initialize Firebase Admin SDK (Vercel automatically handles env vars if configured, 
// but for simplicity in this snippet, we assume standard client-side auth passes UID)
// NOTE: For server-side admin, you usually need a Service Account Key. 
// However, to keep this simple without uploading keys, we will let the CLIENT save to Firestore 
// directly using Security Rules, and the Proxy just handles the AI API.

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    const { mode, query, userId } = await req.json();
    
    if (!userId) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    let apiUrl = '';

    if (mode === 'image') {
      apiUrl = `https://dtz-ai-api-new.vercel.app/api/ai/ai-image?prompt=${encodeURIComponent(query)}`;
    } else if (mode === 'chat') {
      apiUrl = `https://www.movanest.xyz/v2/powerbrainai?query=${encodeURIComponent(query)}`;
    } else if (mode === 'text') {
      apiUrl = `https://www.movanest.xyz/v2/pollination?text=${encodeURIComponent(query)}`;
    } else {
      return new Response(JSON.stringify({ error: 'Invalid mode' }), { status: 400 });
    }

    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    let responseData;
    let isImage = false;

    // --- HANDLE IMAGE MODE ---
    if (mode === 'image') {
      if (contentType && contentType.startsWith('image/')) {
        const arrayBuffer = await response.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString('base64');
        responseData = `${contentType};base64,${base64}`;
        isImage = true;
      } else {
        const jsonData = await response.json();
        responseData = jsonData.url || jsonData.image || jsonData.output || JSON.stringify(jsonData);
        isImage = true; // Assume success is image
      }
    } 
    // --- HANDLE TEXT/CHAT MODE ---
    else {
        if (contentType && contentType.includes('application/json')) {
            const jsonData = await response.json();
            responseData = jsonData.result || jsonData.response || jsonData.text || JSON.stringify(jsonData);
        } else {
            responseData = await response.text();
        }
    }

    return new Response(JSON.stringify({ 
        success: true, 
        data: responseData, 
        isImage: isImage 
    }), {
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
