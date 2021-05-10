import {Context, Next,} from "koa";
import Router from "koa-router";
import Controller from '../../interfaces/controller.interface';
import RequestWithUser from "../../interfaces/requestWIthUser.interface";
// import authMiddleware from '../middleware/auth.middleware';
import validationMiddleware from '../../middleware/validation.middleware';
import CreatePostDto from './dto/post.dto';
import Post from './post.interface';
import postModel from './model/post.model';
import PostNotFoundException from "../../exceptions/PostNotFoundException";
import authMiddleware from "../../middleware/auth.middleware";

class PostController implements Controller {
    public path = '/posts';
    public router = new Router();
    private post = postModel;

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path, this.getAllPosts);
        this.router.get(`${this.path}/:id`, this.getPostById);
        this.router
            .all(`${this.path}/(.*)`, authMiddleware)
            .patch(`${this.path}/:id`, validationMiddleware(CreatePostDto, true), this.modifyPost)
            .delete(`${this.path}/:id`, this.deletePost)
            .post(this.path, authMiddleware, validationMiddleware(CreatePostDto), this.createPost);
    }

    private getAllPosts = async (ctx: Context) => {
        const posts = await this.post.find();
        ctx.body = posts;
        // const posts = await this.post.find()
        //     .populate('author', '-password');
    }
    private getPostById = async (ctx: Context, next: Next) => {
        const {id} = ctx.params;
        const post = await this.post.findById(id);
        if (post) {
            ctx.body = post;
        } else {
            const {status, message} = new PostNotFoundException(id);
            ctx.body = {status, message};
        }
    }


    private modifyPost = async (ctx: Context, next: Next) => {
        const {id} = ctx.params;
        const postData: Post = ctx.request.body;
        const post = await this.post.findByIdAndUpdate(id, postData, { new: true });
        if (post) {
            ctx.body = post;
        } else {
            console.log(123);
            // next(new PostNotFoundException(id));
        }
    }

    private createPost = async (ctx: Context) => {
        const postData: CreatePostDto = ctx.request.body;
        const createdPost = new this.post({
            ...postData,
            author: (ctx.request as RequestWithUser).user._id,
        });
        const savedPost = await createdPost.save();
        console.log("psot", createdPost);
        await savedPost.populate("author","-password").execPopulate();
        ctx.status = 201;
        ctx.body = savedPost;
    }

    private deletePost = async (ctx: Context, next: Next) => {
        const {id} = ctx.params;
        const successResponse = await this.post.findByIdAndDelete(id);
        if (successResponse) {
            ctx.body = successResponse;
        } else {
            const {status, message} = new PostNotFoundException(id);
            ctx.body = {status, message};
        }
    }
}

export default PostController;
