import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { initDesignSwitcher } from './designs';

initDesignSwitcher();
createRoot(document.getElementById('root')).render(<App />);
