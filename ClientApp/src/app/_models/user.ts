import { Photo } from './photo';

export interface User {
    id: number;
    username: string;
    gender: string;
    age: number;
    knownAs: string;
    created: Date;
    photoUrl: string;
    lastActive: Date;
    city: string;
    country: string;
    interests?: string;
    lookingFor?: string;
    introduction?: string;
    photos?: Photo[];

}
