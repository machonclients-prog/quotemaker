const shekel = new Intl.NumberFormat("he-IL",{style:"currency",currency:"ILS"});
function fmt(amount, cur){
  const n = Number(amount||0);
  if(cur==="ILS") return shekel.format(n);
  return n.toLocaleString('he-IL') + " " + cur;
}

const defaultDeliverables = [
  "הפקת 4 סרטונים שיווקיים (ברירת מחדל)",
  "ניהול קמפיין ממומן בפייסבוק ובאינסטגרם",
  "ניהול קמפיין בגוגל (חיפוש/תצוגה)",
  "בנייה/אופטימיזציה של עמוד נחיתה או בוט לקליטת לידים",
  "חיבור ל-CRM/Google Sheets + תיוג אוטומטי",
  "אוטומציה: הודעות וואטסאפ/SMS/מייל",
  "אופטימיזציה שוטפת להורדת עלות לליד ושיפור יחס המרה",
  "קשר שוטף לשיפור תוצאות המכירות"
];

const state = {
  agencyName: document.getElementById('agencyName').value,
  clientName: "",
  projectTitle: "",
  currency: document.getElementById('currency').value,
  retainer: document.getElementById('retainer').value,
  setup: document.getElementById('setup').value,
  includeVat: document.getElementById('includeVat').checked,
  noticeDays: Number(document.getElementById('noticeDays').value)||14,
  deliverables: [...defaultDeliverables],
  milestones: [
    {title:"שבוע 1", text:"מחקר, אסטרטגיה והקמה"},
    {title:"שבוע 2", text:"השקה ובדיקות A/B"},
    {title:"שבועות 3–4", text:"אופטימיזציה וסקיילינג"}
  ],
  logoDataUrl: null
};

function saveLS(){ localStorage.setItem('proposalGen:v1', JSON.stringify(state)); }
function loadLS(){
  try{
    const s = JSON.parse(localStorage.getItem('proposalGen:v1'));
    if(!s) return;
    Object.assign(state,s);
    document.getElementById('agencyName').value = state.agencyName||"";
    document.getElementById('clientName').value = state.clientName||"";
    document.getElementById('projectTitle').value = state.projectTitle||"";
    document.getElementById('currency').value = state.currency||"ILS";
    document.getElementById('retainer').value = state.retainer||3800;
    document.getElementById('setup').value = state.setup||0;
    document.getElementById('includeVat').checked = !!state.includeVat;
    document.getElementById('noticeDays').value = state.noticeDays||14;
  }catch(e){}
}
loadLS();

function renderDeliverables(){
  const box = document.getElementById('deliverablesList'); box.innerHTML="";
  state.deliverables.forEach((d,idx)=>{
    const span = document.createElement('span');
    span.className="chip";
    span.textContent=d;
    const x=document.createElement('button'); x.textContent="×"; x.style.border=0;x.style.background="transparent";x.style.cursor="pointer";
    x.onclick=()=>{ state.deliverables.splice(idx,1); saveLS(); renderDeliverables(); render(); };
    span.appendChild(x);
    box.appendChild(span);
  });
}
renderDeliverables();

function renderMilestones(){
  const box = document.getElementById('milestonesList'); box.innerHTML="";
  state.milestones.forEach((m,idx)=>{
    const span=document.createElement('span'); span.className="chip"; span.textContent=`${m.title} – ${m.text}`;
    const x=document.createElement('button'); x.textContent="×"; x.style.border=0;x.style.background="transparent";x.style.cursor="pointer";
    x.onclick=()=>{ state.milestones.splice(idx,1); saveLS(); renderMilestones(); render(); };
    span.appendChild(x);
    box.appendChild(span);
  });
}
renderMilestones();

function compose(){
  const lines=[];
  const title = state.projectTitle || "הקמה וניהול קמפיין דיגיטלי";
  lines.push(`<h1>${title}</h1>`);
  if(state.clientName){ lines.push(`<div><strong>לכבוד:</strong> ${state.clientName}</div>`); }
  lines.push(`<p><strong>מי אנחנו</strong><br>${state.agencyName} – סוכנות בוטיק עם ניסיון של מעל 17 שנה וניהול תקציבים של 50,000,000₪+.</p>`);
  lines.push(`<p><strong>מה תקבלו</strong></p>`);
  lines.push("<ul>"+state.deliverables.map(d=>`<li>${d}</li>`).join("")+"</ul>");
  if(state.milestones.length){
    lines.push(`<p><strong>תוכנית עבודה ולו\"ז</strong></p>`);
    lines.push("<ul>"+state.milestones.map(m=>`<li>${m.title}: ${m.text}</li>`).join("")+"</ul>");
  }
  const vatText = state.includeVat ? " + מע\"מ" : " (כולל מע\"מ)";
  lines.push(`<p><strong>השקעה כספית</strong><br>ריטיינר חודשי: ${fmt(state.retainer,state.currency)}${vatText}` + (Number(state.setup)>0?`<br>דמי הקמה חד-פעמיים: ${fmt(state.setup,state.currency)}${vatText}`:"") + "</p>");
  lines.push(`<p><strong>אחריות ותנאים</strong><br>אחריות שביעות רצון 30 יום.<br>תנאי תשלום: נטו+7 | ביטול: בהודעה של ${state.noticeDays} יום מראש | בעלות על נכסים דיגיטליים: הלקוח.</p>`);
  lines.push(`<p><strong>לסיום</strong><br>נשמח לצאת לדרך – השלב הבא הוא שיחת קיקאוף ותיאום גישה לנכסים.<br><br>בברכה,<br>אבינועם שחר<br>Owner & Head of Growth<br>${state.agencyName}</p>`);
  return lines.join("");
}

function render(){
  document.getElementById('preview').innerHTML = compose();
  const pl = document.getElementById('previewLogo');
  pl.innerHTML = state.logoDataUrl ? `<img src="${state.logoDataUrl}" alt="לוגו" style="max-height:48px">` : "";
}
render();

// Inputs wiring
document.getElementById('agencyName').oninput = e=>{state.agencyName=e.target.value; saveLS(); render();};
document.getElementById('clientName').oninput = e=>{state.clientName=e.target.value; saveLS(); render();};
document.getElementById('projectTitle').oninput = e=>{state.projectTitle=e.target.value; saveLS(); render();};
document.getElementById('currency').onchange = e=>{state.currency=e.target.value; saveLS(); render();};
document.getElementById('retainer').oninput = e=>{state.retainer=e.target.value; saveLS(); render();};
document.getElementById('setup').oninput = e=>{state.setup=e.target.value; saveLS(); render();};
document.getElementById('includeVat').onchange = e=>{state.includeVat=e.target.checked; saveLS(); render();};
document.getElementById('noticeDays').oninput = e=>{state.noticeDays=Number(e.target.value)||14; saveLS(); render();};
document.getElementById('logo').onchange = e=>{
  const f=e.target.files && e.target.files[0]; if(!f) return;
  const r=new FileReader(); r.onload=ev=>{state.logoDataUrl=ev.target.result; saveLS(); render();}; r.readAsDataURL(f);
};

document.getElementById('addDeliverable').onclick=()=>{
  const v = document.getElementById('newDeliverable').value.trim();
  if(!v) return; state.deliverables.push(v); document.getElementById('newDeliverable').value=""; saveLS(); renderDeliverables(); render();
};
document.getElementById('addMilestone').onclick=()=>{
  const t=document.getElementById('msTitle').value.trim();
  const d=document.getElementById('msText').value.trim();
  if(!t||!d) return;
  state.milestones.push({title:t, text:d}); document.getElementById('msTitle').value=""; document.getElementById('msText').value="";
  saveLS(); renderMilestones(); render();
};
document.getElementById('resetBtn').onclick=()=>{
  localStorage.removeItem('proposalGen:v1'); location.reload();
};
document.getElementById('copyBtn').onclick=async()=>{
  const tmp=document.createElement('textarea'); tmp.value=document.getElementById('preview').innerText; document.body.appendChild(tmp); tmp.select();
  try{ document.execCommand('copy'); }catch(e){ await navigator.clipboard.writeText(tmp.value); } document.body.removeChild(tmp);
};
document.getElementById('downloadBtn').onclick=()=>{
  const html = `<!doctype html><html lang="he" dir="rtl"><head><meta charset="utf-8"><title>${state.projectTitle||"הצעה"}</title></head><body>${document.getElementById('preview').innerHTML}</body></html>`;
  const blob = new Blob([html], {type:"text/html;charset=utf-8"}); const url=URL.createObjectURL(blob);
  const a=document.createElement('a'); a.href=url; a.download=(state.projectTitle||"proposal").replace(/\s+/g,'_')+".html"; a.click(); URL.revokeObjectURL(url);
};
document.getElementById('printBtn').onclick=()=>{ window.print(); };
