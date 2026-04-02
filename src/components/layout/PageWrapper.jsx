import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { AnimatePresence, motion } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0,   scale: 0.995 },
  animate: { opacity: 1,   scale: 1     },
  exit:    { opacity: 0,   scale: 1.005 },
};

const pageTransition = {
  duration: 0.28,
  ease: [0.25, 0.46, 0.45, 0.94],
};

const PageWrapper = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex bg-background min-h-screen w-screen overflow-x-hidden">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 md:pl-[280px] flex flex-col relative w-full overflow-x-hidden">
        <div className="noise-overlay" />
        <div className="grid-bg" />

        <div className="relative z-10 px-4 md:px-8">
          <Header onMenuOpen={() => setIsSidebarOpen(true)} />
        </div>

        <main
          className="flex-1 pt-6 px-4 md:px-8 pb-8 relative z-10 w-full overflow-y-auto custom-scrollbar"
          style={{ minHeight: 0 }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={location.pathname}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={pageTransition}
              style={{
                width:                  '100%',
                display:                'flex',
                flexDirection:          'column',
                minHeight:              '100%',
                willChange:             'opacity, transform',
                backfaceVisibility:     'hidden',
                WebkitBackfaceVisibility: 'hidden',
              }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default PageWrapper;
