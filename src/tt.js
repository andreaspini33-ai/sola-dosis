// =================== TESTA A TESTA (prototipo, modello a pilastri) ===================
// Due bracci, stesso profilo di paziente. Il controllo della malattia dipende da quali pilastri
// terapeutici sono coperti e a che dose; pilastri diversi si combinano per indipendenza di Bliss
// (1 - prodotto dei complementi), lo stesso pilastro non si somma (duplicazione).
// Ogni turno e' una visita con 2 azioni: iniziare, titolare, sospendere, giocare un evento.
const TT={VISITS:10,AE:10,BOARD:6,ACTIONS:2,EVMAX:2,AEW:5};
const LEVEL=[0,.5,.8,1];           // frazione dell'effetto massimo per livello di dose (curva con tetto)
const STRONG_OP=["morfina","fentanil","ossicodone","buprenorfina"];
const RENAL=["metformina","dabigatran","digossina","enoxaparina","litio","pregabalin","edoxaban"];
const ANTIBIO=d=>d&&d.cl==="anti";
// probabilita' di un evento avverso a ogni visita (stime di gioco), raddoppiate dai fattori di rischio del profilo
const RISK_AE={"oppioide + benzodiazepina":.35,"doppio QT":.3,"FANS + ACE-i + diuretico":.3,"inibitore + indice ristretto":.3,"doppio serotoninergico":.2,"rischio emorragico":.15,"risparmiatore di K⁺ + ACE-i":.15,"statina + inibitore CYP3A4":.15};
const PR={ci:.4,dup:.25,adj:.25,high:.15,apnea:.2,dehyd:.25};
const pc=x=>Math.round(x*100);
const PROFILES=[
 {id:"p_scomp",who:"Sig. B.",age:79,bed:7,dis:"d_scompenso",dxl:"Scompenso cardiaco a frazione d'eiezione ridotta",
  facts:[["red","eGFR 28"],["amb","K⁺ 5,2"],["amb","diabete tipo 2"]],pre:["furosemide"],
  pillars:[{id:"raas",n:"ACE-i o ARNI",w:.25,d:{ramipril:1,enalapril:1,losartan:.85,sacval:1.2}},
           {id:"bb",n:"Beta-bloccante",w:.30,d:{bisoprololo:1,metoprololo:1}},
           {id:"mra",n:"Antialdosteronico",w:.25,d:{spironolattone:1}},
           {id:"sglt2",n:"Gliflozina",w:.22,d:{empagliflozin:1}},
           {id:"cong",n:"Diuretico per la congestione",w:.20,d:{furosemide:1}},
           {id:"sint",n:"Digossina per i sintomi",w:.08,d:{digossina:1}}],
  ci:{metformina:"eGFR sotto 30",dabigatran:"eGFR sotto 30",fans:"peggiora scompenso e funzione renale"},adj:{digossina:"eliminazione renale ridotta"},hiK:true,x2:[],
  deck:["ramipril","ramipril","sacval","bisoprololo","bisoprololo","spironolattone","spironolattone","empagliflozin","empagliflozin","digossina","metformina","dabigatran","ibuprofene","diclofenac","r_at1","a_review","a_pront","azitromicina","claritromicina","amoxicillina"],
  hint:"I quattro pilastri (ACE-i o ARNI, beta-bloccante titolato, antialdosteronico con attenzione al potassio, gliflozina) più il diuretico; niente FANS, metformina o dabigatran."},
 {id:"p_fa",who:"Sig.ra R.",age:74,bed:3,dis:"d_fa",dxl:"Fibrillazione atriale",
  facts:[["red","emorragia digestiva pregressa"],["amb","QTc 470 ms"],["amb","ipertensione"],["ok","eGFR 62"]],pre:["escitalopram"],
  pillars:[{id:"ictus",n:"Prevenzione dell'ictus",w:.60,d:{apixaban:1,rivaroxaban:1,edoxaban:1,dabigatran:1,warfarin:.95,acenocumarolo:.95}},
           {id:"freq",n:"Controllo della frequenza",w:.35,d:{bisoprololo:1,metoprololo:1,digossina:.8}},
           {id:"ritmo",n:"Controllo del ritmo",w:.20,d:{amiodarone:1}}],
  ci:{},adj:{},x2:["rischio emorragico"],
  deck:["apixaban","apixaban","rivaroxaban","edoxaban","warfarin","dabigatran","bisoprololo","bisoprololo","metoprololo","digossina","amiodarone","amiodarone","aspirina","ibuprofene","claritromicina","levofloxacina","amoxicillina","r_b1","a_review","a_pront"],
  hint:"Un anticoagulante orale diretto e un beta-bloccante titolato; l'amiodarone aggiunge poco e allunga il QT con l'escitalopram; antibiotico senza effetto sul QT."},
 {id:"p_postop",who:"Sig. M.",age:54,bed:12,dis:"d_postop",dxl:"Dolore postoperatorio dopo protesi di ginocchio",
  facts:[["red","ulcera peptica"],["amb","apnee notturne"],["ok","eGFR 90"]],pre:["sertralina"],
  pillars:[{id:"para",n:"Paracetamolo",w:.35,d:{paracetamolo:1,paracod:1}},
           {id:"fans",n:"FANS",w:.45,d:{ibuprofene:1,naprossene:1,ketorolac:1.05,celecoxib:.95,diclofenac:1,etoricoxib:1}},
           {id:"opp",n:"Oppioide",w:.50,d:{morfina:1,ossicodone:1,buprenorfina:.9,tramadolo:.6,paracod:.6,codeina:.4}},
           {id:"adj",n:"Adiuvante",w:.05,d:{pregabalin:1}}],
  ci:{},adj:{},x2:["rischio emorragico"],strongOp:true,
  deck:["paracetamolo","paracetamolo","paracod","codeina","morfina","ossicodone","tramadolo","tramadolo","ibuprofene","naprossene","ketorolac","celecoxib","diazepam","pregabalin","r_mu","a_review","a_pront","amoxiclav","linezolid","ceftriaxone"],
  hint:"Analgesia multimodale: paracetamolo di base e un oppioide a basso dosaggio; FANS e tramadolo creano rischi con sertralina e ulcera."}
];
const EVENTS=[
 {id:"e_aki",n:"Insufficienza renale acuta",txt:"Per 3 visite l'eGFR del rivale scende sotto 30: ogni farmaco a eliminazione renale sopra la dose minima dà +1 evento avverso a visita.",teach:"Aggiustamento della dose per funzione renale."},
 {id:"e_inf",n:"Infezione intercorrente",txt:"Finché non prescrive un antibiotico il controllo del rivale cala di un quarto; se non lo fa entro 2 visite, +2 eventi avversi.",teach:"Scegliere l'antibiotico senza creare interazioni."},
 {id:"e_spec",n:"Nuovo specialista",txt:"Aggiunge alla terapia del rivale un farmaco prescritto da un altro specialista. Si toglie solo sospendendolo.",teach:"Prescrizione a cascata e riconciliazione della terapia."},
 {id:"e_dehyd",n:"Disidratazione",txt:"Per 2 visite ogni FANS, ACE-i o sartano e diuretico in terapia del rivale dà +1 evento avverso.",teach:"Le regole per i giorni di malattia (sick day rules)."},
 {id:"e_fall",n:"Caduta a domicilio",txt:"+2 eventi avversi al rivale se ha in terapia benzodiazepine o oppioidi, oppure due o più antipertensivi a dose massima.",teach:"Farmaci e cadute nell'anziano."},
 {id:"e_nonadh",n:"Scarsa aderenza",txt:"Il farmaco che dà più controllo al rivale non viene assunto alla sua prossima visita.",teach:"Aderenza e semplificazione della terapia."},
 {id:"e_segn",n:"Segnalazione di farmacovigilanza",txt:"Solo se il rivale ha una combinazione a rischio attiva: +2 eventi avversi subito.",teach:"Il segnale nasce dalle combinazioni lasciate in terapia."},
 {id:"e_segn",n:"Segnalazione di farmacovigilanza",txt:"Solo se il rivale ha una combinazione a rischio attiva: +2 eventi avversi subito.",teach:"Il segnale nasce dalle combinazioni lasciate in terapia."}
];
const EVC={};EVENTS.forEach(e=>EVC[e.id]=e);
const SPEC_POOL=["claritromicina","ibuprofene","diazepam","amiodarone","fluconazolo","prednisone"];

function ttProfile(){return PROFILES.find(p=>p.id===G.prof)}
function ttNewPlayer(name,prof){const P=newPlayer(prof.deck.filter(id=>CARDS[id]),name);
  Object.assign(P,{ae:0,aeLog:{},ev:shuffle(EVENTS.map(e=>e.id)),evh:[],turns:0,pts:0,act:0,ctrl:0,hist:[],
    st:{rx:0,ci:0,susp:0,tit:0,dup:0,over:0,avoided:0,evPlayed:[],evGot:[]},fx:{aki:0,dehyd:0,inf:0,skip:null}});
  prof.pre.forEach(id=>{if(CARDS[id]){const u=mkUnit(CARDS[id]);u.pre=1;u.lv=2;P.board.push(u)}});return P}
function startTT(profId){
  duelHidden=false;const prof=PROFILES.find(p=>p.id===profId)||PROFILES[0];
  G={tt:1,prof:prof.id,field:prof.dis,p:[ttNewPlayer("Braccio A",prof),ttNewPlayer("Braccio B",prof)],turn:0,busy:false,over:false,log:"Il trial comincia: stesso paziente, due bracci.",sel:null};
  for(let i=0;i<4;i++){draw(0);draw(1)}
  ttStart(0);render();
}
const ttLog=m=>{G.log=m};
function ttAE(P,n,cause){if(n<=0)return;P.ae+=n;P.aeLog[cause]=(P.aeLog[cause]||0)+n}
const ttLv=u=>u.lv||1;

// ---- modello del controllo ----
function ttPillarsOf(id){return ttProfile().pillars.filter(p=>p.d[id]!=null)}
function ttContrib(P,u,p){if(u.uid===P.fx.skip)return 0;return p.w*p.d[u.id]*LEVEL[ttLv(u)]}
function ttControl(P){const pr=ttProfile();let rest=1;
  pr.pillars.forEach(p=>{let best=0;P.board.forEach(u=>{if(p.d[u.id]!=null)best=Math.max(best,ttContrib(P,u,p))});rest*=1-Math.min(.95,best)});
  let c=1-rest;if(P.fx.inf>0)c*=.75;return Math.max(0,Math.min(1,c))}
function ttCoverage(P){const pr=ttProfile();return pr.pillars.map(p=>{const us=P.board.filter(u=>p.d[u.id]!=null);
  const best=us.slice().sort((a,b)=>ttContrib(P,b,p)-ttContrib(P,a,p))[0];return {p,us,best}})}
function ttIsCI(id){const pr=ttProfile();const d=CARDS[id];if(!d||d.type!=="drug")return "";if(pr.ci[id])return pr.ci[id];if(pr.ci.fans&&d.tags.includes("fans"))return pr.ci.fans;return ""}
function ttAdj(P,id){const pr=ttProfile();if(pr.adj[id])return pr.adj[id];if(P.fx.aki>0&&RENAL.includes(id))return "insufficienza renale acuta";return ""}
function ttRisks(P){const pr=ttProfile();const out=risks(P).map(r=>({r,n:Math.min(.9,(RISK_AE[r]||.15)*(pr.x2.includes(r)?2:1))}));
  if(pr.hiK&&P.board.some(u=>u.id==="spironolattone")&&!out.some(x=>x.r.startsWith("risparmiatore")))out.push({r:"spironolattone con potassio già alto",n:.2});
  return out}
// ogni fonte di rischio e' una probabilita' di evento avverso alla prossima visita;
// n = numero atteso di eventi, any = probabilita' di almeno un evento (1 - prodotto dei complementi)
function ttAEpreview(P){let n=0,keep=1;const L=[];const add=(c,k)=>{n+=k;keep*=1-k;L.push([c,k])};
  ttRisks(P).forEach(x=>add(x.r,x.n));
  ttCoverage(P).forEach(c=>{if(c.us.length>1)add(`duplicazione: ${[...new Set(c.us.map(u=>D(u).n))].join(" e ")}`,PR.dup)});
  P.board.forEach(u=>{const d=D(u);
    if(ttIsCI(u.id))add(`${d.n} controindicato`,PR.ci);
    const adj=ttAdj(P,u.id);if(adj&&ttLv(u)>=2)add(`${d.n} a dose ${ttLv(u)} (${adj})`,PR.adj);
    if(ttLv(u)>=3&&d.T<=3)add(`${d.n} a dose alta`,PR.high);
    if(ttProfile().strongOp&&STRONG_OP.includes(u.id)&&ttLv(u)>=2)add(`${d.n} a dose ${ttLv(u)} con apnee notturne`,PR.apnea);
    if(P.fx.dehyd>0&&(has(u,"fans")||has(u,"acei")||has(u,"diuretico")))add(`${d.n} durante disidratazione`,PR.dehyd)});
  return {n,any:1-keep,L}}
// effetto ipotetico di una modifica (per anteprime e IA)
function ttWhatIf(P,fn){const snap=P.board.map(u=>({...u}));fn();const a=ttAEpreview(P);const r={c:ttControl(P),ae:a.n,any:a.any};P.board=snap;return r}

// ---- visita ----
function ttStart(i){
  const P=G.p[i];G.turn=i;P.turns++;P.act=TT.ACTIONS;if(P.deck.length)draw(i);
  if(P.evh.length<TT.EVMAX&&P.ev.length)P.evh.push(P.ev.pop());
  const c=ttControl(P);P.ctrl=c;const gain=Math.round(c*10);P.pts+=gain;P.fx.skip=null;P.hist.push(Math.round(c*100));
  if(gain&&!G.sim)fx({k:"cure",side:i,n:gain});
  const pv=ttAEpreview(P);const hit=[];pv.L.forEach(([cs,p])=>{if(Math.random()<p){ttAE(P,1,cs);hit.push(cs)}});pv.hit=hit;
  if(P.fx.inf>0){if(P.board.some(u=>ANTIBIO(D(u)))){P.fx.inf=0;ttLog(`${P.name}: infezione trattata.`)}else{P.fx.inf--;if(P.fx.inf===0){ttAE(P,2,"infezione non trattata");ttLog(`${P.name}: infezione non trattata, +2 eventi avversi.`)}}}
  if(P.fx.aki>0)P.fx.aki--;if(P.fx.dehyd>0)P.fx.dehyd--;
  if(hit.length&&!G.sim)fx({k:"hero",side:i,n:hit.length});
  ttLog(`${P.name}, visita ${P.turns}: controllo ${Math.round(c*100)}%, +${gain} punti.${hit.length?` Evento avverso: ${hit.join("; ")}.`:pv.L.length?" Nessun evento avverso questa volta.":""}`);
  ttCheck();
}
function ttCheck(){if(G.over)return;for(const i of [0,1]){const P=G.p[i];if(P.ae>=TT.AE){ttEnd(1-i,`Il comitato di monitoraggio interrompe il ${P.name} per eventi avversi.`);return}}}
function ttEndTurn(){if(G.over)return;const i=G.turn;
  if(i===1&&G.p[0].turns>=TT.VISITS){ttFinish();return}
  ttStart(1-i);if(G.over)return;if(G.turn===1&&!G.sim)setTimeout(ttAITurn,500)}
const ttNet=P=>P.pts-TT.AEW*P.ae;
function ttFinish(){const [A,B]=G.p;const na=ttNet(A),nb=ttNet(B);
  const w=na>nb?0:nb>na?1:A.ae<B.ae?0:B.ae<A.ae?1:-1;
  ttEnd(w,w<0?"I due bracci finiscono alla pari.":`Il trial si chiude: beneficio netto ${na} contro ${nb}.`)}
function ttEnd(w,msg){G.over=true;G.win=w;if(G.sim)return;
  const win=w===0;const prize=win?45:w<0?25:15;if(win)S.wins++;else if(w===1)S.losses++;S.crediti+=prize;save();
  setTimeout(()=>{sfx(win?"win":"lose");ov.innerHTML=ttReferto(w,msg,prize);render()},350)}

// ---- azioni (ognuna costa 1 azione) ----
function ttCanPlay(i,hi){const P=G.p[i],d=CARDS[P.hand[hi]];if(!d)return "?";if(P.act<1)return "azioni finite per questa visita";
  if(d.type==="drug"){if(d.from)return P.board.some(u=>u.id===d.from)?"":`serve ${CARDS[d.from].n} in terapia`;
    if(P.board.length>=TT.BOARD)return "terapia già con 6 farmaci";return ""}
  if(d.type==="rec"){if(P.recs.length>=2)return "già 2 recettori";if(P.recs.includes(d.id))return "già in gioco";return ""}
  if(d.id==="a_review")return "";
  if(d.id==="a_pront")return P.deck.some(id=>isIndicated(id,fieldDis()))?"":"nessun farmaco indicato nel mazzo";
  if(d.id==="a_repo")return P.grave.length?"":"nessun farmaco sospeso";
  return "non usata in questo prototipo"}
function ttPlay(i,hi){if(ttCanPlay(i,hi))return false;const P=G.p[i],d=CARDS[P.hand[hi]];P.hand.splice(hi,1);P.act--;
  if(d.type==="drug"){let u;
    if(d.from){const base=P.board.find(x=>x.id===d.from);const lv=ttLv(base);Object.assign(base,{id:d.id,atk:d.E,hp:d.T,max:d.T});base.lv=lv;u=base}
    else{u=mkUnit(d);u.lv=1;P.board.push(u)}
    P.st.rx++;const ci=ttIsCI(d.id);if(ci){ttAE(P,2,`${d.n} prescritto nonostante la controindicazione`);P.st.ci++}
    if(ttCoverage(P).some(c=>c.us.length>1&&c.us.includes(u)))P.st.dup++;
    if(!G.sim)fx({k:"enter",uid:u.uid});
    ttLog(`${P.name}: inizia ${d.n} a dose bassa.${ci?` Controindicato (${ci}): +2 eventi avversi.`:""}${ttPillarsOf(d.id).length||ANTIBIO(d)?"":" Non copre nessun pilastro della terapia."}`);
    ttCheck();return true}
  if(d.type==="rec"){P.recs.push(d.id);ttLog(`${P.name}: ${d.n} in gioco.`);return true}
  if(d.id==="a_review"){draw(i);draw(i);ttLog(`${P.name}: Revisione sistematica, 2 carte.`)}
  if(d.id==="a_pront"){const got=tutor(P,id=>isIndicated(id,fieldDis()));ttLog(`${P.name}: Prontuario, ${i?"un farmaco indicato":CARDS[got].n}.`)}
  if(d.id==="a_repo"){const x=P.grave.pop();if(P.hand.length<8)P.hand.push(x);ttLog(`${P.name}: Riposizionamento, ${CARDS[x].n} torna in mano.`)}
  return true}
function ttTitrate(i,uid,dir){const P=G.p[i];if(P.act<1)return false;const u=P.board.find(x=>x.uid===uid);if(!u)return false;
  const lv=ttLv(u)+dir;if(lv<1||lv>3)return false;u.lv=lv;P.act--;P.st.tit++;ttLog(`${P.name}: ${D(u).n} ${dir>0?"aumentato":"ridotto"} a dose ${lv}/3.`);return true}
function ttSuspend(i,uid){const P=G.p[i];if(P.act<1)return false;const k=P.board.findIndex(u=>u.uid===uid);if(k<0)return false;
  const u=P.board[k];P.board.splice(k,1);P.act--;P.grave.push(u.id);P.st.susp++;
  if(u.pre&&!ttPillarsOf(u.id).length){ttAE(P,1,`${D(u).n} sospeso: ricaduta della patologia per cui lo assumeva`);ttLog(`${P.name}: sospeso ${D(u).n}. Era una terapia necessaria: +1 evento avverso (ricaduta).`);ttCheck();return true}
  ttLog(`${P.name}: sospeso ${D(u).n}.`);return true}
function ttEvCan(i,k){const P=G.p[i],O=G.p[1-i],e=EVC[P.evh[k]];if(!e)return "?";if(P.act<1)return "azioni finite per questa visita";
  if(e.id==="e_segn"&&!ttRisks(O).length)return "il rivale non ha combinazioni a rischio attive";
  if(e.id==="e_inf"&&O.fx.inf>0)return "il rivale ha già un'infezione";
  if(e.id==="e_spec"&&O.board.length>=TT.BOARD)return "terapia del rivale piena";return ""}
function ttEvent(i,k){if(ttEvCan(i,k))return false;const P=G.p[i],O=G.p[1-i],e=EVC[P.evh[k]];P.evh.splice(k,1);P.act--;P.st.evPlayed.push(e.id);O.st.evGot.push(e.id);
  let m=`${P.name} gioca «${e.n}» sul ${O.name}.`;
  if(e.id==="e_aki")O.fx.aki=3;
  if(e.id==="e_dehyd")O.fx.dehyd=2;
  if(e.id==="e_inf")O.fx.inf=2;
  if(e.id==="e_fall"){const n=O.board.filter(u=>has(u,"benzo")||has(u,"oppioide")).length;const ah=O.board.filter(u=>(has(u,"betabloc")||has(u,"acei")||has(u,"diuretico")||u.id==="amlodipina")&&ttLv(u)>=3).length;
    if(n||ah>=2){ttAE(O,2,"caduta");m+=` +2 eventi avversi (${n?"sedativi o oppioidi":"ipotensione da antipertensivi a dose massima"}).`}else m+=" Nessuna conseguenza: terapia prudente."}
  if(e.id==="e_nonadh"){let best=null,bv=0;O.board.forEach(u=>{const v=ttControl(O)-ttWhatIf(O,()=>{O.board=O.board.filter(x=>x.uid!==u.uid)}).c;if(v>bv){bv=v;best=u}});if(best){O.fx.skip=best.uid;m+=` ${D(best).n} non verrà assunto.`}}
  if(e.id==="e_segn"){ttAE(O,2,"segnalazione di farmacovigilanza");m+=" +2 eventi avversi."}
  if(e.id==="e_spec"){const cand=SPEC_POOL.filter(id=>CARDS[id]);const before=ttRisks(O).length;
    const pick=cand.find(id=>{const t={uid:-1,id,atk:0,hp:1};O.board.push(t);const r=ttRisks(O).length>before;O.board.pop();return r})||cand[0];
    const u=mkUnit(CARDS[pick]);u.spec=1;u.lv=2;O.board.push(u);m+=` Aggiunge ${CARDS[pick].n}.`}
  ttLog(m);if(!G.sim)fx({k:"alarm"});ttCheck();return true}

// ---- IA: valuta ogni azione simulandone l'effetto sulle prossime visite ----
function ttValue(P,r){const R=Math.max(1,TT.VISITS-P.turns+1);return r.c*10*R-r.ae*TT.AEW*R}
function ttAIChoose(i){const P=G.p[i],O=G.p[1-i];if(P.act<1)return null;const base=ttValue(P,{c:ttControl(P),ae:ttAEpreview(P).n});let best=null;
  const push=(s,a)=>{if(s>0.5&&(!best||s>best.s))best={s,...a}};
  P.hand.forEach((id,hi)=>{if(ttCanPlay(i,hi))return;const d=CARDS[id];
    if(d.type==="drug"){if(P.greedy){push(ttPillarsOf(id).length?10:0,{k:"play",hi});return}
      const r=ttWhatIf(P,()=>{if(d.from){const b=P.board.find(x=>x.id===d.from);b.id=d.id}else P.board.push({uid:-1,id,atk:d.E,hp:d.T,lv:1})});
      let s=ttValue(P,r)-base-(ttIsCI(id)?2*TT.AEW:0);if(ANTIBIO(d)&&P.fx.inf>0&&!P.board.some(u=>ANTIBIO(D(u))))s+=20;push(s,{k:"play",hi})}
    else if(d.id==="a_pront")push(3,{k:"play",hi});else if(d.id==="a_review")push(P.hand.length<3?2.5:1,{k:"play",hi});
    else if(d.type==="rec")push(1,{k:"play",hi})});
  P.board.forEach(u=>{
    for(const dir of [1,-1]){const lv=ttLv(u)+dir;if(lv<1||lv>3)continue;
      if(P.greedy&&dir<0)continue;const r=ttWhatIf(P,()=>{P.board.find(x=>x.uid===u.uid).lv=lv});push(P.greedy?(dir>0?5:0):ttValue(P,r)-base,{k:"tit",uid:u.uid,dir})}
    if(!P.greedy){if(ANTIBIO(D(u))&&P.fx.inf>0)return;const r=ttWhatIf(P,()=>{P.board=P.board.filter(x=>x.uid!==u.uid)});push(ttValue(P,r)-base-(u.pre&&!ttPillarsOf(u.id).length?TT.AEW:0),{k:"susp",uid:u.uid})}});
  P.evh.forEach((eid,k)=>{if(ttEvCan(i,k))return;let s=0;const R=Math.max(1,TT.VISITS-O.turns);
    if(eid==="e_segn")s=10;if(eid==="e_spec")s=6;if(eid==="e_inf")s=O.board.some(u=>ANTIBIO(D(u)))?1:8;
    if(eid==="e_fall")s=O.board.some(u=>has(u,"benzo")||has(u,"oppioide"))||O.board.filter(u=>(has(u,"betabloc")||has(u,"acei")||has(u,"diuretico"))&&ttLv(u)>=3).length>=2?10:0;
    if(eid==="e_aki")s=O.board.filter(u=>RENAL.includes(u.id)&&ttLv(u)>=2).length*5*Math.min(3,R);
    if(eid==="e_dehyd")s=O.board.filter(u=>has(u,"fans")||has(u,"acei")||has(u,"diuretico")).length*5*Math.min(2,R);
    if(eid==="e_nonadh")s=O.ctrl*6;
    push(s,{k:"ev",ev:k})});
  return best}
function ttAIStep(i,c){if(c.k==="play")ttPlay(i,c.hi);else if(c.k==="tit")ttTitrate(i,c.uid,c.dir);else if(c.k==="susp")ttSuspend(i,c.uid);else ttEvent(i,c.ev)}
function ttAIAct(i){let g=0;while(!G.over&&g++<6){const c=ttAIChoose(i);if(!c)break;ttAIStep(i,c)}}
async function ttAITurn(){if(!G||!G.tt||G.over)return;G.busy=true;render();
  let g=0;while(!G.over&&g++<6){const c=ttAIChoose(1);if(!c)break;ttAIStep(1,c);render();await wait(700)}
  G.busy=false;if(!G.over)ttEndTurn();render()}

// ---- referto a due bracci ----
function ttSpark(h){if(!h.length)return "";const w=120,hh=28,n=h.length;const pts=h.map((v,k)=>`${(n<2?0:k/(n-1)*w).toFixed(1)},${(hh-v/100*hh).toFixed(1)}`).join(" ");
  return `<svg class="spark" viewBox="0 0 ${w} ${hh}" width="${w}" height="${hh}" aria-hidden="true"><polyline points="${pts}" fill="none" stroke="currentColor" stroke-width="2"/></svg>`}
function ttReferto(w,msg,prize){const pr=ttProfile();const [A,B]=G.p;
  const row=(l,a,b)=>`<tr><th>${l}</th><td>${a}</td><td>${b}</td></tr>`;
  const causes=P=>Object.entries(P.aeLog).sort((x,y)=>y[1]-x[1]).map(([c,n])=>`${c}: ${n}`).join("<br>")||"nessuno";
  const cov=P=>ttCoverage(P).map(c=>`${c.p.n}: ${c.best?`${D(c.best).n} ${ttLv(c.best)}/3`:"—"}`).join("<br>");
  const used=new Set();[A,B].forEach(P=>Object.keys(P.aeLog).forEach(c=>{const k=RISK2INT[c];if(k)used.add(k)}));
  return `<div class="overlay"><div class="box referto">
    <span class="rf-k">Referto del trial · ${pr.who}, ${pr.age} anni · ${pr.dxl}</span>
    <h3>${w===0?"Vince il tuo braccio":w===1?"Vince il braccio B":"Pareggio"}</h3>
    <p>${msg} Ricevi <b>${prize} crediti ECM</b>.</p>
    <table class="rf-tab"><thead><tr><th></th><th>Braccio A (tu)</th><th>Braccio B</th></tr></thead><tbody>
      ${row("Controllo nel tempo",ttSpark(A.hist)+`<br>${A.hist.join(" · ")}%`,ttSpark(B.hist)+`<br>${B.hist.join(" · ")}%`)}
      ${row("Punti di controllo",A.pts,B.pts)}${row("Eventi avversi",A.ae,B.ae)}${row(`Beneficio netto (punti − ${TT.AEW} × eventi)`,ttNet(A),ttNet(B))}
      ${row("Terapia finale per pilastro",cov(A),cov(B))}
      ${row("Prescrizioni · titolazioni · sospensioni",`${A.st.rx} · ${A.st.tit} · ${A.st.susp}`,`${B.st.rx} · ${B.st.tit} · ${B.st.susp}`)}
      ${row("Controindicazioni violate · duplicazioni",`${A.st.ci} · ${A.st.dup}`,`${B.st.ci} · ${B.st.dup}`)}
      ${row("Avvisi seguiti / ignorati",`${A.st.avoided} / ${A.st.over}`,"")}
      ${row("Cause degli eventi avversi",causes(A),causes(B))}
    </tbody></table>
    <p class="meta">Strategia attesa per questo paziente: ${pr.hint}</p>
    ${used.size?`<dl><div><dt>Le interazioni comparse e le loro fonti</dt><dd><ul class="rf-ints">${[...used].map(k=>{const d=CARDS[k];return `<li><b>${d.n}</b><br><span>${d.f}</span>${(d.q||[]).map(q=>quote(Q[q].q,Q[q].s)).join("")}</li>`}).join("")}</ul></dd></div></dl>`:""}
    <p class="meta">Prototipo: pesi dei pilastri, livelli di dose ed eventi avversi sono stime di gioco da tarare, non indicazioni cliniche.</p>
    <div class="row" style="margin-top:14px"><button class="btn primary" data-ov="ttagain">Nuovo trial</button><button class="btn" data-ov="menu">Scheda tecnica</button></div></div></div>`}

// ---- schermata ----
const pct=x=>Math.round(x*100);
function ttEvCard(e){return `<div class="evcard"><div class="band"></div><div class="in"><div class="top"><div><b class="n">${e.n}</b><span class="t">evento clinico · 1 azione</span></div></div><p>${e.txt}</p><p class="teach">${e.teach}</p></div></div>`}
function ttUnitBadge(P,u){const b=[`dose ${ttLv(u)}/3`];if(u.pre)b.push("in corso");if(u.spec)b.push("specialista");if(ttIsCI(u.id))b.push("controindicato");else if(!ttPillarsOf(u.id).length&&!ANTIBIO(D(u)))b.push(u.pre?"terapia cronica":"non copre pilastri");return b.join(" · ")}
function renderTT(){
  const pr=ttProfile(),me=G.p[0],ai=G.p[1];const myTurn=G.turn===0&&!G.busy&&!G.over;
  G.pw=G.pw||[[0,0],[0,0]];
  const strip=(P,i)=>{const cnow=ttControl(P);const cp=pct(cnow),ap=Math.min(100,P.ae/TT.AE*100);const [pc,pa]=G.pw[i];G.pw[i]=[cp,ap];
    const fxs=[P.fx.aki>0?`IRA ${P.fx.aki} visite`:"",P.fx.inf>0?`infezione: antibiotico entro ${P.fx.inf}`:"",P.fx.dehyd>0?`disidratazione ${P.fx.dehyd}`:"",P.fx.skip?"un farmaco non assunto":""].filter(Boolean);
    return `<div class="hero strip tt" data-side="${i}">
      <span class="who">${i?"Braccio B":"Braccio A"}</span>
      <span class="meter cm"><small>Controllo <b>${cp}%</b></small><span class="bar"><i class="cure" style="width:${pc}%" data-to="${cp}%"></i></span></span>
      <span class="meter ae"><small>Avversi <b>${P.ae}</b>/${TT.AE}</small><span class="bar"><i class="low" style="width:${pa}%" data-to="${ap}%"></i></span></span>
      <span class="stackrow"><span>visita ${P.turns}/${TT.VISITS}</span></span>
      <span class="dose"><span class="pts">${P.pts} punti</span>${i?`<span class="evcount">${P.evh.length} eventi in mano</span>`:`${Array.from({length:TT.ACTIONS},(_,k)=>`<i class="${k<P.act?"on":""}"></i>`).join("")}<span>${P.act}/${TT.ACTIONS} azioni</span>`}</span>
      <span class="recs">${fxs.map(x=>`<span class="warnchip">${x}</span>`).join("")}</span>
    </div>`};
  const fut=(P,i)=>{if(!P.board.length)return `<div class="fut-empty">${i?"Il braccio B non ha ancora prescritto":"Nessun farmaco in terapia: tocca una carta della mano per iniziarne uno"}</div>`;
    const cov=ttCoverage(P);const rk=ttAEpreview(P).L;
    return P.board.map(u=>{const d=D(u);const pl=ttPillarsOf(u.id);const dup=cov.some(c=>c.us.length>1&&c.us.includes(u));const best=cov.some(c=>c.best===u);
      const ci=ttIsCI(u.id);const inRisk=rk.filter(([c])=>c.includes(d.n)||risks(P).includes(c)&&(c.includes("emorragico")?bleedG(u).length:c.includes("QT")?has(u,"qt"):c.includes("serot")?has(u,"serot"):c.includes("indice")?(d.ab.inhib||d.ab.nti):c.includes("oppioide")?has(u,"oppioide")||has(u,"benzo"):c.includes("statina")?has(u,"statina")||has(u,"cyp3a4inib"):c.includes("FANS")?has(u,"fans")||has(u,"acei")||has(u,"diuretico"):c.includes("K⁺")?has(u,"kspar")||has(u,"acei"):false));
      const role=pl.length?pl.map(p=>p.n).join(", "):ANTIBIO(d)?"antibiotico":u.pre?"terapia cronica":"non copre pilastri";
      const tag=i===0?"button":"div";
      return `<${tag} class="fut-row${ci?" ci":dup?" dup":inRisk.length?" risk":best?" ok":""}${u.uid===P.fx.skip?" skip":""}${i===0&&G.sel&&G.sel.k==="unit"&&G.sel.uid===u.uid?" sel":""}" ${i===0?`data-ttu="${u.uid}"`:""} data-cid="${u.id}" data-unit="${u.uid}" data-side="${i}" style="--cc:var(--c-${d.cl})">
        <span class="fn">${d.n}${u.pre?' <em>in corso</em>':""}${u.spec?' <em>specialista</em>':""}</span>
        <span class="fr">${role}</span>
        <span class="fd" aria-label="dose ${ttLv(u)} di 3">${[1,2,3].map(k=>`<i class="${k<=ttLv(u)?"on":""}"></i>`).join("")}</span>
        <span class="ff">${ci?"controindicato":dup?"duplicato":inRisk.length?"a rischio":best?"✓":u.uid===P.fx.skip?"non assunto":""}</span>
      </${tag}>`}).join("")};
  const row=(P,i)=>P.board.length?P.board.map(u=>cardHTML(D(u),"board",{unit:u,eff:u.atk,badge:ttUnitBadge(P,u),btn:i===0,extra:(i===0&&G.sel&&G.sel.k==="unit"&&G.sel.uid===u.uid?"sel":"")+(u.uid===P.fx.skip?" dim":"")+" lv"+ttLv(u),attrs:`data-ttu="${i===0?u.uid:""}" data-cid="${u.id}" data-unit="${u.uid}" data-side="${i}"`})).join(""):`<span class="empty">${i?"Il braccio B non ha ancora prescritto":"Nessun farmaco in terapia"}</span>`;
  const pv=ttAEpreview(me);const cov=ttCoverage(me);const cnow=ttControl(me);
  const sel=G.sel;let prev="";
  const delta=(r)=>{const a=[];if(pct(r.c)!==pct(cnow))a.push(`controllo ${pct(cnow)}% → <b>${pct(r.c)}%</b>`);if(pct(r.any)!==pct(pv.any))a.push(`rischio di evento avverso ${pct(pv.any)}% → <b>${pct(r.any)}%</b>`);return a.length?a.join(" · "):"nessun effetto su controllo e rischio"};
  if(sel&&sel.k==="hand"&&me.hand[sel.hi]){const hi=sel.hi,d=CARDS[me.hand[hi]];const why=myTurn?ttCanPlay(0,hi):"non è il tuo turno";
    const notes=[];const ci=ttIsCI(d.id);let rx=[];
    if(d.type==="drug"){const pl=ttPillarsOf(d.id);
      const r=ttWhatIf(me,()=>{if(d.from){const b=me.board.find(x=>x.id===d.from);if(b)b.id=d.id}else me.board.push({uid:-1,id:d.id,atk:d.E,hp:d.T,lv:1})});
      notes.push(`<p>${pl.length?`Pilastro: <strong>${pl.map(p=>p.n).join(", ")}</strong>. `:ANTIBIO(d)?(me.fx.inf>0?"Tratta l'infezione in corso. ":"Antibiotico: serve solo se compare un'infezione. "):"Non copre nessun pilastro: non migliora il controllo. "}${delta(r)}.</p>`);
      const dup=pl.filter(p=>me.board.some(u=>p.d[u.id]!=null));if(dup.length)notes.push(`<p class="w"><strong>Duplicazione terapeutica</strong>: ${dup.map(p=>p.n).join(", ")} è già coperto. Non aggiunge controllo e aggiunge un rischio del ${pc(PR.dup)}% a visita.</p>`);
      if(ci)notes.push(`<p class="w"><strong>Controindicato in questo paziente</strong>: ${ci}. +2 eventi avversi subito e un rischio del ${pc(PR.ci)}% a ogni visita.</p>`);
      const adj=ttAdj(me,d.id);if(adj)notes.push(`<p>Dose da adattare (${adj}): tienilo a dose 1, sopra aggiunge un rischio del ${pc(PR.adj)}% a visita.</p>`);
      if(!why){rx=rxAlert(d.id);rx.forEach(a=>notes.push(`<p class="w"><strong>${d.n}${a.partners.length?" + "+a.partners.join(", "):""}</strong>: ${a.r}, rischio del ${pc(Math.min(.9,(RISK_AE[a.r]||.15)*(pr.x2.includes(a.r)?2:1)))}% di evento avverso a ogni visita finché resta in terapia.</p>`))}}
    const warn=rx.length||ci||notes.some(n=>n.includes('class="w"'));G.rxShown=!!warn;
    const btns=why?`<button class="btn primary" disabled>${why.charAt(0).toUpperCase()+why.slice(1)}</button>`:`<button class="btn primary" data-ttplay="${hi}" ${warn?'data-override="1"':""}>${warn?"Prescrivi comunque":d.type==="drug"?"Inizia a dose bassa":"Gioca"} · 1 azione</button>`;
    prev=`<div class="hp-back" data-hclose="1"></div><div class="handpreview alert">${cardHTML(d,"hand",{ind:isIndicated(d.id,fieldDis())})}${notes.length?`<div class="rxalert${warn?" ci":""}" role="alert"><b>${warn?"Avviso di prescrizione":"Effetto previsto"}</b>${notes.join("")}</div>`:""}<div class="row">${btns}<button class="btn" data-hclose="1">${warn?"Non prescrivere":"Chiudi"}</button></div></div>`}
  if(sel&&sel.k==="unit"){const u=me.board.find(x=>x.uid===sel.uid);if(u){const why=!myTurn?"non è il tuo turno":me.act<1?"azioni finite":"";const lv=ttLv(u);
    const up=lv<3?ttWhatIf(me,()=>{me.board.find(x=>x.uid===u.uid).lv=lv+1}):null,dn=lv>1?ttWhatIf(me,()=>{me.board.find(x=>x.uid===u.uid).lv=lv-1}):null,off=ttWhatIf(me,()=>{me.board=me.board.filter(x=>x.uid!==u.uid)});
    const line=(l,r)=>r?`<p>${l}: ${delta(r)}</p>`:"";
    prev=`<div class="hp-back" data-hclose="1"></div><div class="handpreview alert">${cardHTML(D(u),"hand",{ind:isIndicated(u.id,fieldDis())})}<div class="rxalert"><b>In terapia · ${ttUnitBadge(me,u)}</b>${line("Aumentando",up)}${line("Riducendo",dn)}${line("Sospendendo",off)}${u.pre&&!ttPillarsOf(u.id).length?`<p class="w">È una terapia cronica necessaria: sospenderla dà +1 evento avverso subito (ricaduta).</p>`:""}</div>
      <div class="row tri">${up?`<button class="btn primary" data-tttit="${u.uid}" data-dir="1" ${why?"disabled":""}>Aumenta</button>`:""}${dn?`<button class="btn" data-tttit="${u.uid}" data-dir="-1" ${why?"disabled":""}>Riduci</button>`:""}<button class="btn" data-ttsusp="${u.uid}" ${why?"disabled":""}>Sospendi</button><button class="btn" data-hclose="1">Chiudi</button></div>${why?`<small>${why.charAt(0).toUpperCase()+why.slice(1)}.</small>`:"<small>Ogni modifica costa 1 azione.</small>"}</div>`}}
  if(sel&&sel.k==="ev"&&me.evh[sel.k2]!=null){const e=EVC[me.evh[sel.k2]];const why=myTurn?ttEvCan(0,sel.k2):"non è il tuo turno";
    prev=`<div class="hp-back" data-hclose="1"></div><div class="handpreview evp">${ttEvCard(e)}<div class="row"><button class="btn primary" data-ttev="${sel.k2}" ${why?"disabled":""}>${why?why.charAt(0).toUpperCase()+why.slice(1):"Gioca sul braccio B · 1 azione"}</button><button class="btn" data-hclose="1">Chiudi</button></div></div>`}
  app.innerHTML=`<div class="duel arena tt">
    <div class="duelbar"><button class="btn" id="tomenu" aria-label="Torna al menu">‹ Menu</button><span class="turnchip ${G.over?"":myTurn?"me":"ai"}">${G.over?"Trial concluso":G.turn===0?"La tua visita":"Visita del braccio B"}</span><button class="btn ghost" id="quit">${G.over?"Chiudi":"Abbandona"}</button></div>
    ${strip(ai,1)}
    <div class="fut rival">${fut(ai,1)}</div>
    <div class="patient ward">
      <div class="chart"><span class="lbl">Stesso profilo nei due bracci · letto ${pr.bed}</span><b>${pr.who}, ${pr.age} anni</b><span class="dx" data-detail="${pr.dis}">${pr.dxl}</span><span class="facts">${pr.facts.map(([c,t])=>`<span class="f ${c}">${t}</span>`).join("")}</span>
        <span class="pillars">${cov.map(c=>`<span class="pil ${c.us.length>1?"dup":c.best?"on":""}" title="${c.p.n}">${c.p.n}${c.best?` · ${D(c.best).n} ${ttLv(c.best)}/3`:""}</span>`).join("")}</span></div>
      <button class="condtile card" data-detail="${pr.dis}" data-cid="${pr.dis}" aria-label="Dettagli ${CARDS[pr.dis].n}"><span class="ct-art">${g(CARDS[pr.dis])}</span><span class="ct-l">diagnosi</span></button>
      <div class="logline" aria-live="polite">${G.busy?"Visita del braccio B… ":""}${G.log}</div>
    </div>
    <div class="fut mine"><span class="fut-h">Foglio unico di terapia · braccio A</span>${fut(me,0)}</div>
    ${pv.L.length?`<div class="riskbar"><b>Rischio di evento avverso alla prossima visita: ${pct(pv.any)}%</b><span>${pv.L.map(([c,p])=>`${c} ${pc(p)}%`).join(" · ")}</span></div>`:`<div class="riskbar ok"><b>Nessun rischio attivo nella tua terapia</b></div>`}
    ${strip(me,0)}
    <div class="evrow">${me.evh.length?`<span class="evl">Eventi da giocare sul braccio B</span>${me.evh.map((id,k)=>`<button class="evchip" data-tte="${k}">${EVC[id].n}</button>`).join("")}`:`<span class="evl">Nessun evento in mano</span>`}</div>
    <div class="trayrow">
      <div class="tray"><div class="hand">${me.hand.map((id,hi)=>{const d=CARDS[id];const w=myTurn?ttCanPlay(0,hi):"non è il tuo turno";
        return cardHTML(d,"hand",{btn:true,ind:isIndicated(id,fieldDis()),extra:(w?"dim":"playable")+(sel&&sel.k==="hand"&&sel.hi===hi?" picked":"")+(ttIsCI(id)?" ci":""),attrs:`data-tthand="${hi}" data-cid="${id}" title="${d.n}"`})}).join("")}</div></div>
      <div class="fab"><button class="btn primary" id="ttend" ${myTurn?"":"disabled"}>Fine visita</button></div>
    </div>
    ${prev}
  </div>`;
  document.getElementById("tomenu").onclick=()=>{if(G.over){G=null}else{duelHidden=true}tab="menu";render()};
  document.getElementById("quit").onclick=()=>{if(G.over){G=null;render();return}const q=document.getElementById("quit");if(q.dataset.sure){G.p[0].ae=TT.AE;ttCheck()}else{q.dataset.sure=1;q.textContent="Confermi? Conta come sconfitta"}};
  applyFx();
}
app.addEventListener("click",e=>{
  if(!G||!G.tt||tab!=="duello"||duelHidden)return;
  const t=e.target;const mine=()=>G.turn===0&&!G.busy&&!G.over;
  if(t.closest("[data-hclose]")){if(G.rxShown&&G.sel&&G.sel.k==="hand")G.p[0].st.avoided++;G.rxShown=false;G.sel=null;render();return}
  if(t.closest("#ttend")){if(!mine())return;G.sel=null;ttEndTurn();render();return}
  const pl=t.closest("[data-ttplay]");if(pl){if(!mine())return;if(pl.dataset.override)G.p[0].st.over++;G.sel=null;G.rxShown=false;ttPlay(0,+pl.dataset.ttplay);render();return}
  const ti=t.closest("[data-tttit]");if(ti){if(!mine())return;G.sel=null;ttTitrate(0,+ti.dataset.tttit,+ti.dataset.dir);render();return}
  const su=t.closest("[data-ttsusp]");if(su){if(!mine())return;G.sel=null;ttSuspend(0,+su.dataset.ttsusp);render();return}
  const ev=t.closest("[data-ttev]");if(ev){if(!mine())return;G.sel=null;ttEvent(0,+ev.dataset.ttev);render();return}
  const h=t.closest("[data-tthand]");if(h){const hi=+h.dataset.tthand;G.sel=G.sel&&G.sel.k==="hand"&&G.sel.hi===hi?null:{k:"hand",hi};render();return}
  const u=t.closest("[data-ttu]");if(u&&u.dataset.ttu){const uid=+u.dataset.ttu;G.sel=G.sel&&G.sel.k==="unit"&&G.sel.uid===uid?null:{k:"unit",uid};render();return}
  const ec=t.closest("[data-tte]");if(ec){G.sel={k:"ev",k2:+ec.dataset.tte};render();return}
});
