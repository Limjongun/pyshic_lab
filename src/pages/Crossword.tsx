import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Puzzle, HelpCircle } from 'lucide-react';

interface Word {
  id: number;
  answer: string;
  clue: string;
  direction: 'across' | 'down';
  startx: number;
  starty: number;
}

interface Level {
  id: number;
  name: string;
  gridSize: number;
  words: Word[];
}

const levels: Level[] = [
  {
    id: 1,
    name: "Level 1: Dasar Fisika",
    gridSize: 12,
    words: [
      { id: 1, answer: "WAKTU", clue: "Besaran pokok yang mengukur durasi.", direction: "across", startx: 0, starty: 0 },
      { id: 2, answer: "USAHA", clue: "Gaya dikali perpindahan (W=F.s).", direction: "down", startx: 4, starty: 0 },
      { id: 3, answer: "MASSA", clue: "Ukuran kelembaman benda (kg).", direction: "across", startx: 3, starty: 2 },
      { id: 4, answer: "GAYA", clue: "Tarikan atau dorongan (F).", direction: "down", startx: 7, starty: 1 },
      { id: 5, answer: "ALAM", clue: "Fisika adalah ilmu yang mempelajari gejala ...", direction: "across", startx: 5, starty: 4 }
    ]
  },
  {
    id: 2,
    name: "Level 2: Dinamika Energi",
    gridSize: 12,
    words: [
      { id: 1, answer: "ENERGI", clue: "Kemampuan untuk melakukan usaha.", direction: "down", startx: 1, starty: 0 },
      { id: 2, answer: "NEWTON", clue: "Ilmuwan penemu hukum gerak & gravitasi.", direction: "across", startx: 0, starty: 2 },
      { id: 3, answer: "GAYA", clue: "F = m . a", direction: "across", startx: 1, starty: 4 },
      { id: 4, answer: "KINETIK", clue: "Energi yang dimiliki benda karena geraknya.", direction: "down", startx: 5, starty: 0 },
      { id: 5, answer: "TUAS", clue: "Pesawat sederhana berupa pengungkit.", direction: "across", startx: 5, starty: 4 }
    ]
  },
  {
    id: 3,
    name: "Level 3: Termo & Fluida",
    gridSize: 12,
    words: [
      { id: 1, answer: "KALOR", clue: "Panas yang berpindah.", direction: "down", startx: 1, starty: 0 },
      { id: 2, answer: "PASCAL", clue: "Satuan tekanan internasional (Pa).", direction: "across", startx: 0, starty: 1 },
      { id: 3, answer: "RUANG", clue: "Volume dimensi tempat benda berada.", direction: "across", startx: 1, starty: 4 },
      { id: 4, answer: "GAS", clue: "Wujud zat yang tidak memiliki bentuk dan volume tetap.", direction: "down", startx: 5, starty: 4 },
      { id: 5, answer: "SUHU", clue: "Derajat panas atau dinginnya benda.", direction: "across", startx: 5, starty: 6 }
    ]
  },
  {
    id: 4,
    name: "Level 4: Gelombang Bunyi",
    gridSize: 12,
    words: [
      { id: 1, answer: "FREKUENSI", clue: "Banyaknya getaran dalam satu detik.", direction: "across", startx: 1, starty: 2 },
      { id: 2, answer: "HERTZ", clue: "Satuan dari frekuensi.", direction: "down", startx: 2, starty: 0 },
      { id: 3, answer: "GAUNG", clue: "Bunyi pantul yang bertabrakan dengan bunyi asli.", direction: "down", startx: 5, starty: 0 },
      { id: 4, answer: "BUNYI", clue: "Gelombang mekanik yang merambat.", direction: "across", startx: 3, starty: 3 },
      { id: 5, answer: "GEMA", clue: "Bunyi pantul yang terdengar setelah bunyi asli.", direction: "across", startx: 5, starty: 4 }
    ]
  },
  {
    id: 5,
    name: "Level 5: Listrik",
    gridSize: 12,
    words: [
      { id: 1, answer: "ARUS", clue: "Aliran muatan listrik.", direction: "down", startx: 5, starty: 0 },
      { id: 2, answer: "VOLT", clue: "Satuan tegangan listrik.", direction: "down", startx: 4, starty: 1 },
      { id: 3, answer: "COULOMB", clue: "Satuan muatan listrik.", direction: "across", startx: 3, starty: 2 },
      { id: 4, answer: "OHM", clue: "Satuan hambatan listrik.", direction: "down", startx: 8, starty: 0 },
      { id: 5, answer: "LISTRIK", clue: "Energi yang timbul dari elektron.", direction: "across", startx: 1, starty: 4 }
    ]
  },
  {
    id: 6,
    name: "Level 6: Magnet",
    gridSize: 12,
    words: [
      { id: 1, answer: "LORENTZ", clue: "Gaya magnetik pada muatan bergerak.", direction: "down", startx: 4, starty: 0 },
      { id: 2, answer: "FARADAY", clue: "Ilmuwan penemu induksi elektromagnetik.", direction: "across", startx: 2, starty: 2 },
      { id: 3, answer: "MAGNET", clue: "Benda yang dapat menarik besi.", direction: "down", startx: 5, starty: 1 },
      { id: 4, answer: "INDUKSI", clue: "Peristiwa timbulnya GGL karena perubahan fluks.", direction: "down", startx: 6, starty: 0 },
      { id: 5, answer: "TESLA", clue: "Satuan medan magnet.", direction: "across", startx: 4, starty: 5 }
    ]
  },
  {
    id: 7,
    name: "Level 7: Optik",
    gridSize: 12,
    words: [
      { id: 1, answer: "OPTIK", clue: "Ilmu fisika tentang cahaya dan alat penglihatan.", direction: "down", startx: 1, starty: 2 },
      { id: 2, answer: "PANTUL", clue: "Sifat cahaya saat mengenai cermin.", direction: "across", startx: 1, starty: 3 },
      { id: 3, answer: "FOKUS", clue: "Titik pusat bertemunya cahaya.", direction: "down", startx: 5, starty: 0 },
      { id: 4, answer: "LENSA", clue: "Kaca bening yang melengkung.", direction: "down", startx: 6, starty: 3 },
      { id: 5, answer: "BIAS", clue: "Sifat pembelokan cahaya.", direction: "across", startx: 3, starty: 6 }
    ]
  },
  {
    id: 8,
    name: "Level 8: Fisika Modern",
    gridSize: 12,
    words: [
      { id: 1, answer: "EINSTEIN", clue: "Ilmuwan penggagas teori relativitas.", direction: "across", startx: 1, starty: 5 },
      { id: 2, answer: "RELATIF", clue: "Sifat waktu dan ruang yang tidak mutlak.", direction: "down", startx: 6, starty: 4 },
      { id: 3, answer: "FOTON", clue: "Partikel cahaya.", direction: "down", startx: 8, starty: 1 },
      { id: 4, answer: "KUANTUM", clue: "Fisika yang membahas partikel subatomik.", direction: "across", startx: 4, starty: 3 },
      { id: 5, answer: "ATOM", clue: "Bagian terkecil materi.", direction: "across", startx: 6, starty: 7 }
    ]
  }
];

type CellData = {
  isBlack: boolean;
  num?: number;
  wordIds: number[];
  char: string;
};

export default function Crossword() {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [grid, setGrid] = useState<CellData[][]>([]);
  const [userInputs, setUserInputs] = useState<string[][]>([]);
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const [selectedCell, setSelectedCell] = useState<{x: number, y: number} | null>(null);
  
  const inputRefs = useRef<(HTMLInputElement | null)[][]>([]);

  const levelData = useMemo(() => levels.find(l => l.id === currentLevel)!, [currentLevel]);

  // Inisialisasi Grid
  useEffect(() => {
    const size = levelData.gridSize;
    const newGrid: CellData[][] = Array(size).fill(null).map(() => 
      Array(size).fill(null).map(() => ({ isBlack: true, wordIds: [], char: '' }))
    );
    const newInputs: string[][] = Array(size).fill(null).map(() => Array(size).fill(''));

    levelData.words.forEach(word => {
      let x = word.startx;
      let y = word.starty;
      
      // Tambahkan nomor di sel pertama
      if (!newGrid[y][x].num) {
        newGrid[y][x].num = word.id;
      }

      for (let i = 0; i < word.answer.length; i++) {
        newGrid[y][x].isBlack = false;
        newGrid[y][x].char = word.answer[i];
        if (!newGrid[y][x].wordIds.includes(word.id)) {
          newGrid[y][x].wordIds.push(word.id);
        }
        
        if (word.direction === 'across') x++;
        else y++;
      }
    });

    setGrid(newGrid);
    setUserInputs(newInputs);
    setSelectedWord(levelData.words[0]);
    setSelectedCell({ x: levelData.words[0].startx, y: levelData.words[0].starty });
    
    inputRefs.current = Array(size).fill(null).map(() => Array(size).fill(null));
  }, [levelData]);

  const handleCellClick = (x: number, y: number) => {
    const cell = grid[y][x];
    if (cell.isBlack) return;

    if (selectedCell?.x === x && selectedCell?.y === y) {
      // Toggle direction if cell belongs to multiple words
      if (cell.wordIds.length > 1) {
        const nextWordId = cell.wordIds.find(id => id !== selectedWord?.id) || cell.wordIds[0];
        setSelectedWord(levelData.words.find(w => w.id === nextWordId)!);
      }
    } else {
      setSelectedCell({ x, y });
      if (!cell.wordIds.includes(selectedWord?.id || -1)) {
        setSelectedWord(levelData.words.find(w => w.id === cell.wordIds[0])!);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, x: number, y: number) => {
    if (!selectedWord) return;

    if (e.key === 'Backspace') {
      e.preventDefault();
      const newInputs = [...userInputs];
      
      if (newInputs[y][x] !== '') {
        newInputs[y][x] = '';
        setUserInputs(newInputs);
      } else {
        // Pindah ke sel sebelumnya
        let prevX = x;
        let prevY = y;
        if (selectedWord.direction === 'across') prevX--;
        else prevY--;

        if (prevX >= selectedWord.startx && prevY >= selectedWord.starty) {
          setSelectedCell({ x: prevX, y: prevY });
          inputRefs.current[prevY][prevX]?.focus();
        }
      }
    } else if (e.key.length === 1 && e.key.match(/[a-zA-Z]/)) {
      e.preventDefault();
      const newInputs = [...userInputs];
      newInputs[y][x] = e.key.toUpperCase();
      setUserInputs(newInputs);

      // Pindah ke sel berikutnya
      let nextX = x;
      let nextY = y;
      if (selectedWord.direction === 'across') nextX++;
      else nextY++;

      const isWithinWord = selectedWord.direction === 'across' 
        ? nextX < selectedWord.startx + selectedWord.answer.length
        : nextY < selectedWord.starty + selectedWord.answer.length;

      if (isWithinWord) {
        setSelectedCell({ x: nextX, y: nextY });
        inputRefs.current[nextY][nextX]?.focus();
      }
    }
  };

  // Fokus input saat sel berubah
  useEffect(() => {
    if (selectedCell && inputRefs.current[selectedCell.y]?.[selectedCell.x]) {
      inputRefs.current[selectedCell.y][selectedCell.x]?.focus();
    }
  }, [selectedCell]);

  const handleAutoFill = () => {
    const newInputs = userInputs.map(row => [...row]);
    levelData.words.forEach(word => {
      let x = word.startx;
      let y = word.starty;
      for (let i = 0; i < word.answer.length; i++) {
        newInputs[y][x] = word.answer[i];
        if (word.direction === 'across') x++;
        else y++;
      }
    });
    setUserInputs(newInputs);
  };

  const isWordComplete = (word: Word) => {
    if (!userInputs.length) return false;
    let x = word.startx;
    let y = word.starty;
    for (let i = 0; i < word.answer.length; i++) {
      if (!userInputs[y] || userInputs[y][x] !== word.answer[i]) return false;
      if (word.direction === 'across') x++;
      else y++;
    }
    return true;
  };

  const progress = useMemo(() => {
    if (!userInputs.length) return 0;
    const correctWords = levelData.words.filter(isWordComplete).length;
    return Math.round((correctWords / levelData.words.length) * 100);
  }, [userInputs, levelData]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold dark:text-white flex items-center gap-3">
            <Puzzle className="text-blue-500" />
            Teka-Teki Fisika
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Uji wawasan fisika Anda! Klik pada kotak atau petunjuk untuk mulai mengisi.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {levels.map(l => (
            <Button
              key={l.id}
              variant={currentLevel === l.id ? "default" : "outline"}
              onClick={() => setCurrentLevel(l.id)}
            >
              Level {l.id}
            </Button>
          ))}
          <Button 
            variant="secondary" 
            onClick={handleAutoFill} 
            className="ml-2 bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:hover:bg-purple-900/50"
          >
            🪄 Isi Otomatis (AI)
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Kolom Kiri: Grid */}
        <div className="lg:col-span-2">
          <Card className="dark:bg-slate-900 border-2 overflow-hidden shadow-sm">
            <div className="bg-slate-50 dark:bg-slate-800 p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
              <h2 className="font-bold text-slate-800 dark:text-white">{levelData.name}</h2>
              <div className="text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                Progress: {progress}%
              </div>
            </div>
            <CardContent className="p-8 flex justify-center bg-slate-100 dark:bg-slate-950">
              <div 
                className="grid gap-[1px] bg-slate-400 dark:bg-slate-700 border-2 border-slate-400 dark:border-slate-700"
                style={{ 
                  gridTemplateColumns: `repeat(${levelData.gridSize}, minmax(0, 1fr))` 
                }}
              >
                {grid.map((row, y) => (
                  row.map((cell, x) => {
                    const isSelected = selectedCell?.x === x && selectedCell?.y === y;
                    const isHighlighted = selectedWord && cell.wordIds.includes(selectedWord.id);
                    
                    return (
                      <div 
                        key={`${x}-${y}`}
                        className={`
                          relative w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center text-lg md:text-2xl font-bold uppercase transition-all
                          ${cell.isBlack ? 'bg-slate-800 dark:bg-slate-900 border-none' : 'bg-white dark:bg-slate-800 cursor-pointer shadow-sm'}
                          ${isHighlighted && !isSelected && !cell.isBlack ? 'bg-blue-50 dark:bg-blue-900/40' : ''}
                          ${isSelected ? 'bg-yellow-200 dark:bg-yellow-600/50 ring-2 ring-yellow-400 z-10' : ''}
                        `}
                        onClick={() => handleCellClick(x, y)}
                      >
                        {!cell.isBlack && (
                          <>
                            {cell.num && (
                              <span className="absolute top-0.5 left-0.5 text-[8px] md:text-[10px] text-slate-500 font-normal">
                                {cell.num}
                              </span>
                            )}
                            <input
                              ref={el => {
                                if (inputRefs.current[y]) inputRefs.current[y][x] = el;
                              }}
                              type="text"
                              maxLength={1}
                              className={`
                                w-full h-full text-center bg-transparent outline-none uppercase
                                ${userInputs[y]?.[x] && userInputs[y][x] !== cell.char && progress === 100 ? 'text-red-500' : 'text-slate-800 dark:text-slate-100'}
                                ${userInputs[y]?.[x] === cell.char && isWordComplete(levelData.words.find(w => w.id === cell.wordIds[0])!) ? 'text-green-600 dark:text-green-400' : ''}
                              `}
                              value={userInputs[y]?.[x] || ''}
                              onChange={() => {}}
                              onKeyDown={(e) => handleKeyDown(e, x, y)}
                              onFocus={() => handleCellClick(x, y)}
                            />
                          </>
                        )}
                      </div>
                    );
                  })
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Kolom Kanan: Clues */}
        <div className="space-y-6">
          <Card className="dark:bg-slate-900 h-full">
            <div className="bg-slate-50 dark:bg-slate-800 p-4 border-b border-slate-100 dark:border-slate-700">
              <h2 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <HelpCircle size={18} className="text-slate-500" />
                Petunjuk Teka-Teki
              </h2>
            </div>
            <CardContent className="p-4 space-y-6 max-h-[600px] overflow-y-auto">
              
              <div>
                <h3 className="font-black text-sm text-slate-400 uppercase tracking-wider mb-3">Mendatar (Across)</h3>
                <ul className="space-y-2">
                  {levelData.words.filter(w => w.direction === 'across').map(word => (
                    <li 
                      key={word.id}
                      className={`
                        p-3 rounded-lg text-sm cursor-pointer transition-colors border
                        ${selectedWord?.id === word.id 
                          ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/30 dark:border-blue-800 shadow-sm' 
                          : 'bg-white border-transparent hover:bg-slate-50 dark:bg-transparent dark:hover:bg-slate-800'}
                        ${isWordComplete(word) ? 'opacity-50 line-through' : ''}
                      `}
                      onClick={() => {
                        setSelectedWord(word);
                        setSelectedCell({ x: word.startx, y: word.starty });
                      }}
                    >
                      <span className="font-bold text-slate-900 dark:text-white mr-2">{word.id}.</span>
                      <span className="text-slate-600 dark:text-slate-300">{word.clue}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-black text-sm text-slate-400 uppercase tracking-wider mb-3">Menurun (Down)</h3>
                <ul className="space-y-2">
                  {levelData.words.filter(w => w.direction === 'down').map(word => (
                    <li 
                      key={word.id}
                      className={`
                        p-3 rounded-lg text-sm cursor-pointer transition-colors border
                        ${selectedWord?.id === word.id 
                          ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/30 dark:border-blue-800 shadow-sm' 
                          : 'bg-white border-transparent hover:bg-slate-50 dark:bg-transparent dark:hover:bg-slate-800'}
                        ${isWordComplete(word) ? 'opacity-50 line-through' : ''}
                      `}
                      onClick={() => {
                        setSelectedWord(word);
                        setSelectedCell({ x: word.startx, y: word.starty });
                      }}
                    >
                      <span className="font-bold text-slate-900 dark:text-white mr-2">{word.id}.</span>
                      <span className="text-slate-600 dark:text-slate-300">{word.clue}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
