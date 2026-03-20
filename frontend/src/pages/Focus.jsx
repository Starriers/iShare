import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { articleAPI } from '../api/api';
import './Focus.css';

const TOPICS = [
  { key: 'all', label: '全部焦点', keywords: [] },
  { key: 'ai', label: 'AI 工程化', keywords: ['ai', 'agent', '模型', 'llm', '智能'] },
  { key: 'frontend', label: '前端体验', keywords: ['react', 'vite', '前端', 'ui', '交互'] },
  { key: 'backend', label: '后端架构', keywords: ['spring', '后端', 'api', '缓存', '数据库'] },
  { key: 'devops', label: 'DevOps', keywords: ['docker', 'ci', '部署', '流水线', 'k8s'] },
];

const FOLLOWED_AUTHORS = ['alice', 'bob', 'carol'];

function Focus() {
  const [focusArticles, setFocusArticles] = useState([]);
  const [latestArticles, setLatestArticles] = useState([]);
  const [activeTopic, setActiveTopic] = useState('all');
  const [onlyFollowed, setOnlyFollowed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadFocusData = async () => {
      try {
        setLoading(true);
        setError('');
        const [itRes, latestRes] = await Promise.all([
          articleAPI.getArticlesByCategory(1),
          articleAPI.getArticlePage(1, 8),
        ]);

        if (itRes?.code === 200) {
          setFocusArticles(itRes.data || []);
        }
        if (latestRes?.code === 200) {
          setLatestArticles(latestRes.data?.items || []);
        }
        if (itRes?.code !== 200 && latestRes?.code !== 200) {
          setError('焦点内容加载失败');
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || '网络错误');
      } finally {
        setLoading(false);
      }
    };

    loadFocusData();
  }, []);

  const filteredFocusArticles = useMemo(() => {
    let list = [...focusArticles];
    if (onlyFollowed) {
      list = list.filter((article) => FOLLOWED_AUTHORS.includes(article.author));
    }

    if (activeTopic === 'all') {
      return list;
    }

    const topic = TOPICS.find((item) => item.key === activeTopic);
    if (!topic) {
      return list;
    }

    return list.filter((article) => {
      const haystack = `${article.title || ''} ${article.summary || ''} ${article.content || ''}`.toLowerCase();
      return topic.keywords.some((keyword) => haystack.includes(keyword.toLowerCase()));
    });
  }, [focusArticles, activeTopic, onlyFollowed]);

  if (loading) {
    return (
      <div className="focus-page">
        <div className="focus-container">
          <div className="focus-loading">正在加载今日焦点...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="focus-page">
        <div className="focus-container">
          <div className="focus-error">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="focus-page">
      <div className="focus-container">
        <section className="focus-hero">
          <div>
            <h1>🔥 今日焦点</h1>
            <p>面向你关注的技术方向：互联网产品、工程实践与最新技术动态。</p>
            <div className="focus-stats">
              <span>IT 文章 {focusArticles.length}</span>
              <span>关注作者 {FOLLOWED_AUTHORS.length}</span>
              <span>快讯 {latestArticles.length}</span>
            </div>
          </div>
          <Link to="/" className="focus-back">返回首页</Link>
        </section>

        <section className="focus-topics">
          {TOPICS.map((topic) => (
            <button
              key={topic.key}
              className={`topic-chip ${activeTopic === topic.key ? 'active' : ''}`}
              onClick={() => setActiveTopic(topic.key)}
            >
              {topic.label}
            </button>
          ))}
          <button
            className={`follow-toggle ${onlyFollowed ? 'active' : ''}`}
            onClick={() => setOnlyFollowed((prev) => !prev)}
          >
            {onlyFollowed ? '仅看关注中 ✓' : '仅看关注中'}
          </button>
        </section>

        <section className="focus-layout">
          <div className="focus-main">
            {filteredFocusArticles.length === 0 ? (
              <div className="focus-empty">当前筛选下暂无焦点文章。</div>
            ) : (
              filteredFocusArticles.map((article) => (
                <article key={article.id} className="focus-card">
                  <h3><Link to={`/article/${article.id}`}>{article.title}</Link></h3>
                  <p className="focus-meta">{article.author} · {article.date}</p>
                  <p className="focus-summary">{article.summary}</p>
                  <Link to={`/article/${article.id}`} className="focus-read">阅读详情 →</Link>
                </article>
              ))
            )}
          </div>

          <aside className="focus-side">
            <div className="side-panel">
              <h4>技术快讯</h4>
              <ul>
                {latestArticles.slice(0, 6).map((item) => (
                  <li key={item.id}>
                    <Link to={`/article/${item.id}`}>{item.title}</Link>
                    <span>{item.date}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="side-panel">
              <h4>关注作者</h4>
              <div className="author-pills">
                {FOLLOWED_AUTHORS.map((author) => (
                  <span key={author}>{author}</span>
                ))}
              </div>
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
}

export default Focus;
