import {Next, Context} from "koa";
import Router from "koa-router";
import Controller from "../../interfaces/controller.interface";
import postModel from '../posts/model/post.model';
import userModel from "./model/user.model";
import authMiddleware from "../../middleware/auth.middleware";
import UserNotFoundException from "../../exceptions/UserNotFoundException";


class UserController implements Controller {
    public path = "/users";
    public router = new Router();
    private post = postModel;
    private user = userModel;

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}/:id`,  this.getUserById);
        this.router.get(`${this.path}/:id/posts`, this.getAllPostsOfUser);
    }

    private getUserById = async (ctx: Context, next: Next) => {
        const {id} = ctx.params;
        const userQUery = this.user.findById(id);
        const user = await userQUery;

        if (user) {
           ctx.body = user;
        } else {
            throw new UserNotFoundException(id);
        }
    }

    private getAllPostsOfUser = async (ctx: Context, next: Next) => {
        const {id} = ctx.params;
        const posts = await this.post.find({ author: id });
        ctx.body = posts;
    }

}

export default UserController;
