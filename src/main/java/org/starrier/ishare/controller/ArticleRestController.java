package org.starrier.ishare.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.starrier.ishare.model.dto.ApiResponse;
import org.starrier.ishare.model.dto.ArticleRequest;
import org.starrier.ishare.model.dto.CommentRequest;
import org.starrier.ishare.model.entity.Article;
import org.starrier.ishare.model.entity.Comment;
import org.starrier.ishare.service.ArticleService;

import java.util.List;

/**
 * Article REST Controller
 * 
 * @author Starrier
 */
@RestController
@RequestMapping("/articles")
@RequiredArgsConstructor
public class ArticleRestController {

    private final ArticleService articleService;

    /**
     * Get all articles
     */
    @GetMapping
    public ApiResponse<List<Article>> getAllArticles() {
        List<Article> articles = articleService.findAllArticle();
        return ApiResponse.success(articles);
    }

    /**
     * Get article by id
     */
    @GetMapping("/{id}")
    public ApiResponse<Article> getArticleById(@PathVariable int id) {
        Article article = articleService.getArticleById(id);
        if (article != null) {
            return ApiResponse.success(article);
        }
        return ApiResponse.error(404, "Article not found");
    }

    /**
     * Create article
     */
    @PostMapping
    public ApiResponse<Article> createArticle(@Valid @RequestBody ArticleRequest request) {
        Article article = Article.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .categoryId(request.getCategoryId())
                .author(request.getAuthor())
                .summary(request.getSummary() != null ? request.getSummary() : 
                        request.getContent().length() > 200 ? 
                        request.getContent().substring(0, 200) : request.getContent())
                .build();
        articleService.addArticle(article);
        return ApiResponse.success("Article created successfully", article);
    }

    /**
     * Update article
     */
    @PutMapping("/{id}")
    public ApiResponse<Void> updateArticle(@PathVariable int id, @RequestBody ArticleRequest request) {
        Article article = Article.builder()
                .id(id)
                .title(request.getTitle())
                .content(request.getContent())
                .categoryId(request.getCategoryId())
                .author(request.getAuthor())
                .summary(request.getSummary())
                .build();
        articleService.update(article);
        return ApiResponse.success("Article updated successfully", null);
    }

    /**
     * Delete article
     */
    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteArticle(@PathVariable int id) {
        articleService.deleteByArticleId(id);
        return ApiResponse.success("Article deleted successfully", null);
    }

    /**
     * Get articles by category
     */
    @GetMapping("/category/{categoryId}")
    public ApiResponse<List<Article>> getArticlesByCategory(@PathVariable int categoryId) {
        List<Article> articles = articleService.getArticlesByCategoryId(categoryId);
        return ApiResponse.success(articles);
    }

    /**
     * Get articles by keyword
     */
    @GetMapping("/search")
    public ApiResponse<List<Article>> searchArticles(@RequestParam String keyword) {
        List<Article> articles = articleService.getArticlesByKeyword(keyword);
        return ApiResponse.success(articles);
    }

    /**
     * Get articles by author
     */
    @GetMapping("/author/{author}")
    public ApiResponse<List<Article>> getArticlesByAuthor(@PathVariable String author) {
        List<Article> articles = articleService.getArticlesByAuthor(author);
        return ApiResponse.success(articles);
    }

    /**
     * Get articles by date
     */
    @GetMapping("/date/{date}")
    public ApiResponse<List<Article>> getArticlesByDate(@PathVariable String date) {
        List<Article> articles = articleService.getArticlesByDate(date);
        return ApiResponse.success(articles);
    }

    /**
     * Get user articles
     */
    @GetMapping("/user/{username}")
    public ApiResponse<List<Article>> getUserArticles(@PathVariable String username) {
        List<Article> articles = articleService.getUserArticle(username);
        return ApiResponse.success(articles);
    }

    /**
     * Get comments for article
     */
    @GetMapping("/{id}/comments")
    public ApiResponse<List<Comment>> getComments(@PathVariable int id) {
        List<Comment> comments = articleService.showComment(id);
        return ApiResponse.success(comments);
    }

    /**
     * Add comment
     */
    @PostMapping("/comments")
    public ApiResponse<Comment> addComment(@Valid @RequestBody CommentRequest request) {
        Comment comment = Comment.builder()
                .articleId(request.getArticleId())
                .comment(request.getContent())
                .build();
        articleService.addComment(comment);
        return ApiResponse.success("Comment added successfully", comment);
    }
}
