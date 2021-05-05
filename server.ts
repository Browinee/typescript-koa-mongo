import "dotenv/config";
import App from "./src/app";
import PostsController from "./src/module/posts/post.controller";

const app = new App([
    new PostsController(),
]);

app.listen();