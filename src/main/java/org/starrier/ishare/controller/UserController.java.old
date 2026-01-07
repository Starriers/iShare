package org.starrier.ishare.controller;

import lombok.SneakyThrows;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.SessionAttributes;
import org.starrier.ishare.model.entity.Article;
import org.starrier.ishare.model.entity.User;
import org.starrier.ishare.service.ArticleService;
import org.starrier.ishare.service.UserService;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.List;

import static org.starrier.ishare.regular.Expression.EMAIL;
import static org.starrier.ishare.regular.Expression.PHONE;
import static org.starrier.ishare.util.Constant.ADMIN;
import static org.starrier.ishare.util.Constant.ARTICLES;
import static org.starrier.ishare.util.Constant.EMPTY;
import static org.starrier.ishare.util.Constant.FINDBYUSERNAME;
import static org.starrier.ishare.util.Constant.ID;
import static org.starrier.ishare.util.Constant.LOGIN;
import static org.starrier.ishare.util.Constant.LOGIN_PARAM_EMPTY;
import static org.starrier.ishare.util.Constant.LOGIN_PARAM_ERROR;
import static org.starrier.ishare.util.Constant.MARK;
import static org.starrier.ishare.util.Constant.MESSAGE_PREFIX;
import static org.starrier.ishare.util.Constant.MESSAGE_SUFFIX;
import static org.starrier.ishare.util.Constant.PASSWORD;
import static org.starrier.ishare.util.Constant.REGISTER_PASSWORD_NOT_CONSISTENT;
import static org.starrier.ishare.util.Constant.REGISTER_USERNAME_EXIST;
import static org.starrier.ishare.util.Constant.REGISTER_USERNAME_FORMAT_ERROR;
import static org.starrier.ishare.util.Constant.RE_PASSWORD;
import static org.starrier.ishare.util.Constant.USER;
import static org.starrier.ishare.util.Constant.USERNAME;
import static org.starrier.ishare.util.Constant.USERS;
import static org.starrier.ishare.util.Constant.WELCOME;

/**
 * @author Starrier
 * @date 2019/4/20
 */
@Controller
@SessionAttributes("user")
public class UserController {

    private final UserService userService;

    private final ArticleService articleService;

    public UserController(UserService userService, ArticleService articleService) {
        this.userService = userService;
        this.articleService = articleService;
    }

    /**
     * Login html.
     *
     * @return login page.
     */
    @RequestMapping("/login")
    public String login() {
        return "user/login";
    }


    /**
     * Format params.
     *
     * @param model    {@link Model}
     * @param request  {@link HttpServletRequest}
     * @param response {@link HttpServletResponse}
     * @return String view
     */
    @RequestMapping(value = "/checkLogin")
    @SneakyThrows({ServletException.class, IOException.class})
    public String checkLogin(Model model, HttpServletRequest request, HttpServletResponse response) {
        String username = request.getParameter(USERNAME);
        String password = request.getParameter(PASSWORD);

        if (EMPTY.equals(username) || EMPTY.equals(password)) {
            request.setAttribute(MESSAGE_PREFIX, LOGIN_PARAM_EMPTY);
            request.getRequestDispatcher(LOGIN).forward(request, response);
            return "user/login";
        }
        User user = userService.checkLogin(username, password);
        if (user != null) {
            if (ADMIN.equals(user.getPower())) {
                model.addAttribute(USER, user);
                List<Article> articles = articleService.findAllArticle();
                model.addAttribute(ARTICLES, articles);
                return "article/articleManage";
            }
            model.addAttribute(MESSAGE_PREFIX, WELCOME);
            model.addAttribute(USER, user);
            model.addAttribute(MESSAGE_SUFFIX, MARK);
            List<Article> articles = articleService.findAllArticle();
            model.addAttribute(ARTICLES, articles);
            return "article/home";

        } else {
            model.addAttribute(MESSAGE_PREFIX, LOGIN_PARAM_ERROR);
            return "user/result";
        }
    }

    /**
     * 测试超链接跳转到另一个页面是否可以取到session值
     */
    @RequestMapping("/write")
    public String hrefPage() {
        return "article/write";
    }

    @RequestMapping("/label")
    public String labelPage() {
        return "label";
    }

    /**
     * user sign out
     * <p/>
     * <p>
     * 通过session.invalidata()方法来注销当前的session
     *
     * @param session {@link HttpSession}
     * @return String views.
     */
    @RequestMapping("/outLogin")
    public String outLogin(HttpSession session) {
        session.invalidate();
        return "redirect:index";
    }

    @RequestMapping("/register")
    public String register() {
        return "user/register";
    }

    @RequestMapping("/doRegister")
    public String doRegister(HttpServletRequest request) {
        paramsValidation(request);
        User user = User.builder().username(request.getParameter(USERNAME)).password(request.getParameter(PASSWORD)).build();
        userService.register(user);
        return "redirect:login";
    }

    @RequestMapping("/userManage")
    public String userManage(Model model) {
        List<User> users = userService.findAllUser();
        model.addAttribute(USERS, users);
        return "user/userManage";
    }

    @RequestMapping("/deleteUser")
    public String deleteUser(HttpServletRequest req) {
        int id = Integer.parseInt(req.getParameter(ID));
        userService.deleteUserById(id);
        return "redirect:userManage";
    }

    @RequestMapping("/findByUsername")
    public String getUserByUsername(Model model, HttpServletRequest req) {
        String username = req.getParameter(FINDBYUSERNAME);
        List<User> users = userService.findByUsername(username);
        model.addAttribute(USERS, users);
        return "user/userManage";
    }

    @RequestMapping("/add")
    public String add() {
        return "user/userAdd";
    }

    @RequestMapping("/addUser")
    public String addUser(HttpServletRequest request, HttpServletResponse response) {
        userService.addUser(request, response);
        return "redirect:userManage";
    }

    @RequestMapping("/edit")
    public String edit(Model model, HttpServletRequest request) {
        model.addAttribute(ID, Integer.parseInt(request.getParameter(ID)));
        return "user/userEdit";
    }

    @RequestMapping("/updateUser")
    public String updateUser(HttpServletRequest request, HttpServletResponse response) {
        userService.updateUser(request, response);
        return "redirect:userManage";
    }

    /**
     * Params Validation.
     * </p>
     * 1. 如果输入的参数为空，操作终止
     * 2. 输入密码与重复密码不一致的时候
     * 3. 用户名不符合tel或email的格式要求
     * 4. 如果用户名已经注册
     *
     * @param request {@link HttpServletRequest}
     * @return String
     */
    private String paramsValidation(HttpServletRequest request) {
        String username = request.getParameter(USERNAME);
        String password = request.getParameter(PASSWORD);
        String rePassword = request.getParameter(RE_PASSWORD);
        if (EMPTY.equals(username) || EMPTY.equals(password) || "".equals(rePassword)) {
            request.setAttribute(MESSAGE_PREFIX, LOGIN_PARAM_EMPTY);
            return "user/register";
        }
        if (!password.equals(rePassword)) {
            request.setAttribute(MESSAGE_PREFIX, REGISTER_PASSWORD_NOT_CONSISTENT);
            return "user/register";
        }
        if (!username.matches(EMAIL) && !username.matches(PHONE)) {
            request.setAttribute(MESSAGE_PREFIX, REGISTER_USERNAME_FORMAT_ERROR);
            return "user/register";
        }
        if (username.equals(userService.isExist(username))) {
            request.setAttribute(MESSAGE_PREFIX, REGISTER_USERNAME_EXIST);
            return "user/register";
        }
        return null;
    }
}
