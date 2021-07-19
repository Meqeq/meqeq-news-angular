import { db } from './db.ts';
import { User } from './user.ts';
import { Panel } from '../../common/rss.ts';

export interface PanelsSchema extends Panels {
    _id: { $oid: string };
}

export interface Panels {
    userId: string;
    panels: Panel[]
}

export const panels = db.collection<PanelsSchema>("panels");

export const getAll = () => {
    return panels.find().toArray();
}

export const save = (pans: Panels) => {
    return panels.insertOne(pans);
}

export const update = (pans: PanelsSchema) => {

    console.log(pans);
    return panels.updateOne({ _id: pans._id }, { $set: { ...pans } });
}

export const getByUserId = (userId: string) => {
    return panels.findOne({ userId });
}