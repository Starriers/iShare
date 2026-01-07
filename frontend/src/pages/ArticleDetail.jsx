import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { articleAPI } from '../api/api';
import './ArticleDetail.css';

function ArticleDetail({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArticle();
    loadComments();
  }, [id]);

  const loadArticle = async () => {
    try {
      const response = await articleAPI.getArticleById(id);
      if (response.code === 200) {
        setArticle(response.data);
      }
    } catch (err) {
      console.error('Failed to load article:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async () => {
    try {
      const response = await articleAPI.getComments(id);
      if (response.code === 200) {
        setComments(response.data || []);
      }
    } catch (err) {
      console.error('Failed to load comments:', err);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await articleAPI.addComment({
        articleId: parseInt(id),
        content: commentText,
      });
      setCommentText('');
      loadComments();
    } catch (err) {
      console.error('Failed to add comment:', err);
      alert('评论失败，请重试');
    }
  };

  if (loading) {
    return <div className="loading">加载中...</div>;
  }

  if (!article) {
    return <div className="error">文章不存在</div>;
  }

  return (
    <div id="detail">
      <div className="col-lg-9 col-md-9 w_main_left">
        {/* 文章内容 */}
        <div className="panel panel-default">
          <div className="panel-body">
            <h2 className="c_titile">{article.title}</h2>
            <p className="box_c">
              <span className="d_time">发布时间：{article.date}</span>
              <span>作者：<a href={`/user/${article.author}`}>{article.author}</a></span>
              <span>阅读（88646）</span>
            </p>
            <ul className="infos" dangerouslySetInnerHTML={{ __html: article.content }} />
          </div>
        </div>

        {/* 评论输入框 */}
        {user && (
          <div className="panel panel-default">
            <div className="panel-body">
              <form className="pinglun" onSubmit={handleCommentSubmit}>
                <div className="comment-author-info">
                  <div className="comment-avatar">
                    <img src="/api/assert/images/life.png" alt={user.username} width="80" height="80"/>
                  </div>
                  <div className="comment-author-name">
                    &nbsp;&nbsp;{user.username}
                  </div>
                </div>
                <div>
                  <input type="hidden" name="articleId" value={article.id} />
                </div>
                <textarea 
                  name="content" 
                  placeholder="写下你的评论..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  required
                />
                <div className="comment-submit-wrapper">
                  <input type="submit" value="发表评论" className="comment-submit-btn" />
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 评论列表 */}
        <div className="panel panel-default">
          <div className="panel-body">
            <div id="pingluncontent" style={{ margin: '20px' }}>
              <div>
                <div>
                  <div className="comments-header">
                    <span>评论</span>
                  </div>
                </div>
              </div>
              <div>
                <div>
                  {comments.length === 0 ? (
                    <div className="no-comments">暂无评论，快来发表第一条评论吧！</div>
                  ) : (
                    comments.map((comment) => (
                      <div key={comment.id}>
                        <div className="author">
                          <div className="comment-avatar">
                            <img src="/api/assert/images/life.png" alt="User" width="80" height="80"/>
                          </div>
                          <div className="comment-author-name">
                            &nbsp;&nbsp;{user?.username || '匿名用户'}
                          </div>
                        </div>
                        <div className="content1">
                          <div className="comment-text">
                            {comment.comment}
                          </div>
                          <div className="comment-date">
                            {comment.date}
                          </div>
                          <hr />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArticleDetail;