const chatBox=document.getElementById('chatBox');

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

function typeMessage(sender,text,speed=35){
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

function showImage(url){
const div=document.createElement('div');
div.className='message ai';

const img=document.createElement('img');
img.src=url;
img.className='ai-image';

div.appendChild(img);
chatBox.appendChild(div);
chatBox.scrollTop=chatBox.scrollHeight;
}

function isImageRequest(text){
const words=["draw","image","generate image","create image","photo","picture","art"];
return words.some(w=>text.toLowerCase().includes(w));
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

// IMAGE
if(isImageRequest(text)){
loader.textContent="Generating image...";
const url="https://dtz-ai-api-new.vercel.app/api/ai/ai-image?prompt="+encodeURIComponent(text);
loader.remove();
typeMessage('ai',"Here is your image:",25);
showImage(url);
return;
}

// OWNER
let reply;
if(text.toLowerCase().includes("owner")){
reply="My owner is Anuga Senithu De Silva, born on 2013/01/20. He studied at G/Gintota National College in Sri Lanka and has strong technical expertise including development, hacking, and advanced computing.";
}else{
const res=await fetch("https://www.movanest.xyz/v2/powerbrainai?query="+encodeURIComponent(text));
const data=await res.json();
reply=data.results || "No response received.";
}

loader.remove();
typeMessage('ai',reply,28);

}catch{
loader.remove();
typeMessage('ai',"Connection error.",28);
}
}

window.onload=autoWelcome;
