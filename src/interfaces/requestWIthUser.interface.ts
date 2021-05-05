import { Request } from 'koa';
import User from '../module/user/user.interface';

interface RequestWithUser extends Request {
    user: User;
}

export default RequestWithUser;