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

## Testa a testa: nuove regole (prototipo in prova dal 6/10/2026)
- Codice in src/tt.js (inserito da build.py al posto di /*@@TT@@*/). Regole complete nel documento "Sola Dosis · Testa a testa: regole (bozza)".
- Due bracci, stesso profilo (PROFILES: p_scomp, p_fa, p_postop), stesso prontuario di reparto per profilo. Niente combattimento.
- Esiti: risposta terapeutica (TT.CURE=40, solo farmaci indicati) ed eventi avversi (TT.AE=10 = interruzione del comitato di monitoraggio); 12 turni; vince il beneficio netto.
- Interazioni e controindicazioni colpiscono chi prescrive; sospendere costa 1 dose; il rivale gioca eventi clinici (EVENTS).
- Simulazioni (ttsim): partite di circa 7 turni; un giocatore prudente batte uno che ignora i rischi nel 57% (scompenso), 69% (FA), 79% (postop).
- Il vecchio duello e la partita guidata sono ancora nel codice ma non raggiungibili dal menu; la guida va rifatta.

## Grafica
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
