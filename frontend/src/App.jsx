import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import CategoryArticles from './pages/CategoryArticles';
import Focus from './pages/Focus';
import ArticleDetail from './pages/ArticleDetail';
import ArticleWrite from './pages/ArticleWrite';
import UserProfile from './pages/UserProfile';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Banner from './components/Banner';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogin = (userData, token) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    if (token) {
      localStorage.setItem('token', token);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <Router>
      <div className="App">
        <Navbar user={user} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={
            <>
              <Banner />
              <Home />
            </>
          } />
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} />
          <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
          <Route path="/focus" element={<Focus />} />
          <Route path="/articles/category/:categoryId" element={<CategoryArticles />} />
          <Route path="/article/:id" element={<ArticleDetail user={user} />} />
          <Route path="/write" element={user ? <ArticleWrite user={user} /> : <Navigate to="/login" />} />
          <Route path="/user/:username" element={<UserProfile />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;