export interface ServerProps {
  id?: number;
  ip: string;
  name: string;
  keyName: string;
  key: string;
}

export const createEmptyServerProps = () => {
  return {
    ip: "",
    key: "",
    keyName: "",
    name: "",
  };
};
