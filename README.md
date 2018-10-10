SMV-Brett
=========

Als erstes sollte man mit ```npm run compile``` alle .js Dateien generieren.
Danach kann man ein Passwort hashen lassen mit ```node crypto.js [password]```.
Die Werte, die man zurück bekommt kann man in die Config eintragen.

Um das SMV-Brett auszuführen, ist es am einfachsten ist es ein Docker-Image mit dem Befehl ```docker build -t smv-brett .``` zu erstellen.<br>
Dieses Image kann man dann mit ```docker run -p80:80 smv-brett``` ausführen.<br>
Die Website, auf der die Bilder angezeigt werden, ist dann unter localhost:80 zu erreichen.

Wenn man das SMV-Brett ohne Docker ausfähren will muss man auf jeden Fall [Node.js](https://nodejs.org/en/download/) installieren.
Man braucht zusätzlich folgende Packages auf Debian-Distros, um PDFs anzeigen zu können:
- imagemagick 
- ghostscript 
- poppler-utils

Einfach zu installieren mit ```sudo apt-get install imagemagick ghostscript poppler-utils ```.
Wenn man keine PDFs anzeigen will kann man das SMV-Brett auch einfach mit ```npm start``` starten.


Benutzte Bibliotheken
---
- [webdav-client](https://github.com/perry-mitchell/webdav-client) lizensiert unter der MIT Lizenz
- [ws](https://github.com/websockets/ws) lizensiert unter der MIT Lizenz
- [pdf-image](https://github.com/mooz/node-pdf-image) lizensiert unter der MIT Lizenz
- [express](https://github.com/expressjs/express) lizensiert unter der MIT LIzenz