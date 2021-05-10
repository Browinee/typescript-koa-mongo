import Controller from '../../interfaces/controller.interface';
import {Next, Context} from "koa";
import Router from "koa-router";
import userModel from "../user/model/user.model";

class ReportController implements Controller {
    public path = '/report';
    public router = new Router();
    private user = userModel;

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}`, this.generateReport);
    }

    private generateReport = async (ctx: Context, next: Next) => {

        const usersByCountries = await this.user.aggregate(
            [
                {
                    $match: {
                        "address.city": {
                            $exists: true,
                        }
                    }
                },
                {
                    $group: {
                        _id: {
                            city: '$address.city',
                        },
                        users: {
                            $push: {
                                _id: "$_id",
                            }
                        },
                        count: {
                            $sum : 1,
                        },

                    },
                },
                {
                    $lookup: {
                        from: 'posts',
                        localField: 'users._id',
                        foreignField: 'author',
                        as: 'articles',
                    }
                },
                {
                    $addFields: {
                        amountOfArticles: {
                            $size: "$articles"
                        }
                    }
                },
                {
                    $sort: {
                        amountOfArticles: 1,
                    },
                },
            ]
        );
        // const cities = await this.user.distinct("address.city", {
        //     email: {
        //         $regex:/@gmail.com$/
        //     }
        // })
        ctx.body = {
            // cities,
            usersByCountries,
        }
    }

}

export default ReportController;