import { create } from 'zustand';
import { 
  Message, 
  MessageType, 
  ConnectMessage,
  TerminalOutputMessage,
  ClaudeOutputMessage,
  ErrorMessage,
  AuthSuccessMessage
} from '@shared/protocol';

interface Terminal {
  id: string;
  output: string[];
}

interface ClaudeSession {
  id: string;
  name: string;
  messages: any[];
  isActive: boolean;
}

interface WebSocketStore {
  // Connection state
  socket: WebSocket | null;
  isConnected: boolean;
  isConnecting: boolean;
  connectionError: string | null;
  authToken: string | null;
  sessionId: string | null;

  // Terminal state
  terminals: Map<string, Terminal>;
  activeTerminalId: string | null;

  // Claude state
  claudeSessions: Map<string, ClaudeSession>;
  activeClaudeSessionId: string | null;

  // Actions
  connect: (url: string, token: string) => void;
  disconnect: () => void;
  sendMessage: (message: Message) => void;
  
  // Terminal actions
  createTerminal: () => void;
  sendTerminalInput: (terminalId: string, data: string) => void;
  setActiveTerminal: (terminalId: string) => void;

  // Claude actions
  startClaudeSession: (projectPath: string, model?: string) => void;
  sendClaudeMessage: (sessionId: string, message: string) => void;
  setActiveClaudeSession: (sessionId: string) => void;
}

export const useWebSocketStore = create<WebSocketStore>((set, get) => ({
  // Initial state
  socket: null,
  isConnected: false,
  isConnecting: false,
  connectionError: null,
  authToken: null,
  sessionId: null,
  terminals: new Map(),
  activeTerminalId: null,
  claudeSessions: new Map(),
  activeClaudeSessionId: null,

  // Connection actions
  connect: (url: string, token: string) => {
    const { socket, isConnecting } = get();
    
    if (socket || isConnecting) {
      return;
    }

    set({ isConnecting: true, connectionError: null, authToken: token });

    try {
      const ws = new WebSocket(url);
      
      ws.onopen = () => {
        console.log('WebSocket connected');
        
        // Send connect message
        const connectMsg: ConnectMessage = {
          type: MessageType.CONNECT,
          id: crypto.randomUUID(),
          timestamp: Date.now(),
          token,
          deviceInfo: {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            screenSize: {
              width: window.screen.width,
              height: window.screen.height
            }
          }
        };
        
        ws.send(JSON.stringify(connectMsg));
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data) as Message;
          handleMessage(message, set, get);
        } catch (error) {
          console.error('Failed to parse message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        set({ 
          connectionError: 'Connection failed',
          isConnecting: false 
        });
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        set({ 
          socket: null,
          isConnected: false,
          isConnecting: false,
          sessionId: null
        });
      };

      set({ socket: ws });
    } catch (error) {
      set({ 
        connectionError: error instanceof Error ? error.message : 'Connection failed',
        isConnecting: false 
      });
    }
  },

  disconnect: () => {
    const { socket } = get();
    if (socket) {
      socket.close();
      set({ 
        socket: null, 
        isConnected: false,
        terminals: new Map(),
        claudeSessions: new Map()
      });
    }
  },

  sendMessage: (message: Message) => {
    const { socket, isConnected } = get();
    if (socket && isConnected && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    }
  },

  // Terminal actions
  createTerminal: () => {
    const { sendMessage } = get();
    sendMessage({
      type: MessageType.TERMINAL_CREATE,
      id: crypto.randomUUID(),
      timestamp: Date.now()
    });
  },

  sendTerminalInput: (terminalId: string, data: string) => {
    const { sendMessage } = get();
    sendMessage({
      type: MessageType.TERMINAL_INPUT,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      terminalId,
      data
    });
  },

  setActiveTerminal: (terminalId: string) => {
    set({ activeTerminalId: terminalId });
  },

  // Claude actions
  startClaudeSession: (projectPath: string, model?: string) => {
    const { sendMessage } = get();
    const sessionId = `claude-${Date.now()}`;
    
    sendMessage({
      type: MessageType.CLAUDE_START,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      sessionId,
      projectPath,
      model
    });
  },

  sendClaudeMessage: (sessionId: string, message: string) => {
    const { sendMessage } = get();
    sendMessage({
      type: MessageType.CLAUDE_INPUT,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      sessionId,
      message
    });
  },

  setActiveClaudeSession: (sessionId: string) => {
    set({ activeClaudeSessionId: sessionId });
  }
}));

// Message handler
function handleMessage(
  message: Message, 
  set: any, 
  get: () => WebSocketStore
) {
  switch (message.type) {
    case MessageType.AUTH_SUCCESS:
      const authMessage = message as AuthSuccessMessage;
      set({ 
        isConnected: true, 
        isConnecting: false,
        sessionId: authMessage.sessionId
      });
      break;

    case MessageType.AUTH_ERROR:
      set({ 
        isConnected: false, 
        isConnecting: false,
        connectionError: (message as ErrorMessage).error
      });
      break;

    case MessageType.TERMINAL_OUTPUT:
      const terminalOutput = message as TerminalOutputMessage;
      const { terminals } = get();
      const terminal = terminals.get(terminalOutput.terminalId);
      
      if (terminal) {
        terminal.output.push(terminalOutput.data);
        set({ terminals: new Map(terminals) });
      } else {
        // Create new terminal
        terminals.set(terminalOutput.terminalId, {
          id: terminalOutput.terminalId,
          output: [terminalOutput.data]
        });
        set({ 
          terminals: new Map(terminals),
          activeTerminalId: terminalOutput.terminalId
        });
      }
      break;

    case MessageType.CLAUDE_OUTPUT:
      const claudeOutput = message as ClaudeOutputMessage;
      const { claudeSessions } = get();
      const session = claudeSessions.get(claudeOutput.sessionId);
      
      if (session) {
        session.messages.push(claudeOutput.content);
        set({ claudeSessions: new Map(claudeSessions) });
      } else {
        // Create new session
        claudeSessions.set(claudeOutput.sessionId, {
          id: claudeOutput.sessionId,
          name: `Session ${claudeOutput.sessionId}`,
          messages: [claudeOutput.content],
          isActive: true
        });
        set({ 
          claudeSessions: new Map(claudeSessions),
          activeClaudeSessionId: claudeOutput.sessionId
        });
      }
      break;

    case MessageType.SESSION_LIST:
      // TODO: Handle session list update
      // const sessionListMsg = message as SessionListMessage;
      break;

    case MessageType.ERROR:
      const error = message as ErrorMessage;
      console.error('Server error:', error.error);
      // Show error toast
      break;

    case MessageType.PING:
      // Respond with pong
      get().sendMessage({
        type: MessageType.PONG,
        id: message.id,
        timestamp: Date.now()
      });
      break;
  }
}