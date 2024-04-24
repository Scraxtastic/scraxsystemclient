import { BasicData } from "../../../src/Models/BasicData";
import { ServerProps } from "../../models/ServerProps";

export class GlobalStore {
  private static instance: GlobalStore;
  private servers: ServerProps[] = [];
  private activeServer: ServerProps | null = null;
  private activeServerData: BasicData | null = null;
  public onActiveServerDataUpdate: (data: BasicData) => void;
  private constructor() {}
  public static getInstance(): GlobalStore {
    if (!GlobalStore.instance) {
      GlobalStore.instance = new GlobalStore();
    }
    return GlobalStore.instance;
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
  public setActiveServerData(data: BasicData) {
    this.activeServerData = data;
    if (this.onActiveServerDataUpdate !== undefined) {
      this.onActiveServerDataUpdate(data);
    }
  }
  public getActiveServerData() {
    return this.activeServerData;
  }
}
