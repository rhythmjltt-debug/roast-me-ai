const modes = {
 normal:{label:"Normal Roast", intro:"You have the confidence of someone who has never experienced consequences."},
 nuclear:{label:"Nuclear Roast", intro:"You asked for nuclear. At this point, even your Wi-Fi is trying to distance itself from you."},
 brainrot:{label:"Brainrot Roast", intro:"Your aura has left the server and your NPC settings are somehow still on default."},
 indian:{label:"Indian Roast", intro:"Somewhere, an Indian parent just sensed your life choices and whispered, 'What are you doing with your life?'"},
 ex:{label:"Ex Roast", intro:"Your relationship history isn't a love story. It's a character-development subscription you forgot to cancel."},
 genz:{label:"Gen-Z Roast", intro:"The aura is buffering, the rizz is under investigation, and the delusion is absolutely premium."},
 fbi:{label:"FBI Roast", intro:"We connected the dots. Unfortunately, the dots are mostly questionable decisions."}
};

const questionBank = {
 default:[
  "😂 What's the most embarrassing thing you've ever done?",
  "🦸 If you could have ONE completely useless superpower, what would it be?",
  "🎪 What's your secret talent that absolutely nobody asked for?",
  "🚨 What's the most suspicious thing you've done that was actually innocent?",
  "🧠 What's one thing you're weirdly obsessed with?",
  "💀 What's your biggest delusion right now?",
  "🫣 What's something you do that you'd NEVER admit publicly?",
  "🕵️ What would your best friend expose about you instantly?",
  "🎬 If your life were a movie, what would the title be?",
  "🪦 What's one decision you made that you immediately regretted?"
 ],
 indian:[
  "🏠 What is one lie you regularly tell your parents?",
  "🍛 What food could you eat for seven days straight?",
  "📱 What would your family find first if they checked your phone?",
  "💍 What question at a family function do you desperately want to escape?",
  "📚 What's your most creative excuse for not studying/working?",
  "🛵 What's the most chaotic thing you've done outside the house?",
  "👀 What would your mother expose about you instantly?",
  "💸 What's the dumbest thing you've spent money on?",
  "🎬 What movie/series are you secretly obsessed with?",
  "🧹 What's the one household chore you behave like you were never trained to do?"
 ],
 ex:[
  "💔 What's the dumbest thing you did for your ex/crush?",
  "🚩 What red flag did you pretend was cute?",
  "📱 What's the most embarrassing text you've sent them?",
  "🎵 What song exposes your entire relationship?",
  "🫠 What's the most delusional thing you believed about them?",
  "👀 What's the pettiest thing you did after the breakup?",
  "🧠 What excuse did you make for them that you now regret?",
  "🧨 What would your best friend say was your worst relationship decision?",
  "😂 What was the most awkward moment between you two?",
  "🪦 What part of the relationship should have ended six months earlier?"
 ],
 brainrot:[
  "🧠 What's your current brainrot obsession?",
  "🗿 What's the most NPC thing you've ever done?",
  "💀 What's your most useless flex?",
  "🧍 What's your most 'I have no idea why I did that' moment?",
  "✨ What's your most delusional main-character belief?",
  "📱 What's the weirdest thing in your camera roll?",
  "🗣️ What's a phrase you say way too often?",
  "🍳 What's the most unhinged thing you've done because you were bored?",
  "🎮 If your life had a loading screen tip, what would it say?",
  "🚨 What's your current side quest?"
 ]
};

let selectedMode="normal";
let photoData="";
let selected=new Map();

const photo=document.getElementById("photo");
const preview=document.getElementById("preview");
const upload=document.querySelector(".upload");
const cook=document.getElementById("cook");
const statusEl=document.getElementById("status");

photo.addEventListener("change",e=>{
  const f=e.target.files?.[0];
  if(!f)return;
  if(!f.type.startsWith("image/"))return;
  const reader=new FileReader();
  reader.onload=()=>{
    photoData=reader.result;
    preview.src=photoData;
    upload.classList.add("has-photo");
    updateState();
  };
  reader.readAsDataURL(f);
});

document.getElementById("removePhoto").addEventListener("click",e=>{
  e.preventDefault();
  e.stopPropagation();
  photo.value="";
  photoData="";
  preview.removeAttribute("src");
  upload.classList.remove("has-photo");
  updateState();
});

document.querySelectorAll("#modes button").forEach(btn=>{
  btn.addEventListener("click",()=>{
    document.querySelectorAll("#modes button").forEach(x=>x.classList.remove("selected"));
    btn.classList.add("selected");
    selectedMode=btn.dataset.mode;
    renderQuestions();
    updateState();
  });
});
document.querySelector('#modes button[data-mode="normal"]').classList.add("selected");

function getPool(){
  if(selectedMode==="indian")return questionBank.indian;
  if(selectedMode==="ex")return questionBank.ex;
  if(selectedMode==="brainrot")return questionBank.brainrot;
  return questionBank.default;
}

function renderQuestions(){
  selected.clear();
  document.getElementById("count").textContent="0/3";
  const box=document.getElementById("questions");
  box.innerHTML="";
  const questions=[...getPool()].sort(()=>Math.random()-.5);

  questions.forEach((question,index)=>{
    const card=document.createElement("div");
    card.className="question-card";
    card.dataset.id=String(index);

    const top=document.createElement("div");
    top.className="question-top";

    const check=document.createElement("span");
    check.className="question-check";
    check.textContent="✓";

    const label=document.createElement("span");
    label.className="question-text";
    label.textContent=question;

    top.append(check,label);

    const textarea=document.createElement("textarea");
    textarea.placeholder="Type your answer...";
    textarea.setAttribute("aria-label","Your answer");

    top.addEventListener("click",()=>{
      toggleQuestion(card,index);
    });

    textarea.addEventListener("input",()=>{
      if(card.classList.contains("selected")){
        selected.set(String(index),textarea.value);
        updateState();
      }
    });

    card.append(top,textarea);
    box.appendChild(card);
  });
}

function toggleQuestion(card,index){
  const id=String(index);

  if(card.classList.contains("selected")){
    card.classList.remove("selected");
    selected.delete(id);
  }else{
    if(selected.size>=3){
      card.animate(
        [{transform:"translateX(0)"},{transform:"translateX(-5px)"},
         {transform:"translateX(5px)"},{transform:"translateX(0)"}],
        {duration:180}
      );
      statusEl.textContent="You already picked 3. Deselect one if you want to change it.";
      return;
    }
    card.classList.add("selected");
    selected.set(id,"");
  }

  document.getElementById("count").textContent=`${selected.size}/3`;
  updateState();
}

function updateState(){
  document.getElementById("count").textContent=`${selected.size}/3`;

  const allAnswered=selected.size===3 &&
    [...selected.values()].every(v=>String(v).trim().length>0);

  const ready=Boolean(photoData)&&allAnswered;
  cook.disabled=!ready;
  cook.setAttribute("aria-disabled",String(!ready));

  if(!photoData){
    statusEl.textContent="Upload a photo to begin.";
    statusEl.classList.remove("ready");
  }else if(selected.size<3){
    statusEl.textContent=`Pick ${3-selected.size} more question${3-selected.size===1?"":"s"}.`;
    statusEl.classList.remove("ready");
  }else if(!allAnswered){
    statusEl.textContent="3/3 selected. Now answer all three questions.";
    statusEl.classList.remove("ready");
  }else{
    statusEl.textContent="You're ready. Time to get cooked. 🔥";
    statusEl.classList.add("ready");
  }
}

function score(seed){
  let n=0;
  for(const c of seed)n=(n*31+c.charCodeAt(0))%9973;
  return n;
}
function pct(n){return Math.max(7,(n%94)+4)}

function makeRoast(mode,answers){
  const intro=modes[mode].intro;
  const lines=[
    intro,
    `You really chose "${answers[0]}". That explains more than you think.`,
    `Then you casually admitted: "${answers[1]}". Please understand that this is not a personality trait.`,
    `And "${answers[2]}"? That's not a fun fact. That's evidence.`,
    mode==="indian"
      ? "Your family group chat would have a 47-message discussion about this."
      : "Somewhere, your future self just watched this and whispered, 'We could have been normal.'"
  ];
  return lines.join("\n\n");
}

cook.addEventListener("click",()=>{
  const answers=[...selected.values()].map(v=>String(v).trim());
  if(!photoData||selected.size!==3||answers.some(v=>!v))return;

  const s=score(answers.join("|")+selectedMode);
  const vals={
    delusion:pct(s),
    aura:pct(s+17),
    chaos:pct(s+33),
    rizz:pct(s+51),
    npc:pct(s+77),
    yapping:pct(s+121)
  };

  document.getElementById("stats").innerHTML=[
    ["🧠 Delusion",vals.delusion],
    ["✨ Aura",vals.aura],
    ["💀 Chaos",vals.chaos],
    ["🗣️ Yapping",vals.yapping],
    ["🧍 NPC Energy",vals.npc],
    ["❤️ Rizz",vals.rizz]
  ].map(([label,value])=>`<div class="stat"><label>${label}</label><strong>${value}%</strong></div>`).join("");

  document.getElementById("resultPhoto").src=photoData;
  document.getElementById("roastText").innerHTML=makeRoast(selectedMode,answers).replace(/\n\n/g,"<br><br>");
  document.getElementById("finalBox").textContent=
    vals.delusion>85 ? "You are not cooked. You are DEEP FRIED. 🍳"
    : vals.aura<30 ? "You're not the main character. You're the loading screen. 💀"
    : "Respectfully... you're cooked. 🔥";

  document.getElementById("verdict").textContent=
    vals.delusion>85 ? "ABSOLUTELY COOKED"
    : vals.chaos>75 ? "CONCERNINGLY COOKED"
    : "LIGHTLY COOKED";

  document.getElementById("app").classList.add("hidden");
  document.getElementById("result").classList.remove("hidden");
  window.scrollTo({top:0,behavior:"smooth"});
});

document.getElementById("again").addEventListener("click",()=>location.reload());

document.getElementById("friend").addEventListener("click",()=>{
  alert("Send this page to your friend and tell them: “I found something that will ruin your confidence.” 😭");
});

document.getElementById("share").addEventListener("click",async()=>{
  const text="I just got absolutely cooked by Roast Me AI 💀";
  if(navigator.share){
    try{await navigator.share({title:"Roast Me AI",text,url:location.href})}catch(e){}
  }else{
    try{
      await navigator.clipboard.writeText(location.href);
      alert("Link copied. Now go ruin your friend's day. 💀");
    }catch(e){
      alert("Copy this page URL and send it to your friend. 💀");
    }
  }
});

renderQuestions();
updateState();
