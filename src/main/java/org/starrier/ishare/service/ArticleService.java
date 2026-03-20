package org.starrier.ishare.service;

import org.starrier.ishare.model.entity.Article;
import org.starrier.ishare.model.entity.Comment;

import java.util.List;

/**
 * @author Starrier
 * @date 2019/4/14
 */
public interface ArticleService {
    /**
     * Add new Article.
     *
     * @param article article entity
     */
    void addArticle(Article article);

    /**
     * Find all articles.
     *
     * @return articles of List.
     */
    List<Article> findAllArticle();

    /**
     * Find article page.
     *
     * @param page page number (starts from 1)
     * @param size page size
     * @return article page list
     */
    List<Article> findArticlePage(int page, int size);

    /**
     * Count all articles.
     *
     * @return total count
     */
    long countArticles();

    /**
     * Get articles by category id.
     *
     * @param id id
     * @return articles of list.
     */
    List<Article> getArticlesByCategoryId(int id);

    /**
     * Get articles by date
     *
     * @param date {@link java.util.Date}
     * @return articles of List.
     */
    List<Article> getArticlesByDate(String date);

    /**
     * Get articles by key word.
     *
     * @param keyword keyword
     * @return articles of List.
     */
    List<Article> getArticlesByKeyword(String keyword);

    /**
     * Get articles by id.
     *
     * @param id id
     * @return {@link Article}
     */
    Article getArticleById(int id);

    /**
     * Add comment.
     *
     * @param comment comment entity
     */
    void addComment(Comment comment);

    /**
     * Show comments.
     *
     * @param articleId article's id.
     * @return comments of list.
     */
    List<Comment> showComment(int articleId);

    /**
     * Get user's articles.
     *
     * @param value value
     * @return articles
     */
    List<Article> getUserArticle(String value);

    /**
     * Get articles by author.
     *
     * @param author article's author
     * @return articles of list.
     */
    List<Article> getArticlesByAuthor(String author);

    /**
     * Update article.
     *
     * @param article article entity
     */
    void update(Article article);

    /**
     * Delete Article By article's id.
     *
     * @param id article's id.
     */
    void deleteByArticleId(int id);
}
