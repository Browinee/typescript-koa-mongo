import {Next, Context} from "koa";
import Router from "koa-router";
import Controller from "../../interfaces/controller.interface";
import userModel from "../user/model/user.model";
import AuthenticationService from "./authentication.service";
import validationMiddleware from "../../middleware/validation.middleware";
import CreateUserDto from "../user/dto/user.dto";
import LoginDto from "./dto/login.dto";


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
        this.router.post(`${this.path}/logout`, this.loggingOut);
    }

    private registration = async (ctx: Context, next: Next) => {
        const userData: CreateUserDto = ctx.request.body;
        try {
            const {cookie, user} = await this.authenticationService.register(userData);
            ctx.cookies.set(cookie.name, cookie.value, cookie.option);
            ctx.body = user;
        } catch (error) {
            throw error;
        }

    }

    private loggingIn = async (ctx: Context, next: Next) => {
    }
    private loggingOut = async (ctx: Context, next: Next) => {
    }

}

export default AuthenticationController;
