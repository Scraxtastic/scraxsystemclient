import { encryptAndPackageData, unpackageAndDecryptData } from "./cbc";
import { Buffer } from "buffer";
import { wrapperKeys } from "./wrapperKeys";
import CryptoJS from "crypto-js";
import { LoginData } from "../Models/LoginData";

export class NetworkManager {
  static instance: NetworkManager = null;

  private socket: WebSocket;
  public data: string;
  public isConnected: boolean;
  public isConnecting: boolean;
  public isVerified: boolean;
  public onUpdate: (data: string) => void;
  public onError: (error: string) => void;
  private lastData: string = "";
  private ip: string;
  private name: string;
  constructor() {
    // console.log("Constructing NetworkManager…");
    if (!!NetworkManager.instance) {
      // console.log("NetworkManager:", "Instance already exists, returning…");
      // console.log(NetworkManager);
      // console.log(NetworkManager.instance);
      if (!!NetworkManager.instance.socket) {
        NetworkManager.instance.socket.close();
      }
    }
    NetworkManager.instance = this;
    // console.log("NetworkManager:", "Instance created.");
  }

  connectTo = (ip: string, name: string, key: Buffer) => {
    // console.log("WClient:", "connecting to ", ip, name);
    // console.log("WClient:", "WebSocket", WebSocket);
    // console.log("WClient:", "Buffer", Buffer.toString());
    this.ip = ip;
    this.name = name;
    const socket = new WebSocket(ip);
    socket.binaryType = "blob";
    // console.log("WClient:", "Socket created.");
    this.isConnecting = true;
    this.handleConnection(socket, key, name);
  };

  closeConnection = () => {
    this.socket?.close();
    this.isConnected = false;
    console.log("WClient:", "Connection closed.");
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
    // console.log("WClient", "Handling connection…");
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
          this.onUpdate(this.lastData);
        };
        reader.onerror = (e) => {
          console.error("Error reading blob:", e);
          this.onUpdate("Error reading blob." + "\n" + this.lastData);
        };
        reader.readAsArrayBuffer(e.data); // Read the blob as an ArrayBuffer
      } else {
        // Handle non-blob data
        // console.log("Received data:", e.data);
      }
    };
    socket.onclose = (e) => {
      console.log(
        "WClient:",
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
      console.log("WClient:", "Socket error:", e);
    };
    socket.onopen = () => {
      this.isConnecting = false;
      this.isConnected = true;
      // console.log("WClient:", "Connected to server.");
      this.onUpdate("Connected to server.");
      const loginData: LoginData = { name: name, type: "receiver" };
      this.sendEncryptedMessage(
        socket,
        Buffer.from(JSON.stringify(loginData)),
        key
      );
    };
    // socket.on("error", (err) => {
    //   console.log("WClient:", "Socket error:", err.name, err.message);
    // });
    // socket.on("unexpected-response", (req, res) => {
    //   console.log("WClient:", "Unexpected response:", res);
    // });

    // socket.on("message", async (data: Buffer) => {
    //   const decrypted = await unpackageAndDecryptData(data, key);
    //   this.data = decrypted.toString();
    //   this.onUpdate(this.data);
    //   console.log("WClient:", "Received data:", decrypted.toString());
    // });

    // socket.on("close", () => {
    //   this.isConnected = false;
    //   this.isConnecting = false;
    //   console.log("WClient:", "Socket closed.");
    // });
  };
}
