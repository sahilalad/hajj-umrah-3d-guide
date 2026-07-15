import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppProvider } from './components/AppContext';
import { Layout } from './components/Layout';
import { ChapterPage } from './pages/ChapterPage';
import { DuasPage } from './pages/DuasPage';
import { GuidePage } from './pages/GuidePage';
import { HomePage } from './pages/HomePage';
import { JourneyPage } from './pages/JourneyPage';
import { SourceBookPage } from './pages/SourceBookPage';
import { ToolsPage } from './pages/ToolsPage';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/journey/:type" element={<JourneyPage />} />
            <Route path="/guide" element={<GuidePage />} />
            <Route path="/guide/:id" element={<ChapterPage />} />
            <Route path="/duas" element={<DuasPage />} />
            <Route path="/tools" element={<ToolsPage />} />
            <Route path="/source-book" element={<SourceBookPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
