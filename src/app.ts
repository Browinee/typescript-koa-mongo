import Koa from "koa";
import  cookieParser from 'koa-cookie';
import * as mongoose from 'mongoose';
import bodyParser from 'koa-bodyparser';
import Controller from "./interfaces/controller.interface";
import errorMiddleware from './middleware/error.middleware';

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
    }

    private initializeErrorHandling() {
        this.app.use(errorMiddleware);
    }

    private initializeControllers(controllers: Controller[]) {
        controllers.forEach((controller) => {
            this.app.use('/', controller.router);
        });
    }

    private connectToTheDatabase() {
        const {
            MONGO_USER,
            MONGO_PASSWORD,
            MONGO_PATH,
        } = process.env;
        // mongoose.connect(`mongodb://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}`);
    }
}

export default App;