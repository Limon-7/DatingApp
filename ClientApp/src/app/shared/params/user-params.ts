import { IUser } from "../models/iUser";
import { QueryParams } from "./query-params";

export class UserParams implements QueryParams {
    pageNumber = 1;
    pageSize = 5;
    search: string;
    gender: string;
    minAge = 18;
    maxAge = 99;
    orderBy = 'lastActive';

    constructor(user: IUser) {
        this.gender = user.gender === 'female' ? 'Male' : 'Female';
    }
}