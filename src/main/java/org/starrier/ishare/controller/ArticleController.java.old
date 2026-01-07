package org.starrier.ishare.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.starrier.ishare.model.entity.Article;
import org.starrier.ishare.model.entity.Comment;
import org.starrier.ishare.service.ArticleService;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import static org.starrier.ishare.util.Constant.ARTICLE;
import static org.starrier.ishare.util.Constant.ARTICLES;
import static org.starrier.ishare.util.Constant.ARTICLE_ID;
import static org.starrier.ishare.util.Constant.COMMENTS;
import static org.starrier.ishare.util.Constant.DATE_FORMAT;
import static org.starrier.ishare.util.Constant.ID;
import static org.starrier.ishare.util.Constant.KEYWORD;
import static org.starrier.ishare.util.Constant.VALUE;

/**
 * @author Starrier
 * @date 2019/4/14
 */
@Controller
public class ArticleController {
    @Resource
    private ArticleService articleService;
    private SimpleDateFormat sdf = new SimpleDateFormat(DATE_FORMAT);

    @PostMapping(value = "/writeBlog")
    public String doWrite(HttpServletRequest request, HttpServletResponse response) {
        articleService.addArticle(request, response);
        return "redirect:home";
    }

    @RequestMapping("/home")
    public String home(Model model) {
        List<Article> articles = articleService.findAllArticle();
        model.addAttribute(ARTICLES, articles);
        return "article/home";
    }

    @RequestMapping("/index")
    public String index(Model model) {
        List<Article> articles = articleService.findAllArticle();
        model.addAttribute(ARTICLES, articles);
        return "user/index";
    }

    @RequestMapping("/category")
    public String getArticleCategory(Model model, HttpServletRequest request) {
        List<Article> articles = articleService.getArticlesByCategoryId(Integer.parseInt(request.getParameter(ID)));
        model.addAttribute(ARTICLES, articles);
        return "article/home";
    }

    @RequestMapping("/focus")
    public String focus(Model model) {
        String date = sdf.format(new Date());
        List<Article> articles = articleService.getArticlesByDate(date);
        model.addAttribute(ARTICLES, articles);
        return "article/home";
    }

    @RequestMapping("/search")
    public String search(Model model, HttpServletRequest request) {
        List<Article> articles = articleService.getArticlesByKeyword(request.getParameter(KEYWORD));
        model.addAttribute(ARTICLES, articles);
        return "article/home";
    }

    @RequestMapping("/detail")
    public String detail(Model model, HttpServletRequest request) {
        int articleId = Integer.parseInt(request.getParameter(ID));
        Article article = articleService.getArticleById(articleId);
        model.addAttribute(ARTICLE, article);
        List<Comment> comments = articleService.showComment(articleId);
        model.addAttribute(COMMENTS, comments);
        return "article/detail";
    }

    @RequestMapping("/comment")
    public String comment(HttpServletRequest request, HttpServletResponse response) {
        articleService.addComment(request, response);
        return "redirect:detail?id=" + Integer.parseInt(request.getParameter(ARTICLE_ID));
    }

    @RequestMapping("/personal")
    public String personal(Model model, HttpServletRequest request) {
        String value = request.getParameter(VALUE);
        List<Article> articles = articleService.getUserArticle(value);
        model.addAttribute(ARTICLES, articles);
        return "article/personal";
    }

    @RequestMapping("/personal_")
    public String personal_(Model model, HttpServletRequest request) {
        String value = request.getParameter(VALUE);
        List<Article> articles = articleService.getUserArticle(value);
        model.addAttribute(ARTICLES, articles);
        model.addAttribute(VALUE, value);
        return "article/personal_";
    }

    @RequestMapping("/articleManage")
    public String articleManage(Model model) {
        List<Article> articles = articleService.findAllArticle();
        model.addAttribute(ARTICLES, articles);
        return "article/articleManage";
    }

    @RequestMapping("/getArticleByAuthor")
    public String getArticleByAuthor(Model model, HttpServletRequest request) {
        String author = request.getParameter("a_name");
        List<Article> articles = articleService.getArticlesByAuthor(author);
        model.addAttribute(ARTICLES, articles);
        return "article/articleManage";
    }

    @RequestMapping("/articleEdit")
    public String articleEdit() {
        return "article/article";
    }

    @RequestMapping("/articleEditDo")
    public String articleEdit(HttpServletRequest request, HttpServletResponse response) {
        articleService.update(request, response);
        return "redirect:articleEdit";
    }

    @RequestMapping("/delete")
    public String delete(HttpServletRequest request) {
        int id = Integer.parseInt(request.getParameter(ID));
        articleService.deleteByArticleId(id);
        return "redirect:articleManage";
    }

    @RequestMapping("/look")
    public String look(Model model, HttpServletRequest request) {
        int id = Integer.parseInt(request.getParameter(ID));
        Article article = articleService.getArticleById(id);
        model.addAttribute(ARTICLE, article);
        return "article/articleView";
    }
}
