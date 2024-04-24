export type ConnectorType = "NOT SET" | "receiver" | "sender";

export interface LoginData {
  name: string;
  type: ConnectorType;
}
