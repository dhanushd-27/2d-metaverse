import { WebSocket } from "ws";
import { OutgoingMessage } from "./types";
import jwt, { JwtPayload } from "jsonwebtoken"
import { JWT_PASSWORD } from "./config";
import client  from '@repo/db/client';
import { RoomManager } from "./RoomManager";

function getRandomString(length: number) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}


export class User{
  public id: string;
  public userId?: string;
  private spaceId?: string;
  private x: number;
  private y: number;
  private ws: WebSocket;


  constructor(ws: WebSocket) {
    this.id = getRandomString(10);
    this.x = 0;
    this.y = 0;
    this.ws = ws;
    this.initHandlers()
  }

  initHandlers() {
    this.ws.on("message", async (data) => {
      // parse the input message
      const parsedData = JSON.parse(data.toString());

      console.log(parsedData);

      switch (parsedData.type){
        case "join":
          const spaceId = parsedData.payload.spaceId;
          const token = parsedData.payload.token;

          const userId = (jwt.verify(token, JWT_PASSWORD) as JwtPayload).id

          if(!userId){
            this.ws.close();
            return;
          }

          this.userId = userId;

          const space = await client.space.findFirst({
            where: {
              id: spaceId
            }
          })

          if(!space){
            this.ws.close();
            return;
          }

          this.spaceId! = spaceId
          RoomManager.getInstance().addUser(spaceId, this);
          this.x = Math.floor(space.width);
          this.y = Math.floor(space.height!);

          console.log(RoomManager.getInstance().rooms.get(spaceId)?.filter(x => x.id !== this.id)?.map((u) => ({id: u.id})) ?? []);
          
          this.send({
            type: "space-joined",
            payload: {
                spawn: {
                    x: this.x,
                    y: this.y
                },
                users: RoomManager.getInstance().rooms.get(spaceId)?.filter(x => x.id !== this.id)?.map((u) => ({id: u.id})) ?? []
            }
          });

          RoomManager.getInstance().broadcast(this.spaceId!, this ,{
              type: "user-joined",
              payload: {
                  userId: this.userId,
                  x: this.x,
                  y: this.y
              }
          });
          break;

        case "move":
          const moveX = parsedData.payload.x;
          const moveY = parsedData.payload.y;
          const xDisplacement = Math.abs(this.x - moveX);
          const yDisplacement = Math.abs(this.y - moveY);

          if ((xDisplacement == 1 && yDisplacement== 0) || (xDisplacement == 0 && yDisplacement == 1)) {
            this.x = moveX;
            this.y = moveY;
            console.log(this.userId);
            
            RoomManager.getInstance().broadcast(this.spaceId!, this, {
                type: "movement",
                userId: this.userId,
                payload: {
                    x: this.x,
                    y: this.y
                }
            } );

            return;
          }

          this.send({
            type: "movement-rejected",
              payload: {
                  x: this.x,
                  y: this.y
              }
          })
          break;
      }
    })
  }

  send(payload: OutgoingMessage){
    this.ws.send(JSON.stringify(payload));
  }

  destroy(){
    RoomManager.getInstance().broadcast(this.spaceId!, this, {
      type: "user-left",
      payload: {
          userId: this.userId
      }
    })

    RoomManager.getInstance().removeUser(this.spaceId!, this)

    return;
  }
}