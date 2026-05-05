import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import Personal from './pages/Personal';
import Vacaciones from './pages/Vacaciones';
import Contratos from './pages/Contratos';
import Boletas from './pages/Boletas';

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Personal />} />
          <Route path="/vacaciones" element={<Vacaciones />} />
          <Route path="/contratos" element={<Contratos />} />
          <Route path="/boletas" element={<Boletas />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;
