# Sola Dosis: note di progetto (da leggere prima di ogni modifica)

## Flusso di lavoro
- Fonte unica del gioco: `src/gioco.html`. Mai modificare a mano `index.html` o `prova/index.html`: si rigenerano.
- Ogni modifica: aumentare `src/VERSION` (formato AAAA.MM.GG-n), poi `python3 tools/build.py prova`.
- La versione pubblica si aggiorna SOLO quando Andrea scrive "pubblica": `python3 tools/build.py pubblica`.
  Lo script rifiuta di pubblicare se `src/` è cambiato dopo l'ultima prova.
- Salvataggi: chiave localStorage `farmacopea-v2` (pubblica) e `farmacopea-v2-prova` (prova).
  Non cambiare la chiave né l'indirizzo del sito, altrimenti gli studenti perdono la collezione.

## Regole del gioco (stato al 6 ottobre 2026)
- Omeostasi 20; risposta terapeutica per curare 20 (CURE). Mazzo 20 carte, bustina 30 crediti.
- Farmaci = creature; condizioni = carte campo (una sola, sostituirla azzera la risposta di entrambi);
  recettori = incantesimi (max 2); interazioni = istantanei (giocabili nel turno avversario con dosi di riserva);
  scienziati e azioni = stregonerie. Combattimento con parata come in Magic, Vigilanza.
- Interazioni: tolgono anche risposta terapeutica (resp 6, qt 6, aki 6, sero 5, pk 5, bleed 4, k 4, rabdo 4).
  Sanguinamento: due farmaci diversi tra FANS, antiaggreganti, anticoagulanti, SSRI/SNRI (non due SSRI).
  Inibizione enzimatica: inibitore + altro farmaco a indice ristretto.
- Ritiro dal commercio (leggendaria, 5 dosi): elimina tutti i farmaci, i recettori e la condizione; risposta a 0.

## Nomi (scelti da Andrea)
- Menu = Scheda tecnica; Duello = Testa a testa (head-to-head); Bustine = Forniture; Collezione = Armadio farmaceutico (in navigazione "Armadio"); Mazzo = Piano terapeutico; Fonti = Bibliografia. Le chiavi interne (tab duello, bustine, ...) restano invariate. Nel duello "mazzo" indica ancora la pila da cui si pesca.

## Testa a testa: nuove regole (prototipo in prova, modello a pilastri dal 6/10/2026)
- Codice in src/tt.js (inserito da build.py al posto di /*@@TT@@*/). Regole: documento "Sola Dosis · Testa a testa: regole (bozza)" (sezione Aggiornamento in testa).
- Due bracci, stesso profilo (PROFILES: p_scomp, p_fa, p_postop), stesso prontuario di reparto. Niente combattimento, niente dosi-moneta.
- Controllo della malattia 0-100% = combinazione alla Bliss dei pilastri terapeutici del profilo (1 - prodotto dei complementi); un farmaco per pilastro, il secondo è una duplicazione.
- Ogni turno è una visita con 2 azioni: iniziare (dose 1), titolare su/giù (livelli 1-3: 50%, 80%, 100% dell'effetto), sospendere, giocare un evento clinico.
- Rischi = probabilità di evento avverso per visita (RISK_AE, PR), raddoppiate dai fattori del profilo; controindicazione +2 subito; sospendere una terapia cronica necessaria +1.
- Punti = controllo×10 a ogni visita, 10 visite; vince il beneficio netto = punti − 5×eventi avversi; 10 eventi = interruzione del comitato di monitoraggio.
- Sim (IA contro IA, 400 partite): controllo finale ~62% scompenso, ~75% FA, ~64% postop; chi ignora i rischi perde quasi sempre.
- Il vecchio duello e la partita guidata sono ancora nel codice ma non raggiungibili dal menu; la guida va rifatta.

## Formazione ECM (esercizi da soli, dal 7/10/2026, in prova)
- Codice in src/es.js (inserito al posto di /*@@ES@@*/). Tab interno "ecm", voce 2 della Scheda tecnica.
- Indicazioni: domande nei due sensi da DIS.ind; risposta giusta solo se l'indicazione è esplicita nell'RCP AIFA (EX_GEN = coppie generiche, verifica del 7/10/2026 confermata da Andrea; doc "Sola Dosis · Verifica delle indicazioni sugli RCP AIFA"). Distrattori = farmaci di classe diversa da tutti gli indicati, meno le coppie plausibili in EX_NOT e i corticosteroidi.
- Coppie fuori RCP ma nelle linee guida (EX_LG, 12 coppie, ricerca del 7/10/2026): possono uscire come risposta sbagliata; se scelte, la spiegazione cita la linea guida più recente. Quelle con sec:1 vengono da fonti secondarie e vanno verificate sull'originale.
- Coppie pericolose: 3 carrelli da 6 farmaci, 1-3 combinazioni tra le 8 interazioni. Esclusi farmaci (EX_POOL_OUT) e coppie (exAmbiguous) con interazioni reali non contate dal gioco; inibitore + indice ristretto solo per le coppie in EX_PK.
- Giro visita del giorno: 10 domande uguali per tutti (seme = data), più fino a 3 di ripasso personale. Ripasso alla Leitner in S.ex.rev (1, 3, 7, 14, 30 giorni).
- Crediti: esercizi liberi max 30 al giorno; giro visita 2 per giusta + 5 di bonus da 8 in su, una volta al giorno.
- Da correggere nel modello del duello: il tag inhib + nti conta come interazione anche coppie senza base (es. valproato o antifungini con litio).

## Grafica
- Dal 7/10/2026 interfaccia "amichevole" ibrida (scelta da Andrea): struttura alla Brilliant (schede grandi con bordo 3D, barra di avanzamento, Verifica e riscontro dal basso, schermata di fine con crediti) sui colori caldi dell'erbario; font UI Nunito, Cormorant solo per il marchio. Navigazione in basso su telefono (NAV: Home, Formazione, Testa a testa, Forniture, Armadio), in alto su schermo largo. Piano terapeutico e Bibliografia dalla Home. Classi nuove: .daycard, .tile, .stats, .pnode, .qz-*, .opt, .drug, .done, .hchip (non usare .hero e .chip: esistono già nel duello e nell'armadio). Esercizi in modalità schermo pieno (body.focus).
- Tema unico chiaro "erbario" (carta #F3EDE0, inchiostro #2B2418, titoli Cormorant Garamond, menu in corsivo sottolineato). Nessuna modalità scura: Andrea l'ha trovata buia.
- Schermata iniziale: tavola botanica (papavero, digitale, salice) disegnata a tratto. Carte: stile "Banco di farmacia", proporzioni 63:88 in bustine e collezione.
- Duello: schermata a sé in un solo schermo (strisce compatte, cartella clinica al centro con pazienti fittizi in PATIENTS, mano che scorre di lato, tocco = anteprima, pressione prolungata = scheda).
- Avviso di prescrizione quando un tuo farmaco crea una combinazione a rischio (rxAlert, RISK2INT); referto di fine partita (refertoHTML) con appropriatezza, avvisi, interazioni e citazioni testuali.
- Dorso carte: "Farmacia storica" (verde e oro). Proposte grafiche nel canvas Design "Proposte grafiche carte".

## Preferenze di Andrea
- Fonti sempre citate con testo testuale e DOI; dire cosa va verificato.
- Valori stimati dichiarati come stime. Valori NNT degli analgesici da non alterare.
- Testi in italiano, chiari, senza trattini lunghi doppi.

## Aperto
- Bilanciamento: con soglia 20 le categorie vincono tra circa 40% (cardio) e 63% (anti-infettivi).
  Opzioni proposte: soglia 16; bonus a farmaco indicato e ben tollerato; ritocco dei valori stimati.
- Venlafaxina etichettata "ssri" ma è un SNRI; per il rischio emorragico degli SNRI serve una fonte.
- Font da Google: valutare l'hosting locale dei font (privacy e funzionamento offline al primo avvio).
