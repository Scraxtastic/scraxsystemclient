import { SocketConnectionData } from "./SocketConnectionData";
import { SocketData } from "./SocketData";

export interface MessageData {
    sockets: SocketData[];
    connections: SocketConnectionData[];
    type: string;
}