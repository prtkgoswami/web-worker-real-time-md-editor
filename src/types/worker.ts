export type WorkerMessageType = 
    | "PARSE_MARKDOWN"
    | "PARSE_COMPLETE"
    | "ERROR";

export interface WorkerMessage {
    type: WorkerMessageType;
    id: string;
    payload?: any;
    result?: any;
}

export interface ParseMarkdownMessage extends WorkerMessage {
    type: "PARSE_MARKDOWN";
    payload: {
        markdown: string;
        delayMs: number;
    }
}

export interface ParseCompleteMessage extends WorkerMessage {
    type: "PARSE_COMPLETE";
    result: {
        html: string;
    }
}

export interface ErrorMessage extends WorkerMessage {
    type: "ERROR";
    result: {
        message: string;
    }
}