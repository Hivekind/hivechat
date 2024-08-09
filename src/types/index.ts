export const enum MessageType {
  Send = 'send',
  Recv = 'recv',
}

export type MessageData = {
  name: string;
  timestamp?: Date;
  message: string;
  type: MessageType;
};
