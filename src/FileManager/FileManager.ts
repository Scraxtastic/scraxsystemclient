import * as FileSystem from "expo-file-system";
import {
  decryptData,
  decryptFileData,
  encryptData,
  encryptFileData,
} from "../Network/cbc";
import { Buffer } from "buffer";

export default class FileManager {
  static instance: FileManager | null = null;
  static ensureInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new FileManager();
    return this.instance;
  }

  constructor() {
    if (FileManager.instance === null) {
      FileManager.instance = this;
    }
    return FileManager.instance;
  }

  async ensureDirExists(path: string): Promise<void> {
    const absolutePath = FileSystem.documentDirectory + path;
    const dirInfo = await FileSystem.getInfoAsync(absolutePath);
    if (!dirInfo.exists) {
      console.log("FileManager:", "directory doesn't exist, creating…");
      await FileSystem.makeDirectoryAsync(absolutePath, {
        intermediates: true,
      });
    }
  }

  async deleteDir(path: string): Promise<void> {
    const absolutePath = FileSystem.documentDirectory + path;
    const dirInfo = await FileSystem.getInfoAsync(absolutePath);
    if (dirInfo.exists) {
      await FileSystem.deleteAsync(absolutePath, { idempotent: true });
    }
  }

  async readDir(path: string): Promise<string[]> {
    const absolutePath = FileSystem.documentDirectory + path;
    const dirInfo = await FileSystem.getInfoAsync(absolutePath);
    if (!dirInfo.exists) {
      return [];
    }
    const dirContent = await FileSystem.readDirectoryAsync(absolutePath);
    return dirContent;
  }

  async readFile(path: string): Promise<string> {
    try {
      const absolutePath = FileSystem.documentDirectory + path;
      const fileInfo = await FileSystem.getInfoAsync(absolutePath);
      if (!fileInfo.exists) {
        return "File doesn't exist";
      }
      const encryptedFileData = await FileSystem.readAsStringAsync(
        absolutePath,
        {
          encoding: FileSystem.EncodingType.UTF8,
        }
      );
      console.log("FileManager:", "encryptedFileData", encryptedFileData);
      const fileData = decryptFileData(encryptedFileData);
      console.log("FileManager:", "fileData", fileData.toString());

      console.log(
        "FileManager:",
        "readFile",
        "encryptedData",
        encryptedFileData
      );
      return fileData.toString();
    } catch (e) {
      console.error("FileManager:", "Error reading file", e);
      return "";
    }
  }

  async saveFile(path: string, data: Buffer): Promise<void> {
    try {
      const absolutePath = FileSystem.documentDirectory + path;
      this.ensureDirExists(path.split("/").slice(0, -1).join("/"));
      const encryptedData = encryptFileData(data);
      console.log(
        "FileManager:",
        "saveFile",
        "encryptedData",
        encryptedData,
        "data",
        data.toString("base64")
      );
      const decryptData = decryptFileData(encryptedData);
      const decryptData2 = decryptFileData(encryptedData);
      console.log(
        "FileManager:",
        "saveFile",
        "decryptData",
        decryptData,
        "decryptData2",
        decryptData2
      );
      await FileSystem.writeAsStringAsync(absolutePath, encryptedData, {
        encoding: FileSystem.EncodingType.UTF8,
      });
    } catch (e) {
      console.error("FileManager:", "Error saving file", e);
    }
  }
}
