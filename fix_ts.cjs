const fs = require('fs');

function replaceFile(path, regex, replacement) {
  if(fs.existsSync(path)) {
    let text = fs.readFileSync(path, 'utf8');
    text = text.replace(regex, replacement);
    fs.writeFileSync(path, text);
  }
}

// Sidebar
replaceFile('src/components/layout/Sidebar.tsx', /import \{ Home, BookOpen, HelpCircle, FlaskConical, Target, Trophy, Calculator, Settings, Info, Share2, Flame, LibraryBig, Award, Box, Cpu, Grid3x3, User \} from "lucide-react"/, 'import { Home, BookOpen, HelpCircle, FlaskConical, Target, Calculator, Info, Share2, LibraryBig, Box, Cpu, Grid3x3, User } from "lucide-react"');
replaceFile('src/components/layout/Sidebar.tsx', /const \{ xp, level \} = useStore\(\)\n?/, '');
replaceFile('src/components/layout/Sidebar.tsx', /import \{ useStore \} from "@\/store\/useStore"\n?/, '');

// Topbar
replaceFile('src/components/layout/Topbar.tsx', /import \{ Zap, Star, Moon, Sun, Bell, Award, LogOut, ChevronDown, User \} from "lucide-react"/, 'import { Moon, Sun, LogOut, ChevronDown, User } from "lucide-react"');
replaceFile('src/components/layout/Topbar.tsx', /const \{ xp, level, energy, theme, toggleTheme, userProfile \} = useStore\(\)/, 'const { theme, toggleTheme, userProfile } = useStore()');

// MusicPlayer
replaceFile('src/components/ui/MusicPlayer.tsx', /import React, \{ useState, useRef, useEffect \} from 'react';/, "import { useState, useRef, useEffect } from 'react';");

// Achievements
replaceFile('src/pages/Achievements.tsx', /import React, \{ useState, useEffect \} from 'react';/, "import { useState, useEffect } from 'react';");
replaceFile('src/pages/Achievements.tsx', /const \{ xp, level, achievements, addEnergy \} = useStore\(\)/, 'const { xp, level, achievements } = useStore()');

// Delete handleRest from Achievements (safely replace the function block)
let achPath = 'src/pages/Achievements.tsx';
if(fs.existsSync(achPath)) {
  let text = fs.readFileSync(achPath, 'utf8');
  text = text.replace(/const handleRest = \(\) => \{[^}]+\}\s*;/g, '');
  text = text.replace(/const handleRest = \(\) => \{[^}]+\}\n/g, '');
  text = text.replace(/<Button[^>]*onClick=\{handleRest\}[^>]*>.*?<\/Button>/s, '');
  fs.writeFileSync(achPath, text);
}

console.log("TS cleanup script done.");
