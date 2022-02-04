import { IPaginate } from './iPaginate';
import { IPhoto } from './iPhoto';

export class IPaginateMember implements IPaginate {
    data: IMember[] = []
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
}
export interface IMember {
    id: number;
    userName: string;
    photoUrl: string;
    age: number;
    knownAs: string;
    created: Date;
    lastActive: Date;
    gender: string;
    introduction: string;
    lookingFor: string;
    interests: string;
    city: string;
    country: string;
    photos: IPhoto[];
}