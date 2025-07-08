import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useWebSocketStore } from '../stores/websocketStore';

interface ClaudeChatProps {
  sessionId: string;
}

export function ClaudeChat({ sessionId }: ClaudeChatProps) {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { claudeSessions, sendClaudeMessage } = useWebSocketStore();
  const session = claudeSessions.get(sessionId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [session?.messages]);

  const handleSend = () => {
    if (!input.trim() || isProcessing) return;

    const message = input.trim();
    setInput('');
    setIsProcessing(true);
    sendClaudeMessage(sessionId, message);

    // Reset processing state after a timeout (in case no response)
    setTimeout(() => setIsProcessing(false), 30000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!session) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground">Session not found</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {session.messages.length === 0 ? (
          <div className="text-center text-muted-foreground">
            <Bot className="w-12 h-12 mx-auto mb-4" />
            <p>Start a conversation with Claude</p>
          </div>
        ) : (
          session.messages.map((message, index) => (
            <MessageBubble key={index} message={message} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t p-4">
        <div className="flex items-center gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            disabled={isProcessing}
            className="flex-1"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isProcessing}
            size="icon"
          >
            {isProcessing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: any }) {
  // Parse Claude's stream-json format
  const isUser = message.type === 'user_message';
  const isAssistant = message.type === 'assistant_message';
  const isToolUse = message.type === 'tool_use';
  const isError = message.type === 'error';

  if (isUser) {
    return (
      <div className="flex items-start gap-3 justify-end">
        <div className="bg-primary text-primary-foreground rounded-lg px-4 py-2 max-w-[80%]">
          <p className="text-sm">{message.content}</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
          <User className="w-4 h-4 text-primary-foreground" />
        </div>
      </div>
    );
  }

  if (isAssistant) {
    return (
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
          <Bot className="w-4 h-4" />
        </div>
        <div className="bg-secondary rounded-lg px-4 py-2 max-w-[80%]">
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        </div>
      </div>
    );
  }

  if (isToolUse) {
    return (
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
          <Bot className="w-4 h-4" />
        </div>
        <div className="bg-muted rounded-lg px-4 py-2 max-w-[80%]">
          <p className="text-xs font-mono text-muted-foreground mb-1">
            Tool: {message.tool_name}
          </p>
          <pre className="text-xs overflow-x-auto">
            {JSON.stringify(message.arguments, null, 2)}
          </pre>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center gap-2 text-destructive bg-destructive/10 rounded-lg px-4 py-2">
        <AlertCircle className="w-4 h-4" />
        <p className="text-sm">{message.error}</p>
      </div>
    );
  }

  // Default message display
  return (
    <div className="bg-muted rounded-lg px-4 py-2">
      <pre className="text-xs overflow-x-auto">
        {JSON.stringify(message, null, 2)}
      </pre>
    </div>
  );
}