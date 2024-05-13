import { ModMessage } from "../../models/Network/mods/ModMessage";

export class ModStore {
  private static instance: ModStore = null;
  public onModDataUpdate = undefined;
  private clients: any = {};

  private constructor() {}

  public static getInstance() {
    if (!ModStore.instance) {
      ModStore.instance = new ModStore();
    }
    return ModStore.instance;
  }

  public addModData(client: string, modName: string, modData: ModMessage) {
    if (this.clients[client] === undefined) {
      this.clients[client] = {};
    }
    if (this.clients[client][modName] === undefined) {
      this.clients[client][modName] = { finished: true, data: [] };
    }
    const current = this.clients[client][modName];
    if (current.finished) {
      this.clients[client][modName].data.push(modData);
      if (modData.type !== "modFinished") {
        current.finished = false;
      }
    } else {
      this.clients[client][modName].data[current.data.length - 1].message +=
        modData.message;
      if (modData.type === "modFinished") {
        current.finished = true;
      }
    }
    if (this.onModDataUpdate !== undefined) {
      this.onModDataUpdate();
    }
  }

  public getModData(server: string, modName: string) {
    if (this.clients[server] === undefined) {
      return null;
    }
    if (this.clients[server][modName] === undefined) {
      return null;
    }
    return this.clients[server][modName].data;
  }
}
