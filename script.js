const chat = document.getElementById("chat");
const input = document.getElementById("input");
const historyDiv = document.getElementById("history");

const API_TEXT="https://www.movanest.xyz/v2/powerbrainai?query=";

let chats = JSON.parse(localStorage.getItem("anuga_threads")) || {};
let current = null;

/* ---------- Welcome Typing ---------- */
const welcome=document.getElementById("welcome");
let text="WELCOME TO ANUGA AI";
let i=0;
(function type(){
if(i<text.length){
welcome.innerHTML+=text[i++];
setTimeout(type,60);
}
})();

/* ---------- Sidebar ---------- */
function renderHistory(){
historyDiv.innerHTML="";
for(let id in chats){
let div=document.createElement("div");
div.className="chatItem";
div.innerText=chats[id].title;
div.onclick=()=>loadChat(id);
historyDiv.appendChild(div);
}
}
renderHistory();

/* ---------- New Chat ---------- */
document.getElementById("newChat").onclick=()=>{
let id="chat_"+Date.now();
chats[id]={title:"New Conversation",messages:[]};
current=id;
save();
renderHistory();
chat.innerHTML="";
};

/* ---------- Load Chat ---------- */
function loadChat(id){
current=id;
chat.innerHTML="";
chats[id].messages.forEach(m=>{
addBubble(m.text,m.role,false);
});
}

/* ---------- Save ---------- */
function save(){
localStorage.setItem("anuga_threads",JSON.stringify(chats));
}

/* ---------- Bubble ---------- */
function addBubble(text,role,store=true){
let div=document.createElement("div");
div.className="msg "+role;
div.innerHTML=text;
chat.appendChild(div);
chat.scrollTop=chat.scrollHeight;

if(store){
chats[current].messages.push({text,role});
save();
}
}

/* ---------- Typing Bot ---------- */
function typeBot(text){
let div=document.createElement("div");
div.className="msg bot";
chat.appendChild(div);

let i=0;
(function t(){
if(i<text.length){
div.innerHTML+=text[i++];
chat.scrollTop=chat.scrollHeight;
setTimeout(t,8);
}else{
chats[current].messages.push({text,role:"bot"});
save();
}
})();
}

/* ---------- Send ---------- */
document.getElementById("send").onclick=async()=>{
if(!current) return;

let q=input.value.trim();
if(!q) return;

addBubble(q,"user");
input.value="";

/* Set title */
if(chats[current].messages.length===1){
chats[current].title=q.substring(0,25);
renderHistory();
}

/* AI response */
let res=await fetch(API_TEXT+encodeURIComponent(q));
let data=await res.json();
typeBot(data.results);
};

/* Enter send */
input.addEventListener("keypress",e=>{
if(e.key==="Enter") document.getElementById("send").click();
});
