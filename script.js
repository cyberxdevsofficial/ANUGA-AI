const chatBox = document.getElementById('chatBox');

// Auto-type welcome message on load
function autoWelcome() {
  const welcome = "WELCOME TO ANUGA AI";
  let i = 0;
  const msgDiv = document.createElement('div');
  msgDiv.className = 'message ai typing';
  chatBox.appendChild(msgDiv);

  function typeChar() {
    if(i < welcome.length){
      msgDiv.textContent += welcome.charAt(i);
      i++;
      chatBox.scrollTop = chatBox.scrollHeight;
      setTimeout(typeChar, 100);
    } else {
      msgDiv.classList.remove('typing');
    }
  }
  typeChar();
}

// Add message to chat
function addMessage(sender, message) {
  const div = document.createElement('div');
  div.className = 'message ' + sender;
  div.textContent = message;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Send query to API
async function sendQuery() {
  const queryInput = document.getElementById('queryInput');
  const text = queryInput.value.trim();
  if(!text) return;

  addMessage('user', text);
  queryInput.value = '';

  // AI typing indicator
  const typingIndicator = document.createElement('div');
  typingIndicator.className = 'message ai typing';
  typingIndicator.textContent = "Anuga AI is typing...";
  chatBox.appendChild(typingIndicator);
  chatBox.scrollTop = chatBox.scrollHeight;

  try {
    let reply;
    const lowerText = text.toLowerCase();

    // Custom owner response as paragraph
    if (
      lowerText.includes("owner") ||
      lowerText.includes("who is your owner") ||
      lowerText.includes("your owner")
    ) {
      reply = "My owner is Anuga Senithu De Silva, born on 2013/01/20. He studied at G/Gintota National College in Sri Lanka and has extensive technical knowledge and qualifications, including development, hacking, and other advanced technical skills. He created me to assist with information and provide AI-powered guidance.";
    } else {
      // Call API for other questions
      const apiUrl = "https://www.movanest.xyz/v2/powerbrainai?query=" + encodeURIComponent(text);
      const response = await fetch(apiUrl);
      const result = await response.json();
      reply = "No response received.";
      if(result && result.results) reply = result.results;
    }

    typingIndicator.remove();
    addMessage('ai', reply);

  } catch(err) {
    typingIndicator.remove();
    addMessage('ai', "Error connecting to Anuga AI API.");
    console.error(err);
  }
}

// Run auto welcome on page load
window.onload = autoWelcome;
