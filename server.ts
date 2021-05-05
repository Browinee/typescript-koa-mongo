import "dotenv/config";
import App from "./src/app";
import PostsController from "./src/module/posts/post.controller";
import AuthenticationController from "./src/module/authentication/authentication.controller";

const app = new App([
    new PostsController(),
    new AuthenticationController()
]);

app.listen();