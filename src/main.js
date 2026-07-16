import './styles.css';
import { HajjUmrahApp } from './app.js';

const app = new HajjUmrahApp();
app.init();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const swUrl = `${import.meta.env.BASE_URL}sw.js`;
    navigator.serviceWorker.register(swUrl).catch((error) => {
      console.warn('Service worker registration skipped:', error);
    });
  });
}
