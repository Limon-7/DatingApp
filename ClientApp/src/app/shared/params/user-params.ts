import { IUser } from "../models/iUser";

export class UserParams {
    gender: string;
    minAge = 18;
    maxAge = 99;
    pageNumber = 1;
    pageSize = 24;
    orderBy = 'lastActive';

    constructor(user: IUser) {
        this.gender = user.gender === 'female' ? 'male' : 'female';
    }
}