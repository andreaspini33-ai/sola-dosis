// =================== TESTA A TESTA (prototipo) ===================
// Due bracci, stesso profilo di paziente. Le interazioni colpiscono chi prescrive.
// Il rivale non attacca: gioca eventi clinici sul paziente dell'altro braccio.
const TT={CURE:40,AE:10,TURNS:12,BOARD:6,IND:0,EVMAX:2};
const STRONG_OP=["morfina","fentanil","ossicodone","buprenorfina"];
const RENAL=["metformina","dabigatran","digossina","enoxaparina","litio","pregabalin","edoxaban"];
const ANTIBIO=d=>d.cl==="anti";
const RISK_AE={"oppioide + benzodiazepina":2,"doppio QT":2,"FANS + ACE-i + diuretico":2,"inibitore + indice ristretto":2,"doppio serotoninergico":1,"rischio emorragico":1,"risparmiatore di K⁺ + ACE-i":1,"statina + inibitore CYP3A4":1};
const PROFILES=[
 {id:"p_scomp",who:"Sig. B.",age:79,bed:7,dis:"d_scompenso",dxl:"Scompenso cardiaco a frazione d'eiezione ridotta",
  facts:[["red","eGFR 28"],["amb","K⁺ 5,2"],["amb","diabete tipo 2"]],pre:["furosemide"],
  ci:{metformina:"eGFR sotto 30",dabigatran:"eGFR sotto 30",fans:"peggiora scompenso e funzione renale"},adj:{digossina:"eliminazione renale ridotta"},hiK:true,x2:[],
  deck:["ramipril","ramipril","sacval","bisoprololo","bisoprololo","spironolattone","spironolattone","empagliflozin","empagliflozin","digossina","metformina","dabigatran","ibuprofene","diclofenac","r_at1","a_review","a_pront","azitromicina","claritromicina","amoxicillina"],
  hint:"Beta-bloccante, ACE-i o sacubitril/valsartan con attenzione al potassio, gliflozina; niente FANS."},
 {id:"p_fa",who:"Sig.ra R.",age:74,bed:3,dis:"d_fa",dxl:"Fibrillazione atriale",
  facts:[["red","emorragia digestiva pregressa"],["amb","QTc 470 ms"],["amb","ipertensione"],["ok","eGFR 62"]],pre:["escitalopram"],
  ci:{},adj:{},x2:["rischio emorragico"],
  deck:["apixaban","apixaban","rivaroxaban","edoxaban","warfarin","dabigatran","bisoprololo","bisoprololo","metoprololo","digossina","amiodarone","amiodarone","aspirina","ibuprofene","claritromicina","levofloxacina","amoxicillina","r_b1","a_review","a_pront"],
  hint:"Anticoagulante orale diretto e beta-bloccante; antibiotico senza effetto sul QT."},
 {id:"p_postop",who:"Sig. M.",age:54,bed:12,dis:"d_postop",dxl:"Dolore postoperatorio dopo protesi di ginocchio",
  facts:[["red","ulcera peptica"],["amb","apnee notturne"],["ok","eGFR 90"]],pre:["sertralina"],
  ci:{},adj:{},x2:["rischio emorragico"],strongOp:true,
  deck:["paracetamolo","paracetamolo","paracod","codeina","morfina","ossicodone","tramadolo","tramadolo","ibuprofene","naprossene","ketorolac","celecoxib","diazepam","pregabalin","r_mu","a_review","a_pront","amoxiclav","linezolid","ceftriaxone"],
  hint:"Paracetamolo di base, oppioide a basso dosaggio per breve tempo; niente tramadolo né FANS."}
];
const EVENTS=[
 {id:"e_aki",n:"Insufficienza renale acuta",c:2,txt:"Per 3 turni l'eGFR del rivale scende sotto 30: ogni farmaco a eliminazione renale a dose piena dà +1 evento avverso a turno.",teach:"Aggiustamento della dose per funzione renale."},
 {id:"e_inf",n:"Infezione intercorrente",c:2,txt:"Il rivale deve prescrivere un antibiotico entro 2 turni, altrimenti +2 eventi avversi.",teach:"Scegliere l'antibiotico senza creare interazioni."},
 {id:"e_spec",n:"Nuovo specialista",c:2,txt:"Aggiunge alla terapia del rivale un farmaco prescritto da un altro specialista. Si toglie solo sospendendolo.",teach:"Prescrizione a cascata e riconciliazione della terapia."},
 {id:"e_dehyd",n:"Disidratazione",c:1,txt:"Per 2 turni ogni FANS, ACE-i o sartano e diuretico in terapia del rivale dà +1 evento avverso.",teach:"Le regole per i giorni di malattia (sick day rules)."},
 {id:"e_fall",n:"Caduta a domicilio",c:1,txt:"+2 eventi avversi al rivale se ha in terapia benzodiazepine o oppioidi, oppure tre o più antipertensivi.",teach:"Farmaci e cadute nell'anziano."},
 {id:"e_nonadh",n:"Scarsa aderenza",c:1,txt:"Il farmaco più efficace del rivale non dà risposta al suo prossimo turno.",teach:"Aderenza e semplificazione della terapia."},
 {id:"e_segn",n:"Segnalazione di farmacovigilanza",c:1,txt:"Solo se il rivale ha una combinazione a rischio attiva: +2 eventi avversi subito.",teach:"Il segnale nasce dalle combinazioni lasciate in terapia."},
 {id:"e_segn",n:"Segnalazione di farmacovigilanza",c:1,txt:"Solo se il rivale ha una combinazione a rischio attiva: +2 eventi avversi subito.",teach:"Il segnale nasce dalle combinazioni lasciate in terapia."}
];
const EVC={};EVENTS.forEach(e=>EVC[e.id]=e);
const SPEC_POOL=["claritromicina","ibuprofene","diazepam","amiodarone","fluconazolo","prednisone"];

function ttProfile(){return PROFILES.find(p=>p.id===G.prof)}
function ttNewPlayer(name,prof){const P=newPlayer(prof.deck.filter(id=>CARDS[id]),name);
  P.ae=0;P.aeLog={};P.ev=shuffle(EVENTS.map(e=>e.id));P.evh=[];P.turns=0;P.st={rx:0,ci:0,susp:0,over:0,avoided:0,evPlayed:[],evGot:[]};P.fx={aki:0,dehyd:0,inf:0,skip:null};
  prof.pre.forEach(id=>{if(CARDS[id]){const u=mkUnit(CARDS[id]);u.pre=1;P.board.push(u)}});return P}
function startTT(profId){
  duelHidden=false;const prof=PROFILES.find(p=>p.id===profId)||PROFILES[0];
  G={tt:1,prof:prof.id,field:prof.dis,p:[ttNewPlayer("Braccio A",prof),ttNewPlayer("Braccio B",prof)],turn:0,busy:false,over:false,log:"Il trial comincia: stesso paziente, due bracci.",ttlog:[]};
  for(let i=0;i<3;i++){draw(0);draw(1)}
  ttStart(0);render();
}
const ttLog=(m)=>{G.log=m;(G.ttlog=G.ttlog||[]).push(m)};
function ttAE(P,n,cause){if(n<=0)return;P.ae+=n;P.aeLog[cause]=(P.aeLog[cause]||0)+n}
function ttIsCI(id){const pr=ttProfile();const d=CARDS[id];if(!d||d.type!=="drug")return "";if(pr.ci[id])return pr.ci[id];if(pr.ci.fans&&d.tags.includes("fans"))return pr.ci.fans;return ""}
function ttAdj(P,id){const pr=ttProfile();if(pr.adj[id])return pr.adj[id];if(P.fx.aki>0&&RENAL.includes(id))return "insufficienza renale acuta";return ""}
function ttRisks(P){const pr=ttProfile();const out=risks(P).map(r=>({r,n:(RISK_AE[r]||1)*(pr.x2.includes(r)?2:1)}));
  if(pr.hiK&&P.board.some(u=>u.id==="spironolattone")&&!out.some(x=>x.r.startsWith("risparmiatore")))out.push({r:"spironolattone con potassio già alto",n:1});
  return out}
function ttCureGain(P){let g=0;P.board.forEach(u=>{if(u.uid===P.fx.skip)return;if(!isIndicated(u.id,fieldDis()))return;g+=Math.max(0,effAtk(u,P)-(u.red?1:0)-(1-TT.IND))});return g}
function ttAEpreview(P){let n=0;const L=[];
  ttRisks(P).forEach(x=>{n+=x.n;L.push([x.r,x.n])});
  P.board.forEach(u=>{const ci=ttIsCI(u.id);if(ci){n+=1;L.push([`${D(u).n} controindicato`,1])}
    const adj=ttAdj(P,u.id);if(adj&&!u.red){n+=1;L.push([`${D(u).n} a dose piena (${adj})`,1])}
    if(ttProfile().strongOp&&STRONG_OP.includes(u.id)){n+=1;L.push([`${D(u).n} con apnee notturne`,1])}
    if(P.fx.dehyd>0&&(has(u,"fans")||has(u,"acei")||has(u,"diuretico"))){n+=1;L.push([`${D(u).n} durante disidratazione`,1])}});
  return {n,L}}
function ttStart(i){
  const P=G.p[i];G.turn=i;P.turns++;P.max=Math.min(10,P.max+1);P.dose=P.max;if(P.deck.length)draw(i);
  if(P.evh.length<TT.EVMAX&&P.ev.length)P.evh.push(P.ev.pop());
  P.board.forEach(u=>{u.can=true;u.tap=false});
  const gain=ttCureGain(P);P.fx.skip=null;
  if(gain){P.cure+=gain;if(!G.sim)fx({k:"cure",side:i,n:gain})}
  const pv=ttAEpreview(P);pv.L.forEach(([c,n])=>ttAE(P,n,c));
  if(P.fx.inf>0){if(P.board.some(u=>ANTIBIO(D(u)))){P.fx.inf=0;ttLog(`${P.name}: infezione trattata.`)}else{P.fx.inf--;if(P.fx.inf===0){ttAE(P,2,"infezione non trattata");ttLog(`${P.name}: infezione non trattata, +2 eventi avversi.`)}}}
  if(P.fx.aki>0)P.fx.aki--;if(P.fx.dehyd>0)P.fx.dehyd--;
  if(pv.n&&!G.sim)fx({k:"hero",side:i,n:pv.n});
  if(gain||pv.n)ttLog(`${P.name}: +${gain} risposta terapeutica${pv.n?`, +${pv.n} eventi avversi`:""}.`);
  ttCheck();
}
function ttCheck(){if(G.over)return;
  for(const i of [0,1]){const P=G.p[i];if(P.ae>=TT.AE){ttEnd(1-i,`Il comitato di monitoraggio interrompe il ${P.name} per eventi avversi.`);return}}
  if(G.p.some(P=>P.cure>=TT.CURE))G.endRound=1;
}
function ttEndTurn(){if(G.over)return;const i=G.turn;
  if(i===1&&(G.endRound||G.p[0].turns>=TT.TURNS)){ttFinish();return}
  ttStart(1-i);if(G.over)return;if(G.turn===1&&!G.sim)setTimeout(ttAITurn,500);
}
function ttFinish(){const [A,B]=G.p;const na=A.cure-A.ae,nb=B.cure-B.ae;
  const w=na>nb?0:nb>na?1:A.ae<B.ae?0:B.ae<A.ae?1:-1;
  ttEnd(w,w<0?"I due bracci finiscono alla pari.":`Il trial si chiude: beneficio netto ${na} contro ${nb}.`)}
function ttEnd(w,msg){G.over=true;G.win=w;if(G.sim)return;
  const win=w===0;const prize=win?45:w<0?25:15;if(win)S.wins++;else if(w===1)S.losses++;S.crediti+=prize;save();
  setTimeout(()=>{sfx(win?"win":"lose");ov.innerHTML=ttReferto(w,msg,prize);render()},350)}

// ---- azioni ----
function ttCanPlay(i,hi){const P=G.p[i],d=CARDS[P.hand[hi]];if(!d)return "?";
  if(d.type==="drug"){if(d.from){if(d.ec>P.dose)return "dosi insufficienti";return P.board.some(u=>u.id===d.from)?"":`serve ${CARDS[d.from].n} in terapia`}
    if(d.c>P.dose)return "dosi insufficienti";if(P.board.length>=TT.BOARD)return "terapia già con 6 farmaci";return ""}
  if(d.c>P.dose)return "dosi insufficienti";
  if(d.type==="rec"){if(P.recs.length>=2)return "già 2 recettori";if(P.recs.includes(d.id))return "già in gioco";return ""}
  if(d.id==="a_review")return "";
  if(d.id==="a_pront")return P.deck.some(id=>isIndicated(id,fieldDis()))?"":"nessun farmaco indicato nel mazzo";
  if(d.id==="a_repo")return P.grave.length?"":"nessun farmaco sospeso";
  return "non usata in questo prototipo"}
function ttPlay(i,hi,opt={}){if(ttCanPlay(i,hi))return false;const P=G.p[i],d=CARDS[P.hand[hi]];P.hand.splice(hi,1);
  if(d.type==="drug"){let u;
    if(d.from){P.dose-=d.ec;const base=P.board.find(x=>x.id===d.from);const red=base.red;Object.assign(base,{id:d.id,atk:d.E,hp:d.T,max:d.T});base.red=red;u=base}
    else{P.dose-=d.c;u=mkUnit(d);P.board.push(u)}
    if(opt.red)u.red=1;P.st.rx++;
    const ci=ttIsCI(d.id);if(ci){ttAE(P,3,`${d.n} prescritto nonostante la controindicazione`);P.st.ci++}
    if(!G.sim)fx({k:"enter",uid:u.uid});
    ttLog(`${P.name}: ${d.n}${opt.red?" a dose ridotta":""} in terapia.${ci?` Controindicato (${ci}): +3 eventi avversi.`:""}${isIndicated(d.id,fieldDis())||ANTIBIO(d)?"":" Non indicato per questo paziente."}`);
    ttCheck();return true}
  P.dose-=d.c;
  if(d.type==="rec"){P.recs.push(d.id);ttLog(`${P.name}: ${d.n} in gioco.`);return true}
  if(d.id==="a_review"){draw(i);draw(i);ttLog(`${P.name}: Revisione sistematica, 2 carte.`)}
  if(d.id==="a_pront"){const got=tutor(P,id=>isIndicated(id,fieldDis()));ttLog(`${P.name}: Prontuario, ${i?"un farmaco indicato":CARDS[got].n}.`)}
  if(d.id==="a_repo"){const x=P.grave.pop();if(P.hand.length<8)P.hand.push(x);ttLog(`${P.name}: Riposizionamento, ${CARDS[x].n} torna in mano.`)}
  return true}
function ttSuspend(i,uid){const P=G.p[i];if(P.dose<1)return false;const k=P.board.findIndex(u=>u.uid===uid);if(k<0)return false;
  const u=P.board[k];P.board.splice(k,1);P.dose-=1;P.grave.push(u.id);P.st.susp++;ttLog(`${P.name}: sospeso ${D(u).n}.`);return true}
function ttEvCan(i,k){const P=G.p[i],O=G.p[1-i],e=EVC[P.evh[k]];if(!e)return "?";if(e.c>P.dose)return "dosi insufficienti";
  if(e.id==="e_segn"&&!ttRisks(O).length)return "il rivale non ha combinazioni a rischio attive";
  if(e.id==="e_inf"&&O.fx.inf>0)return "il rivale ha già un'infezione";
  if(e.id==="e_spec"&&O.board.length>=TT.BOARD)return "terapia del rivale piena";return ""}
function ttEvent(i,k){if(ttEvCan(i,k))return false;const P=G.p[i],O=G.p[1-i],e=EVC[P.evh[k]];P.evh.splice(k,1);P.dose-=e.c;P.st.evPlayed.push(e.id);O.st.evGot.push(e.id);
  let m=`${P.name} gioca «${e.n}» sul ${O.name}.`;
  if(e.id==="e_aki")O.fx.aki=3;
  if(e.id==="e_dehyd")O.fx.dehyd=2;
  if(e.id==="e_inf")O.fx.inf=2;
  if(e.id==="e_fall"){const n=O.board.filter(u=>has(u,"benzo")||has(u,"oppioide")).length;const ah=O.board.filter(u=>has(u,"betabloc")||has(u,"acei")||has(u,"diuretico")||u.id==="amlodipina").length;
    if(n||ah>=3){ttAE(O,2,"caduta");m+=" +2 eventi avversi."}else m+=" Nessuna conseguenza: terapia prudente."}
  if(e.id==="e_nonadh"){const b=O.board.filter(u=>isIndicated(u.id,fieldDis())).sort((a,b)=>effAtk(b,O)-effAtk(a,O))[0];if(b){O.fx.skip=b.uid;m+=` ${D(b).n} non verrà assunto.`}}
  if(e.id==="e_segn"){ttAE(O,2,"segnalazione di farmacovigilanza");m+=" +2 eventi avversi."}
  if(e.id==="e_spec"){const cand=SPEC_POOL.filter(id=>CARDS[id]);const before=ttRisks(O).length;
    let pick=cand.find(id=>{const t={uid:-1,id,atk:0,hp:1};O.board.push(t);const r=ttRisks(O).length>before;O.board.pop();return r})||cand[0];
    const u=mkUnit(CARDS[pick]);u.spec=1;O.board.push(u);m+=` Aggiunge ${CARDS[pick].n}.`}
  ttLog(m);if(!G.sim)fx({k:"alarm"});ttCheck();return true}

// ---- IA ----
function ttScoreDrug(P,id){const d=CARDS[id];const O=G.p[0];let s=0;
  const ind=isIndicated(id,fieldDis());if(ind)s+=(d.E+1)*2+d.T*.3;else if(ANTIBIO(d)&&P.fx.inf>0)s+=7;else s-=2;
  if(P.greedy)return s;
  if(ttIsCI(id))s-=20;
  const before=ttRisks(P).reduce((z,x)=>z+x.n,0);const t={uid:-1,id,atk:0,hp:1};P.board.push(t);const after=ttRisks(P).reduce((z,x)=>z+x.n,0);P.board.pop();
  s-=(after-before)*6;if(ttProfile().strongOp&&STRONG_OP.includes(id))s-=3;return s}
function ttAIChoose(i){const P=G.p[i],O=G.p[1-i];let best=null;const push=(s,a)=>{if(s>0&&(!best||s>best.s))best={s,...a}};
  P.hand.forEach((id,hi)=>{if(ttCanPlay(i,hi))return;const d=CARDS[id];
    if(d.type==="drug"){const s=ttScoreDrug(P,id);push(s,{k:"play",hi,red:!!ttAdj(P,id)})}
    else if(d.type==="rec")push(P.board.filter(u=>has(u,d.tag)&&isIndicated(u.id,fieldDis())).length*3,{k:"play",hi})
    else if(d.id==="a_pront")push(4,{k:"play",hi});else if(d.id==="a_review")push(P.hand.length<3?3:1,{k:"play",hi});else if(d.id==="a_repo")push(1,{k:"play",hi})});
  if(P.dose>=1)P.board.forEach(u=>{const ind=isIndicated(u.id,fieldDis());const ci=ttIsCI(u.id);
    const before=ttRisks(P).reduce((z,x)=>z+x.n,0);const k=P.board.indexOf(u);P.board.splice(k,1);const after=ttRisks(P).reduce((z,x)=>z+x.n,0);P.board.splice(k,0,u);
    let s=(before-after)*3+(ci?4:0)+(!ind&&!(ANTIBIO(D(u))&&P.fx.inf>0)&&!ANTIBIO(D(u))?1.5:0)-(ind?effAtk(u,P)*1.2:0);
    if(ANTIBIO(D(u))&&P.fx.inf>0)s-=10;push(s,{k:"susp",uid:u.uid})});
  P.evh.forEach((eid,k)=>{if(ttEvCan(i,k))return;let s=0;
    if(eid==="e_segn")s=7;if(eid==="e_spec")s=3.5;if(eid==="e_inf")s=O.board.some(u=>ANTIBIO(D(u)))?1:3.5;
    if(eid==="e_fall")s=O.board.some(u=>has(u,"benzo")||has(u,"oppioide"))?6:0;
    if(eid==="e_aki")s=O.board.filter(u=>RENAL.includes(u.id)&&!u.red).length*3;
    if(eid==="e_dehyd")s=O.board.filter(u=>has(u,"fans")||has(u,"acei")||has(u,"diuretico")).length*2;
    if(eid==="e_nonadh")s=O.board.some(u=>isIndicated(u.id,fieldDis())&&effAtk(u,O)>=4)?3:0;
    push(s-0.5,{k:"ev",ev:k})});
  return best}
function ttAIAct(i){let g=0;while(!G.over&&g++<12){const c=ttAIChoose(i);if(!c)break;
  if(c.k==="play")ttPlay(i,c.hi,{red:c.red});else if(c.k==="susp")ttSuspend(i,c.uid);else ttEvent(i,c.ev)}}
async function ttAITurn(){if(!G||!G.tt||G.over)return;G.busy=true;render();
  let g=0;while(!G.over&&g++<12){const c=ttAIChoose(1);if(!c)break;
    if(c.k==="play")ttPlay(1,c.hi,{red:c.red});else if(c.k==="susp")ttSuspend(1,c.uid);else ttEvent(1,c.ev);render();await wait(650)}
  G.busy=false;if(!G.over)ttEndTurn();render()}

// ---- referto a due bracci ----
function ttReferto(w,msg,prize){const pr=ttProfile();const [A,B]=G.p;
  const row=(l,a,b)=>`<tr><th>${l}</th><td>${a}</td><td>${b}</td></tr>`;
  const causes=P=>Object.entries(P.aeLog).sort((x,y)=>y[1]-x[1]).map(([c,n])=>`${c}: ${n}`).join("<br>")||"nessuno";
  const used=new Set();[A,B].forEach(P=>Object.keys(P.aeLog).forEach(c=>{const k=RISK2INT[c.split(" (")[0]]||RISK2INT[c];if(k)used.add(k)}));
  return `<div class="overlay"><div class="box referto">
    <span class="rf-k">Referto del trial · ${pr.who}, ${pr.age} anni · ${pr.dxl}</span>
    <h3>${w===0?"Vince il tuo braccio":w===1?"Vince il braccio B":"Pareggio"}</h3>
    <p>${msg} Ricevi <b>${prize} crediti ECM</b>.</p>
    <table class="rf-tab"><thead><tr><th></th><th>Braccio A (tu)</th><th>Braccio B</th></tr></thead><tbody>
      ${row("Risposta terapeutica",A.cure,B.cure)}${row("Eventi avversi",A.ae,B.ae)}${row("Beneficio netto",A.cure-A.ae,B.cure-B.ae)}
      ${row("Prescrizioni",A.st.rx,B.st.rx)}${row("Controindicazioni violate",A.st.ci,B.st.ci)}${row("Sospensioni",A.st.susp,B.st.susp)}
      ${row("Avvisi seguiti / ignorati",`${A.st.avoided} / ${A.st.over}`,"")}
      ${row("Cause degli eventi avversi",causes(A),causes(B))}
    </tbody></table>
    <p class="meta">Strategia attesa per questo paziente: ${pr.hint}</p>
    ${used.size?`<dl><div><dt>Le interazioni comparse e le loro fonti</dt><dd><ul class="rf-ints">${[...used].map(k=>{const d=CARDS[k];return `<li><b>${d.n}</b><br><span>${d.f}</span>${(d.q||[]).map(q=>quote(Q[q].q,Q[q].s)).join("")}</li>`}).join("")}</ul></dd></div></dl>`:""}
    <p class="meta">Prototipo: valori e regole sono scelte di gioco da tarare, non indicazioni cliniche.</p>
    <div class="row" style="margin-top:14px"><button class="btn primary" data-ov="ttagain">Nuovo trial</button><button class="btn" data-ov="menu">Scheda tecnica</button></div></div></div>`}

// ---- schermata ----
function ttEvCard(e){return `<div class="evcard"><div class="band"></div><div class="in"><div class="top"><div><b class="n">${e.n}</b><span class="t">evento clinico</span></div><span class="c">${e.c}</span></div><p>${e.txt}</p><p class="teach">${e.teach}</p></div></div>`}
function ttUnitBadge(P,u){const b=[];if(u.pre)b.push("in corso");if(u.spec)b.push("specialista");if(u.red)b.push("dose ridotta");if(ttIsCI(u.id))b.push("controindicato");else if(!isIndicated(u.id,fieldDis())&&!ANTIBIO(D(u)))b.push("non indicato");return b.join(" · ")}
function renderTT(){
  const pr=ttProfile(),me=G.p[0],ai=G.p[1];const myTurn=G.turn===0&&!G.busy&&!G.over;
  G.pw=G.pw||[[0,0],[0,0]];
  const strip=(P,i)=>{const cp=Math.min(100,P.cure/TT.CURE*100),ap=Math.min(100,P.ae/TT.AE*100);const [pc,pa]=G.pw[i];G.pw[i]=[cp,ap];
    const fxs=[P.fx.aki>0?`IRA ${P.fx.aki} turni`:"",P.fx.inf>0?`infezione: antibiotico entro ${P.fx.inf}`:"",P.fx.dehyd>0?`disidratazione ${P.fx.dehyd}`:"",P.fx.skip?"un farmaco non assunto":""].filter(Boolean);
    return `<div class="hero strip tt" data-side="${i}">
      <span class="who">${i?"Braccio B":"Braccio A"}</span>
      <span class="meter cm"><small>Risposta <b>${P.cure}</b>/${TT.CURE}</small><span class="bar"><i class="cure" style="width:${pc}%" data-to="${cp}%"></i></span></span>
      <span class="meter ae"><small>Avversi <b>${P.ae}</b>/${TT.AE}</small><span class="bar"><i class="low" style="width:${pa}%" data-to="${ap}%"></i></span></span>
      <span class="stackrow"><span>turno ${P.turns}/${TT.TURNS}</span></span>
      <span class="dose">${i?`<span class="evcount">${P.evh.length} eventi in mano</span>`:`${Array.from({length:P.max},(_,k)=>`<i class="${k<P.dose?"on":""}"></i>`).join("")}<span>${P.dose}/${P.max} dosi</span>`}</span>
      <span class="recs">${fxs.map(x=>`<span class="warnchip">${x}</span>`).join("")}${P.recs.map(r=>`<button class="recchip" data-detail="${r}">${RECN[CARDS[r].tag]||CARDS[r].n}</button>`).join("")}</span>
    </div>`};
  const row=(P,i)=>P.board.length?P.board.map(u=>cardHTML(D(u),"board",{unit:u,eff:effAtk(u,P)-(u.red?1:0),ind:isIndicated(u.id,fieldDis()),badge:ttUnitBadge(P,u),btn:i===0,extra:(i===0&&G.sel&&G.sel.k==="unit"&&G.sel.uid===u.uid?"sel":"")+(u.uid===P.fx.skip?" dim":""),attrs:`data-ttu="${i===0?u.uid:""}" data-cid="${u.id}" data-unit="${u.uid}" data-side="${i}"`})).join(""):`<span class="empty">${i?"Il braccio B non ha ancora prescritto":"Nessun farmaco in terapia"}</span>`;
  const pv=ttAEpreview(me);
  const k=me.hand.length,sel=G.sel;let prev="";
  if(sel&&sel.k==="hand"&&me.hand[sel.hi]){const hi=sel.hi,d=CARDS[me.hand[hi]];const why=myTurn?ttCanPlay(0,hi):"non è il tuo turno";
    const notes=[];const ci=ttIsCI(d.id),adj=d.type==="drug"?ttAdj(me,d.id):"";
    if(ci)notes.push(`<p class="ci"><strong>Controindicato in questo paziente</strong>: ${ci}. Prescriverlo dà +3 eventi avversi subito e +1 a ogni turno.</p>`);
    if(adj)notes.push(`<p><strong>Dose da adattare</strong>: ${adj}. Dose ridotta = −1 efficacia; dose piena = +1 evento avverso a turno.</p>`);
    let rx=[];if(d.type==="drug"&&!why){rx=rxAlert(d.id);rx.forEach(a=>notes.push(`<p><strong>${d.n}${a.partners.length?" + "+a.partners.join(", "):""}</strong>: ${a.r}. Ogni turno +${(RISK_AE[a.r]||1)*(pr.x2.includes(a.r)?2:1)} eventi avversi finché resta in terapia.</p>`))}
    if(d.type==="drug"&&!isIndicated(d.id,fieldDis())&&!ANTIBIO(d))notes.push(`<p>Non indicato per ${CARDS[pr.dis].n.toLowerCase()}: non darà risposta terapeutica.</p>`);
    if(d.type==="drug"&&ANTIBIO(d)&&me.fx.inf>0)notes.push(`<p>Tratta l'infezione in corso.</p>`);
    else if(d.type==="drug"&&ANTIBIO(d))notes.push(`<p>Antibiotico: serve solo se compare un'infezione. Ora non dà risposta terapeutica.</p>`);
    G.rxShown=rx.length>0||!!ci;
    const btns=why?`<button class="btn primary" disabled>${why.charAt(0).toUpperCase()+why.slice(1)}</button>`:adj?`<button class="btn primary" data-ttplay="${hi}" data-red="1">Dose ridotta</button><button class="btn" data-ttplay="${hi}">Dose piena</button>`:`<button class="btn primary" data-ttplay="${hi}" ${rx.length||ci?'data-override="1"':""}>${rx.length||ci?"Prescrivi comunque":d.type==="drug"?`Prescrivi · ${d.from?d.ec:d.c} dosi`:`Gioca · ${d.c} dosi`}</button>`;
    prev=`<div class="hp-back" data-hclose="1"></div><div class="handpreview${notes.length?" alert":""}">${cardHTML(d,"hand",{ind:isIndicated(d.id,fieldDis())})}${notes.length?`<div class="rxalert${ci?" ci":""}" role="alert"><b>${ci?"Controindicazione":rx.length?"Avviso di prescrizione":"Nota"}</b>${notes.join("")}</div>`:""}<div class="row">${btns}<button class="btn" data-hclose="1">${rx.length||ci?"Non prescrivere":"Chiudi"}</button></div></div>`}
  if(sel&&sel.k==="unit"){const u=me.board.find(x=>x.uid===sel.uid);if(u){const why=!myTurn?"non è il tuo turno":me.dose<1?"serve 1 dose":"";
    const inRisk=pv.L.filter(([c])=>c.includes(D(u).n)||risks(me).some(r=>c===r));
    prev=`<div class="hp-back" data-hclose="1"></div><div class="handpreview alert">${cardHTML(D(u),"hand",{ind:isIndicated(u.id,fieldDis())})}<div class="rxalert"><b>In terapia</b><p>${ttUnitBadge(me,u)||"indicato"}${isIndicated(u.id,fieldDis())?` · dà ${Math.max(0,effAtk(u,me)-(u.red?1:0))} di risposta a turno`:""}.</p><p>Sospendere costa 1 dose. Il farmaco torna tra i sospesi.</p></div><div class="row"><button class="btn primary" data-ttsusp="${u.uid}" ${why?"disabled":""}>${why?why.charAt(0).toUpperCase()+why.slice(1):"Sospendi · 1 dose"}</button><button class="btn" data-hclose="1">Chiudi</button></div></div>`}}
  if(sel&&sel.k==="ev"&&me.evh[sel.k2]!=null){const e=EVC[me.evh[sel.k2]];const why=myTurn?ttEvCan(0,sel.k2):"non è il tuo turno";
    prev=`<div class="hp-back" data-hclose="1"></div><div class="handpreview evp">${ttEvCard(e)}<div class="row"><button class="btn primary" data-ttev="${sel.k2}" ${why?"disabled":""}>${why?why.charAt(0).toUpperCase()+why.slice(1):`Gioca sul braccio B · ${e.c} dosi`}</button><button class="btn" data-hclose="1">Chiudi</button></div></div>`}
  app.innerHTML=`<div class="duel arena tt">
    <div class="duelbar"><button class="btn" id="tomenu" aria-label="Torna al menu">‹ Menu</button><span class="turnchip ${G.over?"":myTurn?"me":"ai"}">${G.over?"Trial concluso":G.turn===0?"Tocca a te":"Turno del braccio B"}</span><button class="btn ghost" id="quit">${G.over?"Chiudi":"Abbandona"}</button></div>
    ${strip(ai,1)}
    <div class="boardrow rival" style="--n:${Math.max(1,ai.board.length)}">${row(ai,1)}</div>
    <div class="patient ward">
      <div class="chart"><span class="lbl">Stesso profilo nei due bracci · letto ${pr.bed}</span><b>${pr.who}, ${pr.age} anni</b><span class="dx">${pr.dxl}</span><span class="facts">${pr.facts.map(([c,t])=>`<span class="f ${c}">${t}</span>`).join("")}</span></div>
      <button class="condtile card" data-detail="${pr.dis}" data-cid="${pr.dis}" aria-label="Dettagli ${CARDS[pr.dis].n}"><span class="ct-art">${g(CARDS[pr.dis])}</span><span class="ct-l">diagnosi</span></button>
      <div class="logline" aria-live="polite">${G.busy?"Turno del braccio B… ":""}${G.log}</div>
    </div>
    <div class="boardrow mine" style="--n:${Math.max(1,me.board.length)}">${row(me,0)}</div>
    ${pv.n?`<div class="riskbar"><b>Al tuo prossimo turno: +${pv.n} eventi avversi</b><span>${pv.L.map(([c,n])=>`${c} (+${n})`).join(" · ")}</span></div>`:`<div class="riskbar ok"><b>Nessun rischio attivo nella tua terapia</b></div>`}
    ${strip(me,0)}
    <div class="evrow">${me.evh.length?`<span class="evl">Eventi da giocare sul braccio B</span>${me.evh.map((id,k)=>`<button class="evchip" data-tte="${k}">${EVC[id].n} · ${EVC[id].c}</button>`).join("")}`:`<span class="evl">Nessun evento in mano</span>`}</div>
    <div class="trayrow">
      <div class="tray"><div class="hand">${me.hand.map((id,hi)=>{const d=CARDS[id];const w=myTurn?ttCanPlay(0,hi):"non è il tuo turno";
        return cardHTML(d,"hand",{btn:true,ind:isIndicated(id,fieldDis()),extra:(w?"dim":"playable")+(sel&&sel.k==="hand"&&sel.hi===hi?" picked":"")+(ttIsCI(id)?" ci":""),attrs:`data-tthand="${hi}" data-cid="${id}" title="${d.n}"`})}).join("")}</div></div>
      <div class="fab"><button class="btn primary" id="ttend" ${myTurn?"":"disabled"}>Fine turno</button></div>
    </div>
    ${prev}
  </div>`;
  document.getElementById("tomenu").onclick=()=>{if(G.over){G=null}else{duelHidden=true}tab="menu";render()};
  document.getElementById("quit").onclick=()=>{if(G.over){G=null;render();return}const q=document.getElementById("quit");if(q.dataset.sure){G.p[0].ae=TT.AE;ttCheck()}else{q.dataset.sure=1;q.textContent="Confermi? Conta come sconfitta"}};
  applyFx();
}
app.addEventListener("click",e=>{
  if(!G||!G.tt||tab!=="duello"||duelHidden)return;
  const t=e.target;
  if(t.closest("[data-hclose]")){if(G.rxShown&&G.sel&&G.sel.k==="hand")G.p[0].st.avoided++;G.rxShown=false;G.sel=null;render();return}
  if(t.closest("#ttend")){if(G.turn!==0||G.busy||G.over)return;G.sel=null;ttEndTurn();render();return}
  const pl=t.closest("[data-ttplay]");if(pl){if(G.turn!==0||G.busy||G.over)return;if(pl.dataset.override)G.p[0].st.over++;const hi=+pl.dataset.ttplay;G.sel=null;G.rxShown=false;ttPlay(0,hi,{red:!!pl.dataset.red});render();return}
  const su=t.closest("[data-ttsusp]");if(su){if(G.turn!==0||G.busy||G.over)return;G.sel=null;ttSuspend(0,+su.dataset.ttsusp);render();return}
  const ev=t.closest("[data-ttev]");if(ev){if(G.turn!==0||G.busy||G.over)return;G.sel=null;ttEvent(0,+ev.dataset.ttev);render();return}
  const h=t.closest("[data-tthand]");if(h){const hi=+h.dataset.tthand;G.sel=G.sel&&G.sel.k==="hand"&&G.sel.hi===hi?null:{k:"hand",hi};render();return}
  const u=t.closest("[data-ttu]");if(u&&u.dataset.ttu){const uid=+u.dataset.ttu;G.sel=G.sel&&G.sel.k==="unit"&&G.sel.uid===uid?null:{k:"unit",uid};render();return}
  const ec=t.closest("[data-tte]");if(ec){const k=+ec.dataset.tte;G.sel={k:"ev",k2:k};render();return}
});
