import { db } from './db.ts';

export interface UserSchema extends User {
    _id: { $oid: string };
}

export interface User {
    username: string;
    password: string;
    nick: string;
    email: string;
}
  
export const users = db.collection<UserSchema>("users");

export const getAll = () => {
    return users.find().toArray();
}

export const save = (user: User) => {
    return users.insertOne(user);
}

export const getByUsername = (username: string) => {
    return users.findOne({ username });
}

export const getByEmail = (email: string) => {
    return users.findOne({ email });
}