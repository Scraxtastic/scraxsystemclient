import { BasicData } from "./basicData/BasicData";

export interface SocketData {
  name: string;
  ip: string;
  port: number;
  data?: BasicData;
  mods: string[];
}
