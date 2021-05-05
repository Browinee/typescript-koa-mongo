import {Next, Context} from "koa";
import Router from "koa-router";
import Controller from "../../interfaces/controller.interface";
import postModel from '../posts/model/post.model';
import userModel from "./model/user.model";


class UserController implements  Controller {
    public path = "/users";
    public router = new Router();
    private post = postModel;
    private user = userModel;

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        // this.router.get(`${this.path}/:id`, authMiddleware, this.getUserById);
        // this.router.get(`${this.path}/:id/posts`, authMiddleware, this.getAllPostsOfUser);
        this.router.get(`${this.path}/:id/posts`, this.getAllPostsOfUser);
        this.router.get(`${this.path}/:id/posts`,  this.getAllPostsOfUser);
    }
    private getUserById = async (ctx: Context, next: Next) => {

    }

    private getAllPostsOfUser = async (ctx: Context, next: Next) => {
    }

}

export default UserController;
