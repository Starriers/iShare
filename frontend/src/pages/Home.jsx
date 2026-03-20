import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { articleAPI } from '../api/api';
import './Home.css';

function Home() {
  const pageSize = 6;
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadArticles(page);
  }, [page]);

  const loadArticles = async (targetPage) => {
    try {
      setLoading(true);
      const response = await articleAPI.getArticlePage(targetPage, pageSize);
      if (response && response.code === 200) {
        const pageData = response.data || {};
        setArticles(pageData.items || []);
        setTotalPages(pageData.totalPages || 1);
        setTotal(pageData.total || 0);
      } else {
        setError('加载文章失败: ' + (response?.message || '未知错误'));
      }
    } catch (err) {
      console.error('加载文章错误:', err);
      const errorMsg = err.response?.data?.message || err.message || '网络错误';
      setError(`加载文章失败: ${errorMsg}。请确保后端服务已启动在 http://localhost:8080`);
      
      if (err.code === 'ECONNREFUSED' || err.message?.includes('Network Error')) {
        console.warn('后端服务未启动，请运行后端服务');
      }
    } finally {
      setLoading(false);
    }
  };

  const toPrevPage = () => {
    setPage((prev) => Math.max(prev - 1, 1));
  };

  const toNextPage = () => {
    setPage((prev) => Math.min(prev + 1, totalPages));
  };

  if (loading) {
    return (
      <div className="home-container">
        <div className="loading">加载中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div id="content">
      <div className="page">
        <div className="page1">
          <div className="page2">
            {/* 左侧分类导航 */}
            <div id="left">
              <ul>
                <li>
                  <ul>
                    <li>
                      <Link to="/focus">
                        <span className="icon">🔥</span> &nbsp; 今日焦点
                      </Link>
                    </li>
                    <li>
                      <Link to="#">
                        <span className="icon">⭐</span> &nbsp; 为你推荐
                      </Link>
                    </li>
                    <li>
                      <Link to="/">
                        <span className="icon">📰</span> &nbsp; 最新内容
                      </Link>
                    </li>
                  </ul>
                </li>
                <li>
                  <h4>全部分类</h4>
                  <ul>
                    <li>
                      <Link to="/articles/category/1">
                        <span className="icon">💻</span> &nbsp; IT 互联网
                      </Link>
                    </li>
                    <li>
                      <a href="/summer-notes-preview.html">
                        <span className="icon">🍃</span> &nbsp; 夏日手记
                      </a>
                    </li>
                    <li>
                      <Link to="/articles/category/3">
                        <span className="icon">🍔</span> &nbsp; 美食
                      </Link>
                    </li>
                    <li>
                      <Link to="/articles/category/7">
                        <span className="icon">✈️</span> &nbsp; 旅行
                      </Link>
                    </li>
                    <li>
                      <Link to="/articles/category/8">
                        <span className="icon">📚</span> &nbsp; 阅读
                      </Link>
                    </li>
                    <li>
                      <Link to="#">
                        <span className="icon">📌</span> &nbsp; 更多分类
                      </Link>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>

            {/* 中间文章列表 */}
            <div id="middle">
              {articles.length === 0 ? (
                <div className="no-articles">暂无文章，快来发布第一篇吧！</div>
              ) : (
                <>
                  {articles.map((article) => (
                    <div key={article.id} className="post">
                      <div>
                        <div className="author-avatar">
                          <img src="/api/assert/images/life.png" alt={article.author} width="80" height="80"/>
                        </div>
                        <div className="author-name">
                          <Link to={`/user/${article.author}`}>&nbsp;&nbsp;{article.author}</Link>
                        </div>
                      </div>
                      <div style={{ marginTop: '3px' }}>
                        <h3>
                          <Link to={`/article/${article.id}`}>{article.title}</Link>
                        </h3>
                      </div>
                      <div className="entry">
                        <p>{article.summary}</p>
                        <p>
                          <Link className="btn btn-primary btn-lg" to={`/article/${article.id}`} role="button">
                            阅读全文
                          </Link>
                        </p>
                      </div>
                      <div className="article-actions">
                        <span className="date">{article.date}</span>
                        <div className="action-buttons">
                          <a href="#">
                            <span className="icon">👍</span> &nbsp;120
                          </a>
                          <a href="#">
                            <span className="icon">💬</span> &nbsp;110
                          </a>
                          <a href="#">
                            <span className="icon">⭐</span> &nbsp;100
                          </a>
                        </div>
                      </div>
                      <hr />
                    </div>
                  ))}

                  <div className="pagination">
                    <button className="pagination-btn" onClick={toPrevPage} disabled={page <= 1}>
                      上一页
                    </button>
                    <span className="pagination-info">
                      第 {page} / {totalPages} 页（共 {total} 条）
                    </span>
                    <button className="pagination-btn" onClick={toNextPage} disabled={page >= totalPages}>
                      下一页
                    </button>
                  </div>
                </>
              )}
              <div style={{ clear: 'both' }}>&nbsp;</div>
            </div>

            {/* 右侧推荐 */}
            <div id="right">
              <ul>
                <li>
                  <div className="right-header">
                    <div style={{ float: 'left' }}><h4>作者推荐</h4></div>
                    <div><Link to="#">更多信息</Link></div>
                  </div>
                  <hr />
                  <ul>
                    <li>
                      <div className="author-recommend">
                        <div className="author-avatar-small">
                          <img src="/api/assert/images/life.png" alt="Author" width="80" height="80"/>
                        </div>
                        <div className="author-name-small">
                          &nbsp;&nbsp;Hello World
                        </div>
                        <div className="follow-btn-wrapper">
                          <button className="follow-btn">关注</button>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="author-recommend">
                        <div className="author-avatar-small">
                          <img src="/api/assert/images/life.png" alt="Author" width="80" height="80"/>
                        </div>
                        <div className="author-name-small">
                          &nbsp;&nbsp;Hello World
                        </div>
                        <div className="follow-btn-wrapper">
                          <button className="follow-btn">关注</button>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="author-recommend">
                        <div className="author-avatar-small">
                          <img src="/api/assert/images/life.png" alt="Author" width="80" height="80"/>
                        </div>
                        <div className="author-name-small">
                          &nbsp;&nbsp;Hello World
                        </div>
                        <div className="follow-btn-wrapper">
                          <button className="follow-btn">关注</button>
                        </div>
                      </div>
                    </li>
                  </ul>
                </li>
                <li>
                  <h4>热门标签</h4>
                  <ul className="tags-list">
                    <li><Link to="#" className="label">Aliquam libero</Link></li>
                    <li><Link to="#" className="label">Aliquam libero</Link></li>
                    <li><Link to="#" className="label">Aliquam libero</Link></li>
                    <li><Link to="#" className="label">Aliquam libero</Link></li>
                    <li><Link to="#" className="label">Aliquam libero</Link></li>
                    <li><Link to="#" className="label">Aliquam libero</Link></li>
                  </ul>
                </li>
              </ul>
            </div>
            <div style={{ clear: 'both' }}>&nbsp;</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;