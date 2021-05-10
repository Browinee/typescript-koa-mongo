import "dotenv/config";
import App from "./src/app";
import PostsController from "./src/module/posts/post.controller";
import AuthenticationController from "./src/module/authentication/authentication.controller";
import UserController from "./src/module/user/user.controller";
import ReportController from "./src/module/report/report.controller";

const app = new App([
    new PostsController(),
    new AuthenticationController(),
    new UserController(),
    new ReportController(),
]);

app.listen();