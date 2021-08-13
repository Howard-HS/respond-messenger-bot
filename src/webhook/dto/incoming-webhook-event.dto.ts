export class IncomingWebhookData {
  object: string;

  entry: {
    id: string;
    time: string;
    messaging: {
      sender: {
        id: string;
      };
      recipient: {
        id: string;
      };
      timestamp: number;
      message: {
        mid: string;
        text: string;
      };
    }[];
  }[];
}
