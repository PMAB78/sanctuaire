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

// Ces définitions contiennent du JSX (mise en forme) et ne doivent pas être écrasées par le LocalStorage brut.
const STEPS_CONTENT = [
  {
    id: 'corps',
    title: 'Prise de conscience du corps en vue de la prière',
    description: `Je suis dans un endroit propice à la prière, retiré, silencieux.
Mon corps est détendu, éveillé, immobile.
Je respire paisiblement.`,
    defaultDuration: 30 
  },
  {
    id: 'entrée',
    title: 'Entrée en oraison',
    description: (
      <>
        {/* Ajout de '!' pour forcer les couleurs contre le mode sombre automatique de Samsung */}
        {/* Utilisation de text-xs partout pour uniformiser et gagner de la place */}
        <span className="text-xs text-stone-900 dark:!text-white block mb-1 leading-tight">
        Allons à la rencontre de Dieu qui nous attend,<br />
        faisons un beau et lent signe de croix et disons :<br /><br />
        </span>
        
        <span className="text-xs italic text-indigo-800 dark:!text-yellow-300 block mb-1 leading-tight">
          Ô Toi, qui es chez Toi dans le fond de mon cœur,<br />
          je crois que Tu es là, que Tu m’attends, dans le fond de mon cœur
        </span>
        <span className="text-xs text-stone-600 dark:!text-stone-300 block mb-3 opacity-80">(acte de foi, d’adoration, de confiance...)</span>

        <span className="text-xs italic text-indigo-800 dark:!text-yellow-300 block mb-1 leading-tight">
          Ô Toi, qui es chez Toi dans le fond de mon cœur,<br />
          prends pitié de moi dans le fond de mon cœur
        </span>
        <span className="text-xs text-stone-600 dark:!text-stone-300 block mb-3 opacity-80">(acte de dépendance, de repentance...)</span>

        <span className="text-xs italic text-indigo-800 dark:!text-yellow-300 block mb-1 leading-tight">
          Ô Toi, qui es chez Toi dans le fond de mon cœur,<br />
          Envoie ton Esprit tout au fond de mon cœur
        </span>
        <span className="text-xs text-stone-600 dark:!text-stone-300 block mb-3 opacity-80">(acte d’appel de l’Esprit-Saint...)</span>

        <span className="text-xs italic text-indigo-800 dark:!text-yellow-300 block mb-1 leading-tight">
          Ô Toi, qui es chez Toi dans le fond de mon cœur,<br />
          je veux ce que tu veux dans le fond de mon cœur
        </span>
        <span className="text-xs text-stone-600 dark:!text-stone-300 block mb-0 opacity-80">(acte d’offrande à la Volonté divine...)</span>
      </>
    ),
    defaultDuration: 180 
  },
  {
    id: 'rencontre', 
    title: 'Corps de l\'oraison - A la rencontre du Christ',
    description: (
      <>
        <span className="text-xs text-stone-900 dark:!text-white block mb-1 leading-tight">
        Habiter l’évangile comme un personnage de plus <br />
        Entrer dans les vues du Christ <br /> <br />
        </span>
        
        <span className="text-xs italic text-indigo-800 dark:!text-yellow-300 block mb-1 leading-tight">
          Il me connaît et m’aime de toute éternité <br />
          Il m’aime, en ce moment-même, l’être unique que je suis <br />
          Il m’aime tel que je suis, avec mon bien et mon mal <br />
          Il me regarde avec Amour <br /> <br />
        </span>
        
        <span className="text-xs text-stone-900 dark:!text-white block mb-1 leading-tight">
        Accueillir son Amour, m’offrir, réagir à son Amour <br /> <br />
        </span>

        <span className="text-xs italic text-indigo-800 dark:!text-yellow-300 block mb-1 leading-tight">
          En m’ouvrant à son amour, comme on ouvre au soleil les volets de la chambre <br />
          En m’offrant à Lui par amour tel que je suis <br />
          En cherchant ce qu’il attend de moi, comme Saül sur le chemin de Damas <br /> 
          « Seigneur, que veux-tu que je fasse ? » <br /> 
          En espérant lui être toujours plus étroitement uni
        </span>
      </>
    ),
    defaultDuration: 600 
  },
  {
    id: 'resolution',
    title: 'Sortie de l\'oraison - Demeurer en Dieu',
    description: (
      <>
        <span className="text-xs italic text-indigo-800 dark:!text-yellow-300 block mb-1 leading-tight">
          Remercier le Seigneur pour son action en nous, perçue ou non perçue <br /> <br />
          Se garder de juger son oraison quant au fond <br /> <br />
          A la suite de cette oraison y-a-t-il quelque chose à modifier dans ma façon de penser ou d’agir ? <br /> <br />
          Eventuellement emporter un verset ou une pensée pour la journée, pour mieux demeurer en Dieu, pour incarner une résolution <br /> <br />
        </span>
      </>
    ),
    defaultDuration: 180 
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

// --- Fonction Sonore ---
const playBell = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    // Modification pour un son de "clochette"
    osc.type = 'sine'; // Onde sinusoïdale pure
    osc.frequency.setValueAtTime(2000, ctx.currentTime); // Fréquence haute (2000Hz) pour le côté "cristallin"
    
    // Enveloppe sonore plus courte et percutante
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.05); // Attaque très rapide
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7); // Déclin très rapide (0.7s)
    
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.7);
  } catch (e) { console.error("Erreur son", e); }
};

// Fonction helper pour jouer plusieurs fois
const playBellsSequence = (count) => {
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      playBell();
    }, i * 600); // Intervalle réduit à 600ms pour un tintement rapide
  }
};

// --- Hook pour Wake Lock (Garder l'écran allumé) ---
const useWakeLock = () => {
  const wakeLockRef = useRef(null);

  const requestWakeLock = async () => {
    if ('wakeLock' in navigator) {
      try {
        wakeLockRef.current = await navigator.wakeLock.request('screen');
      } catch (err) {
        console.error(`${err.name}, ${err.message}`);
      }
    }
  };

  const releaseWakeLock = async () => {
    if (wakeLockRef.current) {
      try {
        await wakeLockRef.current.release();
        wakeLockRef.current = null;
      } catch (err) {
        console.error(`${err.name}, ${err.message}`);
      }
    }
  };

  useEffect(() => {
    // Re-demander le wake lock si la visibilité change (ex: retour après veille)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        requestWakeLock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      releaseWakeLock();
    };
  }, []);

  return { requestWakeLock, releaseWakeLock };
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

const Card = ({ children, className = '', theme }) => {
  const isDark = theme === 'dark';
  return (
    <div className={`rounded-2xl shadow-sm border p-6 transition-colors duration-300 ${isDark ? 'bg-stone-800 border-stone-700' : 'bg-white border-stone-100'} ${className}`}>
      {children}
    </div>
  );
};

// --- Application Principale ---

export default function App() {
  const [view, setView] = useState('home'); 
  
  // Persistance (LocalStorage)
  const [journalEntries, setJournalEntries] = useState(() => {
    try { const saved = localStorage.getItem('sanctuaire_journal'); return saved ? JSON.parse(saved) : []; } catch (e) { return []; }
  });
  useEffect(() => { localStorage.setItem('sanctuaire_journal', JSON.stringify(journalEntries)); }, [journalEntries]);

  // INITIALISATION DU THÈME AVEC DÉTECTION DU SYSTÈME
  const [theme, setTheme] = useState(() => {
    try { 
      const saved = localStorage.getItem('sanctuaire_theme'); 
      if (saved) {
        return JSON.parse(saved);
      }
      // Si aucune préférence sauvegardée, on regarde le système
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
      return 'light'; 
    } catch (e) { return 'light'; }
  });
  
  // MISE À JOUR DE LA CLASSE SUR HTML (DocumentRoot)
  // C'est crucial pour que les navigateurs mobiles comprennent le contexte global
  useEffect(() => { 
    localStorage.setItem('sanctuaire_theme', JSON.stringify(theme)); 
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Initialisation intelligente des étapes
  const [stepsConfig, setStepsConfig] = useState(() => {
    try {
      const savedDurations = JSON.parse(localStorage.getItem('sanctuaire_durations') || '{}');
      return STEPS_CONTENT.map(step => ({
        ...step,
        duration: savedDurations[step.id] || step.defaultDuration
      }));
    } catch (e) {
      return STEPS_CONTENT.map(step => ({ ...step, duration: step.defaultDuration }));
    }
  });

  useEffect(() => {
    const durationsToSave = stepsConfig.reduce((acc, step) => {
      acc[step.id] = step.duration;
      return acc;
    }, {});
    localStorage.setItem('sanctuaire_durations', JSON.stringify(durationsToSave));
  }, [stepsConfig]);

  const goHome = () => setView('home');

  return (
    // On garde la classe dark ici aussi pour assurer la cascade CSS locale
    <div className={`min-h-screen font-sans transition-colors duration-500 ${theme === 'dark' ? 'dark bg-stone-900 text-white' : 'bg-stone-50 text-stone-900'}`}>
      
      {/* Affichage Conditionnel : Si Guided, on prend tout l'écran, sinon on affiche Header + Main */}
      {view === 'guided' ? (
        <GuidedSession onExit={goHome} stepsConfig={stepsConfig} theme={theme} />
      ) : (
        <>
          {/* Header */}
          <header className="px-6 py-6 flex justify-between items-start gap-6 max-w-2xl mx-auto">
            
            {/* Gauche : Texte (Titre + Citation) - Boutons retirés ici */}
            <div className="flex-1 flex flex-col items-start gap-4">
              
              {/* Titre */}
              <div className="text-left">
                  <h1 className={`text-3xl font-bold mb-1 ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-900'}`}>Vie d'oraison</h1>
                  <p className={`text-sm italic ${theme === 'dark' ? 'text-stone-300' : 'text-stone-600'}`}>Vive Jésus dans nos cœurs à jamais</p>
              </div>

              {/* Citation */}
              <div className="cursor-pointer" onClick={goHome}>
                <blockquote className={`font-serif text-sm italic leading-relaxed border-l-2 pl-3 ${theme === 'dark' ? 'text-stone-200 border-indigo-500' : 'text-stone-800 border-indigo-300'}`}>
                  "Voici que je me tiens à la porte, et je frappe. Si quelqu’un entend ma voix et ouvre la porte, j’entrerai chez lui ; je prendrai mon repas avec lui, et lui avec moi."
                </blockquote>
                <div className={`text-xs font-bold mt-1 pl-3 ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-800'}`}>
                  Ap 3,20
                </div>
              </div>
            </div>

            {/* Droite : Logo Grand Format + Boutons en dessous */}
            <div className="shrink-0 flex flex-col items-center gap-4">
              <img 
                src="/logo.jpg" 
                alt="Logo" 
                className={`h-72 w-auto rounded-lg shadow-md border ${theme === 'dark' ? 'border-stone-700' : 'border-stone-200'}`}
                onError={(e) => {
                   e.target.style.display = 'none';
                }}
              />

              {/* Boutons d'action déplacés ici */}
              <div className="flex gap-2">
                 <button 
                  onClick={() => setView('settings')}
                  className={`p-2 rounded-full ${theme === 'dark' ? 'hover:bg-stone-800 text-stone-400' : 'hover:bg-stone-200 text-stone-600'}`}
                >
                  <Settings size={20} />
                </button>
                <button 
                  onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
                  className={`p-2 rounded-full ${theme === 'dark' ? 'hover:bg-stone-800' : 'hover:bg-stone-200'}`}
                >
                  {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </button>
              </div>
            </div>
            
          </header>

          {/* Main Content */}
          <main className="max-w-2xl mx-auto px-4 pb-20 pt-4">
            {view === 'home' && (
              <div className="space-y-8 animate-fade-in mt-4">
                
                <div className="grid gap-4">
                  <Card theme={theme} className="cursor-pointer hover:border-indigo-300 transition-colors group" >
                    <div onClick={() => setView('guided')} className="flex items-center gap-4">
                      <div className={`p-3 rounded-full transition-transform group-hover:scale-110 ${theme === 'dark' ? 'bg-indigo-900 text-indigo-300' : 'bg-indigo-100 text-indigo-600'}`}>
                        <BookOpen size={24} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">Oraison guidée</h3>
                        <p className={`text-sm ${theme === 'dark' ? 'text-stone-300' : 'text-stone-600'}`}>
                          Un parcours balisé : préparation, entrée corps et fin de l'oraison.
                        </p>
                      </div>
                      <ChevronRight className="text-stone-300" />
                    </div>
                  </Card>

                  <Card theme={theme} className="cursor-pointer hover:border-indigo-300 transition-colors group">
                     <div onClick={() => setView('free')} className="flex items-center gap-4">
                      <div className={`p-3 rounded-full transition-transform group-hover:scale-110 ${theme === 'dark' ? 'bg-teal-900 text-teal-300' : 'bg-teal-100 text-teal-600'}`}>
                        <Clock size={24} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">Minuteur Silencieux</h3>
                        <p className={`text-sm ${theme === 'dark' ? 'text-stone-300' : 'text-stone-600'}`}>Gérez votre temps de prière en toute simplicité.</p>
                      </div>
                      <ChevronRight className="text-stone-300" />
                    </div>
                  </Card>

                  <Card theme={theme} className="cursor-pointer hover:border-indigo-300 transition-colors group">
                    <div onClick={() => setView('journal')} className="flex items-center gap-4">
                      <div className={`p-3 rounded-full transition-transform group-hover:scale-110 ${theme === 'dark' ? 'bg-amber-900 text-amber-300' : 'bg-amber-100 text-amber-600'}`}>
                        <PenTool size={24} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">Carnet Spirituel</h3>
                        <p className={`text-sm ${theme === 'dark' ? 'text-stone-300' : 'text-stone-600'}`}>Notez vos grâces, résolutions et pensées.</p>
                      </div>
                      <ChevronRight className="text-stone-300" />
                    </div>
                  </Card>
                </div>

                <div className={`mt-8 p-6 rounded-2xl text-center italic border ${theme === 'dark' ? 'bg-stone-800 text-white border-stone-700' : 'bg-stone-100 text-stone-800 border-stone-200'}`}>
                  "{TEXTS[Math.floor(Math.random() * TEXTS.length)].content}"
                </div>
              </div>
            )}

            {view === 'free' && <FreeTimer onExit={goHome} theme={theme} />}
            {view === 'journal' && <Journal entries={journalEntries} setEntries={setJournalEntries} onExit={goHome} theme={theme} />}
            {view === 'settings' && <SettingsView stepsConfig={stepsConfig} setStepsConfig={setStepsConfig} onExit={goHome} theme={theme} />}

          </main>
        </>
      )}
    </div>
  );
}

// --- Sous-Composants ---

function GuidedSession({ onExit, stepsConfig, theme }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(stepsConfig[0].duration);
  // MODIFICATION: Activé par défaut pour démarrage immédiat
  const [isActive, setIsActive] = useState(true); 
  const [selectedText, setSelectedText] = useState(TEXTS[0]);
  const transitionTimeoutRef = useRef(null);
  
  // NOUVEAU: Référence pour stocker l'heure de fin cible (plus précis que setInterval)
  const endTimeRef = useRef(null);
  const { requestWakeLock, releaseWakeLock } = useWakeLock();

  const currentStep = stepsConfig[stepIndex];
  const isLastStep = stepIndex === stepsConfig.length - 1;

  useEffect(() => { setSelectedText(TEXTS[Math.floor(Math.random() * TEXTS.length)]); }, []);
  useEffect(() => { return () => { if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current); }; }, [stepIndex]);

  // MODIFICATION: Dong d'ouverture + WakeLock
  useEffect(() => {
    playBell(); 
    requestWakeLock();
    return () => releaseWakeLock();
  }, []);

  // INITIALISATION DU TEMPS CIBLE QUAND ON ACTIVE LE TIMER
  useEffect(() => {
    if (isActive && !endTimeRef.current) {
        // Si on active et qu'on n'a pas de cible, on la calcule : Maintenant + temps restant
        endTimeRef.current = Date.now() + timeLeft * 1000;
    } else if (!isActive) {
        // Si on met en pause, on reset la cible (on gardera juste timeLeft figé)
        endTimeRef.current = null;
    }
  }, [isActive]); // On ne dépend PAS de timeLeft ici pour ne pas recalculer à chaque seconde

  // BOUCLE DE MINUTEUR ROBUSTE
  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        if (endTimeRef.current) {
             const now = Date.now();
             const remaining = Math.ceil((endTimeRef.current - now) / 1000);
             
             if (remaining <= 0) {
                 // FIN DU TIMER
                 setTimeLeft(0);
                 setIsActive(false);
                 endTimeRef.current = null; // Reset
                 
                 // Logique des dongs
                 playBell();
                 
                  // MODIFICATION: Logique des dongs selon l'étape
                  let dongsCount = 0;
                  if (stepIndex === 0) dongsCount = 2; // Fin étape 1 (Corps)
                  else if (stepIndex === 1) dongsCount = 3; // Fin étape 2 (Entrée)
                  else if (stepIndex === 2) dongsCount = 2; // Fin étape 3 (Rencontre)
                  else if (stepIndex === 3) dongsCount = 1; // Fin étape 4 (Résolution)

                  playBellsSequence(dongsCount);

                  // Calcul du délai avant transition
                  const transitionDelay = (dongsCount * 600) + 1000;

                 transitionTimeoutRef.current = setTimeout(() => {
                    if (stepIndex < stepsConfig.length - 1) {
                        const nextIdx = stepIndex + 1;
                        setStepIndex(nextIdx);
                        const nextDuration = stepsConfig[nextIdx].duration;
                        setTimeLeft(nextDuration);
                        // On relance pour la prochaine étape
                        endTimeRef.current = Date.now() + nextDuration * 1000 + transitionDelay; // On ajoute le délai à la cible pour être précis ? Non, on reset juste isActive
                        setIsActive(true); 
                        // Note: Le useEffect [isActive] va recalculer endTimeRef.current proprement
                        endTimeRef.current = null; // Force le recalcul
                    } else { onExit(); }
                 }, transitionDelay);

             } else {
                 setTimeLeft(remaining);
             }
        }
      }, 200); // Check plus fréquent (5 fois par seconde) pour fluidité
    }
    return () => clearInterval(interval);
  }, [isActive, stepIndex, stepsConfig, onExit]);


  const toggleTimer = () => setIsActive(!isActive);
  const nextStep = () => {
    if (stepIndex < stepsConfig.length - 1) {
      const nextIdx = stepIndex + 1;
      setStepIndex(nextIdx);
      const nextD = stepsConfig[nextIdx].duration;
      setTimeLeft(nextD);
      setIsActive(true);
      endTimeRef.current = null; // Force recalcul
    } else { onExit(); }
  };
  const prevStep = () => {
    if (stepIndex > 0) {
      const prevIdx = stepIndex - 1;
      setStepIndex(prevIdx);
      const prevD = stepsConfig[prevIdx].duration;
      setTimeLeft(prevD);
      setIsActive(false); // Pause quand on recule
      endTimeRef.current = null;
    }
  };
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  const progress = ((stepIndex + 1) / stepsConfig.length) * 100;

  return (
    // Utilisation de fixed inset-0 pour garantir le plein écran mobile sans scroll de page
    // CORRECTION : Ajout de la classe "dark" ici aussi pour garantir le style des enfants
    <div className={`fixed inset-0 z-50 flex flex-col max-w-2xl mx-auto px-4 py-4 ${theme === 'dark' ? 'dark bg-stone-900 text-white' : 'bg-stone-50 text-stone-900'}`}>
      <div className="flex justify-between items-center mb-2 shrink-0"> {/* mb-4 réduit à mb-2 */}
        <button onClick={onExit} className={`p-2 rounded-full ${theme === 'dark' ? 'hover:bg-stone-700' : 'hover:bg-stone-200'}`}>
          <X size={24} />
        </button>
        <div className={`w-1/3 h-2 rounded-full overflow-hidden ${theme === 'dark' ? 'bg-stone-700' : 'bg-stone-200'}`}>
          <div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="w-8"></div>
      </div>

      <Card theme={theme} className="flex-1 flex flex-col relative overflow-hidden !p-0 min-h-0">
        <div className="pt-2 pb-1 px-4 text-center shrink-0">
           <span className="text-xs uppercase tracking-widest font-bold text-indigo-500">Étape {stepIndex + 1}/{stepsConfig.length}</span>
           <h2 className={`text-xl font-serif mt-1 ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>{currentStep.title}</h2>
        </div>

        {/* CONTENU CENTRAL : justify-center pour centrer verticalement le bloc texte+minuteur */}
        <div className="flex-1 w-full px-4 overflow-y-auto custom-scrollbar flex flex-col items-center justify-center min-h-0 pt-1"> {/* pt-2 réduit à pt-1 */}
          {currentStep.id === 'reading' ? (
            <div className="w-full max-w-lg mx-auto py-2 animate-fade-in-up my-auto">
              <div className={`p-4 rounded-2xl border shadow-sm ${theme === 'dark' ? 'bg-stone-900 border-stone-700' : 'bg-stone-50 border-stone-200'}`}>
                {/* PRIERE: Indigo foncé jour, Jaune nuit */}
                <p className={`font-serif text-sm leading-relaxed text-center font-medium ${theme === 'dark' ? '!text-yellow-300' : 'text-indigo-800'}`}>"{selectedText.content}"</p>
                {/* RESTE: Blanc nuit, Noir jour */}
                <p className={`mt-2 text-xs font-medium text-center ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>— {selectedText.source}</p>
              </div>
              <button 
                onClick={() => setSelectedText(TEXTS[Math.floor(Math.random() * TEXTS.length)])}
                className={`mt-2 text-xs text-indigo-500 flex items-center justify-center gap-2 mx-auto hover:text-indigo-600 transition-colors py-2 px-4 rounded-full ${theme === 'dark' ? 'hover:bg-stone-900' : 'hover:bg-stone-50'}`}
              >
                <RefreshCw size={14} /> <span>Autre texte</span>
              </button>
            </div>
          ) : (
            // Utilisation de my-auto pour centrer verticalement SI il y a de la place, sinon scroll normal
            <div className="w-full max-w-lg mx-auto my-auto pt-2">
              {/* Optimisation pour mobile : text-base comme demandé, leading-snug */}
              <div className={`text-xs whitespace-pre-wrap leading-snug animate-fade-in text-center font-serif ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>
                {currentStep.description}
              </div>
            </div>
          )}

          {/* Minuteur collé au texte (mt-4) */}
          <div className="py-0 flex justify-center items-center gap-4 shrink-0 mt-4 mb-2">
            <div className={`text-3xl md:text-4xl font-light tabular-nums tracking-tight opacity-80 ${theme === 'dark' ? 'text-indigo-200' : 'text-indigo-900'}`}>
              {formatTime(timeLeft)}
            </div>
            <Button variant="outline" onClick={toggleTimer} className={`rounded-full w-10 h-10 !p-0 flex items-center justify-center border-2 ${theme === 'dark' ? 'border-indigo-800 hover:border-indigo-500' : 'border-indigo-200 hover:border-indigo-500'}`}>
              {isActive ? <Pause size={18} /> : <Play size={18} className="ml-1" />}
            </Button>
          </div>
        </div>

        <div className={`w-full flex justify-between p-4 pt-2 border-t shrink-0 rounded-b-2xl ${theme === 'dark' ? 'bg-stone-800 border-stone-700' : 'bg-white border-stone-100'}`}> {/* pt-3 réduit à pt-2 */}
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

function SettingsView({ stepsConfig, setStepsConfig, onExit, theme }) {
  const updateDuration = (index, change) => {
    const newSteps = [...stepsConfig];
    const newDuration = Math.max(10, newSteps[index].duration + change * 10);
    newSteps[index].duration = newDuration;
    setStepsConfig(newSteps);
  };
  const formatDurationSetting = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="flex flex-col h-[80vh]">
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-2xl font-serif ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>Réglages</h2>
        <button onClick={onExit} className={`p-2 rounded-full ${theme === 'dark' ? 'hover:bg-stone-700' : 'hover:bg-stone-200'}`}>
            <X size={24} />
        </button>
      </div>

      <Card theme={theme} className="flex-1 overflow-y-auto custom-scrollbar">
        <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-6">Durée des étapes</h3>
        <div className="space-y-6">
          {stepsConfig.map((step, index) => (
            <div key={step.id} className={`flex items-center justify-between pb-4 border-b last:border-0 ${theme === 'dark' ? 'border-stone-700' : 'border-stone-100'}`}>
              <div className="flex-1">
                <div className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>{step.title}</div>
                <div className="text-xs text-stone-400 mt-1">Par défaut : {formatDurationSetting(STEPS_CONTENT[index].defaultDuration)}</div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => updateDuration(index, -1)} className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${theme === 'dark' ? 'bg-stone-700 hover:bg-stone-600 text-stone-300' : 'bg-stone-100 hover:bg-stone-200 text-stone-600'}`}>
                  <Minus size={16} />
                </button>
                <div className={`w-20 text-center font-mono text-lg font-medium ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`}>
                   {formatDurationSetting(step.duration)}
                </div>
                <button onClick={() => updateDuration(index, 1)} className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${theme === 'dark' ? 'bg-stone-700 hover:bg-stone-600 text-stone-300' : 'bg-stone-100 hover:bg-stone-200 text-stone-600'}`}>
                  <Plus size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className={`mt-8 p-4 rounded-xl text-sm border ${theme === 'dark' ? 'bg-stone-900 text-stone-400 border-stone-700' : 'bg-stone-50 text-stone-500 border-stone-200'}`}>
           Note : Ces réglages s'appliquent à votre prochaine oraison guidée. Le minuteur se lancera automatiquement à chaque changement d'étape.
        </div>
      </Card>
    </div>
  );
}

function FreeTimer({ onExit, theme }) {
  const [duration, setDuration] = useState(15);
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('setup'); 

  // Minuteur libre robuste avec Date.now()
  const endTimeRef = useRef(null);
  const { requestWakeLock, releaseWakeLock } = useWakeLock();

  useEffect(() => {
    if (isActive) requestWakeLock();
    else releaseWakeLock();
  }, [isActive]);

  useEffect(() => {
    if (isActive && !endTimeRef.current) {
        endTimeRef.current = Date.now() + timeLeft * 1000;
    } else if (!isActive) {
        endTimeRef.current = null;
    }
  }, [isActive]);

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
         if (endTimeRef.current) {
             const now = Date.now();
             const remaining = Math.ceil((endTimeRef.current - now) / 1000);
             if (remaining <= 0) {
                 setTimeLeft(0);
                 setIsActive(false);
                 setMode('done');
                 playBell();
             } else {
                 setTimeLeft(remaining);
             }
         }
      }, 200);
    }
    return () => clearInterval(interval);
  }, [isActive]);


  const startTimer = () => { setTimeLeft(duration * 60); setMode('running'); setIsActive(true); };
  const resetTimer = () => { setIsActive(false); setMode('setup'); };
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="flex flex-col h-[80vh] justify-center">
      <div className="absolute top-0 right-0 p-4">
          <button onClick={onExit} className={`p-2 rounded-full ${theme === 'dark' ? 'hover:bg-stone-700' : 'hover:bg-stone-200'}`}>
            <X size={24} />
          </button>
      </div>

      <Card theme={theme} className="text-center py-12">
        {mode === 'setup' && (
          <div className="animate-fade-in">
            <h2 className={`text-2xl font-serif mb-8 ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>Durée de l'oraison</h2>
            <div className="flex justify-center items-center gap-6 mb-10">
              <button onClick={() => setDuration(d => Math.max(5, d - 5))} className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${theme === 'dark' ? 'bg-stone-700 hover:bg-stone-600' : 'bg-stone-100 hover:bg-stone-200'}`}>-</button>
              <div className={`text-5xl font-light w-32 ${theme === 'dark' ? 'text-indigo-200' : 'text-indigo-900'}`}>{duration} <span className="text-base text-stone-500">min</span></div>
              <button onClick={() => setDuration(d => Math.min(60, d + 5))} className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${theme === 'dark' ? 'bg-stone-700 hover:bg-stone-600' : 'bg-stone-100 hover:bg-stone-200'}`}>+</button>
            </div>
            <Button onClick={startTimer} className="w-48 mx-auto !py-3 text-lg">Commencer</Button>
          </div>
        )}

        {mode === 'running' && (
          <div className="animate-fade-in">
            <div className="mb-4 text-stone-400 text-sm uppercase tracking-widest">Temps restant</div>
            <div className={`text-7xl font-light tabular-nums tracking-tight mb-10 ${theme === 'dark' ? 'text-indigo-200' : 'text-indigo-900'}`}>{formatTime(timeLeft)}</div>
            <div className="flex justify-center gap-4">
              <Button variant="outline" onClick={() => setIsActive(!isActive)} className="rounded-full w-16 h-16 !p-0 flex items-center justify-center border-2">
                {isActive ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
              </Button>
              <Button variant="ghost" onClick={resetTimer} className="rounded-full w-16 h-16 !p-0 flex items-center justify-center text-stone-400 hover:text-red-500"><X size={28} /></Button>
            </div>
            <div className="mt-12 text-stone-400 text-sm italic">"Il suffit de se tenir devant Lui."</div>
          </div>
        )}

        {mode === 'done' && (
          <div className="animate-fade-in">
            <h2 className={`text-3xl font-serif mb-4 ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-800'}`}>Temps écoulé</h2>
            <p className={`mb-8 ${theme === 'dark' ? 'text-stone-400' : 'text-stone-600'}`}>Votre temps de prière est terminé. Prenez un moment pour remercier.</p>
            <Button onClick={onExit}>Retour à l'accueil</Button>
          </div>
        )}
      </Card>
    </div>
  );
}

function Journal({ entries, setEntries, onExit, theme }) {
  const [text, setText] = useState('');
  const saveEntry = () => {
    if (!text.trim()) return;
    const newEntry = { id: Date.now(), date: new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }), text: text };
    setEntries([newEntry, ...entries]); setText('');
  };
  const deleteEntry = (id) => { setEntries(entries.filter(e => e.id !== id)); };

  return (
    <div className="h-[85vh] flex flex-col">
       <div className="flex justify-between items-center mb-4">
        <h2 className={`text-2xl font-serif ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>Mon Carnet</h2>
        <button onClick={onExit} className={`p-2 rounded-full ${theme === 'dark' ? 'hover:bg-stone-700' : 'hover:bg-stone-200'}`}><X size={24} /></button>
      </div>

      <div className="grid md:grid-cols-2 gap-6 h-full overflow-hidden">
        <div className="flex flex-col gap-4">
          <Card theme={theme} className="flex-1 flex flex-col p-4">
            <label className="text-sm font-semibold text-stone-500 mb-2 uppercase tracking-wide">Nouvelle Note</label>
            <textarea 
              className={`flex-1 w-full p-4 rounded-lg resize-none focus:outline-none focus:ring-2 leading-relaxed ${theme === 'dark' ? 'bg-stone-900 focus:ring-indigo-800 text-white' : 'bg-stone-50 focus:ring-indigo-200 text-stone-900'}`}
              placeholder="Quelles grâces avez-vous reçues ? Quelle résolution prenez-vous ?"
              value={text} onChange={(e) => setText(e.target.value)}
            />
            <div className="mt-4 flex justify-end">
              <Button onClick={saveEntry} disabled={!text.trim()}>Enregistrer</Button>
            </div>
          </Card>
        </div>

        <div className="overflow-y-auto pr-2 space-y-4 pb-10 custom-scrollbar">
          {entries.length === 0 && (
            <div className="text-center py-10 text-stone-400">
              <PenTool size={48} className="mx-auto mb-4 opacity-20" />
              <p>Votre carnet est vide pour le moment.</p>
            </div>
          )}
          {entries.map(entry => (
            <div key={entry.id} className={`p-5 rounded-xl border shadow-sm relative group animate-fade-in-up ${theme === 'dark' ? 'bg-stone-800 border-stone-700' : 'bg-white border-stone-100'}`}>
              <div className="text-xs font-bold text-indigo-500 uppercase mb-2">{entry.date}</div>
              <p className={`whitespace-pre-wrap font-serif ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>{entry.text}</p>
              <button onClick={() => deleteEntry(entry.id)} className="absolute top-2 right-2 p-2 text-stone-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><X size={16} /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
