import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calculator as CalcIcon, Search, ArrowRight, Activity, Zap, Droplet, Move, Magnet } from "lucide-react";

// Tipe Data Formula
type Variable = {
  key: string;
  label: string;
  unit: string;
  defaultValue?: number;
};

type Formula = {
  id: string;
  name: string;
  category: string;
  icon: React.ElementType;
  color: string;
  variables: Variable[];
  expressionString: string;
  calculate: (values: Record<string, number>) => { result: number; unit: string };
};

const FORMULAS: Formula[] = [
  {
    id: "hukum-newton-2",
    name: "Gaya (Hukum Newton II)",
    category: "Dinamika",
    icon: Move,
    color: "text-blue-500",
    expressionString: "F = m × a",
    variables: [
      { key: "m", label: "Massa (m)", unit: "kg" },
      { key: "a", label: "Percepatan (a)", unit: "m/s²" },
    ],
    calculate: (v) => ({ result: v.m * v.a, unit: "N (Newton)" }),
  },
  {
    id: "energi-kinetik",
    name: "Energi Kinetik",
    category: "Energi",
    icon: Zap,
    color: "text-yellow-500",
    expressionString: "Ek = 1/2 × m × v²",
    variables: [
      { key: "m", label: "Massa (m)", unit: "kg" },
      { key: "v", label: "Kecepatan (v)", unit: "m/s" },
    ],
    calculate: (v) => ({ result: 0.5 * v.m * Math.pow(v.v, 2), unit: "Joule" }),
  },
  {
    id: "energi-potensial",
    name: "Energi Potensial Gravitasi",
    category: "Energi",
    icon: Zap,
    color: "text-orange-500",
    expressionString: "Ep = m × g × h",
    variables: [
      { key: "m", label: "Massa (m)", unit: "kg" },
      { key: "g", label: "Gravitasi (g)", unit: "m/s²", defaultValue: 9.8 },
      { key: "h", label: "Ketinggian (h)", unit: "m" },
    ],
    calculate: (v) => ({ result: v.m * v.g * v.h, unit: "Joule" }),
  },
  {
    id: "tekanan-hidrostatis",
    name: "Tekanan Hidrostatis",
    category: "Fluida",
    icon: Droplet,
    color: "text-cyan-500",
    expressionString: "P = ρ × g × h",
    variables: [
      { key: "rho", label: "Massa Jenis (ρ)", unit: "kg/m³", defaultValue: 1000 },
      { key: "g", label: "Gravitasi (g)", unit: "m/s²", defaultValue: 9.8 },
      { key: "h", label: "Kedalaman (h)", unit: "m" },
    ],
    calculate: (v) => ({ result: v.rho * v.g * v.h, unit: "Pa (Pascal)" }),
  },
  {
    id: "glbb-kecepatan",
    name: "Kecepatan Akhir (GLBB)",
    category: "Kinematika",
    icon: Activity,
    color: "text-green-500",
    expressionString: "vt = v0 + (a × t)",
    variables: [
      { key: "v0", label: "Kecepatan Awal (v0)", unit: "m/s" },
      { key: "a", label: "Percepatan (a)", unit: "m/s²" },
      { key: "t", label: "Waktu (t)", unit: "s" },
    ],
    calculate: (v) => ({ result: v.v0 + (v.a * v.t), unit: "m/s" }),
  },
  {
    id: "hukum-ohm",
    name: "Tegangan (Hukum Ohm)",
    category: "Kelistrikan",
    icon: Magnet,
    color: "text-purple-500",
    expressionString: "V = I × R",
    variables: [
      { key: "i", label: "Arus (I)", unit: "A (Ampere)" },
      { key: "r", label: "Hambatan (R)", unit: "Ω (Ohm)" },
    ],
    calculate: (v) => ({ result: v.i * v.r, unit: "V (Volt)" }),
  },
  {
    id: "usaha",
    name: "Usaha (W)",
    category: "Energi",
    icon: Zap,
    color: "text-yellow-600",
    expressionString: "W = F × s",
    variables: [
      { key: "f", label: "Gaya (F)", unit: "N" },
      { key: "s", label: "Perpindahan (s)", unit: "m" },
    ],
    calculate: (v) => ({ result: v.f * v.s, unit: "Joule" }),
  },
  {
    id: "momentum",
    name: "Momentum (p)",
    category: "Dinamika",
    icon: Activity,
    color: "text-rose-500",
    expressionString: "p = m × v",
    variables: [
      { key: "m", label: "Massa (m)", unit: "kg" },
      { key: "v", label: "Kecepatan (v)", unit: "m/s" },
    ],
    calculate: (v) => ({ result: v.m * v.v, unit: "kg·m/s" }),
  },
  {
    id: "jarak-glb",
    name: "Jarak (GLB)",
    category: "Kinematika",
    icon: ArrowRight,
    color: "text-teal-500",
    expressionString: "s = v × t",
    variables: [
      { key: "v", label: "Kecepatan (v)", unit: "m/s" },
      { key: "t", label: "Waktu (t)", unit: "s" },
    ],
    calculate: (v) => ({ result: v.v * v.t, unit: "m (Meter)" }),
  },
  {
    id: "gaya-apung",
    name: "Gaya Apung (Archimedes)",
    category: "Fluida",
    icon: Droplet,
    color: "text-blue-400",
    expressionString: "Fa = ρ × g × V",
    variables: [
      { key: "rho", label: "Massa Jenis Fluida (ρ)", unit: "kg/m³", defaultValue: 1000 },
      { key: "g", label: "Gravitasi (g)", unit: "m/s²", defaultValue: 9.8 },
      { key: "v", label: "Volume Tercelup (V)", unit: "m³" },
    ],
    calculate: (v) => ({ result: v.rho * v.g * v.v, unit: "N (Newton)" }),
  },
  {
    id: "jarak-glbb",
    name: "Jarak (GLBB)",
    category: "Kinematika",
    icon: ArrowRight,
    color: "text-emerald-500",
    expressionString: "s = v0×t + 1/2×a×t²",
    variables: [
      { key: "v0", label: "Kecepatan Awal (v0)", unit: "m/s" },
      { key: "t", label: "Waktu (t)", unit: "s" },
      { key: "a", label: "Percepatan (a)", unit: "m/s²" },
    ],
    calculate: (v) => ({ result: (v.v0 * v.t) + (0.5 * v.a * Math.pow(v.t, 2)), unit: "m (Meter)" }),
  }
];

export default function Calculator() {
  const [search, setSearch] = useState("");
  const [activeFormula, setActiveFormula] = useState<Formula | null>(null);
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  
  const filteredFormulas = FORMULAS.filter(f => f.name.toLowerCase().includes(search.toLowerCase()) || f.category.toLowerCase().includes(search.toLowerCase()));

  const handleSelectFormula = (formula: Formula) => {
    setActiveFormula(formula);
    // Initialize default values
    const newValues: Record<string, string> = {};
    formula.variables.forEach(v => {
      if (v.defaultValue !== undefined) {
        newValues[v.key] = v.defaultValue.toString();
      } else {
        newValues[v.key] = "";
      }
    });
    setInputValues(newValues);
  };

  const handleInputChange = (key: string, value: string) => {
    setInputValues(prev => ({ ...prev, [key]: value }));
  };

  // Check if all variables are filled and valid numbers
  const isReadyToCalculate = activeFormula?.variables.every(v => {
    const val = inputValues[v.key];
    return val !== "" && !isNaN(Number(val));
  });

  let calculationResult: { result: number; unit: string } | null = null;
  if (activeFormula && isReadyToCalculate) {
    const numericValues: Record<string, number> = {};
    Object.keys(inputValues).forEach(k => {
      numericValues[k] = Number(inputValues[k]);
    });
    calculationResult = activeFormula.calculate(numericValues);
  }

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold dark:text-white flex items-center gap-3">
            <CalcIcon className="text-blue-500" size={32} />
            Kalkulator Fisika
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Pilih template rumus, masukkan variabel, dan dapatkan hasilnya secara instan!
          </p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input 
            placeholder="Cari rumus..." 
            className="pl-10 bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Template Selection */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-4">
          <h3 className="font-semibold text-lg dark:text-white mb-2">Template Tersedia</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {filteredFormulas.map(formula => (
              <Card 
                key={formula.id} 
                className={`cursor-pointer transition-all border hover:border-blue-300 dark:hover:border-blue-700 ${activeFormula?.id === formula.id ? 'ring-2 ring-blue-500 border-blue-200 bg-blue-50 dark:bg-blue-900/20' : 'dark:bg-slate-900 dark:border-slate-800'}`}
                onClick={() => handleSelectFormula(formula)}
              >
                <CardContent className="p-4 flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center shrink-0 ${formula.color}`}>
                    <formula.icon size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-800 dark:text-gray-200">{formula.name}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-mono mt-1">{formula.expressionString}</p>
                    <span className="inline-block px-2 py-0.5 bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400 text-[10px] rounded-full mt-2 font-medium">
                      {formula.category}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filteredFormulas.length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
                Rumus tidak ditemukan.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Calculator Input & Result */}
        <div className="lg:col-span-7 xl:col-span-8">
          <Card className="shadow-lg border-gray-100 dark:border-slate-800 dark:bg-slate-900 overflow-hidden h-full">
            {activeFormula ? (
              <div className="flex flex-col h-full">
                {/* Calculator Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                  <h2 className="text-2xl font-bold">{activeFormula.name}</h2>
                  <div className="mt-4 bg-white/10 border border-white/20 p-4 rounded-xl flex justify-center backdrop-blur-sm">
                    <span className="font-mono text-2xl tracking-wider">{activeFormula.expressionString}</span>
                  </div>
                </div>

                {/* Calculator Body */}
                <div className="p-6 md:p-8 flex-1 flex flex-col">
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-6 flex items-center gap-2">
                    <ArrowRight size={18} className="text-blue-500" /> Masukkan Variabel
                  </h3>

                  <div className="space-y-5">
                    {activeFormula.variables.map(variable => (
                      <div key={variable.key} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                        <label className="sm:w-1/3 font-medium text-sm text-gray-600 dark:text-gray-300">
                          {variable.label}
                        </label>
                        <div className="relative flex-1">
                          <Input 
                            type="number" 
                            className="pr-16 text-lg dark:bg-slate-800 border-gray-300 dark:border-slate-700 font-mono"
                            value={inputValues[variable.key] ?? ""}
                            onChange={(e) => handleInputChange(variable.key, e.target.value)}
                            placeholder="0.00"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 font-mono text-sm">
                            {variable.unit}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Result Section */}
                  <div className="mt-auto pt-10">
                    <div className={`p-6 rounded-2xl border-2 transition-all duration-300 ${calculationResult ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800/50' : 'bg-gray-50 border-dashed border-gray-200 dark:bg-slate-800/50 dark:border-slate-700 text-center'}`}>
                      {calculationResult ? (
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
                          <div>
                            <p className="text-sm text-green-600 dark:text-green-400 font-bold uppercase tracking-wider mb-1">Hasil Perhitungan</p>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">Nilai dari <span className="font-mono font-bold text-gray-800 dark:text-gray-200">{activeFormula.expressionString.split("=")[0].trim()}</span> adalah:</p>
                          </div>
                          <div className="flex items-baseline gap-2 bg-white dark:bg-slate-900 px-6 py-3 rounded-xl shadow-sm border border-green-100 dark:border-green-800">
                            <span className="text-3xl font-black text-gray-800 dark:text-white">
                              {Number.isInteger(calculationResult.result) ? calculationResult.result : calculationResult.result.toFixed(4)}
                            </span>
                            <span className="font-bold text-green-600 dark:text-green-400">{calculationResult.unit}</span>
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-500 dark:text-gray-400">
                          Isi semua variabel di atas untuk melihat hasil perhitungan.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-12 text-center text-gray-400 dark:text-gray-500">
                <div className="w-24 h-24 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 border-8 border-white dark:border-slate-900 shadow-sm">
                  <CalcIcon size={40} className="text-gray-300 dark:text-gray-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-600 dark:text-gray-300 mb-2">Pilih Template Rumus</h2>
                <p className="max-w-xs mx-auto text-sm">
                  Silakan pilih salah satu template rumus di sebelah kiri untuk mulai menghitung.
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
