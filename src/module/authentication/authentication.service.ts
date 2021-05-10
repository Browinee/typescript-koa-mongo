import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserWithThatEmailAlreadyExistsException from '../../exceptions/UserWithThatEmailAlreadyExistsException';
import DataStoredInToken from '../../interfaces/dataStoredIntoken.interface';
import TokenData from '../../interfaces/tokenData.interface';
import CreateUserDto from '../user/dto/user.dto';
import User from '../user/user.interface';
import userModel from '../user/model/user.model';

class AuthenticationService {
    public user = userModel;

    public async register(userData: CreateUserDto) {
        if (
            await this.user.findOne({email: userData.email})
        ) {
            throw new UserWithThatEmailAlreadyExistsException(userData.email);
        }
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const user = await this.user.create({
            ...userData,
            password: hashedPassword,
        });
        const tokenData = this.createToken(user);
        const cookie = this.createCookie(tokenData);
        return {
            cookie,
            user,
        };
    }

    public createCookie(tokenData: TokenData) {
        return {
            name: "Authorization",
            value: tokenData.token,
            option: {
                httpOnly: true,
                maxAge: tokenData.expiresIn,
            }
        }
    }

    public createToken(user: User): TokenData {
        const expiresIn = 60 * 60 * 1000; // an hour
        const secret = process.env.JWT_SECRET;
        const dataStoredInToken: DataStoredInToken = {
            _id: user._id,
        };
        return {
            expiresIn,
            token: jwt.sign(dataStoredInToken, secret, {expiresIn}),
        };
    }
}

export default AuthenticationService;