import {Next, Context} from "koa";
import Router from "koa-router";
import bcrypt from "bcrypt";
import Controller from "../../interfaces/controller.interface";
import userModel from "../user/model/user.model";
import AuthenticationService from "./authentication.service";
import validationMiddleware from "../../middleware/validation.middleware";
import CreateUserDto from "../user/dto/user.dto";
import LoginDto from "./dto/login.dto";
import WrongCredentialsException from "../../exceptions/WrongCredentialsException";

class AuthenticationController implements Controller {
    public path = '/auth';
    public router = new Router();
    public authenticationService = new AuthenticationService();
    private user = userModel;

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}/register`, this.registration);
        this.router.post(`${this.path}/login`, validationMiddleware(LoginDto), this.loggingIn);
        this.router.get(`${this.path}/logout`, this.loggingOut);
    }

    private registration = async (ctx: Context, next: Next) => {
        const userData: CreateUserDto = ctx.request.body;
        try {
            const {cookie, user} = await this.authenticationService.register(userData);
            ctx.cookies.set(cookie.name, cookie.value, cookie.option);
            ctx.body = user;
        } catch (error) {
            ctx.throw(error.status, error.message);
        }

    }

    private loggingIn = async (ctx: Context, next: Next) => {
        const logInData: LoginDto = ctx.request.body;
        const user = await this.user.findOne({ email: logInData.email });
        if (user) {
            const isPasswordMatching = await bcrypt.compare(
                logInData.password,
                user.get('password', null, { getters: false }),
            );
            if (isPasswordMatching) {
                const tokenData = this.authenticationService.createToken(user);
                const cookie = this.authenticationService.createCookie(tokenData);
                console.log("cookie", cookie);
                ctx.cookies.set(cookie.name, cookie.value, cookie.option);
                ctx.body = user;
            } else {
                throw new WrongCredentialsException();
            }
        } else {
            throw new WrongCredentialsException();
        }
    }
    private loggingOut = async (ctx: Context, next: Next) => {
        // ctx.cookies.set('Authorization','',{maxAge:0})
        ctx.status = 204;
        ctx.cookies.set(
            'cid',
            'hello world',
            {
                domain: 'localhost',  // 写cookie所在的域名
                path: '/index',       // 写cookie所在的路径
                maxAge: 10 * 60 * 1000, // cookie有效时长
                expires: new Date('2017-02-15'),  // cookie失效时间
                httpOnly: false,  // 是否只用于http请求中获取
                overwrite: false  // 是否允许重写
            }
        )
    }

}

export default AuthenticationController;
