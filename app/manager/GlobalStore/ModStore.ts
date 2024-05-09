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

  public addModData(client: string, modName: string, modData: any) {
    if (this.clients[client] === undefined) {
      this.clients[client] = {};
      this.clients[client][modName] = [];
    }
    this.clients[client][modName].push(modData);
    if (this.onModDataUpdate !== undefined) {
      this.onModDataUpdate();
    }
  }

  public getModData(server: string, modName: string) {
    if (this.clients[server] === undefined) {
      return null;
    }
    return this.clients[server][modName];
  }
}
