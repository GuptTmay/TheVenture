import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { ThemeProvider } from './components/theme-provider';
import Hero from './pages/Hero';
import LogIn from './pages/LogIn';
import Register from './pages/Register';
import Feeds from './pages/Feeds';
import { NoPage } from './pages/NoPage';
import { Toaster } from 'sonner';
import CreateBlog from './pages/CreateBlog';
import ReadBlog from './pages/ReadBlog';
import AiBlog from './pages/AiBlog';
import { UserBlog } from './pages/UserBlog';

function App() {
  return (
    <>
      <ThemeProvider>
        <Toaster richColors position="top-center" theme="system" />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Hero />} />
            <Route path="feeds" element={<Feeds />} />
            <Route path="/blog">
              <Route path="read/:id" element={<ReadBlog />} />
              <Route path="create" element={<CreateBlog />} />
              <Route path="ai" element={<AiBlog />} />
              <Route path="user" element={<UserBlog />} />
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
