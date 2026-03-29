import { useState, useEffect } from "react";
import { PetProvider } from "./context/PetContext";
import { ProgressProvider } from "./context/ProgressContext";
import { supabase } from "./lib/supabase";
import Auth from "./components/pages/Auth";
import Navbar from "./components/common/Navbar";
import Hero from "./components/pages/Hero";
import LevelPreview from "./components/pages/LevelPreview";
import Footer from "./components/common/Footer";
import Dashboard from "./components/pages/Dashboard";
import Profile from "./components/pages/Profile";
import Adventures from "./components/pages/Adventures";
import MiniGamesHub from "./components/minigames/MiniGamesHub";
import LanguagePicker from "./components/lessons/LanguagePicker";
import LessonPlayer from "./components/lessons/LessonPlayer";
import LessonListPage from "./components/lessons/LessonListPage";

function App() {
  const [view, setView] = useState<
    | "landing"
    | "dashboard"
    | "auth"
    | "profile"
    | "adventures"
    | "minigames"
    | "languagePicker"
    | "lessonList"
    | "lessonPlayer"
  >("landing");
  const [selectedLang, setSelectedLang] = useState<"en" | "es" | "zh">("en");
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      if (event === "SIGNED_OUT") {
        setView("landing");
        setSession(null);
      } else if (event === "SIGNED_IN" || event === "INITIAL_SESSION") {
        setSession(session);
        if (session) {
          setView((prev) => {
            if (event === "SIGNED_IN" && prev === "auth") return "profile";
            if (prev === "landing") return "dashboard";
            return prev;
          });
        }
      } else if (session) {
        setSession(session);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleStart = () => {
    if (session) { setView("dashboard"); } else { setView("auth"); }
    window.scrollTo(0, 0);
  };

  const handleHome = () => { setView("landing"); window.scrollTo(0, 0); };

  const handleAdventures = () => {
    if (!session) { setView("auth"); window.scrollTo(0, 0); return; }
    setView("adventures");
    window.scrollTo(0, 0);
  };

  const handleDashboard = () => {
    if (!session) { setView("auth"); window.scrollTo(0, 0); return; }
    setView("dashboard");
    window.scrollTo(0, 0);
  };

  const handleAuthView = () => { setView("auth"); window.scrollTo(0, 0); };
  const handleProfile  = () => {
    if (!session) { setView("auth"); window.scrollTo(0, 0); return; }
    setView("profile");
    window.scrollTo(0, 0);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setView("landing");
    window.scrollTo(0, 0);
  };

  // Navigate to lesson list for a given language
  const goToLessonList = (lang: "en" | "es" | "zh") => {
    setSelectedLang(lang);
    setView("lessonList");
    window.scrollTo(0, 0);
  };

  return (
    <ProgressProvider>
      <PetProvider>
        <div className="appContainer">
          <Navbar
            view={view}
            session={session}
            onAuth={handleAuthView}
            onHome={handleHome}
            onDashboard={handleDashboard}
            onAdventures={handleAdventures}
            onProfile={handleProfile}
          />
          <main>
            {view === "landing" ? (
              <>
                <Hero onStart={handleStart} onAdventures={handleAdventures} />
                <LevelPreview />
                <Footer />
              </>
            ) : view === "auth" ? (
              <div className="min-h-screen pt-32 flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
                <Auth onBack={() => setView("landing")} />
              </div>
            ) : view === "profile" ? (
              <Profile session={session} onLogout={handleLogout} />
            ) : view === "adventures" ? (
              <Adventures
                onSelectLanguage={goToLessonList}
                onBack={handleDashboard}
              />
            ) : view === "minigames" ? (
              <MiniGamesHub onBack={() => setView("dashboard")} />
            ) : view === "languagePicker" ? (
              <LanguagePicker
                onSelect={(lang: "en" | "es" | "zh") => {
                  setSelectedLang(lang);
                  setView("lessonPlayer");
                }}
                onBack={() => setView("dashboard")}
              />
            ) : view === "lessonList" ? (
              <LessonListPage
                language={selectedLang}
                onSelectLesson={(id) => {
                  setSelectedLessonId(id);
                  setView("lessonPlayer");
                }}
                onBack={() => setView("adventures")}
              />
            ) : view === "lessonPlayer" ? (
              <LessonPlayer
                lessonId={selectedLessonId || 'unknown'}
                language={selectedLang}
                onExit={() => setView("lessonList")}
              />
            ) : (
              <Dashboard
                onMinigames={() => setView("minigames")}
                onLessons={() => setView("languagePicker")}
              />
            )}
          </main>
        </div>
      </PetProvider>
    </ProgressProvider>
  );
}

export default App;
