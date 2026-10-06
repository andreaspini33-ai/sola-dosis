# Sola Dosis

Gioco di carte collezionabili di farmacologia, pensato per la didattica.
Si gioca nel browser e si può installare sul telefono come app (web app installabile).

- Versione per gli studenti: la radice del sito
- Versione di prova: la cartella `/prova/`, con salvataggi separati

## Uso didattico
I valori di efficacia e tollerabilità degli analgesici derivano da NNT e dati di sicurezza
citati nella scheda di ogni carta. Gli altri valori sono stime dichiarate come tali.
Regole e punteggi sono scelte di gioco, non indicazioni cliniche.

## Come si aggiorna
1. Si modifica `src/gioco.html` e si aumenta `src/VERSION`.
2. `python3 tools/build.py prova` aggiorna la versione di prova.
3. Dopo il controllo, `python3 tools/build.py pubblica` porta la stessa versione agli studenti.

## Crediti
- Formule di struttura disegnate con smiles-drawer (licenza MIT) a partire dagli SMILES delle schede Wikipedia.
- Caratteri: Google Fonts (Archivo, Schibsted Grotesk, Atkinson Hyperlegible, JetBrains Mono, IBM Plex, Cinzel), licenza SIL Open Font License.
