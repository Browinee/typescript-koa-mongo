import Koa from "koa";
import  cookieParser from 'koa-cookie';
import  mongoose from 'mongoose';
import bodyParser from 'koa-bodyparser';
import Controller from "./interfaces/controller.interface";
import errorMiddleware from './middleware/error.middleware';
import Logger from "./middleware/logger";

class App {
    public app: any;

    constructor(controllers: Controller[]) {
        this.app = new Koa();
        this.connectToTheDatabase();
        this.initializeMiddlewares();
        this.initializeControllers(controllers);
        this.initializeErrorHandling();
    }

    listen() {
        this.app.listen(process.env.PORT, () => {
            console.log(`App listening on the port ${process.env.PORT}`);
        });
    }
    public getServer() {
        return this.app;
    }

    private initializeMiddlewares() {
        this.app.use(bodyParser());
        this.app.use(cookieParser());
        this.app.use(Logger);
    }

    private initializeErrorHandling() {
        this.app.use(errorMiddleware);
    }

    private initializeControllers(controllers: Controller[]) {
        controllers.forEach((controller) => {
            this.app.use(controller.router.routes());
        });
    }
    private connectToTheDatabase() {
        const {
            MONGO_PATH,
        } = process.env;
        mongoose.connect(MONGO_PATH, { useNewUrlParser: true, useUnifiedTopology: true });
    }
}

export default App;