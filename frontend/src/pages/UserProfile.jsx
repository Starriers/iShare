import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { articleAPI } from '../api/api';
import './UserProfile.css';

function UserProfile() {
  const { username } = useParams();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserArticles();
  }, [username]);

  const loadUserArticles = async () => {
    try {
      const response = await articleAPI.getUserArticles(username);
      if (response.code === 200) {
        setArticles(response.data || []);
      }
    } catch (err) {
      console.error('Failed to load user articles:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading">加载中...</div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>{username}</h1>
        <p>的文章 ({articles.length} 篇)</p>
      </div>
      <div className="articles-list">
        {articles.length === 0 ? (
          <div className="no-articles">该用户还没有发表文章</div>
        ) : (
          articles.map((article) => (
            <article key={article.id} className="article-card">
              <h2>{article.title}</h2>
              <div className="article-meta">
                <span>📅 {formatDate(article.date) || article.date}</span>
              </div>
              {article.summary && (
                <p className="article-summary">{article.summary}</p>
              )}
            </article>
          ))
        )}
      </div>
    </div>
  );
}

export default UserProfile;