const chatBox = document.getElementById('chatBox');

// Auto welcome typing
function autoWelcome() {
  const welcome = "Welcome to Anuga AI. How can I help you?";
  let i = 0;
  const msgDiv = document.createElement('div');
  msgDiv.className = 'message ai typing';
  chatBox.appendChild(msgDiv);

  function typeChar() {
    if(i < welcome.length){
      msgDiv.textContent += welcome.charAt(i);
      i++;
      chatBox.scrollTop = chatBox.scrollHeight;
      setTimeout(typeChar, 120);
    } else {
      msgDiv.classList.remove('typing');
    }
  }
  typeChar();
}

// Add message
function addMessage(sender, message) {
  const div = document.createElement('div');
  div.className = 'message ' + sender;
  div.textContent = message;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Send query
async function sendQuery() {
  const input = document.getElementById('queryInput');
  const text = input.value.trim();
  if(!text) return;

  addMessage('user', text);
  input.value = '';

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

    typingIndicator.remove();
    addMessage('ai', reply);
  } catch (err) {
    typingIndicator.remove();
    addMessage('ai', "Error connecting to Anuga AI API.");
    console.error(err);
  }
}

window.onload = autoWelcome;
