import { useEffect, useRef } from 'react';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Plus, Terminal, Bot, X, Settings } from 'lucide-react';
import { useWebSocketStore } from '../stores/websocketStore';
import { ClaudeChat } from './ClaudeChat';
import 'xterm/css/xterm.css';

export function TerminalScreen() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  
  const {
    terminals,
    activeTerminalId,
    createTerminal,
    sendTerminalInput,
    setActiveTerminal,
    claudeSessions,
    activeClaudeSessionId,
    startClaudeSession,
    setActiveClaudeSession,
    disconnect
  } = useWebSocketStore();

  useEffect(() => {
    if (!terminalRef.current || xtermRef.current) return;

    // Initialize xterm
    const term = new XTerm({
      theme: {
        background: '#1e1e1e',
        foreground: '#cccccc',
        cursor: '#cccccc',
        black: '#000000',
        red: '#cd3131',
        green: '#0dbc79',
        yellow: '#e5e510',
        blue: '#2472c8',
        magenta: '#bc3fbc',
        cyan: '#11a8cd',
        white: '#e5e5e5',
        brightBlack: '#666666',
        brightRed: '#f14c4c',
        brightGreen: '#23d18b',
        brightYellow: '#f5f543',
        brightBlue: '#3b8eea',
        brightMagenta: '#d670d6',
        brightCyan: '#29b8db',
        brightWhite: '#e5e5e5'
      },
      fontFamily: 'Consolas, Monaco, "Courier New", monospace',
      fontSize: 14,
      cursorBlink: true,
      allowProposedApi: true
    });

    const fitAddon = new FitAddon();
    const webLinksAddon = new WebLinksAddon();

    term.loadAddon(fitAddon);
    term.loadAddon(webLinksAddon);

    term.open(terminalRef.current);
    fitAddon.fit();

    xtermRef.current = term;
    fitAddonRef.current = fitAddon;

    // Handle terminal input
    term.onData((data) => {
      if (activeTerminalId) {
        sendTerminalInput(activeTerminalId, data);
      }
    });

    // Handle resize
    const handleResize = () => {
      fitAddon.fit();
    };
    window.addEventListener('resize', handleResize);

    // Create initial terminal if none exists
    if (terminals.size === 0) {
      createTerminal();
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      term.dispose();
    };
  }, [activeTerminalId, createTerminal, sendTerminalInput, terminals.size]);

  // Update terminal content when active terminal changes
  useEffect(() => {
    if (!xtermRef.current || !activeTerminalId) return;

    const terminal = terminals.get(activeTerminalId);
    if (terminal) {
      xtermRef.current.clear();
      terminal.output.forEach(line => {
        xtermRef.current!.write(line);
      });
    }
  }, [activeTerminalId, terminals]);

  const handleNewTerminal = () => {
    createTerminal();
  };

  const handleNewClaudeSession = () => {
    const workspacePath = '/workspace'; // In real app, get from context
    startClaudeSession(workspacePath);
  };

  const terminalTabs = Array.from(terminals.values());
  const claudeTabs = Array.from(claudeSessions.values());

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-2 border-b bg-secondary">
        <h1 className="text-sm font-semibold">Claudia Mobile Terminal</h1>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" onClick={disconnect}>
            <X className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="ghost">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="terminal" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="terminal" className="flex items-center gap-2">
            <Terminal className="w-4 h-4" />
            Terminal
          </TabsTrigger>
          <TabsTrigger value="claude" className="flex items-center gap-2">
            <Bot className="w-4 h-4" />
            Claude
          </TabsTrigger>
        </TabsList>

        <TabsContent value="terminal" className="flex-1 flex flex-col m-0">
          {terminalTabs.length > 0 && (
            <div className="flex items-center gap-1 p-1 border-b overflow-x-auto">
              {terminalTabs.map((term) => (
                <Button
                  key={term.id}
                  size="sm"
                  variant={activeTerminalId === term.id ? 'default' : 'ghost'}
                  onClick={() => setActiveTerminal(term.id)}
                  className="text-xs"
                >
                  Terminal {term.id.slice(-4)}
                </Button>
              ))}
              <Button
                size="sm"
                variant="ghost"
                onClick={handleNewTerminal}
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          )}
          <div ref={terminalRef} className="flex-1" />
        </TabsContent>

        <TabsContent value="claude" className="flex-1 flex flex-col m-0">
          {claudeTabs.length > 0 && (
            <div className="flex items-center gap-1 p-1 border-b overflow-x-auto">
              {claudeTabs.map((session) => (
                <Button
                  key={session.id}
                  size="sm"
                  variant={activeClaudeSessionId === session.id ? 'default' : 'ghost'}
                  onClick={() => setActiveClaudeSession(session.id)}
                  className="text-xs"
                >
                  {session.name}
                </Button>
              ))}
              <Button
                size="sm"
                variant="ghost"
                onClick={handleNewClaudeSession}
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          )}
          
          {activeClaudeSessionId && claudeSessions.get(activeClaudeSessionId) ? (
            <ClaudeChat sessionId={activeClaudeSessionId} />
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Bot className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">No Claude sessions</p>
                <Button onClick={handleNewClaudeSession}>
                  Start New Session
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}