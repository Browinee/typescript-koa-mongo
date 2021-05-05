// import { Request, Response, NextFunction, Router } from 'express';
import Router from "koa-router";
import {Request, Response} from "koa";
// import PostNotFoundException from '../../exceptions/PostNotFoundException';
import Controller from '../../interfaces/controller.interface';
// import RequestWithUser from '../interfaces/requestWithUser.interface';
// import authMiddleware from '../middleware/auth.middleware';
// import validationMiddleware from '../middleware/validation.middleware';
import CreatePostDto from './post.dto';
import Post from './post.interface';
import postModel from './post.model';
import {Context} from "vm";

class PostController implements Controller {
    public path = '/posts';
    public router = new Router();
    private post = postModel;

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(this.path, this.createPost);
        // this.router.get(this.path, this.getAllPosts);
        // this.router.get(`${this.path}/:id`, this.getPostById);
        // this.router
        //     .all(`${this.path}/*`, authMiddleware)
        //     .patch(`${this.path}/:id`, validationMiddleware(CreatePostDto, true), this.modifyPost)
        //     .delete(`${this.path}/:id`, this.deletePost)
        //     .post(this.path, authMiddleware, validationMiddleware(CreatePostDto), this.createPost);
    }

    // private getAllPosts = async (request: Request, response: Response) => {
    //     const posts = await this.post.find()
    //         .populate('author', '-password');
    //     response.send(posts);
    // }
    //
    // private getPostById = async (request: Request, response: Response, next: NextFunction) => {
    //     const id = request.params.id;
    //     const post = await this.post.findById(id);
    //     if (post) {
    //         response.send(post);
    //     } else {
    //         next(new PostNotFoundException(id));
    //     }
    // }
    //
    // private modifyPost = async (request: Request, response: Response, next: NextFunction) => {
    //     const id = request.params.id;
    //     const postData: Post = request.body;
    //     const post = await this.post.findByIdAndUpdate(id, postData, { new: true });
    //     if (post) {
    //         response.send(post);
    //     } else {
    //         next(new PostNotFoundException(id));
    //     }
    // }
    //
    private createPost = async (ctx: Context) => {
        const postData: CreatePostDto = ctx.request.body;
        const createdPost = new this.post({
            ...postData,
            // author: request.user._id,
        });
        const savedPost = await createdPost.save();
        // await savedPost.populate('author', '-password').execPopulate();
        ctx.status = 201;
        ctx.body = savedPost;
    }
    //
    // private deletePost = async (request: Request, response: Response, next: NextFunction) => {
    //     const id = request.params.id;
    //     const successResponse = await this.post.findByIdAndDelete(id);
    //     if (successResponse) {
    //         response.send(200);
    //     } else {
    //         next(new PostNotFoundException(id));
    //     }
    // }
}

export default PostController;
