import { BasicData } from "../../../src/Models/BasicData";
import { SocketData } from "../../models/Network/SocketData";
import { ServerProps } from "../../models/ServerProps";
import { ModStore } from "./ModStore";

export class GlobalStore {
  private static instance: GlobalStore;
  private servers: ServerProps[] = [];
  private activeServer: ServerProps | null = null;
  private activeServerData: SocketData | null = null;
  public onActiveServerDataUpdate: (data: SocketData) => void;
  //Creation
  public shallCreateServer: boolean = false;
  public onShallCreateServer: (shallCreate: boolean) => void;

  // Mods
  public modStore: ModStore = ModStore.getInstance();
  private constructor() {}
  public static getInstance(): GlobalStore {
    if (!GlobalStore.instance) {
      GlobalStore.instance = new GlobalStore();
    }
    return GlobalStore.instance;
  }
  public clearServers() {
    this.servers = [];
  }
  public getServers(): ServerProps[] {
    return this.servers;
  }
  public addServer(server: ServerProps) {
    this.servers.push(server);
  }
  public addServers(servers: ServerProps[]) {
    this.servers.push(...servers);
  }
  public removeServer(server: ServerProps) {
    this.servers = this.servers.filter((s) => s !== server);
  }
  public updateServer(server: ServerProps) {
    this.servers = this.servers.map((s) => (s === server ? server : s));
  }
  public setActiveServer(server: ServerProps) {
    this.activeServer = server;
  }
  public getActiveServer() {
    return this.activeServer;
  }
  public setActiveServerData(data: SocketData) {
    this.activeServerData = data;
    if (this.onActiveServerDataUpdate !== undefined) {
      this.onActiveServerDataUpdate(data);
    }
  }
  public getActiveServerData() {
    return this.activeServerData;
  }
  //Creation
  public setShallCreateServer(shallCreate: boolean) {
    this.onShallCreateServer(shallCreate);
    this.shallCreateServer = shallCreate;
  }
  public getShallCreateServer() {
    return this.shallCreateServer;
  }
}
