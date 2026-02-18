const chatBox=document.getElementById("chatBox");
const input=document.getElementById("userInput");
const welcome=document.getElementById("welcome");

welcome.innerText="WELCOME TO ANUGA AI";

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
let speed=18;

function typing(){
if(i<text.length){
el.innerHTML+=text.charAt(i);
i++;
setTimeout(typing,speed);
}
}
typing();
}

async function sendMessage(){

let text=input.value.trim();
if(!text) return;

addMsg(text,"user");
input.value="";


// IMAGE MODE
if(text.toLowerCase().startsWith("image")){
let prompt=text.replace("image","");

let img=document.createElement("img");
img.src=`https://dtz-ai-api-new.vercel.app/api/ai/ai-image?prompt=${encodeURIComponent(prompt)}`;
img.style.width="220px";
img.style.borderRadius="12px";

let wrap=document.createElement("div");
wrap.className="msg ai";
wrap.appendChild(img);

chatBox.appendChild(wrap);
chatBox.scrollTop=chatBox.scrollHeight;
return;
}


// TEXT AI MODE
try{
let res=await fetch(`https://www.movanest.xyz/v2/powerbrainai?query=${encodeURIComponent(text)}`);
let data=await res.json();

addMsg(data.results,"ai");

}catch{
addMsg("Error contacting AI","ai");
}

}

input.addEventListener("keypress",e=>{
if(e.key==="Enter") sendMessage();
});
