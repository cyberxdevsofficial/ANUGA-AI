const chatBox=document.getElementById("chatBox");
const input=document.getElementById("userInput");

/* Messaging */

function addMsg(text,cls){
let div=document.createElement("div");
div.className="msg "+cls;
chatBox.appendChild(div);

if(cls==="ai"){
typeText(div,text);
}else{
div.innerText=text;
}
chatBox.scrollTop=chatBox.scrollHeight;
}

function typeText(el,text){
let i=0;
function t(){
if(i<text.length){
el.innerHTML+=text[i];
i++;
setTimeout(t,15);
}}
t();
}

async function sendMessage(){
let text=input.value.trim();
if(!text) return;

addMsg(text,"user");
input.value="";

/* Image Mode */
if(text.toLowerCase().startsWith("image")){
let prompt=text.replace("image","");
let img=document.createElement("img");
img.src=`https://dtz-ai-api-new.vercel.app/api/ai/ai-image?prompt=${encodeURIComponent(prompt)}`;
img.style.width="240px";
img.style.borderRadius="12px";

let wrap=document.createElement("div");
wrap.className="msg ai";
wrap.appendChild(img);
chatBox.appendChild(wrap);
return;
}

/* Text AI */
let res=await fetch(`https://www.movanest.xyz/v2/powerbrainai?query=${encodeURIComponent(text)}`);
let data=await res.json();
addMsg(data.results,"ai");
}

input.addEventListener("keypress",e=>{
if(e.key==="Enter") sendMessage();
});

/* Animated Background Particles */

const canvas=document.getElementById("bg");
const ctx=canvas.getContext("2d");

canvas.width=window.innerWidth;
canvas.height=window.innerHeight;

let particles=[];

for(let i=0;i<60;i++){
particles.push({
x:Math.random()*canvas.width,
y:Math.random()*canvas.height,
vx:(Math.random()-0.5)*0.5,
vy:(Math.random()-0.5)*0.5,
r:Math.random()*2
});
}

function animate(){
ctx.clearRect(0,0,canvas.width,canvas.height);

particles.forEach(p=>{
p.x+=p.vx;
p.y+=p.vy;

if(p.x<0||p.x>canvas.width)p.vx*=-1;
if(p.y<0||p.y>canvas.height)p.vy*=-1;

ctx.beginPath();
ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
ctx.fillStyle="rgba(255,255,255,0.3)";
ctx.fill();
});

requestAnimationFrame(animate);
}
animate();
