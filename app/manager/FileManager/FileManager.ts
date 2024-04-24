import * as FileSystem from "expo-file-system";
import {
  decryptData,
  decryptFileData,
  encryptData,
  encryptFileData,
} from "../../../src/Network/cbc";
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
      console.log("FileManager:", "directory created…");
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
      const fileData = decryptFileData(encryptedFileData);
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
      await FileSystem.writeAsStringAsync(absolutePath, encryptedData, {
        encoding: FileSystem.EncodingType.UTF8,
      });
    } catch (e) {
      console.error("FileManager:", "Error saving file", e);
    }
  }
}
