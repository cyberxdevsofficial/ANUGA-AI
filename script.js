const API_URL = "https://www.movanest.xyz/v2/powerbrainai?query=";


// ===== Welcome typing =====
const welcomeText = "WELCOME TO ANUGA AI";
let w=0;

function typeWelcome(){
    if(w < welcomeText.length){
        document.getElementById("welcome").innerHTML += welcomeText.charAt(w);
        w++;
        setTimeout(typeWelcome,60);
    }
}
typeWelcome();


// ===== Send Message =====
async function sendMessage(){

    const input=document.getElementById("userInput");
    const text=input.value.trim();
    if(!text) return;

    addMessage(text,"user");
    input.value="";

    const botBubble = addMessage("","bot");

    try{
        const res = await fetch(API_URL + encodeURIComponent(text));
        const data = await res.json();

        const reply = data.results || "No response";

        typeResponse(botBubble, reply);

    }catch(err){
        typeResponse(botBubble,"Connection error");
    }
}


// ===== Add Message =====
function addMessage(text,type){
    const div=document.createElement("div");
    div.className="msg "+type;
    div.innerText=text;

    document.getElementById("chatBox").appendChild(div);
    document.getElementById("chatBox").scrollTop=999999;

    return div;
}


// ===== Typing Effect =====
function typeResponse(el,text){
    let i=0;
    el.innerText="";

    function type(){
        if(i<text.length){
            el.innerText += text.charAt(i);
            i++;
            setTimeout(type,15);
        }
    }
    type();
}
