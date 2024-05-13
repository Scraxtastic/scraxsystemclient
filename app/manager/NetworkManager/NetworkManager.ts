import { encryptAndPackageData, unpackageAndDecryptData } from "./cbc";
import { Buffer } from "buffer";
import { wrapperKeys } from "./wrapperKeys";
import CryptoJS from "crypto-js";
import { LoginData } from "../../models/Network/LoginData";
import { ModMessage } from "../../models/Network/mods/ModMessage";

export class NetworkManager {
  private static instance: NetworkManager = null;

  public socket: WebSocket;
  public data: string;
  public isConnected: boolean;
  public isConnecting: boolean;
  public isVerified: boolean;
  public onConnect: (data: string) => void;
  public onUpdate: (data: string) => void;
  public onModUpdate: (data: ModMessage[]) => void;
  private currentModUpdates: ModMessage[] = [];
  private lastModUpdateSendTime: number = 0;
  public onError: (error: string) => void;
  private lastData: string = "";
  private ip: string;
  private name: string;
  constructor() {}

  public static getInstance = (): NetworkManager => {
    if (!NetworkManager.instance) {
      NetworkManager.instance = new NetworkManager();
    }
    return NetworkManager.instance;
  };

  connectTo = (ip: string, name: string, key: Buffer) => {
    this.ip = ip;
    this.name = name;
    const socket = new WebSocket(ip);
    this.socket = socket;
    socket.binaryType = "blob";
    this.isConnecting = true;
    console.log("WClient:", "ip", ip, "name", name);
    this.handleConnection(socket, key, name);
  };

  closeConnection = () => {
    this.socket?.close();
    this.isConnected = false;
    console.log("NetworkManager:", "Connection closed.");
  };

  sendEncryptedMessage = async (
    socket: WebSocket,
    data: Buffer,
    key: Buffer
  ) => {
    let encryptedData = encryptAndPackageData(data, key);
    for (let i = 0; i < wrapperKeys.length; i++) {
      encryptedData = encryptAndPackageData(
        encryptedData,
        Buffer.from(wrapperKeys[i], "base64")
      );
    }
    socket.send(encryptedData);
  };

  handleConnection = (socket: WebSocket, key: Buffer, name: string) => {
    socket.onmessage = async (e) => {
      if (e.data instanceof Blob) {
        const reader = new FileReader();
        reader.onload = () => {
          const arrayBuffer = reader.result as ArrayBuffer;
          let unwrappedData = Buffer.from(arrayBuffer);
          for (let i = wrapperKeys.length - 1; i >= 0; i--) {
            const decryptionStepData = unpackageAndDecryptData(
              unwrappedData,
              Buffer.from(wrapperKeys[i], "base64"),
              CryptoJS.enc.Base64
            );
            unwrappedData = Buffer.from(
              decryptionStepData.toString("utf-8"),
              "base64"
            );
          }
          let decryptedData = unpackageAndDecryptData(
            unwrappedData,
            key,
            CryptoJS.enc.Base64
          );
          this.lastData = Buffer.from(
            decryptedData.toString("utf-8"),
            "base64"
          ).toString("utf-8");
          const modMessage: ModMessage = JSON.parse(this.lastData);
          if (modMessage.type === "mod" || modMessage.type === "modFinished") {
            this.currentModUpdates = [...this.currentModUpdates, modMessage];
            if (this.lastModUpdateSendTime + 1000 < Date.now()) {
              this.lastModUpdateSendTime = Date.now();
              this.onModUpdate(this.currentModUpdates);
              this.currentModUpdates = [];
            }
          } else {
            this.onUpdate(this.lastData);
          }
        };
        reader.onerror = (e) => {
          console.error("Error reading blob:", e);
        };
        reader.readAsArrayBuffer(e.data); // Read the blob as an ArrayBuffer
      } else {
        // Handle non-blob data
        // console.log("Received data:", e.data);
      }

      if (this.currentModUpdates.length > 0) {
        this.onModUpdate(this.currentModUpdates);
        this.currentModUpdates = [];
      }
    };
    socket.onclose = (e) => {
      console.log(
        "NetworkManager:",
        "Socket closed:",
        "code:",
        e.code,
        "reason:",
        e.reason
      );
      // this.onUpdate("Connection closed." + "\n" + this.lastData);
    };
    socket.onerror = (e) => {
      this.onError(
        `Error connecting to server. ${this.name} (${
          this.ip
        }) msg: ${JSON.stringify(e)}`
      );
      console.log("NetworkManager:", "Socket error:", e);
    };
    socket.onopen = () => {
      this.isConnecting = false;
      this.isConnected = true;
      this.onConnect("Connected to server.");
      const loginData: LoginData = { name: name, type: "receiver" };
      this.sendEncryptedMessage(
        socket,
        Buffer.from(JSON.stringify(loginData)),
        key
      );
    };
  };
}
