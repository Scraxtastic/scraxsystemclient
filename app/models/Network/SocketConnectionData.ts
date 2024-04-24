export interface SocketConnectionData {
  connected: number;
  disconnected: number;
  lastConnectionTime: number;
  names: string[];
  failedLogins: number;
  ip: string;
}
