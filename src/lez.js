// =================== LEZIONI (schede interattive) ===================
// Ogni lezione è un elenco di schede: text, predict (prevedi e scopri), check (domanda che vale punteggio),
// widget (grafico con cursore e obiettivo), summary (appunti). Testi da rivedere da Andrea prima della pubblicazione.
// Le curve sono illustrative: forme corrette, valori non tratti da studi.
const LZ_LESSONS=[
{id:"l_basi",title:"Che cos'è un farmaco",area:"Le basi",mins:6,color:"green",icon:"pill",free:true,reward:"s_vane",
 steps:[
  {t:"theory",h:"Farmaco, principio attivo, medicinale",defs:[
    ["Farmaco","Una sostanza che, legandosi a un bersaglio dell'organismo, ne modifica una funzione. Si usa per prevenire, curare o diagnosticare una malattia."],
    ["Principio attivo","La sostanza del medicinale che produce l'effetto. Si indica con la denominazione comune internazionale, per esempio paracetamolo."],
    ["Eccipiente","Ogni altro componente del medicinale: dà forma, stabilità e sapore, o aiuta l'assorbimento, senza un effetto terapeutico voluto."],
    ["Medicinale","Il prodotto finito che arriva al paziente: principio attivo ed eccipienti, in una forma farmaceutica e a un dosaggio precisi."]],
   ex:{b:"Il paracetamolo è il principio attivo. «Tachipirina 500 mg compresse» è un medicinale: contiene 500 mg di paracetamolo più gli eccipienti della compressa.",cards:["paracetamolo"]}},
  {t:"predict",ph:"pratica",h:"Proviamo",q:"Tachipirina, Efferalgan e «Paracetamolo EG» sono tre medicinali. Quanti principi attivi diversi contengono?",
   o:[["a","Uno"],["b","Tre"],["c","Dipende dagli eccipienti"]],ok:"a",
   why:"Contengono tutti paracetamolo. Cambiano il nome, gli eccipienti e a volte la forma farmaceutica, non il principio attivo."},
  {t:"theory",h:"Nome commerciale ed equivalente",defs:[
    ["Denominazione comune internazionale","Il nome del principio attivo, uguale in tutto il mondo: paracetamolo, amoxicillina, ramipril."],
    ["Nome commerciale","Il nome scelto dall'azienda per il suo medicinale, per esempio Tachipirina."],
    ["Medicinale equivalente","Ha lo stesso principio attivo, alla stessa dose e nella stessa forma farmaceutica del medicinale di riferimento, e ne è stata dimostrata la bioequivalenza. Spesso si chiama con la denominazione comune seguita dal nome dell'azienda."]],
   ex:{b:"«Ramipril EG» e Triatec contengono entrambi ramipril: il primo è un equivalente, il secondo è il medicinale di riferimento.",cards:["ramipril"]}},
  {t:"match",h:"Abbina",b:"Tocca un elemento a sinistra e poi la definizione giusta a destra.",pairs:[["Paracetamolo","Principio attivo"],["Tachipirina","Nome commerciale"],["Amido di mais nella compressa","Eccipiente"],["Ramipril EG","Medicinale equivalente"]],
   done:"Tutto giusto. Ricordalo quando leggi una prescrizione: il nome sulla scatola può cambiare, il principio attivo no."},
  {t:"theory",h:"Farmacodinamica e farmacocinetica",defs:[
    ["Farmacodinamica","Che cosa fa il farmaco all'organismo: a quale bersaglio si lega e quale effetto produce."],
    ["Farmacocinetica","Che cosa fa l'organismo al farmaco: assorbimento, distribuzione, metabolismo ed eliminazione (in sigla ADME)."]],
   ex:{b:"L'ibuprofene inibisce le ciclossigenasi e riduce il dolore: è farmacodinamica. Viene assorbito dall'intestino, si lega alle proteine del plasma ed è metabolizzato dal fegato: è farmacocinetica.",cards:["ibuprofene"]}},
  {t:"predict",ph:"pratica",h:"Proviamo",q:"«Se il fegato funziona male, il warfarin viene eliminato più lentamente.» Di che cosa parla questa frase?",
   o:[["a","Di farmacodinamica"],["b","Di farmacocinetica"],["c","Di nessuna delle due"]],ok:"b",
   why:"Parla di metabolismo ed eliminazione, cioè di quello che l'organismo fa al farmaco: farmacocinetica."},
  {t:"theory",h:"I quattro bersagli principali",defs:[
    ["Recettore","Proteina che riconosce un messaggero dell'organismo, come un ormone o un neurotrasmettitore, e trasmette un segnale alla cellula."],
    ["Enzima","Proteina che accelera una reazione chimica; il farmaco di solito la blocca."],
    ["Canale ionico","Poro nella membrana che fa passare ioni come sodio, potassio o calcio."],
    ["Trasportatore","Proteina che sposta una molecola da un lato all'altro della membrana."]],
   ex:{b:"La morfina attiva un recettore, l'aspirina blocca un enzima, l'amlodipina chiude un canale ionico, la sertralina blocca un trasportatore.",cards:["morfina","aspirina","amlodipina","sertralina"]}},
  {t:"match",h:"Abbina",b:"Che tipo di bersaglio colpisce ciascun farmaco?",pairs:[["Metoprololo (β1)","Recettore"],["Atorvastatina (HMG-CoA reduttasi)","Enzima"],["Carbamazepina (canale del sodio)","Canale ionico"],["Furosemide (Na-K-2Cl)","Trasportatore"]],
   done:"Esatto. Quasi tutti i farmaci che incontrerai agiscono su uno di questi quattro tipi di bersaglio."},
  {t:"predict",ph:"caso",h:"Il caso",cards:["paracetamolo"],q:"La Sig.ra C., 29 anni, ha mal di testa. In casa trova Tachipirina e un «Paracetamolo» di un'altra azienda e pensa di prenderli tutti e due per fare prima. Che cosa le dici?",
   o:[["a","Va bene: sono due medicinali diversi"],["b","No: hanno lo stesso principio attivo e le dosi si sommano"],["c","Va bene se li prende a qualche minuto di distanza"]],ok:"b",
   why:"Il nome cambia, il principio attivo no. Due medicinali con paracetamolo sommano la dose e aumentano il rischio di danno al fegato."},
  {t:"check",h:"Ripasso 1 di 3",q:"Che cos'è un eccipiente?",o:[["a","Un componente senza effetto terapeutico voluto, che dà forma e stabilità al medicinale"],["b","Il principio attivo puro"],["c","Un farmaco di riserva"]],ok:"a",why:"Gli eccipienti servono alla forma farmaceutica, non all'effetto terapeutico."},
  {t:"check",h:"Ripasso 2 di 3",q:"Come il rene elimina un farmaco è un argomento di…",o:[["a","Farmacodinamica"],["b","Farmacocinetica"],["c","Farmacovigilanza"]],ok:"b",why:"L'eliminazione è la E di ADME."},
  {t:"check",h:"Ripasso 3 di 3",q:"L'amlodipina chiude i canali del calcio di tipo L. Che tipo di bersaglio è?",o:[["a","Un recettore"],["b","Un enzima"],["c","Un canale ionico"]],ok:"c",why:"È un poro di membrana che fa passare ioni calcio."},
  {t:"summary",h:"Appunti",pts:[
   "<b>Principio attivo</b>: la sostanza che produce l'effetto. <b>Eccipienti</b>: il resto. <b>Medicinale</b>: il prodotto finito, con forma e dosaggio.",
   "Lo stesso principio attivo può avere molti <b>nomi commerciali</b>; la <b>denominazione comune internazionale</b> è una sola.",
   "Il <b>medicinale equivalente</b> ha stesso principio attivo, dose e forma del riferimento ed è bioequivalente.",
   "<b>Farmacodinamica</b>: cosa fa il farmaco all'organismo. <b>Farmacocinetica</b>: cosa fa l'organismo al farmaco (ADME).",
   "I bersagli principali sono quattro: <b>recettori, enzimi, canali ionici, trasportatori</b>.",
   "Due medicinali con nomi diversi possono contenere lo stesso principio attivo: le dosi si sommano."],
   cards:["paracetamolo","ramipril","ibuprofene"],
   src:"Definizioni scritte per la lezione, da rivedere. Per il medicinale la definizione di legge è quella del D.Lgs. 219/2006, articolo 1; per l'equivalente vale lo stesso decreto. Da verificare sui testi originali prima di citarli."}
 ]},
{id:"l_fd1",title:"Recettori e curva dose-risposta",area:"Farmacodinamica",mins:10,color:"sky",icon:"target",req:"l_basi",reward:"r_mu",
 steps:[
  {t:"theory",h:"Ligando, agonista, antagonista",defs:[
    ["Ligando","Qualsiasi molecola che si lega a un recettore."],
    ["Agonista","Ligando che si lega al recettore e lo attiva."],
    ["Antagonista","Ligando che si lega al recettore senza attivarlo e impedisce all'agonista di farlo."],
    ["Affinità","Quanto saldamente un ligando si lega al recettore."],
    ["Efficacia","Quanto un ligando, una volta legato, attiva il recettore."]],
   ex:{b:"Morfina e naloxone si legano allo stesso recettore µ-oppioide. La morfina lo attiva (agonista); il naloxone lo occupa senza attivarlo (antagonista).",cards:["morfina","naloxone"]}},
  {t:"predict",ph:"pratica",h:"Proviamo",q:"Il naloxone ha un'affinità alta per il recettore µ ed efficacia nulla. Che cos'è?",
   o:[["a","Un agonista"],["b","Un antagonista"],["c","Un agonista parziale"]],ok:"b",why:"Si lega bene ma non attiva: è la definizione di antagonista."},
  {t:"theory",h:"La curva dose-risposta",defs:[
    ["Curva dose-risposta","Il grafico dell'effetto al crescere della dose. Con la dose in scala logaritmica ha la forma di una S."],
    ["Emax","L'effetto massimo che il farmaco può dare: aumentare ancora la dose non lo supera."],
    ["EC50","La dose (o concentrazione) che dà metà dell'Emax."],
    ["Potenza","Quanta dose serve per un certo effetto. Più bassa è l'EC50, più il farmaco è potente."]],
   ex:{b:"Con la morfina, aumentando la dose l'analgesia cresce, poi smette di aumentare: si è raggiunto l'Emax.",cards:["morfina"]}},
  {t:"predict",ph:"pratica",h:"Proviamo",q:"Se raddoppi la dose di morfina, l'effetto raddoppia sempre?",
   o:[["a","Sì, sempre"],["b","Solo finché la risposta non si avvicina al suo massimo"],["c","No, si dimezza"]],ok:"b",
   why:"A dosi basse l'effetto cresce in fretta; vicino all'Emax la curva si appiattisce e raddoppiare la dose cambia poco."},
  {t:"widget",ph:"pratica",w:"ec50",h:"Trova l'EC50",b:"Muovi la dose finché l'effetto arriva a metà del massimo.",
   done:"Eccola: la dose che dà il 50% dell'Emax è l'<b>EC50</b>."},
  {t:"theory",h:"Agonista pieno e agonista parziale",defs:[
    ["Agonista pieno","Può raggiungere l'effetto massimo del sistema."],
    ["Agonista parziale","Anche occupando tutti i recettori non raggiunge l'effetto massimo: ha un'efficacia minore."]],
   ex:{b:"La morfina è un agonista pieno del recettore µ; la buprenorfina è un agonista parziale con affinità alta.",cards:["buprenorfina"]}},
  {t:"widget",ph:"pratica",w:"partial",h:"Guarda la differenza",b:"Porta la dose al massimo e guarda dove arriva ciascuna.",
   done:"La buprenorfina si ferma più in basso anche a dosi alte: è un <b>agonista parziale</b>. Da qui viene l'«effetto tetto» sulla depressione respiratoria."},
  {t:"theory",h:"Antagonismo competitivo e non competitivo",defs:[
    ["Antagonista competitivo","Occupa lo stesso sito dell'agonista. Con più agonista lo si scavalca: la curva si sposta a destra e l'Emax si raggiunge ancora."],
    ["Antagonista non competitivo","Agisce in modo che più agonista non basta a vincerlo: l'Emax si abbassa."]],
   ex:{b:"Il naloxone è un antagonista competitivo del recettore µ: per questo si usa nell'intossicazione da oppioidi.",cards:["naloxone"]}},
  {t:"predict",ph:"pratica",h:"Proviamo",q:"Aggiungi naloxone alla morfina. Che cosa succede alla curva della morfina?",
   o:[["a","Si abbassa: la morfina non arriva più al massimo"],["b","Si sposta a destra: serve più morfina per lo stesso effetto"],["c","Non cambia"]],ok:"b",
   why:"È un antagonista competitivo: la curva trasla a destra senza perdere il massimo."},
  {t:"widget",ph:"pratica",w:"antag",h:"Guarda lo spostamento",b:"Aumenta l'antagonista e guarda la curva della morfina; la linea tratteggiata è la curva senza antagonista. Poi prova l'antagonista non competitivo.",
   done:"Competitivo: la curva va a destra e il massimo resta. <b>Non competitivo</b>: il massimo si abbassa e nessuna dose di agonista lo recupera."},
  {t:"theory",h:"Potenza ed efficacia",defs:[
    ["Più potente","Serve meno dose per lo stesso effetto (EC50 più bassa)."],
    ["Più efficace","Raggiunge un effetto massimo più alto (Emax più alto)."]],
   ex:{b:"Il fentanil è molto più potente della morfina: bastano dosi molto più basse. Ma entrambi sono agonisti pieni, quindi l'effetto massimo è lo stesso.",cards:["fentanil"]}},
  {t:"widget",ph:"pratica",w:"potency",h:"Mettilo alla prova",b:"Trova una dose a cui il fentanil supera il 90% dell'effetto e la morfina resta sotto il 10%.",
   done:"Il fentanil arriva al massimo con dosi molto più basse, ma il massimo è lo stesso: più potente non vuol dire più efficace."},
  {t:"predict",ph:"caso",h:"Il caso",cards:["naloxone"],q:"Il Sig. M., 54 anni, arriva in pronto soccorso sonnolento, con 6 atti respiratori al minuto e pupille a punta di spillo: ha preso un oppioide a lunga durata. Dopo il naloxone si sveglia e respira bene. Dopo 20 minuti chiede di andare a casa. Che cosa fai?",
   o:[["a","Lo dimetti: il naloxone ha funzionato"],["b","Lo tieni in osservazione: il naloxone può smettere di agire prima dell'oppioide"],["c","Gli dai subito una dose di morfina per il dolore"]],ok:"b",
   why:"L'effetto del naloxone può durare meno di quello dell'oppioide, soprattutto con le formulazioni a lunga durata: la depressione respiratoria può tornare. Il paziente va osservato e, se serve, il naloxone va ripetuto."},
  {t:"check",h:"Ripasso 1 di 3",q:"Che cosa misura l'EC50?",o:[["a","La potenza: la dose che dà metà dell'effetto massimo"],["b","L'efficacia massima del farmaco"],["c","La durata d'azione"]],ok:"a",why:"L'EC50 è la dose che produce il 50% dell'Emax; l'efficacia è l'Emax stesso."},
  {t:"check",h:"Ripasso 2 di 3",q:"Rispetto alla morfina, la buprenorfina è…",o:[["a","Un antagonista puro"],["b","Un agonista parziale, con un effetto massimo minore"],["c","Un agonista pieno più efficace"]],ok:"b",why:"Anche saturando i recettori non raggiunge l'effetto massimo dell'agonista pieno."},
  {t:"check",h:"Ripasso 3 di 3",q:"Un antagonista competitivo, in presenza di più agonista…",o:[["a","Sposta la curva a destra, ma l'effetto massimo si può ancora raggiungere"],["b","Abbassa per sempre l'effetto massimo"],["c","Aumenta la potenza dell'agonista"]],ok:"a",why:"La competizione per lo stesso sito si vince aumentando l'agonista."},
  {t:"summary",h:"Appunti",pts:[
   "<b>Agonista</b>: si lega e attiva. <b>Antagonista</b>: si lega e non attiva. <b>Affinità</b>: quanto si lega. <b>Efficacia</b>: quanto attiva.",
   "La curva dose-risposta, con la dose in scala logaritmica, è una S che arriva a un massimo (<b>Emax</b>).",
   "<b>EC50</b>: dose che dà metà dell'Emax; misura la <b>potenza</b>.",
   "<b>Agonista pieno</b> (morfina, fentanil) contro <b>agonista parziale</b> (buprenorfina): il parziale si ferma più in basso.",
   "<b>Antagonista competitivo</b> (naloxone): curva a destra, Emax raggiungibile. <b>Non competitivo</b>: Emax più basso.",
   "Più potente non vuol dire più efficace.",
   "Il naloxone può durare meno dell'oppioide: dopo la risposta il paziente va osservato."],
   cards:["morfina","buprenorfina","fentanil","naloxone"],
   src:"Curve illustrative: la forma segue il modello di Hill, i valori non vengono da studi. Testo da rivedere su un manuale di riferimento (per esempio Rang & Dale o Goodman & Gilman) e sugli RCP di naloxone e buprenorfina."}
 ]},
{id:"l_fk1",title:"Emivita e stato stazionario",area:"Farmacocinetica",mins:7,color:"teal",icon:"repeat",free:true,soon:1},
{id:"l_int",title:"Interazioni: il CYP3A4 e l'indice terapeutico",area:"Interazioni",mins:6,color:"red",icon:"pair",soon:1,unlock:"Coppie pericolose: almeno 20 crediti in una sessione"},
{id:"l_ana",title:"Analgesici e NNT",area:"Analgesici",mins:6,color:"plum",icon:"pill",soon:1,unlock:"Indicazioni: almeno 7 su 10"},
{id:"l_emo",title:"La cascata della coagulazione",area:"Emostasi",mins:7,color:"red",icon:"target",soon:1,unlock:"Bersagli: almeno 7 su 10"}
];
const LZ_PH={teoria:["Teoria","sky"],pratica:["Pratica","green"],caso:["Caso clinico","plum"],ripasso:["Ripasso","ochre"],appunti:["Appunti","teal"]};
const lzPh=st=>st.ph||(st.t==="theory"||st.t==="text"?"teoria":st.t==="check"?"ripasso":st.t==="summary"?"appunti":"pratica");
const lzNChecks=L=>L.steps.filter(s=>s.t==="check").length;
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
  if(st.t==="theory"){body=`<div class="defs">${st.defs.map(([k,d])=>`<div class="def"><b>${k}</b><span>${d}</span></div>`).join("")}</div>
    ${st.ex?`<div class="lz-ex"><span class="lz-exk">${ic("pill")} Esempio concreto</span><p>${st.ex.b}</p>${lzCards(st.ex.cards)}</div>`:""}`;
    foot=`<button class="btn primary big" data-lz="next">Continua</button>`}
  else if(st.t==="match"){const M=LZ.m||(LZ.m={sel:null,done:{},bad:null,order:exShuf(st.pairs.map((_,j)=>j),Math.random)});LZ.goal=Object.keys(M.done).length===st.pairs.length;
    body=`<p class="lz-b">${st.b}</p><div class="mt"><div class="mcol">${st.pairs.map((p,j)=>`<button class="mi${M.done[j]?" ok":M.sel===j?" sel":""}" data-lzm="${j}" ${M.done[j]?"disabled":""}>${p[0]}</button>`).join("")}</div>
      <div class="mcol">${M.order.map(j=>`<button class="mi r${M.done[j]?" ok":M.bad===j?" bad":""}" data-lzr="${j}" ${M.done[j]?"disabled":""}>${st.pairs[j][1]}</button>`).join("")}</div></div>
      ${LZ.goal?`<div class="lz-ok">${ic("check")}<span>${st.done}</span></div>`:""}`;
    foot=`<button class="btn primary big" data-lz="next" ${LZ.goal?"":"disabled"}>Continua</button>`}
  else if(st.t==="text"){body=`<p class="lz-b">${st.b}</p>${lzCards(st.cards)}${st.note?`<p class="note">${st.note}</p>`:""}`;
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
function lzFrame(body,foot){const L=LZ.les,st=L.steps[LZ.i],n=L.steps.length,P=LZ_PH[lzPh(st)];
  return `<div class="qz lz"><div class="qz-top"><button class="qz-x" data-lz="exit" aria-label="Esci">${ic("x")}</button><div class="lz-seg">${L.steps.map((s,j)=>`<i class="ph-${lzPh(s)}${j<LZ.i?" on":j===LZ.i?" cur":""}"></i>`).join("")}</div><span class="qz-n">${LZ.i+1}/${n}</span></div>
    <div class="qz-body"><p class="lz-phase" style="--tc:var(--${P[1]});--tl:var(--${P[1]}-l)"><span>${P[0]}</span>${L.area}</p><h2 class="lz-h">${st.h}</h2>${body}</div>${foot}</div>`}
function lzListHTML(){
  const D=lzSt();
  const tile=L=>{const d=D[L.id],lock=L.req&&!D[L.req],col=L.color,nc=lzNChecks(L.steps?L:{steps:[]});
    return `<button class="tile lz-tile${L.soon||lock?" soon":""}" ${L.soon||lock?"disabled":`data-lz="open" data-id="${L.id}"`} style="--tc:var(--${col});--tl:var(--${col}-l)"><span class="ico">${ic(L.icon)}</span><span class="tb"><b>${L.title}</b><span>${L.area} · ${L.mins} minuti</span>
      <small>${lock?`Si apre dopo «${LZ_LESSONS.find(x=>x.id===L.req).title}»`:L.soon?(L.unlock?`In preparazione · si aprirà con ${L.unlock}`:"In preparazione · gratuita"):d?`Completata · ${d.best}/${nc} al ripasso · appunti disponibili`:"Gratuita · completala per una carta e fino a 30 crediti"}</small></span><span class="go">${ic(d&&!L.soon?"check":"arrow")}</span></button>
      ${d&&!L.soon?`<button class="lnk lz-notes" data-lz="notes" data-id="${L.id}">Rivedi gli appunti</button>`:""}`};
  return `<div class="home"><p class="hello">Lezioni</p><h2 class="sec">Impara dalle basi</h2><p class="sub">Lezioni brevi che alternano teoria e pratica: prima le definizioni e un esempio concreto, poi provi tu. Alla fine restano gli appunti.</p>${LZ_LESSONS.map(tile).join("")}</div>`}
function lzNotesHTML(L){const st=L.steps.find(s=>s.t==="summary");
  return `<div class="home"><button class="lnk" data-lz="list">‹ Tutte le lezioni</button><p class="hello">${L.area}</p><h2 class="sec">${L.title}: appunti</h2><ul class="lz-sum">${st.pts.map(p=>`<li>${p}</li>`).join("")}</ul>${lzCards(st.cards)}<p class="note">${st.src}</p>
    <button class="btn primary" data-lz="open" data-id="${L.id}">Rifai la lezione</button></div>`}
function lzDoneHTML(){const L=LZ.les,r=LZ.reward;
  return `<div class="done"><div class="burst">${SPRIG}</div><p class="qz-kick">${L.area}</p><h2 class="sec">Lezione completata!</h2>
    ${r.got?`<div class="won">+${r.got}<span>crediti</span></div>`:""}
    <div class="done-l"><div class="stats"><div class="stat"><b>${LZ.score}/${lzNChecks(L)}</b><span>ripasso finale</span></div><div class="stat"><b>${L.steps.length}</b><span>schede</span></div></div>
    ${r.card?`<p>Nuova carta nel tuo Armadio:</p>${lzCards([r.card])}`:"<p>I crediti e la carta si ricevono solo la prima volta. Gli appunti restano qui.</p>"}</div></div>
    <div class="qz-foot"><div class="in btns"><button class="btn primary big" data-lz="list">Continua</button><button class="btn big" data-lz="notes" data-id="${L.id}">Vedi gli appunti</button></div></div>`}
function renderLez(){
  if(!LZ||LZ.view==="list")app.innerHTML=lzListHTML();
  else if(LZ.view==="notes")app.innerHTML=lzNotesHTML(LZ.les);
  else if(LZ.view==="done")app.innerHTML=lzDoneHTML();
  else app.innerHTML=lzStepHTML()}
function lzOpen(id){const L=LZ_LESSONS.find(x=>x.id===id);LZ={les:L,i:0,view:"run",score:0};tab="lez";render();window.scrollTo(0,0)}
function lzNext(){LZ.i++;LZ.sel=null;LZ.ans=null;LZ.v=undefined;LZ.goal=false;LZ.nc=false;LZ.seen=null;LZ.m=null;render();window.scrollTo(0,0)}
function lzFinish(){const L=LZ.les,D=lzSt(),first=!D[L.id];let got=0,card=null;
  if(first){got=exAward(exReward(LZ.score/lzNChecks(L)),false);if(L.reward&&CARDS[L.reward]){S.col[L.reward]=(S.col[L.reward]||0)+1;card=L.reward}}
  D[L.id]={done:exToday(),best:Math.max(LZ.score,(D[L.id]||{}).best||0)};save();LZ.reward={got,card};LZ.view="done";sfx("cure");render();window.scrollTo(0,0)}
app.addEventListener("click",e=>{
  if(tab!=="lez")return;
  const b=e.target.closest("[data-lz],[data-lzo],[data-lzm],[data-lzr]");if(!b||b.disabled)return;
  if(b.dataset.lzm!==undefined){LZ.m.sel=+b.dataset.lzm;LZ.m.bad=null;sfx("play");render();return}
  if(b.dataset.lzr!==undefined){const M=LZ.m,j=+b.dataset.lzr;if(M.sel===null)return;
    if(j===M.sel){M.done[j]=1;M.sel=null;sfx("heal")}else{M.bad=j;sfx("hit")}render();return}
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
