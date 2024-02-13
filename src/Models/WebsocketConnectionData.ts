export interface WebsocketConnectionData {
  connected: number;
  disconnected: number;
  lastConnectionTime: number;
  names: string[];
  failedLogins: number;
  ip?: string;
}
