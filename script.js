const chat = document.getElementById("chat");
const input = document.getElementById("input");
const send = document.getElementById("send");
const clearBtn = document.getElementById("clearBtn");

const API_TEXT = "https://www.movanest.xyz/v2/powerbrainai?query=";
const API_IMG = "https://dtz-ai-api-new.vercel.app/api/ai/ai-image?prompt=";

/* ---------- Welcome typing ---------- */
const welcome = document.getElementById("welcomeText");
const welcomeMsg = "WELCOME TO ANUGA AI";

let wi=0;
function typeWelcome(){
if(wi < welcomeMsg.length){
welcome.innerHTML += welcomeMsg.charAt(wi);
wi++;
setTimeout(typeWelcome,70);
}
}
typeWelcome();

/* ---------- Message bubble ---------- */
function addMsg(text, cls){
let div = document.createElement("div");
div.className = "msg " + cls;
div.innerHTML = text;
chat.appendChild(div);
chat.scrollTop = chat.scrollHeight;
saveChat();
}

/* ---------- Typing animation ---------- */
function typeBot(text){
let div=document.createElement("div");
div.className="msg bot";
chat.appendChild(div);

let i=0;
function type(){
if(i<text.length){
div.innerHTML += text.charAt(i);
i++;
chat.scrollTop = chat.scrollHeight;
setTimeout(type,12);
}else{
saveChat();
}
}
type();
}

/* ---------- Save & Load Chat ---------- */
function saveChat(){
localStorage.setItem("anuga_chat", chat.innerHTML);
}

function loadChat(){
let saved = localStorage.getItem("anuga_chat");
if(saved) chat.innerHTML = saved;
}
loadChat();

/* ---------- Clear Chat ---------- */
clearBtn.onclick=()=>{
localStorage.removeItem("anuga_chat");
chat.innerHTML="";
}

/* ---------- Send Message ---------- */
send.onclick = async ()=>{
let q=input.value.trim();
if(!q) return;

addMsg(q,"user");
input.value="";

/* Image generation trigger */
if(q.toLowerCase().startsWith("draw") || q.toLowerCase().startsWith("image")){
let prompt=q.replace("draw","").replace("image","");
typeBot("Generating image...");

let res=await fetch(API_IMG+encodeURIComponent(prompt));
let data=await res.json();

addMsg(`<img src="${data.url}" style="max-width:100%;border-radius:12px">`,"bot");
return;
}

/* Text AI */
let res=await fetch(API_TEXT+encodeURIComponent(q));
let data=await res.json();
typeBot(data.results);
}

/* Enter key send */
input.addEventListener("keypress",e=>{
if(e.key==="Enter") send.click();
});
