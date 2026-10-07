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
  if(t==="tg")return DTG[id]&&CARDS[id]?exQtgDrug(id,r):null;
  if(t==="tt")return TG[id]?exQtgTarget(id,r):null;
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


// ---------- Bersagli ----------
// Bersaglio molecolare principale dei farmaci (meccanismo d'azione, sezione 5.1 degli RCP; da verificare).
// Esclusi i farmaci con meccanismo incerto o multiplo (paracetamolo, metformina, valproato, litio, amiodarone...).
// Distrattori sempre da un gruppo diverso da quelli dei bersagli del farmaco, per non dare torto a chi ha ragione.
const TG={
  mu:["Recettore µ-oppioide","dol","Recettore accoppiato a proteine Gi/o: riduce la trasmissione del dolore."],
  cox1:["COX-1","dol","Ciclossigenasi costitutiva: prostaglandine protettive della mucosa e trombossano piastrinico."],
  cox2:["COX-2","dol","Ciclossigenasi inducibile nell'infiammazione."],
  ht1:["Recettori 5-HT1B/1D","dol","Recettori serotoninergici: vasocostrizione dei vasi cranici e meno rilascio di neuropeptidi."],
  gaba:["Recettore GABA-A (sito delle benzodiazepine)","snc","Canale al cloro: le benzodiazepine aumentano l'effetto del GABA."],
  sert:["Trasportatore della serotonina (SERT)","snc","Riporta la serotonina nel terminale presinaptico."],
  net:["Trasportatore della noradrenalina (NET)","snc","Riporta la noradrenalina nel terminale presinaptico."],
  d2:["Recettore dopaminergico D2","snc","Recettore accoppiato a Gi/o, bersaglio degli antipsicotici."],
  ht2a:["Recettore 5-HT2A","snc","Recettore serotoninergico bloccato dagli antipsicotici atipici."],
  a2d:["Subunità α2δ dei canali del calcio","snc","Subunità accessoria dei canali del calcio voltaggio-dipendenti nei neuroni."],
  nav:["Canale del sodio voltaggio-dipendente","snc","Il blocco riduce le scariche ripetitive dei neuroni."],
  sv2a:["Proteina delle vescicole sinaptiche SV2A","snc","Proteina coinvolta nel rilascio dei neurotrasmettitori."],
  b1:["Recettore adrenergico β1","cv","Recettore prevalente nel cuore: frequenza e contrattilità."],
  ace:["Enzima di conversione dell'angiotensina (ACE)","cv","Trasforma l'angiotensina I in angiotensina II e degrada la bradichinina."],
  at1:["Recettore AT1 dell'angiotensina II","cv","Media vasocostrizione e secrezione di aldosterone."],
  nep:["Neprilisina","cv","Enzima che degrada i peptidi natriuretici."],
  mr:["Recettore dei mineralcorticoidi","cv","Recettore nucleare dell'aldosterone."],
  nkcc2:["Cotrasportatore Na-K-2Cl (NKCC2)","cv","Riassorbe il sodio nell'ansa di Henle."],
  ncc:["Cotrasportatore Na-Cl (NCC)","cv","Riassorbe il sodio nel tubulo contorto distale."],
  cav:["Canale del calcio di tipo L","cv","Fa entrare il calcio nelle cellule muscolari lisce dei vasi e nel cuore."],
  nak:["Na⁺/K⁺ ATPasi","cv","Pompa di membrana; la sua inibizione aumenta il calcio nel miocardio."],
  hmg:["HMG-CoA reduttasi","cv","Enzima limitante della sintesi del colesterolo."],
  vkor:["Vitamina K epossido reduttasi (VKORC1)","emo","Ricicla la vitamina K necessaria ai fattori II, VII, IX e X."],
  xa:["Fattore Xa","emo","Converte la protrombina in trombina."],
  iia:["Trombina (fattore IIa)","emo","Trasforma il fibrinogeno in fibrina."],
  at3:["Antitrombina","emo","Inibitore naturale della trombina e del fattore Xa, potenziato dalle eparine."],
  p2y12:["Recettore piastrinico P2Y12","emo","Recettore dell'ADP che attiva le piastrine."],
  plg:["Plasminogeno","emo","Precursore della plasmina, che scioglie la fibrina."],
  ins:["Recettore dell'insulina","endo","Recettore tirosin-chinasico."],
  katp:["Canale del potassio ATP-dipendente (SUR1)","endo","La sua chiusura nelle cellule β fa liberare insulina."],
  dpp4:["Dipeptidil peptidasi 4 (DPP-4)","endo","Enzima che degrada le incretine GLP-1 e GIP."],
  glp1:["Recettore del GLP-1","endo","Aumenta la secrezione di insulina dipendente dal glucosio."],
  sglt2:["Cotrasportatore sodio-glucosio SGLT2","endo","Riassorbe il glucosio nel tubulo prossimale."],
  ppar:["Recettore PPARγ","endo","Recettore nucleare che aumenta la sensibilità all'insulina."],
  tr:["Recettore degli ormoni tiroidei","endo","Recettore nucleare della triiodotironina."],
  tpo:["Tireoperossidasi","endo","Enzima della sintesi degli ormoni tiroidei."],
  gr:["Recettore dei glucocorticoidi","endo","Recettore nucleare che regola la trascrizione genica."],
  fpps:["Farnesil pirofosfato sintasi","endo","Enzima degli osteoclasti inibito dai bisfosfonati azotati."],
  pbp:["Proteine leganti la penicillina (PBP)","anti","Enzimi della sintesi del peptidoglicano della parete batterica."],
  dala:["Terminale D-Ala-D-Ala del peptidoglicano","anti","Precursore della parete batterica a cui si lega la vancomicina."],
  r50:["Subunità ribosomiale 50S","anti","Subunità maggiore del ribosoma batterico."],
  r30:["Subunità ribosomiale 30S","anti","Subunità minore del ribosoma batterico."],
  gyr:["DNA girasi e topoisomerasi IV","anti","Enzimi che regolano il superavvolgimento del DNA batterico."],
  dhfr:["Diidrofolato reduttasi e diidropteroato sintasi","anti","Due enzimi della sintesi dei folati batterici."],
  cyp51:["14α-demetilasi fungina","anti","Enzima della sintesi dell'ergosterolo."],
  rnap:["RNA polimerasi batterica","anti","Enzima della trascrizione batterica."],
  hivp:["Proteasi dell'HIV","anti","Enzima che matura le proteine del virus."]
};
const DTG={morfina:["mu"],fentanil:["mu"],ossicodone:["mu"],buprenorfina:["mu"],codeina:["mu"],tramadolo:["mu","sert","net"],naloxone:["mu"],
  ibuprofene:["cox1","cox2"],naprossene:["cox1","cox2"],diclofenac:["cox1","cox2"],ketorolac:["cox1","cox2"],aspirina:["cox1","cox2"],celecoxib:["cox2"],etoricoxib:["cox2"],
  sumatriptan:["ht1"],diazepam:["gaba"],midazolam:["gaba"],lorazepam:["gaba"],alprazolam:["gaba"],flumazenil:["gaba"],
  sertralina:["sert"],fluoxetina:["sert"],escitalopram:["sert"],venlafaxina:["sert","net"],
  aloperidolo:["d2"],olanzapina:["d2","ht2a"],clozapina:["d2","ht2a"],pregabalin:["a2d"],carbamazepina:["nav"],levetiracetam:["sv2a"],
  metoprololo:["b1"],bisoprololo:["b1"],ramipril:["ace"],enalapril:["ace"],losartan:["at1"],sacval:["at1","nep"],spironolattone:["mr"],
  furosemide:["nkcc2"],idroclorotiazide:["ncc"],amlodipina:["cav"],digossina:["nak"],atorvastatina:["hmg"],rosuvastatina:["hmg"],
  warfarin:["vkor"],acenocumarolo:["vkor"],apixaban:["xa"],rivaroxaban:["xa"],edoxaban:["xa"],dabigatran:["iia"],
  eparina:["at3","xa","iia"],enoxaparina:["at3","xa","iia"],fondaparinux:["at3","xa"],clopidogrel:["p2y12"],prasugrel:["p2y12"],ticagrelor:["p2y12"],
  alteplase:["plg"],tranexamico:["plg"],insulina:["ins"],glargine:["ins"],gliclazide:["katp"],sitagliptin:["dpp4"],semaglutide:["glp1"],
  empagliflozin:["sglt2"],pioglitazone:["ppar"],levotiroxina:["tr"],metimazolo:["tpo"],prednisone:["gr"],desametasone:["gr"],idrocortisone:["gr","mr"],
  alendronato:["fpps"],amoxicillina:["pbp"],amoxiclav:["pbp"],penicillina:["pbp"],ceftriaxone:["pbp"],meropenem:["pbp"],vancomicina:["dala"],
  claritromicina:["r50"],azitromicina:["r50"],linezolid:["r50"],doxiciclina:["r30"],levofloxacina:["gyr"],cotrimox:["dhfr"],
  fluconazolo:["cyp51"],ketoconazolo:["cyp51"],rifampicina:["rnap"],ritonavir:["hivp"]};
// note sul meccanismo, quando il nome del bersaglio da solo non basta
const DTG_NOTE={naloxone:"È un antagonista: occupa il recettore senza attivarlo e sposta gli oppioidi.",flumazenil:"È un antagonista del sito delle benzodiazepine.",
  codeina:"Agisce soprattutto dopo la trasformazione in morfina da parte del CYP2D6.",tramadolo:"Agonista µ debole (soprattutto il metabolita) e inibitore della ricaptazione di serotonina e noradrenalina.",
  buprenorfina:"Agonista parziale del recettore µ.",aspirina:"Acetila in modo irreversibile la COX; a basse dosi l'effetto conta sulla COX-1 piastrinica.",
  eparina:"Potenzia l'antitrombina, che inattiva trombina e fattore Xa.",enoxaparina:"Potenzia l'antitrombina, con effetto prevalente sul fattore Xa.",
  fondaparinux:"Si lega all'antitrombina e fa inibire in modo selettivo il fattore Xa.",tranexamico:"Blocca i siti di legame del plasminogeno alla fibrina: frena la fibrinolisi.",
  alteplase:"Attiva il plasminogeno a plasmina: scioglie il trombo.",sacval:"Il sacubitril inibisce la neprilisina; il valsartan blocca il recettore AT1.",
  idrocortisone:"Agisce sul recettore dei glucocorticoidi e, alle dosi sostitutive, anche su quello dei mineralcorticoidi.",
  prednisone:"È un profarmaco: il fegato lo trasforma in prednisolone.",cotrimox:"Il sulfametossazolo inibisce la diidropteroato sintasi, il trimetoprim la diidrofolato reduttasi.",
  amoxiclav:"L'acido clavulanico non agisce sulle PBP: inibisce le beta-lattamasi che degradano l'amoxicillina.",olanzapina:"Antagonista di D2 e 5-HT2A, oltre ad altri recettori.",clozapina:"Antagonista di D2 e 5-HT2A, oltre ad altri recettori."};
const tgDrugs=()=>Object.keys(DTG).filter(i=>CARDS[i]);
const tgGroups=id=>new Set(DTG[id].map(k=>TG[k][1]));
function exQtgDrug(id,r){
  const g=tgGroups(id),ok=exPick(DTG[id],r);
  const wrong=exShuf(Object.keys(TG).filter(k=>!g.has(TG[k][1])),r).slice(0,3);
  if(wrong.length<3)return null;
  return {t:"tg",key:"tg:"+id,prompt:`Qual è il bersaglio di <b>${exN(id)}</b>?`,opts:exShuf([ok,...wrong],r).map(k=>({id:k,l:TG[k][0]})),ok,
    note:`${exN(id)} agisce su: ${DTG[id].map(k=>TG[k][0]).join(", ")}. ${DTG_NOTE[id]||TG[ok][2]}`}}
function exQtgTarget(k,r){
  const holders=tgDrugs().filter(i=>DTG[i].includes(k));if(!holders.length)return null;
  const ok=exPick(holders,r),grp=TG[k][1];
  const wrong=exShuf(tgDrugs().filter(i=>!tgGroups(i).has(grp)),r).slice(0,3);
  if(wrong.length<3)return null;
  return {t:"tt",key:"tt:"+k,prompt:`Quale farmaco agisce su <b>${TG[k][0]}</b>?`,opts:exShuf([ok,...wrong],r).map(i=>({id:i,l:exN(i),s:CLS[CARDS[i].cl].n})),ok,
    note:`${TG[k][2]} Nel gioco agiscono qui: ${holders.map(exN).join(", ")}.${DTG_NOTE[ok]?" "+DTG_NOTE[ok]:""}`}}
function exQtg(r){for(let n=0;n<40;n++){const q=r()<.6?exQtgDrug(exPick(tgDrugs(),r),r):exQtgTarget(exPick(Object.keys(TG),r),r);if(q)return q}return null}
function exStartTg(){
  const r=Math.random,due=exShuf(exDue().filter(k=>k.startsWith("tg:")||k.startsWith("tt:")),r).slice(0,4);
  const qs=due.map(k=>exQfromKey(k,r)).filter(Boolean).map(q=>(q.rev=1,q));
  while(qs.length<10){const q=exQtg(r);if(q&&!qs.some(x=>x.key===q.key))qs.push(q)}
  EX={mode:"tg",qs,i:0,ok:0,ans:null,errs:[]};render()}

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
  for(let k=0;qs.length<10&&k<200;k++){const q=qs.length%3===2?exQpair(r):qs.length%3===1?exQtg(r):exQind(r);if(q&&!qs.some(x=>x.key===q.key))qs.push(q)}
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
    msg=okb>=8?"Con 8 risposte giuste o più hai preso anche il bonus di 5 crediti.":"Con 8 risposte giuste o più c'è un bonus di 5 crediti. Domani ci riprovi."}
  else{got=exAward(EX.ok,true);msg=`${EX.ok} risposte giuste su ${EX.qs.length}.`}
  EX.done={got,msg};render()}

// ---------- disegno (stile amichevole: barra di avanzamento, Verifica, riscontro dal basso) ----------
const EX_OK=["Esatto!","Perfetto!","Giusto!","Ottimo!","Proprio così!"],EX_KO=["Non proprio.","Quasi.","Non è così.","Riproviamo la prossima volta."];
function exStreak(){const E=exState(),last=Object.keys(E.daily).sort().pop();if(!last)return 0;return exDayN(exToday())-exDayN(last)<=1?(E.streak||1):0}
const exTop=(n,tot,k)=>`<div class="qz-top"><button class="qz-x" data-ex="home" aria-label="Esci">${ic("x")}</button><div class="qz-prog" role="progressbar" aria-valuemin="0" aria-valuemax="${tot}" aria-valuenow="${n}"><i style="width:${Math.max(4,n/tot*100)}%"></i></div><span class="qz-n">${k}</span></div>`;
function exDoneHTML(title,got,lines,btns,score){
  return `<div class="done"><div class="burst">${SPRIG}</div><p class="qz-kick">${title}</p><h2 class="sec">${score}</h2>
    <div class="won">+${got}<span>crediti ECM</span></div><div class="done-l">${lines}</div></div>
    <div class="qz-foot"><div class="in btns">${btns}</div></div>`}
function exQuizHTML(){
  if(EX.done){
    const errs=EX.qs.filter(q=>q.res===false),okN=EX.qs.filter(q=>q.res).length;
    const capMsg=EX.mode!=="daily"&&exState().got>=EX_CAP?`<p class="note">Hai raggiunto il massimo di oggi per gli esercizi liberi (${EX_CAP} crediti).</p>`:"";
    const lines=`${EX.mode==="daily"?`<div class="stats"><div class="stat"><b>${okN}/${EX.qs.length}</b><span>risposte giuste</span></div><div class="stat"><b>${exStreak()}</b><span>giorni di fila</span></div></div>`:""}
      <p>${EX.done.msg}</p>${capMsg}
      ${errs.length?`<div class="rev"><h3>${ic("repeat")} Da ripassare</h3><p class="note">Tornano domani, poi dopo 3, 7, 14 e 30 giorni finché non le sbagli più.</p><ul>${errs.map(q=>`<li>${q.prompt.replace(/<[^>]+>/g,"")} <b>${q.opts.find(o=>o.id===q.ok).l}</b></li>`).join("")}</ul></div>`:""}`;
    const btns=`<button class="btn primary big" data-ex="home">Continua</button>${EX.mode==="ind"||EX.mode==="tg"?`<button class="btn big" data-ex="${EX.mode}">Altre 10 domande</button>`:""}`;
    const score=okN===EX.qs.length?"Tutto giusto!":okN>=EX.qs.length*.7?"Ottimo lavoro!":okN>=EX.qs.length*.4?"Buon allenamento!":"Ogni errore è un ripasso";
    return exDoneHTML(EX.mode==="daily"?`Giro visita del ${exLabel(EX.day)}`:EX.mode==="tg"?"Bersagli":"Indicazioni",EX.done.got,lines,btns,score)}
  const q=EX.qs[EX.i],a=EX.ans,sel=EX.sel;
  const L="ABCD";
  const opt=(o,j)=>{let c="opt";if(a){if(o.id===q.ok)c+=" good";else if(o.id===a)c+=" bad";else c+=" dim"}else if(o.id===sel)c+=" sel";
    return `<button class="${c}" data-exo="${o.id}" ${a?"disabled":""}><span class="L">${a&&o.id===q.ok?ic("check"):L[j]}</span><span class="ot">${o.l}</span>${o.s?`<small>${o.s}</small>`:""}</button>`};
  let foot;
  if(a){const good=a===q.ok,ik=q.int&&CARDS[q.int];
    const lgn=q.t==="ic"?q.opts.map(o=>exLGnote(o.id,q.key.slice(3),o.id===a)).join(""):q.t==="id"?q.opts.map(o=>exLGnote(q.key.slice(3),o.id,o.id===a)).join(""):"";
    const msg=(good?EX_OK:EX_KO)[EX.i%(good?EX_OK:EX_KO).length];
    foot=`<div class="qz-foot ${good?"good":"bad"}"><div class="in"><div class="fb-h"><span class="badge">${ic(good?"check":"x")}</span>${msg}</div>
      <div class="fb-t">${good?"":`Risposta giusta: <b>${q.opts.find(o=>o.id===q.ok).l}</b>. `}${q.note}${lgn}${ik&&ik.q?`<details><summary>Fonte</summary>${ik.q.map(k=>quote(Q[k].q,Q[k].s)).join("")}</details>`:""}</div>
      <button class="btn big ${good?"primary":"red"}" data-ex="next">Continua</button></div></div>`}
  else foot=`<div class="qz-foot"><div class="in"><button class="btn primary big" data-ex="check" ${sel?"":"disabled"}>Verifica</button></div></div>`;
  const k=EX.mode==="daily"?`Giro visita · ${exLabel(EX.day)}`:EX.mode==="tg"?"Bersagli":"Indicazioni";
  return `<div class="qz">${exTop(EX.i+(a?1:0),EX.qs.length,`${EX.i+1}/${EX.qs.length}`)}
    <div class="qz-body"><p class="qz-kick">${q.rev?`${ic("repeat")} Ripasso`:k}</p>
    <p class="qz-q">${q.prompt}</p>
    <div class="opts">${q.opts.map(opt).join("")}</div></div>${foot}</div>`}
function exCpHTML(){
  const T=EX.tables[EX.round];
  if(EX.done){const tot=EX.tables.reduce((z,T)=>z+T.combos.length,0),fnd=EX.tables.reduce((z,T)=>z+(T.gave?0:T.found.length),0);
    return exDoneHTML("Coppie pericolose",EX.done.got,`<div class="stats"><div class="stat"><b>${fnd}/${tot}</b><span>combinazioni trovate</span></div><div class="stat"><b>${EX.tables.reduce((z,T)=>z+T.wrong,0)}</b><span>segnalazioni sbagliate</span></div></div><p>${EX.done.msg}</p>`,
      `<button class="btn primary big" data-ex="home">Continua</button><button class="btn big" data-ex="cp">Altri 3 carrelli</button>`,fnd===tot?"Occhio clinico!":"Carrelli controllati")}
  const all=T.found.length===T.combos.length;
  const pill=id=>{const d=CARDS[id],on=T.sel.includes(id),inF=T.found.some(f=>T.combos[f].ids.includes(id));
    return `<button class="drug${on?" on":""}${inF?" hit":""}" data-exd="${id}" ${all?"disabled":""} style="--cc:${CLS[d.cl].c}"><span class="dot"></span><b>${d.n}</b><small>${CLS[d.cl].n}</small>${on?`<span class="tick">${ic("check")}</span>`:""}</button>`};
  const found=T.found.slice().reverse().map(f=>{const c=T.combos[f];return c.r.map(rk=>{const ik=CARDS[RISK2INT[rk]];
    return `<div class="found"><span class="fi">${ic("pair")}</span><div><b>${ik.n}</b><span>${c.ids.map(exN).join(" + ")}</span><p>${ik.f}</p>${ik.q?`<details><summary>Fonte</summary>${ik.q.map(k=>quote(Q[k].q,Q[k].s)).join("")}</details>`:""}</div></div>`}).join("")}).join("");
  let foot;
  if(T.last)foot=`<div class="qz-foot ${T.last.k}"><div class="in"><div class="fb-h"><span class="badge">${ic(T.last.k==="good"?"check":T.last.k==="bad"?"x":"info")}</span>${T.last.h}</div><div class="fb-t">${T.last.t}</div><button class="btn big ${T.last.k==="bad"?"red":"primary"}" data-ex="${all?"cpnext":"cpok"}">${all?(EX.round<2?"Carrello successivo":"Vedi il risultato"):"Continua"}</button></div></div>`;
  else if(all)foot=`<div class="qz-foot"><div class="in"><button class="btn primary big" data-ex="cpnext">${EX.round<2?"Carrello successivo":"Vedi il risultato"}</button></div></div>`;
  else foot=`<div class="qz-foot"><div class="in btns"><button class="btn primary big" data-ex="flag" ${T.sel.length<2?"disabled":""}>Segnala${T.sel.length?` (${T.sel.length})`:""}</button><button class="lnk" data-ex="giveup">Mostra le risposte</button></div></div>`;
  return `<div class="qz">${exTop(EX.round+(all?1:0),3,`Carrello ${EX.round+1}/3`)}
    <div class="qz-body"><p class="qz-kick">Coppie pericolose</p>
    <p class="qz-q">Quali farmaci di questo carrello fanno un'interazione?</p>
    <p class="qz-hint">Tocca 2 o 3 farmaci, poi «Segnala». Da trovare: <b>${T.found.length} su ${T.combos.length}</b>.</p>
    <div class="drugs">${T.ids.map(pill).join("")}</div>
    ${found?`<div class="founds">${found}</div>`:""}
    <p class="note">Conta solo le 8 interazioni del gioco. Ho tolto dai carrelli i farmaci e le coppie con altre interazioni importanti, per non darti torto quando hai ragione.</p></div>${foot}</div>`}
function exHomeHTML(){
  const E=exState(),t=exToday(),dd=E.daily[t],due=exDue().length,left=Math.max(0,EX_CAP-E.got);
  const node=(k,icon,col,tt,d,x,state)=>`<button class="pnode ${state||""}" data-ex="${k}" style="--tc:var(--${col});--tl:var(--${col}-l)"><span class="pc">${state==="done"?ic("check"):ic(icon)}</span><span class="pt"><b>${tt}</b><span>${d}</span>${x?`<small>${x}</small>`:""}</span></button>`;
  return `<div class="home"><p class="hello">Formazione ECM</p><h2 class="sec">Allenati un po' ogni giorno</h2>
    <div class="stats"><div class="stat"><b>${exStreak()}</b><span>giorni di fila</span></div><div class="stat"><b>${left}</b><span>crediti liberi rimasti oggi</span></div><div class="stat"><b>${due}</b><span>da ripassare</span></div></div>
    <div class="path">
      ${node("daily","visit","green",`Giro visita del ${exLabel(t)}`,"10 domande uguali per tutti oggi, più il tuo ripasso.",dd?`Fatto: ${dd.ok} su ${dd.n}`:"2 crediti per risposta giusta, +5 da 8 in su",dd?"done":"now")}
      ${node("ind","pill","sky","Indicazioni","Abbina farmaco e condizione clinica, nei due sensi.","1 credito per risposta giusta")}
      ${node("tg","target","teal","Bersagli","Abbina il farmaco al suo bersaglio molecolare, nei due sensi.","1 credito per risposta giusta")}
      ${node("cp","pair","red","Coppie pericolose","Trova sul carrello le associazioni a rischio.","2 crediti per combinazione, 1 in meno per errore")}
    </div>
    <p class="note">Gli esercizi liberi danno al massimo ${EX_CAP} crediti al giorno; il giro visita non ha limite.</p></div>`}
function renderEcm(){
  if(!EX)app.innerHTML=exHomeHTML();
  else if(EX.mode==="dailydone"){const d=exState().daily[exToday()];
    app.innerHTML=exDoneHTML("Giro visita","0",`<p>Hai già fatto il giro visita di oggi (${d.ok} su ${d.n}). Il prossimo è domani: intanto puoi allenarti con Indicazioni e Coppie pericolose.</p>`,`<button class="btn primary big" data-ex="home">Torna alla formazione</button>`,"Già fatto oggi")}
  else if(EX.mode==="cp")app.innerHTML=exCpHTML();
  else app.innerHTML=exQuizHTML()}
function exCheck(){const q=EX.qs[EX.i];if(EX.ans||!EX.sel)return;EX.ans=EX.sel;q.res=EX.ans===q.ok;if(q.res)EX.ok++;
  exMark(q.key,q.res);save();sfx(q.res?"cure":"hit");render()}
function exNext(){EX.ans=null;EX.sel=null;EX.i++;if(EX.i>=EX.qs.length)exEndQuiz();else{render();window.scrollTo(0,0)}}
app.addEventListener("click",e=>{
  if(tab!=="ecm")return;
  const b=e.target.closest("[data-ex],[data-exo],[data-exd]");if(!b||b.disabled)return;
  if(b.dataset.exo!==undefined){if(EX.ans)return;EX.sel=b.dataset.exo;sfx("play");render();return}
  if(b.dataset.exd!==undefined){const T=EX.tables[EX.round],id=b.dataset.exd;if(T.last)return;
    T.sel=T.sel.includes(id)?T.sel.filter(x=>x!==id):T.sel.length<3?[...T.sel,id]:T.sel;render();return}
  const k=b.dataset.ex;
  if(k==="home"){EX=null;render();window.scrollTo(0,0);return}
  if(k==="daily"){exStartDaily();return}
  if(k==="ind"){exStartInd();return}
  if(k==="cp"){exStartCp();return}
  if(k==="tg"){exStartTg();return}
  if(k==="check"){exCheck();return}
  if(k==="next"){exNext();return}
  if(k==="cpok"){EX.tables[EX.round].last=null;render();return}
  if(k==="flag"){const T=EX.tables[EX.round],s=T.sel.slice().sort().join("|");
    const f=T.combos.findIndex(c=>c.ids.join("|")===s);
    if(f>=0&&!T.found.includes(f)){T.found.push(f);EX.pts+=2;T.sel=[];sfx("cure");const c=T.combos[f];
      T.last={k:"good",h:T.found.length===T.combos.length?"Carrello completato!":"Trovata!",t:c.r.map(rk=>`<b>${CARDS[RISK2INT[rk]].n}</b>: ${c.ids.map(exN).join(" + ")}.`).join(" ")+" La fonte è qui sotto, tra le combinazioni trovate."}}
    else if(f>=0)T.last={k:"info",h:"Già trovata",t:"Questa combinazione l'hai già segnalata."};
    else if(exRisk(T.sel).length)T.last={k:"info",h:"Ci sei quasi",t:"C'è una combinazione a rischio, ma hai selezionato anche un farmaco che non serve. Toglilo e riprova."};
    else{T.wrong++;EX.pts-=1;T.sel=[];sfx("hit");T.last={k:"bad",h:"Non è tra le interazioni del gioco",t:"Questa associazione non fa nessuna delle 8 interazioni del gioco. Riprova con un'altra coppia."}}
    render();return}
  if(k==="giveup"){const T=EX.tables[EX.round];T.combos.forEach((c,i)=>{if(!T.found.includes(i))T.found.push(i)});T.gave=1;T.sel=[];
    T.last={k:"info",h:"Ecco le risposte",t:"Le combinazioni che mancavano sono qui sotto. Questo carrello non dà altri crediti."};render();return}
  if(k==="cpnext"){if(EX.round<2){EX.round++;EX.tables.push(exTable(Math.random));render()}
    else{const tot=EX.tables.reduce((z,T)=>z+T.combos.length,0);const got=exAward(EX.pts,true);
      EX.done={got,msg:`Punti ${EX.pts} su ${tot*2} possibili.${exState().got>=EX_CAP?" Hai raggiunto il massimo di oggi per gli esercizi liberi.":""}`};render()}
    window.scrollTo(0,0);return}
});
document.addEventListener("keydown",e=>{
  if(tab!=="ecm"||!EX||EX.done||!EX.qs||e.target.closest("input,textarea"))return;
  const n="1234abcd".indexOf(e.key.toLowerCase());
  if(n>=0&&!EX.ans){const o=EX.qs[EX.i].opts[n%4];if(o){EX.sel=o.id;render()}}
  else if(e.key==="Enter"){e.preventDefault();EX.ans?exNext():exCheck()}});
