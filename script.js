const chat=document.getElementById("chat");
const input=document.getElementById("input");
const sendBtn=document.getElementById("sendBtn");
const welcome=document.getElementById("welcome");

/* Welcome typing */
const welcomeText="Welcome to Anuga AI";
let i=0;
function typeWelcome(){
    if(i<welcomeText.length){
        welcome.innerHTML+=welcomeText.charAt(i);
        i++;
        setTimeout(typeWelcome,70);
    } else {
        setTimeout(()=>welcome.style.display="none",800);
    }
}
window.onload=typeWelcome;

function scrollToBottom(){
    chat.scrollTop = chat.scrollHeight;
}

function addMessage(text,cls){
    const div=document.createElement("div");
    div.className="msg "+cls;
    div.textContent=text;
    chat.appendChild(div);
    scrollToBottom();
}

async function send(){
    const q = input.value.trim();
    if(!q) return;
    addMessage(q,"user");
    input.value="";

    let reply;

    const isImage = /image|logo|photo|design|draw|art/i.test(q);

    if(isImage){
        addMessage("Generating image…","ai");
        const url="https://dtz-ai-api-new.vercel.app/api/ai/ai-image?prompt="+encodeURIComponent(q);
        const res = await fetch(url);
        const data = await res.json();
        const img=document.createElement("img");
        img.src=data.url||data.image;
        img.style.maxWidth="280px";
        const d=document.createElement("div");
        d.className="msg ai";
        d.appendChild(img);
        chat.appendChild(d);
        scrollToBottom();
        return;
    }

    const res = await fetch("https://www.movanest.xyz/v2/powerbrainai?query="+encodeURIComponent(q));
    const data = await res.json();
    reply=data.results||"No response.";

    addMessage(reply,"ai");
}

sendBtn.addEventListener("click",send);
input.addEventListener("keypress",e=>{
    if(e.key==="Enter") send();
});
