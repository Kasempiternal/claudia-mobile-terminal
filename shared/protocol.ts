export enum MessageType {
    // Connection
    CONNECT = 'connect',
    DISCONNECT = 'disconnect',
    AUTH = 'auth',
    AUTH_SUCCESS = 'auth_success',
    AUTH_ERROR = 'auth_error',

    // Terminal
    TERMINAL_INPUT = 'terminal_input',
    TERMINAL_OUTPUT = 'terminal_output',
    TERMINAL_RESIZE = 'terminal_resize',
    TERMINAL_CREATE = 'terminal_create',
    TERMINAL_CLOSE = 'terminal_close',

    // Claude
    CLAUDE_START = 'claude_start',
    CLAUDE_INPUT = 'claude_input',
    CLAUDE_OUTPUT = 'claude_output',
    CLAUDE_ERROR = 'claude_error',
    CLAUDE_COMPLETE = 'claude_complete',
    CLAUDE_TOOL_USE = 'claude_tool_use',

    // Session
    SESSION_LIST = 'session_list',
    SESSION_CREATE = 'session_create',
    SESSION_RESUME = 'session_resume',
    SESSION_UPDATE = 'session_update',

    // File System
    FS_READ = 'fs_read',
    FS_WRITE = 'fs_write',
    FS_LIST = 'fs_list',
    FS_DELETE = 'fs_delete',

    // System
    ERROR = 'error',
    PING = 'ping',
    PONG = 'pong'
}

export interface BaseMessage {
    type: MessageType;
    id: string;
    timestamp: number;
}

export interface ConnectMessage extends BaseMessage {
    type: MessageType.CONNECT;
    token: string;
    deviceInfo: {
        userAgent: string;
        platform: string;
        screenSize: { width: number; height: number };
    };
}

export interface AuthSuccessMessage extends BaseMessage {
    type: MessageType.AUTH_SUCCESS;
    sessionId: string;
    capabilities: string[];
}

export interface TerminalInputMessage extends BaseMessage {
    type: MessageType.TERMINAL_INPUT;
    terminalId: string;
    data: string;
}

export interface TerminalOutputMessage extends BaseMessage {
    type: MessageType.TERMINAL_OUTPUT;
    terminalId: string;
    data: string;
}

export interface TerminalResizeMessage extends BaseMessage {
    type: MessageType.TERMINAL_RESIZE;
    terminalId: string;
    cols: number;
    rows: number;
}

export interface ClaudeStartMessage extends BaseMessage {
    type: MessageType.CLAUDE_START;
    sessionId: string;
    projectPath: string;
    model?: string;
    systemPrompt?: string;
}

export interface ClaudeInputMessage extends BaseMessage {
    type: MessageType.CLAUDE_INPUT;
    sessionId: string;
    message: string;
}

export interface ClaudeOutputMessage extends BaseMessage {
    type: MessageType.CLAUDE_OUTPUT;
    sessionId: string;
    content: any; // Claude's stream-json format
}

export interface SessionInfo {
    id: string;
    name: string;
    projectPath: string;
    createdAt: number;
    lastActiveAt: number;
    isActive: boolean;
}

export interface SessionListMessage extends BaseMessage {
    type: MessageType.SESSION_LIST;
    sessions: SessionInfo[];
}

export interface ErrorMessage extends BaseMessage {
    type: MessageType.ERROR;
    error: string;
    code?: string;
}

export type Message = 
    | ConnectMessage
    | AuthSuccessMessage
    | TerminalInputMessage
    | TerminalOutputMessage
    | TerminalResizeMessage
    | ClaudeStartMessage
    | ClaudeInputMessage
    | ClaudeOutputMessage
    | SessionListMessage
    | ErrorMessage
    | BaseMessage;