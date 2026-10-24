// =================== LEZIONI (schede interattive) ===================
// Ogni lezione è un elenco di schede: text, predict (prevedi e scopri), check (domanda che vale punteggio),
// widget (grafico con cursore e obiettivo), summary (appunti). Testi da rivedere da Andrea prima della pubblicazione.
// Le curve sono illustrative: forme corrette, valori non tratti da studi.
const LZ_LESSONS=[
{id:"l_fd1",title:"Recettori e curva dose-risposta",area:"Farmacodinamica",mins:7,color:"sky",icon:"target",free:true,reward:"r_mu",
 steps:[
  {t:"text",h:"Legarsi non basta",cards:["morfina","naloxone"],
   b:"Un farmaco agisce quando si lega a un bersaglio, spesso un recettore. Ma legarsi e attivare sono due cose diverse. L'<b>affinità</b> dice quanto il farmaco si lega; l'<b>efficacia</b> dice quanto attiva il recettore una volta legato.",
   note:"Morfina e naloxone si legano allo stesso recettore µ-oppioide. La morfina lo attiva, il naloxone no."},
  {t:"predict",h:"Più dose, più effetto?",q:"Se raddoppi la dose di morfina, l'effetto raddoppia sempre?",
   o:[["a","Sì, sempre"],["b","Solo finché la risposta non si avvicina al suo massimo"],["c","No, si dimezza"]],ok:"b",
   why:"A dosi basse l'effetto cresce in fretta; poi la curva si appiattisce perché la risposta ha un massimo. Con la dose in scala logaritmica la curva prende la forma di una S."},
  {t:"widget",w:"ec50",h:"Trova l'EC50",b:"Muovi la dose finché l'effetto arriva a metà del massimo.",
   done:"Eccola. La dose che dà il 50% dell'effetto massimo (Emax) si chiama <b>EC50</b> ed è una misura della <b>potenza</b>: più è bassa, più il farmaco è potente."},
  {t:"widget",w:"partial",h:"Agonista pieno e agonista parziale",cards:["buprenorfina"],b:"Morfina e buprenorfina attivano entrambe il recettore µ. Porta la dose al massimo e guarda dove arriva ciascuna.",
   done:"La buprenorfina si ferma più in basso anche a dosi alte: è un <b>agonista parziale</b>, con efficacia massima minore. Ha però un'affinità alta, quindi è attiva già a dosi basse. Da qui viene l'«effetto tetto» sulla depressione respiratoria."},
  {t:"predict",h:"Arriva l'antagonista",q:"Aggiungi naloxone alla morfina. Che cosa succede alla curva della morfina?",
   o:[["a","Si abbassa: la morfina non arriva più al massimo"],["b","Si sposta a destra: serve più morfina per lo stesso effetto"],["c","Non cambia"]],ok:"b",
   why:"Il naloxone è un <b>antagonista competitivo</b>: occupa lo stesso sito senza attivarlo. Con abbastanza morfina lo si scavalca, quindi la curva trasla a destra senza perdere il massimo."},
  {t:"widget",w:"antag",h:"Guarda lo spostamento",b:"Aumenta l'antagonista e guarda la curva della morfina; la linea tratteggiata è la curva senza antagonista. Poi prova l'antagonista non competitivo.",
   done:"Con l'antagonista competitivo la curva va a destra e il massimo resta. Con un antagonista <b>non competitivo</b> il massimo si abbassa e nessuna dose di agonista lo recupera."},
  {t:"widget",w:"potency",h:"Potenza ed efficacia",cards:["fentanil"],b:"Fentanil e morfina sono agonisti pieni. Trova una dose a cui il fentanil supera il 90% dell'effetto e la morfina resta sotto il 10%.",
   done:"Il fentanil arriva al massimo con dosi molto più basse: è più <b>potente</b>. Ma il massimo è lo stesso, quindi l'<b>efficacia</b> è uguale. «Più potente» non vuol dire «più efficace»."},
  {t:"predict",h:"Il caso",cards:["naloxone"],q:"Il Sig. M., 54 anni, arriva in pronto soccorso sonnolento, con 6 atti respiratori al minuto e pupille a punta di spillo: ha preso un oppioide a lunga durata. Dopo il naloxone si sveglia e respira bene. Dopo 20 minuti chiede di andare a casa. Che cosa fai?",
   o:[["a","Lo dimetti: il naloxone ha funzionato"],["b","Lo tieni in osservazione: il naloxone può smettere di agire prima dell'oppioide"],["c","Gli dai subito una dose di morfina per il dolore"]],ok:"b",
   why:"L'effetto del naloxone può durare meno di quello dell'oppioide, soprattutto con le formulazioni a lunga durata: la depressione respiratoria può tornare. Il paziente va osservato e, se serve, il naloxone va ripetuto."},
  {t:"check",h:"Ripasso 1 di 3",q:"Che cosa misura l'EC50?",o:[["a","La potenza: la dose che dà metà dell'effetto massimo"],["b","L'efficacia massima del farmaco"],["c","La durata d'azione"]],ok:"a",
   why:"L'EC50 è la concentrazione che produce il 50% dell'Emax; l'efficacia è l'Emax stesso."},
  {t:"check",h:"Ripasso 2 di 3",q:"Rispetto alla morfina, la buprenorfina è…",o:[["a","Un antagonista puro"],["b","Un agonista parziale, con un effetto massimo minore"],["c","Un agonista pieno più efficace"]],ok:"b",
   why:"Agonista parziale: anche saturando i recettori non raggiunge l'effetto massimo dell'agonista pieno."},
  {t:"check",h:"Ripasso 3 di 3",q:"Un antagonista competitivo, in presenza di più agonista…",o:[["a","Sposta la curva a destra, ma l'effetto massimo si può ancora raggiungere"],["b","Abbassa per sempre l'effetto massimo"],["c","Aumenta la potenza dell'agonista"]],ok:"a",
   why:"La competizione per lo stesso sito si vince aumentando la concentrazione di agonista."},
  {t:"summary",h:"Appunti",pts:[
   "<b>Affinità</b>: quanto un farmaco si lega al recettore. <b>Efficacia</b>: quanto lo attiva una volta legato.",
   "La curva dose-risposta, con la dose in scala logaritmica, è una S: cresce e poi raggiunge un massimo (<b>Emax</b>).",
   "<b>EC50</b>: dose che dà metà dell'Emax. Misura la <b>potenza</b>: EC50 più bassa, farmaco più potente.",
   "<b>Agonista pieno</b> (morfina, fentanil): raggiunge l'Emax. <b>Agonista parziale</b> (buprenorfina): si ferma più in basso anche a dosi alte.",
   "<b>Antagonista competitivo</b> (naloxone): sposta la curva a destra, l'Emax resta raggiungibile. <b>Non competitivo</b>: abbassa l'Emax.",
   "Potenza ed efficacia sono cose diverse: il fentanil è più potente della morfina, non più efficace.",
   "Il naloxone può durare meno dell'oppioide: dopo la risposta il paziente va osservato."],
   cards:["morfina","buprenorfina","fentanil","naloxone"],
   src:"Curve illustrative: la forma segue il modello di Hill, i valori non vengono da studi. Testo da rivedere su un manuale di riferimento (per esempio Rang & Dale o Goodman & Gilman) e sugli RCP di naloxone e buprenorfina."}
 ]},
{id:"l_fk1",title:"Emivita e stato stazionario",area:"Farmacocinetica",mins:7,color:"teal",icon:"repeat",free:true,soon:1},
{id:"l_int",title:"Interazioni: il CYP3A4 e l'indice terapeutico",area:"Interazioni",mins:6,color:"red",icon:"pair",soon:1,unlock:"Coppie pericolose: almeno 20 crediti in una sessione"},
{id:"l_ana",title:"Analgesici e NNT",area:"Analgesici",mins:6,color:"plum",icon:"pill",soon:1,unlock:"Indicazioni: almeno 7 su 10"},
{id:"l_emo",title:"La cascata della coagulazione",area:"Emostasi",mins:7,color:"red",icon:"target",soon:1,unlock:"Bersagli: almeno 7 su 10"}
];
let LZ=null;
const lzSt=()=>{S.lz=S.lz||{};return S.lz};
// modello di Hill (n=1): effetto % con agonista di efficacia emax, EC50 ec; antagonista competitivo cmp (multipli di Ki) o non competitivo ncp
const hill=(d,emax,ec,cmp=0,ncp=0)=>emax/(1+ncp)*d/(d+ec*(1+cmp));
const LX=[-2,3]; // log10 della dose, unità relative
function drSVG(curves,marks,extra=""){
  const W=320,H=190,L=34,R=8,T=10,B=28,x=v=>L+(v-LX[0])/(LX[1]-LX[0])*(W-L-R),y=e=>T+(1-e/100)*(H-T-B);
  let s=`<svg viewBox="0 0 ${W} ${H}" class="dr" role="img" aria-label="Curva dose-risposta">`;
  for(let e=0;e<=100;e+=25)s+=`<line x1="${L}" x2="${W-R}" y1="${y(e)}" y2="${y(e)}" class="gl"/><text x="${L-6}" y="${y(e)+3}" class="ax" text-anchor="end">${e}</text>`;
  for(let v=LX[0];v<=LX[1];v++)s+=`<text x="${x(v)}" y="${H-12}" class="ax" text-anchor="${v===LX[1]?"end":v===LX[0]?"start":"middle"}">${v<0?"1/"+Math.pow(10,-v):Math.pow(10,v)}</text>`;
  s+=`<text x="${(L+W-R)/2}" y="${H-1}" class="axt" text-anchor="middle">dose (scala logaritmica, unità relative)</text>`;
  s+=extra;
  curves.forEach(c=>{let p="";for(let i=0;i<=120;i++){const v=LX[0]+i/120*(LX[1]-LX[0]);p+=(i?"L":"M")+x(v).toFixed(1)+","+y(hill(Math.pow(10,v),c.emax,c.ec,c.cmp||0,c.ncp||0)).toFixed(1)}
    s+=`<path d="${p}" class="cv${c.dash?" dash":""}" style="stroke:${c.col}"/>`;
    if(c.lab){const lv=Math.log10(c.ec*(1+(c.cmp||0))),hy=c.emax/(1+(c.ncp||0))/2;s+=`<text x="${Math.max(L+26,Math.min(x(lv)+8,W-R-60))}" y="${y(hy)+4}" class="lb" style="fill:${c.col}">${c.lab}</text>`}});
  marks.forEach(m=>{s+=`<line x1="${x(m.v)}" x2="${x(m.v)}" y1="${T}" y2="${H-B}" class="mk"/><circle cx="${x(m.v)}" cy="${y(m.e)}" r="6" style="fill:${m.col}" class="pt"/>`});
  return s+"</svg>"}
const COL={mor:"#3569AA",bup:"#C98A1E",fen:"#7E519C",nal:"#C8553D"};
function lzWidget(st){
  const v=LZ.v??(st.w==="antag"?0:-1.5),f=x=>Math.round(x);
  if(st.w==="ec50"){const d=Math.pow(10,v),e=hill(d,100,1);LZ.goal=Math.abs(e-50)<=3;
    return {svg:drSVG([{emax:100,ec:1,col:COL.mor,lab:"morfina"}],[{v,e,col:COL.mor}],`<line x1="34" x2="312" y1="${10+0.5*152}" y2="${10+0.5*152}" class="half"/>`),
      read:`Effetto: <b>${f(e)}%</b> dell'Emax`,slider:{min:-2,max:3,step:.01,val:v,lab:"Dose di morfina"}}}
  if(st.w==="partial"){const d=Math.pow(10,v),em=hill(d,100,1),eb=hill(d,45,.15);LZ.goal=v>=2.4;
    return {svg:drSVG([{emax:100,ec:1,col:COL.mor,lab:"morfina"},{emax:45,ec:.15,col:COL.bup,lab:"buprenorfina"}],[{v,e:em,col:COL.mor},{v,e:eb,col:COL.bup}]),
      read:`Morfina <b>${f(em)}%</b> · Buprenorfina <b>${f(eb)}%</b>`,slider:{min:-2,max:3,step:.01,val:v,lab:"Dose"}}}
  if(st.w==="antag"){const a=Math.pow(10,LZ.v??0)-1,nc=!!LZ.nc;LZ.seen=LZ.seen||{};if(a>=9)LZ.seen[nc?"nc":"c"]=1;LZ.goal=LZ.seen.c&&LZ.seen.nc;
    const c=nc?{emax:100,ec:1,ncp:a,col:COL.mor,lab:"morfina + antagonista"}:{emax:100,ec:1,cmp:a,col:COL.mor,lab:"morfina + naloxone"};
    return {svg:drSVG([{emax:100,ec:1,col:"#9A8E77",dash:1},c],[]),
      read:nc?`Antagonista non competitivo: effetto massimo <b>${f(100/(1+a))}%</b>`:`Naloxone: serve <b>${f(1+a)} volte</b> più morfina per lo stesso effetto`,
      slider:{min:0,max:1.5,step:.01,val:LZ.v??0,lab:nc?"Antagonista non competitivo":"Naloxone"},toggle:nc?"Torna al naloxone (competitivo)":"Prova un antagonista non competitivo"}}
  if(st.w==="potency"){const d=Math.pow(10,v),ef=hill(d,100,.005),em=hill(d,100,1);LZ.goal=ef>=90&&em<=10;
    return {svg:drSVG([{emax:100,ec:.005,col:COL.fen,lab:"fentanil"},{emax:100,ec:1,col:COL.mor,lab:"morfina"}],[{v,e:ef,col:COL.fen},{v,e:em,col:COL.mor}]),
      read:`Fentanil <b>${f(ef)}%</b> · Morfina <b>${f(em)}%</b>`,slider:{min:-2,max:3,step:.01,val:v,lab:"Dose"}}}
}
const lzCards=ids=>ids&&ids.length?`<div class="lz-cards">${ids.filter(i=>CARDS[i]).map(i=>`<button class="qthumb" data-detail="${i}" aria-label="Apri la scheda di ${CARDS[i].n}"><span class="cell">${cardHTML(CARDS[i],"full",{extra:"tcg"})}</span><span class="qlink">${ic("info")} ${CARDS[i].n}</span></button>`).join("")}</div>`:"";
function lzWidgetInner(st){const W=lzWidget(st);
  return `<div class="lz-plot">${W.svg}</div><p class="lz-read">${W.read}</p>
    <label class="lz-sl"><span>${W.slider.lab}</span><input type="range" id="lzr" min="${W.slider.min}" max="${W.slider.max}" step="${W.slider.step}" value="${W.slider.val}"></label>
    ${W.toggle?`<button class="btn" data-lz="tog">${W.toggle}</button>`:""}
    ${LZ.goal?`<div class="lz-ok">${ic("check")}<span>${st.done}</span></div>`:""}`}
function lzStepHTML(){
  const L=LZ.les,st=L.steps[LZ.i],n=L.steps.length;
  let body="",foot="";
  if(st.t==="text"){body=`<p class="lz-b">${st.b}</p>${lzCards(st.cards)}${st.note?`<p class="note">${st.note}</p>`:""}`;
    foot=`<button class="btn primary big" data-lz="next">Continua</button>`}
  else if(st.t==="widget"){body=`<p class="lz-b">${st.b}</p><div id="lzw" class="lz-w">${lzWidgetInner(st)}</div>${lzCards(st.cards)}`;
    foot=`<button class="btn primary big" id="lzgo" data-lz="next" ${LZ.goal?"":"disabled"}>Continua</button>`}
  else if(st.t==="predict"||st.t==="check"){const a=LZ.ans,L4="ABC";
    body=`${st.t==="predict"?`<p class="lz-tag">${ic("info")} Prevedi, poi scopri</p>`:""}<p class="lz-b">${st.q}</p>${lzCards(st.cards)}<div class="opts lz-opts">${st.o.map(([id,l],j)=>{let c="opt";if(a){if(id===st.ok)c+=" good";else if(id===a)c+=" bad";else c+=" dim"}else if(id===LZ.sel)c+=" sel";
      return `<button class="${c}" data-lzo="${id}" ${a?"disabled":""}><span class="L">${a&&id===st.ok?ic("check"):L4[j]}</span><span class="ot">${l}</span></button>`}).join("")}</div>`;
    if(a){const good=a===st.ok;return lzFrame(body,`<div class="qz-foot ${good?"good":"bad"}"><div class="in"><div class="fb-h"><span class="badge">${ic(good?"check":"x")}</span>${good?"Esatto!":st.t==="predict"?"Era una previsione: ecco come va":"Non proprio."}</div><div class="fb-t">${st.why}</div><button class="btn big ${good?"primary":"red"}" data-lz="next">Continua</button></div></div>`)}
    foot=`<button class="btn primary big" data-lz="check" ${LZ.sel?"":"disabled"}>Verifica</button>`}
  else if(st.t==="summary"){const sc=LZ.score;
    body=`<ul class="lz-sum">${st.pts.map(p=>`<li>${p}</li>`).join("")}</ul>${lzCards(st.cards)}<p class="note">${st.src}</p>`;
    foot=`<button class="btn primary big" data-lz="finish">Termina la lezione</button>`}
  return lzFrame(body,`<div class="qz-foot"><div class="in">${foot}</div></div>`)}
function lzFrame(body,foot){const L=LZ.les,st=L.steps[LZ.i],n=L.steps.length;
  return `<div class="qz lz"><div class="qz-top"><button class="qz-x" data-lz="exit" aria-label="Esci">${ic("x")}</button><div class="lz-seg">${L.steps.map((s,j)=>`<i class="${j<LZ.i?"on":j===LZ.i?"cur":""}"></i>`).join("")}</div><span class="qz-n">${LZ.i+1}/${n}</span></div>
    <div class="qz-body"><p class="qz-kick">${L.area}</p><h2 class="lz-h">${st.h}</h2>${body}</div>${foot}</div>`}
function lzListHTML(){
  const D=lzSt();
  const tile=L=>{const d=D[L.id],lock=!L.free&&!d,col=L.color;
    return `<button class="tile lz-tile${L.soon?" soon":""}" ${L.soon?"disabled":`data-lz="open" data-id="${L.id}"`} style="--tc:var(--${col});--tl:var(--${col}-l)"><span class="ico">${ic(L.icon)}</span><span class="tb"><b>${L.title}</b><span>${L.area} · ${L.mins} minuti</span>
      <small>${L.soon?(L.unlock?`In preparazione · si aprirà con ${L.unlock}`:"In preparazione · gratuita"):d?`Completata · ${d.best}/3 al ripasso · appunti disponibili`:"Gratuita · completala per una carta e fino a 30 crediti"}</small></span><span class="go">${ic(d&&!L.soon?"check":"arrow")}</span></button>
      ${d&&!L.soon?`<button class="lnk lz-notes" data-lz="notes" data-id="${L.id}">Rivedi gli appunti</button>`:""}`};
  return `<div class="home"><p class="hello">Lezioni</p><h2 class="sec">Impara con le mani</h2><p class="sub">Lezioni brevi a schede: prevedi, muovi i cursori, guarda cosa succede. Alla fine restano gli appunti.</p>${LZ_LESSONS.map(tile).join("")}</div>`}
function lzNotesHTML(L){const st=L.steps.find(s=>s.t==="summary");
  return `<div class="home"><button class="lnk" data-lz="list">‹ Tutte le lezioni</button><p class="hello">${L.area}</p><h2 class="sec">${L.title}: appunti</h2><ul class="lz-sum">${st.pts.map(p=>`<li>${p}</li>`).join("")}</ul>${lzCards(st.cards)}<p class="note">${st.src}</p>
    <button class="btn primary" data-lz="open" data-id="${L.id}">Rifai la lezione</button></div>`}
function lzDoneHTML(){const L=LZ.les,r=LZ.reward;
  return `<div class="done"><div class="burst">${SPRIG}</div><p class="qz-kick">${L.area}</p><h2 class="sec">Lezione completata!</h2>
    ${r.got?`<div class="won">+${r.got}<span>crediti</span></div>`:""}
    <div class="done-l"><div class="stats"><div class="stat"><b>${LZ.score}/3</b><span>ripasso finale</span></div><div class="stat"><b>${L.steps.length}</b><span>schede</span></div></div>
    ${r.card?`<p>Nuova carta nel tuo Armadio:</p>${lzCards([r.card])}`:"<p>I crediti e la carta si ricevono solo la prima volta. Gli appunti restano qui.</p>"}</div></div>
    <div class="qz-foot"><div class="in btns"><button class="btn primary big" data-lz="list">Continua</button><button class="btn big" data-lz="notes" data-id="${L.id}">Vedi gli appunti</button></div></div>`}
function renderLez(){
  if(!LZ||LZ.view==="list")app.innerHTML=lzListHTML();
  else if(LZ.view==="notes")app.innerHTML=lzNotesHTML(LZ.les);
  else if(LZ.view==="done")app.innerHTML=lzDoneHTML();
  else app.innerHTML=lzStepHTML()}
function lzOpen(id){const L=LZ_LESSONS.find(x=>x.id===id);LZ={les:L,i:0,view:"run",score:0};tab="lez";render();window.scrollTo(0,0)}
function lzNext(){LZ.i++;LZ.sel=null;LZ.ans=null;LZ.v=undefined;LZ.goal=false;LZ.nc=false;LZ.seen=null;render();window.scrollTo(0,0)}
function lzFinish(){const L=LZ.les,D=lzSt(),first=!D[L.id];let got=0,card=null;
  if(first){got=exAward(exReward(LZ.score/3),false);if(L.reward&&CARDS[L.reward]){S.col[L.reward]=(S.col[L.reward]||0)+1;card=L.reward}}
  D[L.id]={done:exToday(),best:Math.max(LZ.score,(D[L.id]||{}).best||0)};save();LZ.reward={got,card};LZ.view="done";sfx("cure");render();window.scrollTo(0,0)}
app.addEventListener("click",e=>{
  if(tab!=="lez")return;
  const b=e.target.closest("[data-lz],[data-lzo]");if(!b||b.disabled)return;
  if(b.dataset.lzo!==undefined){if(LZ.ans)return;LZ.sel=b.dataset.lzo;sfx("play");render();return}
  const k=b.dataset.lz;
  if(k==="open"){lzOpen(b.dataset.id);return}
  if(k==="list"||k==="exit"){LZ={view:"list"};render();window.scrollTo(0,0);return}
  if(k==="notes"){LZ={view:"notes",les:LZ_LESSONS.find(x=>x.id===b.dataset.id)};render();window.scrollTo(0,0);return}
  if(k==="next"){lzNext();return}
  if(k==="check"){const st=LZ.les.steps[LZ.i];LZ.ans=LZ.sel;const good=LZ.ans===st.ok;if(st.t==="check"&&good)LZ.score++;sfx(good?"cure":st.t==="check"?"hit":"play");render();return}
  if(k==="tog"){LZ.nc=!LZ.nc;LZ.v=0;const st=LZ.les.steps[LZ.i];document.getElementById("lzw").innerHTML=lzWidgetInner(st);return}
  if(k==="finish"){lzFinish();return}
});
app.addEventListener("input",e=>{
  if(tab!=="lez"||e.target.id!=="lzr")return;
  LZ.v=parseFloat(e.target.value);const st=LZ.les.steps[LZ.i];
  const W=lzWidget(st),box=document.getElementById("lzw");
  box.querySelector(".lz-plot").innerHTML=W.svg;box.querySelector(".lz-read").innerHTML=W.read;
  let ok=box.querySelector(".lz-ok");
  if(LZ.goal&&!ok){box.insertAdjacentHTML("beforeend",`<div class="lz-ok">${ic("check")}<span>${st.done}</span></div>`);sfx("heal")}
  const go=document.getElementById("lzgo");if(go)go.disabled=!LZ.goal;
});
