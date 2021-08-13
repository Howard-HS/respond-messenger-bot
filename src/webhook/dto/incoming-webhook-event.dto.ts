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
      message?: {
        mid: string;
        text: string;
        nlp: {
          intents: Array<any>;
          entities: Record<string, any>;
          traits: Record<string, any>;
          detected_locals: Array<any>;
        };
      };
      postback?: {
        title: string;
        payload: string;
        mid: string;
      };
    }[];
  }[];
}
