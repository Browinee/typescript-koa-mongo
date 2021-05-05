import {Context} from "koa";
import {Next} from "koa";
import jwt from "jsonwebtoken";
import userModel from "../module/user/model/user.model";
import WrongAuthenticationTokenException from "../exceptions/WrongAuthenticationTokenException";
import RequestWithUser from "../interfaces/requestWIthUser.interface";

async function authMiddleware(ctx: Context, next: Next) {
    const cookie = ctx.cookie;
    if (cookie && cookie.Authorization) {
        const secret = process.env.JWT_SECRET;
        try {
            const verification = jwt.verify(cookie.Authorization, secret);
            const id = verification._id;
            const user = await userModel.findById(id);
            if (user) {
                (ctx.request as RequestWithUser).user = user;
                await next();
            } else {
                throw new WrongAuthenticationTokenException();
            }
        } catch (error) {
            throw new WrongAuthenticationTokenException();
        }
    } else {
        throw new WrongAuthenticationTokenException();
    }
}


export default authMiddleware;