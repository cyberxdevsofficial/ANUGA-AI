const chatBox = document.getElementById('chatBox');

function autoWelcome(){
  typeMessage('ai',"WELCOME TO ANUGA AI",120);
}

function addMessage(sender,msg){
  const div=document.createElement('div');
  div.className='message '+sender;
  div.textContent=msg;
  chatBox.appendChild(div);
  chatBox.scrollTop=chatBox.scrollHeight;
}

function typeMessage(sender,text,speed=40){
  const div=document.createElement('div');
  div.className='message '+sender+' typing';
  chatBox.appendChild(div);

  let i=0;
  function type(){
    if(i<text.length){
      div.textContent+=text.charAt(i);
      i++;
      chatBox.scrollTop=chatBox.scrollHeight;
      setTimeout(type,speed);
    }else{
      div.classList.remove('typing');
    }
  }
  type();
}

async function sendQuery(){
  const input=document.getElementById('queryInput');
  const text=input.value.trim();
  if(!text) return;

  addMessage('user',text);
  input.value='';

  const loader=document.createElement('div');
  loader.className='message ai typing';
  loader.textContent="Anuga AI is typing...";
  chatBox.appendChild(loader);

  try{
    let reply;
    const lower=text.toLowerCase();

    if(lower.includes("owner")){
      reply="My owner is Anuga Senithu De Silva, born on 2013/01/20. He studied at G/Gintota National College in Sri Lanka and has extensive technical knowledge and qualifications, including development, hacking, and other advanced technical skills.";
    }else{
      const res = await fetch(
        "https://dtz-ai-api-new.vercel.app/api/ai/gemini?prompt=" +
        encodeURIComponent(text)
      );

      const data = await res.json();
      reply = data.data || "No response received.";
    }

    loader.remove();
    typeMessage('ai',reply,28);

  }catch(e){
    loader.remove();
    typeMessage('ai',"Error connecting to Gemini API.",28);
  }
}

window.onload=autoWelcome;
