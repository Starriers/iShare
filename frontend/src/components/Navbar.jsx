import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './Navbar.css';

function Navbar({ user, onLogout }) {
  const [searchKeyword, setSearchKeyword] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      navigate(`/articles/search?keyword=${encodeURIComponent(searchKeyword)}`);
    }
  };

  return (
    <>
      <header id="header">
        <div className="inner">
          <Link to="/" className="logo">i Share</Link>
          <div id="nav">
            <Link to="/">首页</Link>
            <Link to="/label">标签</Link>
            <Link to="#">专栏</Link>
            <a>
              <form className="search" onSubmit={handleSearch}>
                <input 
                  className="sinput" 
                  placeholder="搜索标签" 
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                />
                <span className="sspan" onClick={handleSearch}></span>
              </form>
            </a>
            {/* 暂时隐藏登录、注册、写文章功能 */}
            {/* {user ? (
              <>
                <Link to="/write">写文章</Link>
                <Link to={`/user/${user.username}`}>{user.username}</Link>
                <Link to="#" onClick={(e) => { e.preventDefault(); onLogout(); }}>退出</Link>
              </>
            ) : (
              <>
                <Link to="/write">写文章</Link>
                <Link to="/login">登录</Link>
                <Link to="/register">注册</Link>
              </>
            )} */}
          </div>
        </div>
      </header>
      <a href="#menu" className="navPanelToggle"><span className="fa fa-bars"></span></a>
    </>
  );
}

export default Navbar;