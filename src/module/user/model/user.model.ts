import mongoose from "mongoose";
import User from '../user.interface';



const addressSchema = new mongoose.Schema({
    city: String,
    street: String,
});
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    address: addressSchema,
    creditCardNumber: {
        type: String,
        get: (creditCardNumber: string) => {
            return `****-****-****-${
                creditCardNumber.substr(creditCardNumber.length - 4)
            }`;
        },
    },
}, {
    toJSON: {getters: true},
});

const userModel = mongoose.model<User & mongoose.Document>('User', userSchema);

export default userModel;