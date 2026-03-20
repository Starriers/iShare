package org.starrier.ishare.dao;

import org.starrier.ishare.model.entity.Article;
import org.starrier.ishare.model.entity.Comment;

import java.util.List;

/**
 * ArticleDao.
 *
 * @author Starrier
 * @date 2019/4/11.
 */
public interface ArticleDao {
    /**
     * 通过时间显示文章列表
     *
     * @return article of list.
     */
    List<Article> showArticle();

    /**
     * 写文章
     *
     * @param article {@link Article}
     */
    void writeBlog(Article article);

    /**
     * 通过文章类别id查询文章列表
     *
     * @param categoryId {@link Article#getCategoryId()}
     * @return article of list.
     */
    List<Article> getArticlesByCategoryId(int categoryId);

    /**
     * 通过时间查询文章列表
     *
     * @param date {@link java.util.Date}
     * @return articles of List.
     */
    List<Article> getArticlesByDate(String date);

    /**
     * 通过关键字搜索
     *
     * @param keyword keyword
     * @return article of List
     */
    List<Article> getArticlesByKeyword(String keyword);

    /**
     * 通过文章id显示文章详情
     *
     * @param id id
     * @return {@link Article}
     */
    Article getArticleById(int id);

    /**
     * 添加评论
     *
     * @param comment {@link Comment}
     */
    void addComment(Comment comment);


    /**
     * Show comment.
     *
     * @param articleId article's id.
     * @return comments of list.
     */
    List<Comment> showComment(int articleId);

    /**
     * Get user's article.
     *
     * @param value value
     * @return articles of list
     */
    List<Article> getUserArticle(String value);

    /**
     * Get article by article's author.
     *
     * @param author article's author.
     * @return articles of List.
     */
    List<Article> getArticlesByAuthor(String author);

    /**
     * update article.
     *
     * @param article {@link Article}
     */
    void update(Article article);

    /**
     * Delete by id.
     *
     * @param id id
     */
    void delete(int id);

    /**
     * Find All Articles
     *
     * @return List of {@link Article}
     */
    List<Article> findAllArticle();

    /**
     * Find article list by page.
     *
     * @param offset query offset
     * @param size page size
     * @return article list
     */
    List<Article> findArticlePage(int offset, int size);

    /**
     * Count all articles.
     *
     * @return total count
     */
    long countArticles();


}
