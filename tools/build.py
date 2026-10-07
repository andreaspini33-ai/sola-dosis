#!/usr/bin/env python3
"""Costruisce Sola Dosis come web app installabile.

  python3 tools/build.py prova      -> aggiorna la versione di prova in /prova
  python3 tools/build.py pubblica   -> porta in radice esattamente cio' che e' in prova

Il gioco vero e proprio sta in src/gioco.html. La versione e' in src/VERSION:
va aumentata a ogni modifica, altrimenti i telefoni non vedono l'aggiornamento.
"""
import hashlib, json, os, shutil, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "src")
FILES = ["gioco.html", "tt.js", "es.js", "head.html", "pwa.html", "sw.js", "manifest.webmanifest", "VERSION"]

def read(n):
    with open(os.path.join(SRC, n), encoding="utf-8") as f:
        return f.read()

def src_hash():
    h = hashlib.sha256()
    for n in FILES:
        h.update(read(n).encode())
    for n in sorted(os.listdir(os.path.join(ROOT, "icons"))):
        with open(os.path.join(ROOT, "icons", n), "rb") as f:
            h.update(f.read())
    return h.hexdigest()[:16]

def build(dest, env):
    version = read("VERSION").strip()
    tag = {"prova": (" · prova", " (prova)", " prova"), "pubblica": ("", "", "")}[env]
    os.makedirs(dest, exist_ok=True)
    page = read("head.html") + read("gioco.html").replace("/*@@TT@@*/", read("tt.js")).replace("/*@@ES@@*/", read("es.js")) + "\n" + read("pwa.html") + "\n</html>\n"
    page = page.replace("__VERSION__", version).replace("__ENV__", tag[0])
    if env == "prova":
        page = page.replace("<title>Sola Dosis</title>", "<title>Sola Dosis (prova)</title>")
    man = read("manifest.webmanifest").replace("__ENVNAME__", tag[1]).replace("__ENVSHORT__", tag[2])
    sw = read("sw.js").replace("__VERSION__", version)
    for name, text in [("index.html", page), ("manifest.webmanifest", man), ("sw.js", sw)]:
        with open(os.path.join(dest, name), "w", encoding="utf-8") as f:
            f.write(text)
    icons = os.path.join(dest, "icons")
    if os.path.abspath(icons) != os.path.join(ROOT, "icons"):
        shutil.copytree(os.path.join(ROOT, "icons"), icons, dirs_exist_ok=True)
    return version

def main():
    if len(sys.argv) != 2 or sys.argv[1] not in ("prova", "pubblica"):
        sys.exit(__doc__)
    stamp = os.path.join(ROOT, "prova", "BUILD.json")
    if sys.argv[1] == "prova":
        v = build(os.path.join(ROOT, "prova"), "prova")
        with open(stamp, "w") as f:
            json.dump({"version": v, "src": src_hash()}, f)
        print("prova aggiornata alla versione", v)
    else:
        if not os.path.exists(stamp):
            sys.exit("Prima va costruita e controllata la versione di prova.")
        info = json.load(open(stamp))
        if info["src"] != src_hash():
            sys.exit("src/ e' cambiato dopo l'ultima prova: ricostruisci la prova e ricontrollala.")
        v = build(ROOT, "pubblica")
        print("versione pubblica aggiornata alla", v)

main()
