const chat = document.getElementById("chat");
const input = document.getElementById("input");
const welcome = document.getElementById("welcome");
const sendBtn = document.getElementById("sendBtn");

/* Welcome typing */
const welcomeText="Welcome to Anuga AI";
let i=0;
function typeWelcome(){
    if(i<welcomeText.length){
        welcome.innerHTML+=welcomeText.charAt(i);
        i++;
        setTimeout(typeWelcome,70);
    } else {
        setTimeout(()=>welcome.style.display="none",1000);
    }
}
window.onload=typeWelcome;

/* Detect image prompts */
function isImagePrompt(t){
    const words=[
        "image","picture","photo","logo","design","draw","art",
        "icon","banner","poster","wallpaper","generate",
        "create image","make logo","illustration"
    ];
    t=t.toLowerCase();
    return words.some(w=>t.includes(w));
}

/* Typing animation */
function typeMessage(el,text){
    let i=0;
    function type(){
        if(i<text.length){
            el.innerHTML+=text.charAt(i);
            i++;
            setTimeout(type,15);
        }
    }
    type();
}

function addMessage(text,cls){
    const div=document.createElement("div");
    div.className="msg "+cls;
    chat.appendChild(div);

    if(cls==="ai")
        typeMessage(div,text);
    else
        div.innerHTML=text;

    chat.scrollTop=chat.scrollHeight;
}

/* Send Function */
async function send(){
    const q=input.value;
    if(!q) return;

    addMessage(q,"user");
    input.value="";

    /* IMAGE ROUTE */
    if(isImagePrompt(q)){
        addMessage("🎨 Generating image...","ai");

        const url="https://dtz-ai-api-new.vercel.app/api/ai/ai-image?prompt="+encodeURIComponent(q);
        const res=await fetch(url);
        const data=await res.json();

        const img=document.createElement("img");
        img.src=data.url || data.image;
        img.style.maxWidth="300px";

        const div=document.createElement("div");
        div.className="msg ai";
        div.appendChild(img);
        chat.appendChild(div);

        chat.scrollTop=chat.scrollHeight;
        return;
    }

    /* TEXT ROUTE */
    const url="https://www.movanest.xyz/v2/powerbrainai?query="+encodeURIComponent(q);
    const res=await fetch(url);
    const data=await res.json();

    addMessage(data.results,"ai");
}

/* Button click & Enter key */
sendBtn.addEventListener("click",send);
input.addEventListener("keypress",e=>{
    if(e.key==="Enter") send();
});
