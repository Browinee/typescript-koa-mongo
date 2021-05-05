import {Context, Next} from "koa";
import {validate, ValidationError} from 'class-validator';
import {plainToClass} from "class-transformer";
import HttpException from '../exceptions/HttpException';

export default function validationMiddleware(type: any, skipMissingProperties = false) {
    return  async (ctx: Context, next: Next) => {
       await  validate(plainToClass(type, ctx.request.body), {skipMissingProperties})
            .then(async (errors: ValidationError[]) => {
                if (errors.length > 0) {
                    console.log("errors", errors)
                    const combinedMessage = errors.map((error: ValidationError) => Object.values(error.constraints)).join(', ');
                    const {status, message,} = new HttpException(400, combinedMessage);
                    throw new HttpException(400, combinedMessage);
                } else {
                    await next();
                }
            });
    }
}