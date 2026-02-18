const chat=document.getElementById("chat");

function add(text,type){
const div=document.createElement("div");
div.className="msg "+type;
div.textContent=text;
chat.appendChild(div);
chat.scrollTop=chat.scrollHeight;
}

function typeEffect(text){
const div=document.createElement("div");
div.className="msg bot";
chat.appendChild(div);

let i=0;
const t=setInterval(()=>{
div.textContent+=text[i];
i++;
if(i>=text.length) clearInterval(t);
},20);
}

async function send(){
const input=document.getElementById("msg");
const q=input.value;
if(!q) return;

add(q,"user");
input.value="";

let response;

if(q.startsWith("/img")){
let prompt=q.replace("/img","");

response=await fetch(
`https://dtz-ai-api-new.vercel.app/api/ai/ai-image?prompt=${encodeURIComponent(prompt)}`
);

const data=await response.json();
typeEffect(data.url || "Image generated");

}else{

response=await fetch(
`https://www.movanest.xyz/v2/powerbrainai?query=${encodeURIComponent(q)}`
);

const data=await response.json();
typeEffect(data.results);
saveChat(q,data.results);
}
}

/* AUTH */

function signup(){
fbFns.createUserWithEmailAndPassword(firebaseAuth,
email.value,password.value);
}

function login(){
fbFns.signInWithEmailAndPassword(firebaseAuth,
email.value,password.value);
}

function logout(){
fbFns.signOut(firebaseAuth);
}

/* SAVE CHAT */

async function saveChat(q,r){
await fbFns.addDoc(
fbFns.collection(firebaseDB,"chats"),
{uid:firebaseAuth.currentUser.uid,q,r}
);
}

/* LOAD CHAT */

fbFns.onAuthStateChanged(firebaseAuth, async user=>{
if(user){
authBox.classList.add("hidden");
chatUI.classList.remove("hidden");

const q=fbFns.query(
fbFns.collection(firebaseDB,"chats"),
fbFns.where("uid","==",user.uid)
);

const snap=await fbFns.getDocs(q);
snap.forEach(d=>{
add(d.data().q,"user");
add(d.data().r,"bot");
});

}else{
authBox.classList.remove("hidden");
chatUI.classList.add("hidden");
}
});
