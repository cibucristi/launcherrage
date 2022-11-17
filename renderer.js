/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */

 const { ipcRenderer } = require('electron');
 const ipc = ipcRenderer
 const fs = require('fs');
 
 //read file
 fs.readFile('config.bhood', 'utf8', (err, data) => {
     if(err){
         console.error(err);
         return;
     }
 
     const lines = data.split("\n");
     document.getElementById("playername").setAttribute("value", lines[0]);
     
     var options = document.getElementById("microphone").options;
     console.log(options);
     
     if(lines[2] == "true") {
        document.getElementById('cefrendering').checked = true;
     } else {
        document.getElementById('cefrendering').checked = false;
     } 
 });
 
 /*saveBtn.addEventListener("click", () => {
     document.getElementById("control-panel").style.display = "none";
     document.getElementById("check-menu").style.display = "block";
 
     //settings file
     var settings_logger = fs.createWriteStream('server-core/settings.cibu', {
         // 'a' means appending (old data will be preserved)
     })
 
     settings_logger.write(document.getElementById("inputLicense").value + '|' + document.getElementById("generalName").value + '|' + document.getElementById("dns").value + '|' + document.getElementById("loginLogo").value + '|' + document.getElementById("panelLink").value + '|' + document.getElementById("forumLink").value + '|' + document.getElementById("discordLink").value + '|' + document.getElementById("dmvCarID").value + '|' + document.getElementById("dmvStartPos").value); // append string to your file
 
 
     //mysql file
     var mysql_logger = fs.createWriteStream('server-core/mysql.cibu', {
          // 'a' means appending (old data will be preserved)
     })
 
     mysql_logger.write(document.getElementById("host").value + '|' + document.getElementById("username").value + '|' + document.getElementById("password").value + '|' + document.getElementById("database").value); // append string to your file
 
     window.alert('Toate setarile au fost salvate!');
 
     ipc.send('closeApp')
     
 });
 
 setInterval(() => {
     if(document.getElementById("control-panel").style.display == "block") {
         let time = userTime - getTimestampInSeconds();  
     
         document.querySelector(".box1 p").innerHTML = "<b>" + parseInt(time/86400) + "D";
         document.querySelector(".box2 p").innerHTML = "<b>" + parseInt((time/3600) % 24) + "H";
         document.querySelector(".box3 p").innerHTML = "<b>" + parseInt(((time/60) % 60)) + "M";
         document.querySelector(".box4 p").innerHTML = "<b>" + parseInt(time % 60) + "S";
     }
 }, 1000);*/