import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { articleAPI } from '../api/api';
import './ArticleWrite.css';

function ArticleWrite({ user }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    categoryId: 1,
    summary: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await articleAPI.createArticle({
        ...formData,
        author: user.username,
      });
      if (response.code === 200) {
        navigate(`/article/${response.data.id}`);
      }
    } catch (err) {
      console.error('Failed to create article:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="write-container">
      <form onSubmit={handleSubmit} className="write-form">
        <h2>写文章</h2>
        <div className="form-group">
          <label>标题</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>内容</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows="20"
            required
          />
        </div>
        <div className="form-group">
          <label>分类ID</label>
          <input
            type="number"
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>摘要（可选）</label>
          <textarea
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            rows="3"
          />
        </div>
        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? '发布中...' : '发布文章'}
        </button>
      </form>
    </div>
  );
}

export default ArticleWrite;
