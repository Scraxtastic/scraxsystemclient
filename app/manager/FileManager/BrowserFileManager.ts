import {
  decryptFileData,
  encryptFileData,
} from '../NetworkManager/cbc';
import { Buffer } from 'buffer';

export default class BrowserFileManager {
  static instance: BrowserFileManager | null = null;

  static ensureInstance(): BrowserFileManager {
    if (!this.instance) {
      this.instance = new BrowserFileManager();
    }
    return this.instance;
  }

  private constructor() {}

  private getDirKey(path: string): string {
    return `dir:${path}`;
  }

  private getFileKey(path: string): string {
    return `file:${path}`;
  }

  async ensureDirExists(path: string): Promise<void> {
    const dirKey = this.getDirKey(path);
    if (!localStorage.getItem(dirKey)) {
      console.log('BrowserFileManager:', "directory doesn't exist, creating…");
      localStorage.setItem(dirKey, JSON.stringify([]));
      console.log('BrowserFileManager:', 'directory created…');
    }
  }

  async deleteDir(path: string): Promise<void> {
    const dirKey = this.getDirKey(path);
    localStorage.removeItem(dirKey);
  }

  async readDir(path: string): Promise<string[]> {
    const dirKey = this.getDirKey(path);
    const dirContent = localStorage.getItem(dirKey);
    return dirContent ? JSON.parse(dirContent) : [];
  }

  async readFile(path: string): Promise<string> {
    try {
      const fileKey = this.getFileKey(path);
      const fileInfo = localStorage.getItem(fileKey);
      if (!fileInfo) {
        return "File doesn't exist";
      }
      const decryptedFileData = decryptFileData(fileInfo);
      return decryptedFileData.toString();
    } catch (e) {
      console.error('BrowserFileManager:', 'Error reading file', e);
      return '';
    }
  }

  async saveFile(path: string, data: Buffer): Promise<void> {
    try {
      const dirPath = path.split('/').slice(0, -1).join('/');
      await this.ensureDirExists(dirPath);
      const fileKey = this.getFileKey(path);
      const encryptedData = encryptFileData(data);

      const dirContent = await this.readDir(dirPath);
      const fileName = path.split('/').pop();
      if (!dirContent.includes(fileName)) {
        dirContent.push(fileName);
        localStorage.setItem(this.getDirKey(dirPath), JSON.stringify(dirContent));
      }

      localStorage.setItem(fileKey, encryptedData);
    } catch (e) {
      console.error('BrowserFileManager:', 'Error saving file', e);
    }
  }
}
