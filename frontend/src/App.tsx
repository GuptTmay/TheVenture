import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { ThemeProvider } from './components/theme-provider';
import Layout from './pages/Layout';
import Hero from './pages/Hero';
import LogIn from './pages/LogIn';
import Register from './pages/Register';
import Feeds from './pages/Feeds';
import { NoPage } from './pages/NoPage';

function App() {
  return (
    <>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route index element={<Hero />} />
            <Route path="/" element={<Layout />}>
              <Route path="feeds" element={<Feeds />} />
            </Route>
            <Route path="login" element={<LogIn />} />
            <Route path="register" element={<Register />} />
            <Route path="*" element={<NoPage />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </>
  );
}
export default App;
