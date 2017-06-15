#!/usr/bin/env bash
gnome-terminal -x bash -c "cd /home/mcattaneo/github/carmen; git pull; npm install; echo 'password' | sudo -S rmmod pn533;echo 'password' | sudo -S /etc/init.d/pcscd restart;./node_modules/.bin/electron-rebuild; npm start"
