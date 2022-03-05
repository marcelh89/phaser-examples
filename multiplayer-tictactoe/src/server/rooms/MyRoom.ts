import {Room, Client} from "colyseus";
import {MyRoomState} from "./schema/MyRoomState";

export class MyRoom extends Room<MyRoomState> {

    onCreate(options: any) {
        this.setState(new MyRoomState());

        this.onMessage("keydown", (client, message) => {
            this.broadcast('keydown', message, {
                except: client
            })
        });

    }

    onJoin(client: Client, options: any) {
        console.log(client.sessionId, "joined!");
    }

    onLeave(client: Client, consented: boolean) {
        console.log(client.sessionId, "left!");
    }

    onDispose() {
        console.log("room", this.roomId, "disposing...");
    }

}
