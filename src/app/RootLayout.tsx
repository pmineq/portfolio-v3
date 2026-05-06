import { Outlet, useLocation } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Header from 'components/layout/Header';
import Footer from 'components/layout/Footer';
import BootLoader from 'components/common/Loader/Loader';
import AchievementToast from 'components/common/AchievementToast/AchievementToast';
import LocationHUD from 'components/common/LocationHUD/LocationHUD';
import KonamiEffect from 'components/common/KonamiEffect/KonamiEffect';
import { GameProvider, useGame } from 'context/GameContext';
import { useKonamiCode } from 'hooks/useKonamiCode';

function Layout() {
  const [boot, setBoot] = useState(true);
  const [konamiActive, setKonamiActive] = useState(false);
  const location = useLocation();
  const { playTransition, trackPage, unlock } = useGame();

  const handleKonami = useCallback(() => {
    unlock('legendary');
    setKonamiActive(true);
  }, [unlock]);

  useKonamiCode(handleKonami);

  useEffect(() => {
    const t = setTimeout(() => setBoot(false), 1200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!boot) {
      playTransition();
      trackPage(location.pathname);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <>
      <AnimatePresence>{boot && <BootLoader />}</AnimatePresence>
      {!boot && (
        <>
          <Header />
          <main className="container">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: 'easeInOut' }}
                style={{ display: 'flex', width: '100%', height: '100%' }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </main>
          <Footer />
          <AchievementToast />
          {location.pathname !== '/about' && location.pathname !== '/career' && <LocationHUD />}
          {konamiActive && <KonamiEffect onDone={() => setKonamiActive(false)} />}
        </>
      )}
    </>
  );
}

export default function RootLayout() {
  return (
    <GameProvider>
      <Layout />
    </GameProvider>
  );
}
