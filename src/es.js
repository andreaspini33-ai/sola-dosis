// =================== FORMAZIONE ECM (esercizi da soli) ===================
// Indicazioni, Coppie pericolose, Giro visita del giorno con ripasso dilazionato.
const EX_CAP=30;                 // crediti massimi al giorno dagli esercizi liberi
const EX_BOX=[1,3,7,14,30];      // giorni di attesa nel ripasso (scatole alla Leitner)
const EX_MESI=["gennaio","febbraio","marzo","aprile","maggio","giugno","luglio","agosto","settembre","ottobre","novembre","dicembre"];
function exToday(){const d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")}
function exDayN(s){const [y,m,d]=s.split("-").map(Number);return Math.round(Date.UTC(y,m-1,d)/864e5)}
function exLabel(s){const [y,m,d]=s.split("-").map(Number);return d+" "+EX_MESI[m-1]}
function exRng(seed){let a=seed>>>0;return()=>{a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const exPick=(a,r)=>a[Math.floor(r()*a.length)];
const exShuf=(a,r)=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const exN=id=>CARDS[id].n;
function exState(){
  S.ex=S.ex||{};const t=exToday();
  if(S.ex.day!==t){S.ex.day=t;S.ex.got=0}
  S.ex.rev=S.ex.rev||{};S.ex.daily=S.ex.daily||{};S.ex.best=S.ex.best||{};
  return S.ex}

// ---------- Indicazioni ----------
// Distrattori "sicuramente sbagliati": farmaco non indicato e di classe diversa da tutti i farmaci indicati
// per quella condizione. In più escludo a mano coppie plausibili (uso reale fuori dalle liste del gioco).
const EX_DIS=()=>DIS.filter(Boolean);
const EX_NOT=new Set(["prednisone|d_polmonite","idrocortisone|d_polmonite","desametasone|d_polmonite",
  "pregabalin|d_ansia","pregabalin|d_epilessia","aspirina|d_emicrania","metoprololo|d_emicrania","bisoprololo|d_emicrania",
  "metoprololo|d_ansia","bisoprololo|d_ansia","adrenalina|d_sepsi","morfina|d_sca","fentanil|d_sca","paracetamolo|d_sca",
  "amitriptilina|d_neuro","litio|d_ansia","olanzapina|d_depressione","clozapina|d_depressione"]);
// Coppie che negli RCP AIFA rientrano solo in una dicitura generica (verifica del 7/10/2026):
// non diventano mai risposta giusta, e restano escluse dai distrattori perché sono in DIS.ind.
const EX_GEN=new Set(["paracod|d_postop","ibuprofene|d_postop","naprossene|d_postop","etoricoxib|d_postop","codeina|d_postop",
  "tramadolo|d_postop","fentanil|d_postop","buprenorfina|d_postop","paracetamolo|d_emicrania","metoprololo|d_fa","acenocumarolo|d_fa",
  "spironolattone|d_scompenso","penicillina|d_polmonite","doxiciclina|d_polmonite","carbamazepina|d_neuro","tramadolo|d_neuro",
  "ossicodone|d_neuro","litio|d_depressione","acenocumarolo|d_tvp","aspirina|d_sca","eparina|d_sca","meropenem|d_sepsi",
  "vancomicina|d_sepsi","ceftriaxone|d_sepsi","fluconazolo|d_sepsi","desametasone|d_surrene"]);
const exExp=(drugId,dis)=>dis.ind.includes(drugId)&&!EX_GEN.has(drugId+"|"+dis.id);

// Coppie fuori RCP ma presenti nelle linee guida (ricerca del 7/10/2026). Possono uscire come risposta sbagliata:
// se lo studente le sceglie, la spiegazione dice che l'RCP non le prevede e cita la linea guida.
// sec = testo letto su una fonte secondaria (slide, riassunti), da verificare sul documento originale.
Object.assign(SRC,{
  lg_esc_sca23:{a:"Byrne RA, et al. 2023 ESC Guidelines for the management of acute coronary syndromes. Eur Heart J 2023;44(38):3720-3826",sh:"ESC 2023, sindromi coronariche acute",doi:"10.1093/eurheartj/ehad191"},
  lg_esc_fa24:{a:"Van Gelder IC, et al. 2024 ESC Guidelines for the management of atrial fibrillation. Eur Heart J 2024;45(36):3314-3414",sh:"ESC 2024, fibrillazione atriale",doi:"10.1093/eurheartj/ehae176"},
  lg_esc_hf26:{a:"Køber L, Adamo M, et al. 2026 ESC Guidelines for the management of heart failure. Eur Heart J 2026;00:1-112",sh:"ESC 2026, scompenso cardiaco",doi:"10.1093/eurheartj/ehag100"},
  lg_nice_gad:{a:"NICE. Generalised anxiety disorder and panic disorder in adults: management. Clinical guideline CG113, 2011 (ultimo aggiornamento aprile 2026)",sh:"NICE CG113",url:"https://www.nice.org.uk/guidance/cg113/chapter/1-Guidance"},
  lg_neupsig25:{a:"Soliman N, et al. Pharmacotherapy and non-invasive neuromodulation for neuropathic pain: a systematic review and meta-analysis. Lancet Neurol 2025;24(5):413-428",sh:"NeuPSIG 2025 (Soliman et al.)",doi:"10.1016/S1474-4422(25)00068-7"},
  lg_ssc26:{a:"Prescott HC, et al. Surviving Sepsis Campaign: International Guidelines for Management of Sepsis and Septic Shock 2026. Crit Care Med 2026;54(4):725-812",sh:"Surviving Sepsis Campaign 2026",doi:"10.1097/CCM.0000000000007075"},
  lg_eta18:{a:"Kahaly GJ, et al. 2018 European Thyroid Association Guideline for the Management of Graves' Hyperthyroidism. Eur Thyroid J 2018;7:167-186",sh:"ETA 2018, morbo di Graves",doi:"10.1159/000490384"},
  lg_es_pai16:{a:"Bornstein SR, et al. Diagnosis and Treatment of Primary Adrenal Insufficiency: An Endocrine Society Clinical Practice Guideline. J Clin Endocrinol Metab 2016;101(2):364-389",sh:"Endocrine Society 2016",doi:"10.1210/jc.2015-1710"},
  lg_nogg24:{a:"Gregson CL, et al. The 2024 UK clinical guideline for the prevention and treatment of osteoporosis. Arch Osteoporos 2025;20:119",sh:"NOGG 2024",doi:"10.1007/s11657-025-01588-3"},
  lg_prospect24:{a:"Lirk P, et al. PROSPECT guideline for laparoscopic colorectal surgery. Eur J Anaesthesiol 2024;41:161-173",sh:"PROSPECT 2024, chirurgia colorettale",doi:"10.1097/EJA.0000000000001945"}
});
const EX_LG={
  "atorvastatina|d_sca":{s:"lg_esc_sca23",q:"It is recommended that high-dose statin therapy is initiated or continued as early as possible, regardless of initial LDL-C values.",g:"Classe I, livello A",sec:1},
  "rosuvastatina|d_sca":{s:"lg_esc_sca23",q:"It is recommended that high-dose statin therapy is initiated or continued as early as possible, regardless of initial LDL-C values.",g:"Classe I, livello A",sec:1},
  "bisoprololo|d_sca":{s:"lg_esc_sca23",q:"Beta-blockers are recommended in ACS patients with LVEF ≤40% regardless of HF symptoms.",g:"Classe I, livello A; non nomina il bisoprololo",sec:1},
  "bisoprololo|d_fa":{s:"lg_esc_fa24",q:"Beta-blockers, diltiazem, verapamil, or digoxin are recommended as first-choice drugs to control heart rate and reduce symptoms in patients with AF and left ventricular ejection fraction (LVEF) > 40%.",g:"controllo della frequenza; classe non verificata",sec:1},
  "metoprololo|d_scompenso":{s:"lg_esc_hf26",q:"A beta-blocker is recommended in stable patients with symptomatic HFrEF to reduce the risk of HFH and death.",g:"Classe I, livello A; il testo nomina bisoprololo, metoprololo succinato a rilascio prolungato e carvedilolo"},
  "sertralina|d_ansia":{s:"lg_nice_gad",q:"If a person with GAD chooses drug treatment, offer a selective serotonin reuptake inhibitor (SSRI). Consider offering sertraline first because it is the most cost-effective drug, but note that at the time of publication (January 2011) sertraline did not have UK marketing authorisation for this indication.",g:"raccomandazione 1.2.23"},
  "venlafaxina|d_neuro":{s:"lg_neupsig25",q:"a strong recommendation for use of TCAs, α2δ-ligands, and SNRIs as first-line treatments",g:"dall'abstract; la tabella 2 nomina la venlafaxina tra gli SNRI di prima linea"},
  "idrocortisone|d_sepsi":{s:"lg_ssc26",q:"For adults with septic shock, we 'suggest' using IV corticosteroids.",g:"raccomandazione condizionale, certezza bassa; solo nello shock settico",sec:1},
  "bisoprololo|d_ipertiroidismo":{s:"lg_eta18",q:"Propranolol (20–40 mg every 6 h) or longer acting beta-blockers (i.e., atenolol/bisoprolol), are useful to control adrenergic symptoms such as palpitations and tremor, especially in the early stages before ATD take effect.",g:"per i sintomi adrenergici, insieme ai farmaci antitiroidei"},
  "prednisone|d_surrene":{s:"lg_es_pai16",q:"As an alternative to hydrocortisone, we suggest using prednisolone (3–5 mg/d), administered orally once or twice daily, especially in patients with reduced compliance.",g:"la linea guida nomina il prednisolone, di cui il prednisone è il profarmaco"},
  "colecalciferolo|d_osteo":{s:"lg_nogg24",q:"Offer calcium and/or vitamin D supplementation as an adjunct to anti-osteoporosis drug treatment, if dietary calcium is low and/or vitamin D insufficiency is a risk, respectively (Strong recommendation).",g:"complemento della terapia, non trattamento dell'osteoporosi"},
  "celecoxib|d_postop":{s:"lg_prospect24",q:"Paracetamol and NSAIDs/COX-2 specific inhibitors are recommended as basic analgesia for colonic surgery; paracetamol is recommended for rectal surgery; these should be administered pre-operatively or intra-operatively and continued postoperatively (unless contraindicated)",g:"nomina la classe, non il celecoxib"}
};
const exLG=(drugId,disId)=>EX_LG[drugId+"|"+disId];
function exLGnote(drugId,disId,chosen){const L=exLG(drugId,disId);if(!L)return"";const d=EX_DIS().find(x=>x.id===disId);
  return `<div class="ex-lg"><b>${chosen?"Attenzione":"Da sapere"}:</b> ${exN(drugId)} non ha l'indicazione «${d.n.toLowerCase()}» nell'RCP AIFA, ma le linee guida lo usano (${L.g}).${quote(L.q,L.s)}${L.sec?`<small>Testo letto su una fonte secondaria, da verificare sul documento originale.</small>`:""}<small>Nel gioco la risposta giusta segue l'RCP.</small></div>`}
const EX_NODIS=new Set(["prednisone","idrocortisone","desametasone"]); // i corticosteroidi si usano in troppe condizioni
function exClasses(dis){const s=new Set([dis.cat]);dis.ind.forEach(i=>CARDS[i]&&s.add(CARDS[i].cl));return s}
function exSafeWrong(drugId,dis){
  const d=CARDS[drugId];if(!d||d.type!=="drug")return false;
  if(dis.ind.includes(drugId)||EX_NODIS.has(drugId)||EX_NOT.has(drugId+"|"+dis.id))return false;
  return !exClasses(dis).has(d.cl)}
function exQcond(dis,r){
  const exp=dis.ind.filter(i=>CARDS[i]&&exExp(i,dis));if(!exp.length)return null;
  const ok=exPick(exp,r);
  const wrong=exShuf(DRUGS.map(d=>d.id).filter(i=>exSafeWrong(i,dis)),r).slice(0,3);
  if(wrong.length<3)return null;
  const lg=Object.keys(EX_LG).filter(k=>k.endsWith("|"+dis.id)).map(k=>k.split("|")[0]).filter(i=>CARDS[i]&&!dis.ind.includes(i));
  if(lg.length&&r()<.5)wrong[2]=exPick(lg,r);
  return {t:"ic",key:"ic:"+dis.id,prompt:`Quale farmaco è indicato per <b>${dis.n}</b>?`,
    opts:exShuf([ok,...wrong],r).map(i=>({id:i,l:exN(i),s:CLS[CARDS[i].cl].n})),ok,
    note:`${dis.f} Indicati nel gioco: ${dis.ind.filter(i=>CARDS[i]).map(exN).join(", ")}.`}}
function exQdrug(drugId,r){
  const all=EX_DIS(),okD=all.filter(x=>exExp(drugId,x));if(!okD.length)return null;
  const ok=exPick(okD,r);
  const wrong=exShuf(all.filter(x=>exSafeWrong(drugId,x)),r).slice(0,3);
  if(wrong.length<3)return null;
  const lg=all.filter(x=>exLG(drugId,x.id)&&!x.ind.includes(drugId));
  if(lg.length&&r()<.5)wrong[2]=exPick(lg,r);
  return {t:"id",key:"id:"+drugId,prompt:`<b>${exN(drugId)}</b> (${CLS[CARDS[drugId].cl].n.toLowerCase()}): per quale condizione è indicato?`,
    opts:exShuf([ok,...wrong],r).map(x=>({id:x.id,l:x.n})),ok:ok.id,
    note:`Nel gioco ${exN(drugId)} è indicato per: ${okD.map(x=>x.n.toLowerCase()).join("; ")}.`}}
function exQind(r){
  for(let k=0;k<40;k++){
    let q;
    if(r()<.5)q=exQcond(exPick(EX_DIS(),r),r);
    else{const ids=[...new Set(EX_DIS().flatMap(x=>x.ind))].filter(i=>CARDS[i]);q=exQdrug(exPick(ids,r),r)}
    if(q)return q}
  return null}
function exQfromKey(key,r){
  const [t,...rest]=key.split(":"),id=rest.join(":");
  if(t==="ic"){const d=EX_DIS().find(x=>x.id===id);return d&&exQcond(d,r)}
  if(t==="id")return exQdrug(id,r);
  if(t==="cp")return exQpair(r,id);
  return null}

// ---------- Coppie pericolose ----------
// Uso le 8 interazioni del gioco (risks), ma solo con farmaci e coppie per cui il gioco non dice cose sbagliate.
const EX_POOL_OUT=new Set(["rifampicina","carbamazepina","iperico","litio","clozapina","naloxone","flumazenil","vitk","protamina",
  "idarucizumab","tranexamico","adrenalina","alteplase","ritonavir","ketoconazolo","valproato","fluoxetina"]);
const exPool=()=>DRUGS.filter(d=>!EX_POOL_OUT.has(d.id)).map(d=>d.id);
// Inibitore + indice ristretto: solo coppie con interazione documentata
const EX_PK=new Set(["amiodarone|digossina","amiodarone|warfarin","acenocumarolo|amiodarone","claritromicina|digossina",
  "claritromicina|warfarin","fluconazolo|warfarin","acenocumarolo|fluconazolo"]);
const CYP3A_SUB=new Set(["midazolam","alprazolam","diazepam","fentanil","ossicodone","buprenorfina","codeina","paracod","tramadolo",
  "amlodipina","ticagrelor","clopidogrel","apixaban","rivaroxaban","edoxaban","dabigatran","aloperidolo","prednisone","idrocortisone","desametasone","atorvastatina"]);
const exT=(id,t)=>CARDS[id].tags.includes(t);
const exAb=(id,a)=>!!CARDS[id].ab[a];
// coppie con un'interazione reale che il gioco non conta: le evito per non dare un "falso" sbagliato
function exAmbiguous(a,b){
  const k=[a,b].sort().join("|"),either=(f,g)=>(f(a)&&g(b))||(f(b)&&g(a)),id=x=>y=>y===x,inn=s=>y=>s.includes(y),tag=t=>y=>exT(y,t);
  if(exAb(a,"inhib")&&exAb(b,"nti")||exAb(b,"inhib")&&exAb(a,"nti"))if(!EX_PK.has(k))return true;
  if(either(tag("cyp3a4inib"),y=>CYP3A_SUB.has(y))&&!(either(tag("statina"),tag("cyp3a4inib"))))return true;
  if(either(tag("avk"),y=>CARDS[y].cl==="anti")&&!EX_PK.has(k))return true;
  if(either(tag("avk"),inn(["paracetamolo","paracod","levotiroxina","metimazolo"])))return true;
  if(either(id("digossina"),inn(["furosemide","idroclorotiazide"]))||either(id("digossina"),tag("betabloc"))||either(id("amiodarone"),tag("betabloc")))return true;
  if(either(id("cotrimox"),tag("acei"))||either(id("cotrimox"),tag("kspar")))return true;
  if(exT(a,"acei")&&exT(b,"acei"))return true;
  if(either(id("gliclazide"),inn(["fluconazolo","claritromicina","levofloxacina"]))||either(id("levofloxacina"),tag("insulina")))return true;
  if(exT(a,"oppioide")&&exT(b,"oppioide")||exT(a,"benzo")&&exT(b,"benzo")||exT(a,"fans")&&exT(b,"fans"))return true;
  if(either(tag("gabapent"),tag("oppioide"))||either(tag("gabapent"),tag("benzo")))return true;
  if(either(tag("antipsic"),tag("benzo"))||either(tag("antipsic"),tag("oppioide")))return true;
  if(either(id("fentanil"),tag("serot"))||either(tag("triptano"),tag("serot")))return true;
  if(either(id("atorvastatina"),id("amiodarone")))return true;
  if(either(tag("fans"),tag("cortis")))return true;
  if(either(id("vancomicina"),tag("fans"))||either(id("vancomicina"),id("furosemide")))return true;
  if(either(tag("fans"),tag("acei"))||either(tag("fans"),tag("diuretico")))return true; // va bene solo dentro la tripletta
  return false}
const exRisk=ids=>risks({board:ids.map(id=>({id}))});
function exCombos(ids){
  const out=[],n=ids.length;
  for(let i=0;i<n;i++)for(let j=i+1;j<n;j++){const r=exRisk([ids[i],ids[j]]);if(r.length)out.push({ids:[ids[i],ids[j]].sort(),r})}
  for(let i=0;i<n;i++)for(let j=i+1;j<n;j++)for(let k=j+1;k<n;k++){
    const t=[ids[i],ids[j],ids[k]],r=exRisk(t),sub=new Set([[t[0],t[1]],[t[0],t[2]],[t[1],t[2]]].flatMap(exRisk));
    const nw=r.filter(x=>!sub.has(x));if(nw.length)out.push({ids:t.sort(),r:nw})}
  return out}
function exTriple(ids){const f=ids.filter(i=>exT(i,"fans")),a=ids.filter(i=>exT(i,"acei")),d=ids.filter(i=>exT(i,"diuretico"));return f.length===1&&a.length===1&&d.length===1}
function exSetOk(ids){
  for(let i=0;i<ids.length;i++)for(let j=i+1;j<ids.length;j++)if(exAmbiguous(ids[i],ids[j])){
    const a=ids[i],b=ids[j],fad=t=>exT(a,t)||exT(b,t);
    // eccezione: FANS con ACE-i o diuretico quando c'è la tripletta completa
    if(fad("fans")&&(fad("acei")||fad("diuretico"))&&exTriple(ids)&&!(exT(a,"fans")&&exT(b,"fans")))continue;
    return false}
  return true}
// semi: per avere sempre almeno una combinazione, parto da una coppia a rischio
const EX_SEEDS=[["oppioide","benzo"],["serot","serot"],["fans","anticoag"],["ssri","antiaggr"],["antiaggr","anticoag"],["qt","qt"],["kspar","acei"],["statina","cyp3a4inib"],["pk"],["fans","acei","diuretico"]];
function exSeed(r,pool){
  const s=exPick(EX_SEEDS,r);
  if(s[0]==="pk")return exPick([...EX_PK],r).split("|");
  const out=[];for(const t of s){const c=pool.filter(i=>exT(i,t)&&!out.includes(i));if(!c.length)return null;out.push(exPick(c,r))}
  return out}
function exTable(r){
  const pool=exPool();
  for(let k=0;k<400;k++){
    const seed=exSeed(r,pool);if(!seed)continue;
    const ids=[...seed];for(const i of exShuf(pool,r)){if(ids.length>=6)break;if(!ids.includes(i))ids.push(i)}
    if(!exSetOk(ids))continue;
    const c=exCombos(ids);if(c.filter(x=>x.r.includes("rischio emorragico")).length>1)continue;if(c.length>=1&&c.length<=3)return {ids:exShuf(ids,r),combos:c,found:[],wrong:0,sel:[],msg:""}}
  return null}
// domanda rapida per il giro visita: quale tra 4 coppie è a rischio?
function exQpair(r,want){
  const pool=exPool();
  for(let k=0;k<300;k++){
    let seed=exSeed(r,pool);if(!seed||seed.length!==2)continue;
    if(!exSetOk(seed))continue;
    const rk=exRisk(seed);if(!rk.length)continue;
    if(want&&!rk.includes(want))continue;
    const safe=[];
    for(let t=0;t<200&&safe.length<3;t++){const a=exPick(pool,r),b=exPick(pool,r);if(a===b)continue;const p=[a,b];
      if(exRisk(p).length||!exSetOk(p)||safe.some(x=>x.join()===p.join()))continue;safe.push(p)}
    if(safe.length<3)continue;
    const opts=exShuf([seed,...safe],r).map(p=>({id:p.join("+"),l:p.map(exN).join(" + ")}));
    const ik=RISK2INT[rk[0]];
    return {t:"cp",key:"cp:"+rk[0],prompt:"Quale di queste associazioni è a rischio secondo le interazioni del gioco?",opts,ok:seed.join("+"),int:ik,
      note:`${CARDS[ik].n}: ${CARDS[ik].f}`}}
  return null}

// ---------- ripasso dilazionato ----------
function exMark(key,good){
  const E=exState(),now=exDayN(exToday()),cur=E.rev[key];
  if(!good){E.rev[key]={b:0,due:now+EX_BOX[0]};return}
  if(!cur)return;
  const b=cur.b+1;if(b>=EX_BOX.length)delete E.rev[key];else E.rev[key]={b,due:now+EX_BOX[b]}}
const exDue=()=>{const E=exState(),now=exDayN(exToday());return Object.entries(E.rev).filter(([k,v])=>v.due<=now).map(([k])=>k)};

// ---------- crediti ----------
function exAward(n,capped){
  const E=exState();if(capped)n=Math.max(0,Math.min(n,EX_CAP-E.got));
  n=Math.max(0,Math.round(n));if(capped)E.got+=n;S.crediti+=n;save();return n}

// ---------- sessioni ----------
let EX=null;
function exStartInd(){
  const r=Math.random,due=exShuf(exDue().filter(k=>k.startsWith("ic:")||k.startsWith("id:")),r).slice(0,4);
  const qs=due.map(k=>exQfromKey(k,r)).filter(Boolean).map(q=>(q.rev=1,q));
  while(qs.length<10){const q=exQind(r);if(q&&!qs.some(x=>x.key===q.key))qs.push(q)}
  EX={mode:"ind",qs,i:0,ok:0,ans:null,errs:[]};render()}
function exStartDaily(){
  const E=exState(),t=exToday();
  if(E.daily[t]){EX={mode:"dailydone"};render();return}
  const r=exRng(hash("sola-dosis-giro-"+t)),qs=[];
  for(let k=0;qs.length<10&&k<200;k++){const q=qs.length%3===2?exQpair(r):exQind(r);if(q&&!qs.some(x=>x.key===q.key))qs.push(q)}
  const rr=Math.random;
  exDue().slice(0,3).forEach(k=>{if(qs.some(x=>x.key===k))return;const q=exQfromKey(k,rr);if(q){q.rev=1;qs.push(q)}});
  EX={mode:"daily",qs,i:0,ok:0,ans:null,errs:[],day:t};render()}
function exStartCp(){EX={mode:"cp",round:0,tables:[exTable(Math.random)],pts:0};render()}
function exEndQuiz(){
  const E=exState();let got=0,msg="";
  if(EX.mode==="daily"){
    const base=EX.qs.filter(q=>!q.rev),okb=base.filter(q=>q.res).length;
    got=exAward(okb*2+(okb>=8?5:0),false);
    const y=exLabel(EX.day);
    const prev=Object.keys(E.daily).sort().pop();
    E.streak=(prev&&exDayN(EX.day)-exDayN(prev)===1)?(E.streak||0)+1:1;
    E.daily[EX.day]={ok:okb,n:base.length};save();
    msg=`Giro visita del ${y}: ${okb} su ${base.length}. ${okb>=8?"Bonus di 5 crediti. ":""}Giorni consecutivi: ${E.streak}.`}
  else{got=exAward(EX.ok,true);msg=`${EX.ok} risposte giuste su ${EX.qs.length}.`}
  EX.done={got,msg};render()}

// ---------- disegno ----------
function exHead(k,t,sub){return `<span class="ts-k">${k}</span><h2 class="sec">${t}</h2>${sub?`<p class="sub">${sub}</p>`:""}`}
function exQuizHTML(){
  if(EX.done){
    const errs=EX.qs.filter(q=>q.res===false);
    return `<div class="ex">${exHead(EX.mode==="daily"?"Giro visita":"Indicazioni","Fine della sessione")}
      <div class="patient first"><b>${EX.done.got} crediti ECM</b><span>${EX.done.msg}${EX.mode!=="daily"&&exState().got>=EX_CAP?" Hai raggiunto il massimo di oggi per gli esercizi liberi.":""}</span></div>
      ${errs.length?`<h3 class="ex-h">Da ripassare</h3><p class="sub">Queste domande tornano domani, poi a intervalli crescenti (1, 3, 7, 14, 30 giorni) finché non le sbagli più.</p><ul class="ex-err">${errs.map(q=>`<li>${q.prompt.replace(/<[^>]+>/g,"")} <b>${q.opts.find(o=>o.id===q.ok).l}</b></li>`).join("")}</ul>`:""}
      <div class="row" style="margin-top:14px;gap:8px"><button class="btn primary" data-ex="home">Torna alla formazione</button>${EX.mode==="ind"?`<button class="btn" data-ex="ind">Altre 10 domande</button>`:""}</div></div>`}
  const q=EX.qs[EX.i],a=EX.ans;
  const opt=o=>{let c="ex-opt";if(a){if(o.id===q.ok)c+=" good";else if(o.id===a)c+=" bad"}
    return `<button class="${c}" data-exo="${o.id}" ${a?"disabled":""}><span>${o.l}</span>${o.s?`<small>${o.s}</small>`:""}</button>`};
  let fb="";
  if(a){const good=a===q.ok,ik=q.int&&CARDS[q.int];
    const lgn=q.t==="ic"?q.opts.map(o=>exLGnote(o.id,q.key.slice(3),o.id===a)).join(""):q.t==="id"?q.opts.map(o=>exLGnote(q.key.slice(3),o.id,o.id===a)).join(""):"";
    fb=`<div class="ex-fb ${good?"good":"bad"}"><b>${good?"Giusto.":"Non è così."}</b> ${q.note}${lgn}
      ${ik&&ik.q?`<details><summary>Fonte</summary>${ik.q.map(k=>quote(Q[k].q,Q[k].s)).join("")}</details>`:""}</div>
      <div class="row" style="margin-top:10px"><button class="btn primary" data-ex="next">${EX.i+1<EX.qs.length?"Avanti":"Vedi il risultato"}</button></div>`}
  const k=EX.mode==="daily"?`Giro visita del ${exLabel(EX.day)}`:"Indicazioni";
  return `<div class="ex">${exHead(k,`Domanda ${EX.i+1} di ${EX.qs.length}`)}
    <div class="ex-bar"><i style="width:${EX.i/EX.qs.length*100}%"></i></div>
    ${q.rev?`<span class="ex-tag">Ripasso</span>`:""}
    <p class="ex-q">${q.prompt}</p>
    <div class="ex-opts">${q.opts.map(opt).join("")}</div>${fb}
    <div class="row" style="margin-top:16px"><button class="btn" data-ex="home">Esci</button></div></div>`}
function exCpHTML(){
  const T=EX.tables[EX.round];
  if(EX.done)return `<div class="ex">${exHead("Coppie pericolose","Fine della sessione")}
    <div class="patient first"><b>${EX.done.got} crediti ECM</b><span>${EX.done.msg}</span></div>
    <div class="row" style="margin-top:14px;gap:8px"><button class="btn primary" data-ex="home">Torna alla formazione</button><button class="btn" data-ex="cp">Altri 3 carrelli</button></div></div>`;
  const all=T.found.length===T.combos.length;
  const pill=id=>{const d=CARDS[id],on=T.sel.includes(id),inF=T.found.some(f=>T.combos[f].ids.includes(id));
    return `<button class="ex-drug${on?" on":""}${inF?" hit":""}" data-exd="${id}" ${all?"disabled":""} style="--cc:${CLS[d.cl].c}"><b>${d.n}</b><small>${CLS[d.cl].n}</small></button>`};
  const found=T.found.map(f=>{const c=T.combos[f];return c.r.map(rk=>{const ik=CARDS[RISK2INT[rk]];
    return `<div class="ex-found"><b>${ik.n}</b>: ${c.ids.map(exN).join(" + ")}<p>${ik.f}</p>${ik.q?`<details><summary>Fonte</summary>${ik.q.map(k=>quote(Q[k].q,Q[k].s)).join("")}</details>`:""}</div>`}).join("")}).join("");
  const miss=all?"":"";
  return `<div class="ex">${exHead("Coppie pericolose",`Carrello ${EX.round+1} di 3`,"Sei farmaci sullo stesso carrello della terapia. Seleziona due o tre farmaci che insieme fanno una delle 8 interazioni del gioco e premi «Segnala». Le combinazioni da trovare sono da 1 a 3.")}
    <p class="ex-count">Trovate ${T.found.length} su ${T.combos.length} · segnalazioni sbagliate ${T.wrong}</p>
    <div class="ex-grid">${T.ids.map(pill).join("")}</div>
    ${T.msg?`<p class="ex-msg">${T.msg}</p>`:""}
    <div class="row" style="margin-top:12px;gap:8px">${all?`<button class="btn primary" data-ex="cpnext">${EX.round<2?"Carrello successivo":"Vedi il risultato"}</button>`:
      `<button class="btn primary" data-ex="flag" ${T.sel.length<2?"disabled":""}>Segnala</button><button class="btn" data-ex="giveup">Mostra le risposte</button>`}</div>
    ${found}${miss}
    <p class="ex-note">Conta solo le 8 interazioni del gioco. Ho tolto dai carrelli i farmaci e le coppie con altre interazioni importanti, per non darti torto quando hai ragione.</p>
    <div class="row" style="margin-top:12px"><button class="btn" data-ex="home">Esci</button></div></div>`}
function exHomeHTML(){
  const E=exState(),t=exToday(),dd=E.daily[t],due=exDue().length;
  const it=(n,k,tt,d,x)=>`<button class="ts-row" data-ex="${k}"><span class="ts-n">${n}</span><span class="ts-b"><b>${tt}</b><span>${d}</span>${x?`<small>${x}</small>`:""}</span><span class="ts-a" aria-hidden="true">›</span></button>`;
  return `<div class="tecnica">${exHead("Formazione a distanza","Formazione ECM","Esercizi brevi da fare da soli. Le risposte giuste danno crediti ECM da spendere nelle Forniture.")}
    <div class="ts-list">
      ${it("1","daily",`Giro visita del ${exLabel(t)}`,"Dieci domande, uguali per tutti oggi. Se ne sbagli qualcuna, torna nei giorni seguenti per il ripasso.",dd?`fatto: ${dd.ok} su ${dd.n} · giorni consecutivi ${E.streak||1}`:"2 crediti per risposta giusta, 5 di bonus da 8 in su")}
      ${it("2","ind","Indicazioni","Abbina farmaco e condizione clinica, nei due sensi.","1 credito per risposta giusta")}
      ${it("3","cp","Coppie pericolose","Trova sul carrello le associazioni a rischio.","2 crediti per combinazione trovata, 1 in meno per ogni errore")}
    </div>
    <p class="ex-note">Oggi dagli esercizi liberi: ${E.got} di ${EX_CAP} crediti. Il giro visita non ha limite. ${due?`Domande da ripassare oggi: ${due}.`:"Nessuna domanda da ripassare oggi."}</p></div>`}
function renderEcm(){
  if(!EX)app.innerHTML=exHomeHTML();
  else if(EX.mode==="dailydone"){const E=exState(),d=E.daily[exToday()];app.innerHTML=`<div class="ex">${exHead("Giro visita","Già fatto oggi")}<div class="patient first"><b>${d.ok} su ${d.n}</b><span>Il prossimo giro visita è domani. Intanto puoi allenarti con gli esercizi liberi.</span></div><div class="row" style="margin-top:14px"><button class="btn primary" data-ex="home">Torna alla formazione</button></div></div>`}
  else if(EX.mode==="cp")app.innerHTML=exCpHTML();
  else app.innerHTML=exQuizHTML()}
app.addEventListener("click",e=>{
  if(tab!=="ecm")return;
  const b=e.target.closest("[data-ex],[data-exo],[data-exd]");if(!b||b.disabled)return;
  if(b.dataset.exo!==undefined){const q=EX.qs[EX.i];if(EX.ans)return;EX.ans=b.dataset.exo;q.res=EX.ans===q.ok;if(q.res)EX.ok++;
    exMark(q.key,q.res);save();sfx(q.res?"heal":"hit");render();return}
  if(b.dataset.exd!==undefined){const T=EX.tables[EX.round],id=b.dataset.exd;T.msg="";
    T.sel=T.sel.includes(id)?T.sel.filter(x=>x!==id):T.sel.length<3?[...T.sel,id]:T.sel;render();return}
  const k=b.dataset.ex;
  if(k==="home"){EX=null;render();window.scrollTo(0,0);return}
  if(k==="daily"){exStartDaily();return}
  if(k==="ind"){exStartInd();return}
  if(k==="cp"){exStartCp();return}
  if(k==="next"){EX.ans=null;EX.i++;if(EX.i>=EX.qs.length)exEndQuiz();else render();return}
  if(k==="flag"){const T=EX.tables[EX.round],s=T.sel.slice().sort().join("|");
    const f=T.combos.findIndex(c=>c.ids.join("|")===s);
    if(f>=0&&!T.found.includes(f)){T.found.push(f);EX.pts+=2;T.sel=[];sfx("cure")}
    else if(f>=0){T.msg="Questa l'hai già trovata."}
    else if(exRisk(T.sel).length){T.msg="C'è una combinazione a rischio, ma hai selezionato anche un farmaco che non serve. Toglilo e riprova."}
    else{T.wrong++;EX.pts-=1;T.sel=[];T.msg="Questa associazione non è tra le 8 interazioni del gioco.";sfx("hit")}
    render();return}
  if(k==="giveup"){const T=EX.tables[EX.round];T.combos.forEach((c,i)=>{if(!T.found.includes(i))T.found.push(i)});T.gave=1;T.sel=[];T.msg="Ecco le combinazioni che mancavano. Questo carrello non dà altri crediti.";render();return}
  if(k==="cpnext"){if(EX.round<2){EX.round++;EX.tables.push(exTable(Math.random));render()}
    else{const tot=EX.tables.reduce((z,T)=>z+T.combos.length,0);const got=exAward(EX.pts,true);
      EX.done={got,msg:`Punti ${EX.pts} su ${tot*2} possibili.${exState().got>=EX_CAP?" Hai raggiunto il massimo di oggi per gli esercizi liberi.":""}`};render()}
    window.scrollTo(0,0);return}
});
