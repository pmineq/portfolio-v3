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
import { preloadImages } from '../utils/preloadImages';
import homeBg from 'assets/images/home/home-bg.webp';
import homeMountain from 'assets/images/home/home-bg-mountain.webp';
import homeCloudLeft from 'assets/images/home/home-bg-cloud-left.webp';
import homeCloudRight from 'assets/images/home/home-bg-cloud-right.webp';
import homeBottom from 'assets/images/home/home-bottom.webp';
import homeBalloon from 'assets/images/home/home-balloon.webp';
import homeZeppelin from 'assets/images/home/home-zeppelin.webp';
import homeSunMoon from 'assets/images/home/home-item-sun-moon-sprite.webp';
import homeCharacterSprite from 'assets/images/home/home-character-sprite.webp';
import homePortalAbout from 'assets/images/home/home-portal-about.webp';
import homePortalCareer from 'assets/images/home/home-portal-career.webp';
import homePortalContact from 'assets/images/home/home-portal-contact.webp';
import guideCat from 'assets/images/home/guide-cat.webp';
import homeCloudNpc from 'assets/images/home/home-cloud-npc.webp';
import secretShop from 'assets/images/home/secret-shop.webp';
import aboutBg from 'assets/images/about/about-bg.webp';
import aboutFloor from 'assets/images/about/about-floor.webp';
import aboutExitDoor from 'assets/images/about/about-exit-door.webp';
import careerBg from 'assets/images/career/career-bg.webp';
import careerFloor from 'assets/images/career/career-floor.webp';
import careerExitDoor from 'assets/images/career/career-exit-door.webp';

const HOME_CRITICAL_IMAGES = [
  homeBg,
  homeMountain,
  homeCloudLeft,
  homeCloudRight,
  homeBottom,
  homeBalloon,
  homeZeppelin,
  homeSunMoon,
  homeCharacterSprite,
  homePortalAbout,
  homePortalCareer,
  homePortalContact,
  guideCat,
  homeCloudNpc,
  secretShop,
];

const ROUTE_IDLE_IMAGES = [
  aboutBg,
  aboutFloor,
  aboutExitDoor,
  careerBg,
  careerFloor,
  careerExitDoor,
];

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
    let mounted = true;
    const minimumBootTime = new Promise(resolve => window.setTimeout(resolve, 420));
    const criticalImages = preloadImages(HOME_CRITICAL_IMAGES);

    Promise.all([minimumBootTime, criticalImages]).then(() => {
      if (!mounted) return;

      setBoot(false);
      const preloadRouteImages = () => {
        void preloadImages(ROUTE_IDLE_IMAGES);
      };

      const requestIdleCallback = window.requestIdleCallback;
      if (typeof requestIdleCallback === 'function') {
        requestIdleCallback(preloadRouteImages, { timeout: 2500 });
      } else {
        globalThis.setTimeout(preloadRouteImages, 800);
      }
    });

    return () => {
      mounted = false;
    };
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
