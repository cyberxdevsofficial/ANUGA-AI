const chatBox = document.getElementById('chatBox');

// Auto welcome typing
function autoWelcome() {
  const welcome = "WELCOME TO ANUGA AI";
  typeMessage('ai', welcome, 120);
}

// Add message instantly (used for user)
function addMessage(sender, message) {
  const div = document.createElement('div');
  div.className = 'message ' + sender;
  div.textContent = message;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Type message character by character (for AI)
function typeMessage(sender, text, speed = 50) {
  const div = document.createElement('div');
  div.className = 'message ' + sender + ' typing';
  chatBox.appendChild(div);

  let i = 0;
  function typeChar() {
    if (i < text.length) {
      div.textContent += text.charAt(i);
      i++;
      chatBox.scrollTop = chatBox.scrollHeight;
      setTimeout(typeChar, speed);
    } else {
      div.classList.remove('typing');
    }
  }
  typeChar();
}

// Send query
async function sendQuery() {
  const input = document.getElementById('queryInput');
  const text = input.value.trim();
  if (!text) return;

  addMessage('user', text);
  input.value = '';

  // Show AI typing placeholder
  const typingIndicator = document.createElement('div');
  typingIndicator.className = 'message ai typing';
  typingIndicator.textContent = "Anuga AI is typing...";
  chatBox.appendChild(typingIndicator);
  chatBox.scrollTop = chatBox.scrollHeight;

  try {
    let reply;
    const lowerText = text.toLowerCase();

    // Custom owner response
    if (lowerText.includes("owner") || lowerText.includes("who is your owner") || lowerText.includes("your owner")) {
      reply = "My owner is Anuga Senithu De Silva, born on 2013/01/20. He studied at G/Gintota National College in Sri Lanka and has extensive technical knowledge and qualifications, including development, hacking, and other advanced technical skills. He created me to assist with information and provide AI-powered guidance.";
    } else {
      const apiUrl = "https://www.movanest.xyz/v2/powerbrainai?query=" + encodeURIComponent(text);
      const response = await fetch(apiUrl);
      const result = await response.json();
      reply = (result && result.results) ? result.results : "No response received.";
    }

    // Remove placeholder and type AI response
    typingIndicator.remove();
    typeMessage('ai', reply, 30); // 30ms per character typing

  } catch (err) {
    typingIndicator.remove();
    typeMessage('ai', "Error connecting to Anuga AI API.", 30);
    console.error(err);
  }
}

window.onload = autoWelcome;
