import { ObjectId } from "mongodb";

export interface Queue {
  opdId: ObjectId;
  appointments: Array<ObjectId>;
}
