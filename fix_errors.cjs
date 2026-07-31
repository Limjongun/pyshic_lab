const fs = require('fs');

// Fix App.tsx (remove Achievements route)
let appPath = 'src/App.tsx';
if(fs.existsSync(appPath)) {
  let appText = fs.readFileSync(appPath, 'utf8');
  appText = appText.replace(/import Achievements from "\.\/pages\/Achievements"(\r?\n)/g, '');
  appText = appText.replace(/<Route path="achievements" element=\{<Achievements \/>\} \/>(\r?\n)/g, '');
  fs.writeFileSync(appPath, appText);
}

// Fix CatapultLab.tsx type error
let catPath = 'src/pages/CatapultLab.tsx';
if(fs.existsSync(catPath)) {
  let catText = fs.readFileSync(catPath, 'utf8');
  catText = catText.replace(/event\.body/g, '(event as any).body');
  fs.writeFileSync(catPath, catText);
}

console.log('Fixed TS Errors');

