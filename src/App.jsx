import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, 
  Clock, 
  PenTool, 
  Settings, 
  ChevronRight, 
  ChevronLeft, 
  Play, 
  Pause, 
  RefreshCw, 
  Heart,
  X,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  SkipForward,
  Minus,
  Plus
} from 'lucide-react';

// --- Données et Contenu ---

const DEFAULT_STEPS = [
  {
    id: 'presence',
    title: 'Mise en présence',
    description: 'Prenez quelques instants pour faire silence. Fermez les yeux, calmez votre respiration. Dieu est là, présent au fond de votre cœur.',
    duration: 120 // 2 minutes par défaut
  },
  {
    id: 'reading',
    title: 'Lectio (Lecture)',
    description: 'Lisez lentement le texte proposé. Laissez un mot ou une phrase résonner en vous. Ne cherchez pas à analyser, mais à écouter.',
    duration: 180 // 3 minutes
  },
  {
    id: 'meditation',
    title: 'Meditatio (Cœur à cœur)',
    description: 'C\'est le temps de l\'échange silencieux. Parlez à Dieu comme à un ami, ou restez simplement dans sa présence amoureuse.',
    duration: 600 // 10 minutes (ajustable)
  },
  {
    id: 'resolution',
    title: 'Conclusion & Résolution',
    description: 'Terminez par une action de grâce. Prenez une petite résolution concrète pour votre journée.',
    duration: 180 // 3 minutes
  }
];

const TEXTS = [
  { source: "Psaume 23", content: "L'Éternel est mon berger : je ne manquerai de rien. Il me fait reposer dans de verts pâturages, Il me dirige près des eaux paisibles." },
  { source: "Jean 15, 9", content: "Comme le Père m'a aimé, moi aussi je vous ai aimés. Demeurez dans mon amour." },
  { source: "Saint Augustin", content: "Tu nous as faits pour toi, Seigneur, et notre cœur est sans repos tant qu'il ne demeure en toi." },
  { source: "Matthieu 11, 28", content: "Venez à moi, vous tous qui êtes fatigués et chargés, et je vous donnerai du repos." },
  { source: "Sainte Thérèse d'Avila", content: "L'oraison n'est à mon avis qu'un commerce intime d'amitié où l'on s'entretient souvent seul à seul avec ce Dieu dont on se sait aimé." },
  { source: "Isaïe 43, 1", content: "Ne crains rien, car je te rachète, Je t'appelle par ton nom : tu es à moi !" },
];

// --- Fonction Sonore (Bol Tibétain simulé) ---

const playBell = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Paramètres pour un son doux type "bol chantant"
    osc.type = 'sine';
    osc.frequency.setValueAtTime(432, ctx.currentTime); // 432Hz fréquence apaisante
    
    // Enveloppe sonore (Attaque douce, déclin long)
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.1); // Volume max à 0.3
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3); // Déclin sur 3 secondes

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 3);
  } catch (e) {
    console.error("Impossible de jouer le son", e);
  }
};

// --- Composants Utilitaires ---

const Button = ({ children, onClick, variant = 'primary', className = '' }) => {
  const baseStyle = "px-4 py-2 rounded-xl transition-all duration-200 font-medium flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg",
    secondary: "bg-stone-200 text-stone-800 hover:bg-stone-300",
    ghost: "text-stone-600 hover:bg-stone-100 hover:text-indigo-600",
    outline: "border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50"
  };
  
  return (
    <button onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-2xl shadow-sm border border-stone-100 p-6 ${className}`}>
    {children}
  </div>
);

// --- Application Principale ---

export default function App() {
  const [view, setView] = useState('home'); // home, guided, free, journal, settings
  const [journalEntries, setJournalEntries] = useState([]);
  const [theme, setTheme] = useState('light'); // light, dark
  const [stepsConfig, setStepsConfig] = useState(DEFAULT_STEPS); // Configuration dynamique des étapes

  // Navigation simple
  const goHome = () => setView('home');

  return (
    <div className={`min-h-screen font-sans transition-colors duration-500 ${theme === 'dark' ? 'bg-stone-900 text-stone-100' : 'bg-stone-50 text-stone-800'}`}>
      
      {/* Header */}
      <header className="px-6 py-4 flex justify-between items-center max-w-2xl mx-auto">
        <div className="flex items-center gap-2 cursor-pointer" onClick={goHome}>
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Heart size={18} className="text-white" fill="currentColor" />
          </div>
          <span className="text-xl font-semibold tracking-tight">Sanctuaire</span>
        </div>
        
        <div className="flex gap-2">
           <button 
            onClick={() => setView('settings')}
            className={`p-2 rounded-full ${theme === 'dark' ? 'hover:bg-stone-800 text-stone-400' : 'hover:bg-stone-200 text-stone-600'}`}
            title="Réglages"
          >
            <Settings size={20} />
          </button>
          <button 
            onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
            className={`p-2 rounded-full ${theme === 'dark' ? 'hover:bg-stone-800' : 'hover:bg-stone-200'}`}
            title="Thème"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-2xl mx-auto px-4 pb-20 pt-4">
        {view === 'home' && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center py-8">
              <h1 className="text-3xl font-bold mb-3 text-indigo-900 dark:text-indigo-300">Bienvenue dans votre espace intérieur</h1>
              <p className="text-stone-500 dark:text-stone-400">Prenez le temps de vous arrêter et de respirer.</p>
            </div>

            <div className="grid gap-4">
              <Card className="cursor-pointer hover:border-indigo-300 transition-colors group" >
                <div onClick={() => setView('guided')} className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-100 dark:bg-indigo-900 rounded-full text-indigo-600 dark:text-indigo-300 group-hover:scale-110 transition-transform">
                    <BookOpen size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">Oraison Guidée</h3>
                    <p className="text-sm text-stone-500 dark:text-stone-400">Un parcours pas à pas : présence, écoute, dialogue.</p>
                  </div>
                  <ChevronRight className="text-stone-300" />
                </div>
              </Card>

              <Card className="cursor-pointer hover:border-indigo-300 transition-colors group">
                 <div onClick={() => setView('free')} className="flex items-center gap-4">
                  <div className="p-3 bg-teal-100 dark:bg-teal-900 rounded-full text-teal-600 dark:text-teal-300 group-hover:scale-110 transition-transform">
                    <Clock size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">Minuteur Silencieux</h3>
                    <p className="text-sm text-stone-500 dark:text-stone-400">Gérez votre temps de prière en toute simplicité.</p>
                  </div>
                  <ChevronRight className="text-stone-300" />
                </div>
              </Card>

              <Card className="cursor-pointer hover:border-indigo-300 transition-colors group">
                <div onClick={() => setView('journal')} className="flex items-center gap-4">
                  <div className="p-3 bg-amber-100 dark:bg-amber-900 rounded-full text-amber-600 dark:text-amber-300 group-hover:scale-110 transition-transform">
                    <PenTool size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">Carnet Spirituel</h3>
                    <p className="text-sm text-stone-500 dark:text-stone-400">Notez vos grâces, résolutions et pensées.</p>
                  </div>
                  <ChevronRight className="text-stone-300" />
                </div>
              </Card>
            </div>

            {/* Daily Quote Mini */}
            <div className="mt-8 p-6 bg-stone-100 dark:bg-stone-800 rounded-2xl text-center italic text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
              "{TEXTS[Math.floor(Math.random() * TEXTS.length)].content}"
            </div>
          </div>
        )}

        {view === 'guided' && <GuidedSession onExit={goHome} stepsConfig={stepsConfig} theme={theme} />}
        {view === 'free' && <FreeTimer onExit={goHome} theme={theme} />}
        {view === 'journal' && <Journal entries={journalEntries} setEntries={setJournalEntries} onExit={goHome} theme={theme} />}
        {view === 'settings' && <SettingsView stepsConfig={stepsConfig} setStepsConfig={setStepsConfig} onExit={goHome} />}

      </main>
    </div>
  );
}

// --- Sous-Composant : Session Guidée ---

function GuidedSession({ onExit, stepsConfig, theme }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(stepsConfig[0].duration);
  // Initialiser à true pour lancer le premier timer automatiquement, ou false si on préfère une intro. 
  // Ici on laisse false pour la toute première étape, mais ensuite on enchaîne.
  const [isActive, setIsActive] = useState(false); 
  const [selectedText, setSelectedText] = useState(TEXTS[0]);
  
  const currentStep = stepsConfig[stepIndex];
  const isLastStep = stepIndex === stepsConfig.length - 1;

  useEffect(() => {
    setSelectedText(TEXTS[Math.floor(Math.random() * TEXTS.length)]);
  }, []);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      // Le timer vient de se terminer
      setIsActive(false);
      playBell();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);

  const nextStep = () => {
    if (stepIndex < stepsConfig.length - 1) {
      const nextIdx = stepIndex + 1;
      setStepIndex(nextIdx);
      setTimeLeft(stepsConfig[nextIdx].duration);
      setIsActive(true); // AUTO-START : On lance automatiquement le timer de l'étape suivante
    } else {
      onExit();
    }
  };

  const prevStep = () => {
    if (stepIndex > 0) {
      const prevIdx = stepIndex - 1;
      setStepIndex(prevIdx);
      setTimeLeft(stepsConfig[prevIdx].duration);
      setIsActive(false); // On met en pause si on revient en arrière
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const progress = ((stepIndex + 1) / stepsConfig.length) * 100;

  return (
    <div className="flex flex-col h-[80vh]">
      {/* Top Navigation */}
      <div className="flex justify-between items-center mb-6">
        <button onClick={onExit} className="p-2 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-full">
          <X size={24} />
        </button>
        <div className="w-1/3 h-2 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
          <div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="w-8"></div>
      </div>

      <Card className="flex-1 flex flex-col relative overflow-hidden dark:bg-stone-800 dark:border-stone-700 !p-0">
        
        {/* Step Indicator */}
        <div className="pt-6 pb-2 px-6 text-center shrink-0">
           <span className="text-xs uppercase tracking-widest font-bold text-indigo-500">Étape {stepIndex + 1}/{stepsConfig.length}</span>
           <h2 className="text-2xl font-serif mt-2 text-stone-800 dark:text-stone-100">{currentStep.title}</h2>
        </div>

        {/* Content Area */}
        <div className="flex-1 w-full px-6 overflow-y-auto custom-scrollbar flex flex-col items-center justify-start min-h-0 pt-4">
          
          {currentStep.id === 'reading' ? (
            <div className="w-full max-w-lg mx-auto py-4 animate-fade-in-up my-auto">
              <div className="bg-stone-50 dark:bg-stone-900 p-6 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-sm">
                <p className="font-serif text-lg leading-relaxed text-stone-900 dark:text-stone-100 text-center font-medium">
                  "{selectedText.content}"
                </p>
                <p className="mt-4 text-sm text-stone-600 dark:text-stone-400 font-medium text-center">— {selectedText.source}</p>
              </div>
              
              <button 
                onClick={() => setSelectedText(TEXTS[Math.floor(Math.random() * TEXTS.length)])}
                className="mt-4 text-xs text-indigo-500 flex items-center justify-center gap-2 mx-auto hover:text-indigo-600 transition-colors py-2 px-4 rounded-full hover:bg-stone-50 dark:hover:bg-stone-900"
              >
                <RefreshCw size={14} /> <span>Autre texte</span>
              </button>
            </div>
          ) : (
            <div className="w-full max-w-lg mx-auto py-4 my-auto">
              <p className="text-stone-700 dark:text-stone-300 text-lg leading-relaxed animate-fade-in text-center font-serif">
                {currentStep.description}
              </p>
            </div>
          )}

          {/* Timer Display */}
          <div className="py-4 flex justify-center items-center gap-4 shrink-0 mt-auto md:mt-0">
            <div className="text-4xl font-light tabular-nums tracking-tight text-indigo-900 dark:text-indigo-200 opacity-80">
              {formatTime(timeLeft)}
            </div>
            
            <Button variant="outline" onClick={toggleTimer} className="rounded-full w-10 h-10 !p-0 flex items-center justify-center border-2 border-indigo-200 dark:border-indigo-800 hover:border-indigo-500">
              {isActive ? <Pause size={18} /> : <Play size={18} className="ml-1" />}
            </Button>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="w-full flex justify-between p-6 pt-4 border-t border-stone-100 dark:border-stone-700 shrink-0 bg-white dark:bg-stone-800 rounded-b-2xl">
          <Button variant="ghost" onClick={prevStep} disabled={stepIndex === 0} className={stepIndex === 0 ? 'opacity-0' : ''}>
            <ChevronLeft size={20} /> Précédent
          </Button>
          <Button variant="primary" onClick={nextStep}>
            {isLastStep ? 'Terminer' : 'Suivant'} {isLastStep ? null : <ChevronRight size={20} />}
          </Button>
        </div>
      </Card>
    </div>
  );
}

// --- Sous-Composant : Réglages ---

function SettingsView({ stepsConfig, setStepsConfig, onExit }) {
  
  const updateDuration = (index, change) => {
    const newSteps = [...stepsConfig];
    const currentDuration = newSteps[index].duration;
    // Incréments de 1 minute (60s), minimum 1 minute
    const newDuration = Math.max(60, currentDuration + change * 60);
    newSteps[index].duration = newDuration;
    setStepsConfig(newSteps);
  };

  return (
    <div className="flex flex-col h-[80vh]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-serif text-stone-800 dark:text-stone-100">Réglages</h2>
        <button onClick={onExit} className="p-2 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-full">
            <X size={24} />
        </button>
      </div>

      <Card className="flex-1 overflow-y-auto custom-scrollbar dark:bg-stone-800 dark:border-stone-700">
        <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-6">Durée des étapes</h3>
        <div className="space-y-6">
          {stepsConfig.map((step, index) => (
            <div key={step.id} className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-700 last:border-0">
              <div className="flex-1">
                <div className="font-medium text-stone-800 dark:text-stone-200">{step.title}</div>
                <div className="text-xs text-stone-400 mt-1">Par défaut : {DEFAULT_STEPS[index].duration / 60} min</div>
              </div>
              
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => updateDuration(index, -1)}
                  className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-700 hover:bg-stone-200 flex items-center justify-center text-stone-600 dark:text-stone-300 transition-colors"
                >
                  <Minus size={16} />
                </button>
                <div className="w-16 text-center font-mono text-lg font-medium text-indigo-600 dark:text-indigo-400">
                  {Math.floor(step.duration / 60)} <span className="text-xs text-stone-400">min</span>
                </div>
                <button 
                  onClick={() => updateDuration(index, 1)}
                  className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-700 hover:bg-stone-200 flex items-center justify-center text-stone-600 dark:text-stone-300 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-stone-50 dark:bg-stone-900 p-4 rounded-xl text-sm text-stone-500 dark:text-stone-400 border border-stone-200 dark:border-stone-700">
           Note : Ces réglages s'appliquent à votre prochaine oraison guidée. Le minuteur se lancera automatiquement à chaque changement d'étape.
        </div>
      </Card>
    </div>
  );
}

// --- Sous-Composant : Minuteur Libre ---

function FreeTimer({ onExit, theme }) {
  const [duration, setDuration] = useState(15); // minutes
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('setup'); // setup, running, done

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && mode === 'running') {
      setIsActive(false);
      setMode('done');
      playBell(); // Jouer le son aussi pour le mode libre
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode]);

  const startTimer = () => {
    setTimeLeft(duration * 60);
    setMode('running');
    setIsActive(true);
  };

  const resetTimer = () => {
    setIsActive(false);
    setMode('setup');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="flex flex-col h-[80vh] justify-center">
      <div className="absolute top-0 right-0 p-4">
          <button onClick={onExit} className="p-2 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-full">
            <X size={24} />
          </button>
      </div>

      <Card className="text-center py-12 dark:bg-stone-800 dark:border-stone-700">
        {mode === 'setup' && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-serif mb-8 text-stone-800 dark:text-stone-100">Durée de l'oraison</h2>
            
            <div className="flex justify-center items-center gap-6 mb-10">
              <button 
                onClick={() => setDuration(d => Math.max(5, d - 5))}
                className="w-12 h-12 rounded-full bg-stone-100 dark:bg-stone-700 hover:bg-stone-200 flex items-center justify-center text-xl font-bold"
              >
                -
              </button>
              <div className="text-5xl font-light w-32 text-indigo-900 dark:text-indigo-200">{duration} <span className="text-base text-stone-500">min</span></div>
              <button 
                onClick={() => setDuration(d => Math.min(60, d + 5))}
                className="w-12 h-12 rounded-full bg-stone-100 dark:bg-stone-700 hover:bg-stone-200 flex items-center justify-center text-xl font-bold"
              >
                +
              </button>
            </div>

            <Button onClick={startTimer} className="w-48 mx-auto !py-3 text-lg">
              Commencer
            </Button>
          </div>
        )}

        {mode === 'running' && (
          <div className="animate-fade-in">
            <div className="mb-4 text-stone-400 text-sm uppercase tracking-widest">Temps restant</div>
            <div className="text-7xl font-light tabular-nums tracking-tight text-indigo-900 dark:text-indigo-200 mb-10">
              {formatTime(timeLeft)}
            </div>
            
            <div className="flex justify-center gap-4">
              <Button variant="outline" onClick={() => setIsActive(!isActive)} className="rounded-full w-16 h-16 !p-0 flex items-center justify-center border-2">
                {isActive ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
              </Button>
              <Button variant="ghost" onClick={resetTimer} className="rounded-full w-16 h-16 !p-0 flex items-center justify-center text-stone-400 hover:text-red-500">
                <X size={28} />
              </Button>
            </div>
            
            <div className="mt-12 text-stone-400 text-sm italic">
              "Il suffit de se tenir devant Lui."
            </div>
          </div>
        )}

        {mode === 'done' && (
          <div className="animate-fade-in">
            <h2 className="text-3xl font-serif text-indigo-800 dark:text-indigo-300 mb-4">Temps écoulé</h2>
            <p className="text-stone-600 dark:text-stone-400 mb-8">Votre temps de prière est terminé. Prenez un moment pour remercier.</p>
            <Button onClick={onExit}>Retour à l'accueil</Button>
          </div>
        )}
      </Card>
    </div>
  );
}

// --- Sous-Composant : Carnet Spirituel ---

function Journal({ entries, setEntries, onExit, theme }) {
  const [text, setText] = useState('');

  const saveEntry = () => {
    if (!text.trim()) return;
    const newEntry = {
      id: Date.now(),
      date: new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }),
      text: text
    };
    setEntries([newEntry, ...entries]);
    setText('');
  };

  const deleteEntry = (id) => {
    setEntries(entries.filter(e => e.id !== id));
  };

  return (
    <div className="h-[85vh] flex flex-col">
       <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-serif text-stone-800 dark:text-stone-100">Mon Carnet</h2>
        <button onClick={onExit} className="p-2 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-full">
            <X size={24} />
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6 h-full overflow-hidden">
        {/* Editor Side */}
        <div className="flex flex-col gap-4">
          <Card className="flex-1 flex flex-col p-4 dark:bg-stone-800 dark:border-stone-700">
            <label className="text-sm font-semibold text-stone-500 mb-2 uppercase tracking-wide">Nouvelle Note</label>
            <textarea 
              className="flex-1 w-full p-4 bg-stone-50 dark:bg-stone-900 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 text-stone-700 dark:text-stone-200 leading-relaxed"
              placeholder="Quelles grâces avez-vous reçues ? Quelle résolution prenez-vous ?"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="mt-4 flex justify-end">
              <Button onClick={saveEntry} disabled={!text.trim()}>
                Enregistrer
              </Button>
            </div>
          </Card>
        </div>

        {/* List Side */}
        <div className="overflow-y-auto pr-2 space-y-4 pb-10 custom-scrollbar">
          {entries.length === 0 && (
            <div className="text-center py-10 text-stone-400">
              <PenTool size={48} className="mx-auto mb-4 opacity-20" />
              <p>Votre carnet est vide pour le moment.</p>
            </div>
          )}
          {entries.map(entry => (
            <div key={entry.id} className="bg-white dark:bg-stone-800 p-5 rounded-xl border border-stone-100 dark:border-stone-700 shadow-sm relative group animate-fade-in-up">
              <div className="text-xs font-bold text-indigo-500 uppercase mb-2">{entry.date}</div>
              <p className="text-stone-700 dark:text-stone-300 whitespace-pre-wrap font-serif">{entry.text}</p>
              <button 
                onClick={() => deleteEntry(entry.id)}
                className="absolute top-2 right-2 p-2 text-stone-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
