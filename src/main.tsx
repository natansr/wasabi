import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app/App';
import { AppProviders } from './app/providers';
import './i18n';
import './styles/index.css';
import '@fontsource/source-serif-4/latin-400.css';
import '@fontsource/source-serif-4/latin-600.css';
import '@fontsource/source-serif-4/latin-700.css';

const savedTheme = localStorage.getItem('wasabi.theme');
const initialTheme = savedTheme === 'dark' ? 'dark' : 'light';
document.documentElement.classList.toggle('dark', initialTheme === 'dark');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProviders><App /></AppProviders>
  </StrictMode>,
);
