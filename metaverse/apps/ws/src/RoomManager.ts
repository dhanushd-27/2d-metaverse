import { OutgoingMessage } from "./types";
import { User } from "./User";

export class RoomManager{
  rooms: Map<string, User[]> = new Map();
  static instance: RoomManager;

  constructor(){
    this.rooms = new Map();
  }

  static getInstance() {
    if(!this.instance){
      this.instance = new RoomManager();
    }

    return this.instance;
  }

  public removeUser(spaceId: string, user: User){
    if(!this.rooms.has(spaceId)){
      return
    }

    this.rooms.set(spaceId, (this.rooms.get(spaceId)?.filter((u) => u.id !== user.id)) ?? [])

  }

  public addUser(spaceId: string, user: User){
    if(!this.rooms.has(spaceId)){
      this.rooms.set(spaceId,[user])
    }

    this.rooms.set(spaceId, [...this.rooms.get(spaceId)?.filter((u) => u.id !== user.id) ?? [], user])
  }

  public broadcast(spaceId: string, user: User, message: OutgoingMessage){
    if(!this.rooms.has(spaceId)){
      return;
    }

    this.rooms.get(spaceId)?.forEach((u) => {
      if(u.id !== user.id){
        u.send(message);
      }
    })
  }
}