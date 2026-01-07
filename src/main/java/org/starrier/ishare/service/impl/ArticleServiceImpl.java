package org.starrier.ishare.service.impl;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.starrier.ishare.dao.ArticleDao;
import org.starrier.ishare.model.entity.Article;
import org.starrier.ishare.model.entity.Comment;
import org.starrier.ishare.service.ArticleService;
import org.starrier.ishare.service.EmailService;
import org.starrier.ishare.util.SensitiveWordUtil;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static org.starrier.ishare.constant.EmailConstant.TEN;
import static org.starrier.ishare.constant.EmailConstant.TWENTY;
import static org.starrier.ishare.util.Constant.DATE_FORMAT;

/**
 * @author Starrier
 * @date 2019/4/14
 */
@Service
public class ArticleServiceImpl implements ArticleService {

    private final ArticleDao articleDao;

    private final EmailService emailService;

    private final SimpleDateFormat simpleDateFormat = new SimpleDateFormat(DATE_FORMAT);

    public ArticleServiceImpl(ArticleDao articleDao, EmailService emailService) {
        this.articleDao = articleDao;
        this.emailService = emailService;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void addArticle(Article article) {
        // Set date if not set
        if (article.getDate() == null || article.getDate().isEmpty()) {
            article.setDate(simpleDateFormat.format(new Date()));
        }
        // Set summary if not set
        if (article.getSummary() == null || article.getSummary().isEmpty()) {
            String content = article.getContent();
            article.setSummary(content != null && content.length() > 200 ? 
                    content.substring(0, 200) : content);
        }
        articleDao.writeBlog(article);

        // Sensitive word detection and email notification
        Set<String> sensitiveWordSet = new HashSet<>();
        sensitiveWordSet.add("太多");
        sensitiveWordSet.add("爱恋");
        sensitiveWordSet.add("静静");
        sensitiveWordSet.add("哈哈");
        sensitiveWordSet.add("啦啦");
        sensitiveWordSet.add("感动");
        sensitiveWordSet.add("发呆");
        // Initialize sensitive word library
        SensitiveWordUtil.init(sensitiveWordSet);
        Set<String> set = SensitiveWordUtil.getSensitiveWord(article.getContent());
        String author = article.getAuthor();
        if (author != null) {
            if (set.size() < TEN) {
                emailService.sendHealthMessage(author);
            } else if ((set.size() > TEN) && (set.size() < TWENTY)) {
                emailService.sendHaveRestMessage(author);
            } else {
                emailService.sendSickMessage(author);
            }
        }
    }

    @Override
    public List<Article> findAllArticle() {
        return articleDao.findAllArticle();
    }

    @Override
    public List<Article> getArticlesByCategoryId(int id) {
        return articleDao.getArticlesByCategoryId(id);
    }

    @Override
    public List<Article> getArticlesByDate(String date) {
        return articleDao.getArticlesByDate(date);
    }

    @Override
    public List<Article> getArticlesByKeyword(String keyword) {
        return articleDao.getArticlesByKeyword(keyword);
    }

    @Override
    public Article getArticleById(int id) {
        return articleDao.getArticleById(id);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void addComment(Comment comment) {
        // Set date if not set
        if (comment.getDate() == null || comment.getDate().isEmpty()) {
            comment.setDate(simpleDateFormat.format(new Date()));
        }
        articleDao.addComment(comment);
    }

    @Override
    public List<Comment> showComment(int articleId) {
        return articleDao.showComment(articleId);
    }

    @Override
    public List<Article> getUserArticle(String value) {
        return articleDao.getUserArticle(value);
    }

    @Override
    public List<Article> getArticlesByAuthor(String author) {
        return articleDao.getArticlesByAuthor(author);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void update(Article article) {
        articleDao.update(article);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteByArticleId(int id) {
        articleDao.delete(id);
    }


}
