import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Suspense, lazy, useEffect, useState } from 'react';
import Lenis from 'lenis';
import { Toaster } from 'react-hot-toast';

import PageWrapper from './components/layout/PageWrapper';
import GhostCursor from './components/cursor/GhostCursor';
import GlobalLoader from './components/animations/GlobalLoader';
import useFinanceStore from './store/useFinanceStore';
import { generateMockData } from './utils/generateMockData';

const Login        = lazy(() => import('./pages/Login'));
const Dashboard    = lazy(() => import('./pages/Dashboard'));
const Transactions = lazy(() => import('./pages/Transactions'));
const Analytics    = lazy(() => import('./pages/Analytics'));
const Budget       = lazy(() => import('./pages/Budget'));
const Settings     = lazy(() => import('./pages/Settings'));

function App() {
  const { transactions, theme } = useFinanceStore();
  const [appLoaded, setAppLoaded] = useState(false);

  useEffect(() => {
    const stored = useFinanceStore.getState().theme;
    if (stored !== 'dark') {
      useFinanceStore.setState({ theme: 'dark' });
    }
    document.documentElement.classList.remove('light');
  }, []);

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }

    if (transactions.length === 0) {
      useFinanceStore.setState({ transactions: generateMockData(50) });
    }
  }, [transactions, theme]);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  return (
    <>
      {!appLoaded && <GlobalLoader onComplete={() => setAppLoaded(true)} />}
      <div style={{ opacity: appLoaded ? 1 : 0, transition: 'opacity 0.5s ease', minHeight: '100vh' }}>
        <div className="noise-overlay" />
        <GhostCursor />
        <BrowserRouter>
          <Toaster
            position="top-right"
            toastOptions={{
              className: 'custom-toast',
              style: {
                background:    'rgba(255, 255, 255, 0.05)',
                backdropFilter:'blur(20px)',
                color:         '#fff',
                border:        '1px solid rgba(0, 255, 136, 0.2)',
                fontFamily:    '"Space Grotesk", sans-serif',
              },
            }}
          />
          <Suspense
            fallback={
              <div className="w-full flex flex-col items-center justify-center bg-background text-primary font-mono">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                Loading Nexus Finance...
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<Login />} />
              <Route element={<PageWrapper />}>
                <Route path="/dashboard"    element={<Dashboard />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/analytics"    element={<Analytics />} />
                <Route path="/budget"       element={<Budget />} />
                <Route path="/settings"     element={<Settings />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
