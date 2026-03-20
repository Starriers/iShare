import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { articleAPI } from '../api/api';
import './CategoryArticles.css';

const CATEGORY_MAP = {
  1: 'IT 互联网',
  2: '生活实用',
  3: '美食',
  4: '旅行',
  5: '阅读',
  7: '旅行',
  8: '阅读',
};

const CATEGORY_THEME = {
  1: { icon: '💻', subtitle: '技术实践与工具记录', tone: 'tech' },
  2: { icon: '🏡', subtitle: '日常生活经验与技巧', tone: 'life' },
  3: { icon: '🍜', subtitle: '美食体验与制作灵感', tone: 'food' },
  4: { icon: '✈️', subtitle: '旅行路线与城市探索', tone: 'travel' },
  5: { icon: '📚', subtitle: '阅读笔记与书单摘录', tone: 'reading' },
  7: { icon: '✈️', subtitle: '旅行路线与城市探索', tone: 'travel' },
  8: { icon: '📚', subtitle: '阅读笔记与书单摘录', tone: 'reading' },
};

function CategoryArticles() {
  const { categoryId } = useParams();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [authorFilter, setAuthorFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');

  const categoryName = CATEGORY_MAP[Number(categoryId)] || `分类 ${categoryId}`;
  const categoryTheme = CATEGORY_THEME[Number(categoryId)] || {
    icon: '📝',
    subtitle: '分类文章列表',
    tone: 'life',
  };

  useEffect(() => {
    const loadCategoryArticles = async () => {
      try {
        setLoading(true);
        setError('');
        setAuthorFilter('all');
        setViewMode(Number(categoryId) === 1 ? 'list' : 'grid');
        const response = await articleAPI.getArticlesByCategory(categoryId);
        if (response?.code === 200) {
          setArticles(response.data || []);
        } else {
          setError(response?.message || '分类文章加载失败');
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || '网络错误');
      } finally {
        setLoading(false);
      }
    };

    loadCategoryArticles();
  }, [categoryId]);

  const authors = useMemo(() => {
    const uniqueAuthors = Array.from(new Set((articles || []).map((article) => article.author).filter(Boolean)));
    return uniqueAuthors;
  }, [articles]);

  const filteredArticles = useMemo(() => {
    if (authorFilter === 'all') {
      return articles;
    }
    return articles.filter((article) => article.author === authorFilter);
  }, [articles, authorFilter]);

  if (loading) {
    return (
      <div className={`category-page ${categoryTheme.tone}`}>
        <div className="category-container">
          <div className="category-skeleton-head shimmer"></div>
          <div className="category-skeleton-toolbar shimmer"></div>
          <div className="category-skeleton-grid">
            <div className="category-skeleton-card shimmer"></div>
            <div className="category-skeleton-card shimmer"></div>
            <div className="category-skeleton-card shimmer"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className={`category-page ${categoryTheme.tone}`}><div className="category-state error">{error}</div></div>;
  }

  return (
    <div className={`category-page ${categoryTheme.tone}`}>
      <div className="category-container">
        <div className="category-hero">
          <div>
            <h2>{categoryTheme.icon} {categoryName}</h2>
            <p>{categoryTheme.subtitle}</p>
          </div>
          <Link to="/" className="back-link">返回首页</Link>
        </div>

        <div className="category-stats">
          <span className="stat-pill">文章 {articles.length}</span>
          <span className="stat-pill">作者 {authors.length}</span>
          <span className="stat-pill">当前筛选 {authorFilter === 'all' ? '全部作者' : authorFilter}</span>
        </div>

        <div className="category-toolbar">
          <div className="filter-group">
            <button
              className={`filter-chip ${authorFilter === 'all' ? 'active' : ''}`}
              onClick={() => setAuthorFilter('all')}
            >
              全部
            </button>
            {authors.map((author) => (
              <button
                key={author}
                className={`filter-chip ${authorFilter === author ? 'active' : ''}`}
                onClick={() => setAuthorFilter(author)}
              >
                {author}
              </button>
            ))}
          </div>

          <div className="view-switch">
            <button
              className={`switch-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              卡片
            </button>
            <button
              className={`switch-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              列表
            </button>
          </div>
        </div>

        {filteredArticles.length === 0 ? (
          <div className="category-state">这个分类还没有文章。</div>
        ) : (
          <div className={`articles-wrap ${viewMode}`}>
            {filteredArticles.map((article) => (
              <article key={article.id} className="category-card">
                <div className="card-top">
                  <span className="category-badge">{categoryName}</span>
                  <span className="meta">{article.author} · {article.date}</span>
                </div>
                <h3>
                  <Link to={`/article/${article.id}`}>{article.title}</Link>
                </h3>
                <p className="summary">{article.summary}</p>
                <Link className="read-link" to={`/article/${article.id}`}>阅读全文 →</Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CategoryArticles;
