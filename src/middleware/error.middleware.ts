import {Next} from "koa";
import {Context} from "vm";

async function errorMiddleware(ctx: Context, next: Next) {
    try {
        await next();
    } catch (err) {
        ctx.response.status = err.status || 500;
        ctx.response.body = err.message;
    }
}

export default errorMiddleware;