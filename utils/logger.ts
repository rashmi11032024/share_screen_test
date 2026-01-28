/**
 * Centralized logging utility for debugging the screen sharing flow
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

class Logger {
  private prefix = '[ScreenShare]';
  private isDebugEnabled = true;

  private formatMessage(level: LogLevel, message: string, ...args: any[]): void {
    const timestamp = new Date().toISOString();
    const formattedMessage = `${this.prefix} [${timestamp}] [${level.toUpperCase()}] ${message}`;
    
    switch (level) {
      case 'error':
        console.error(formattedMessage, ...args);
        break;
      case 'warn':
        console.warn(formattedMessage, ...args);
        break;
      case 'debug':
        if (this.isDebugEnabled) {
          console.log(formattedMessage, ...args);
        }
        break;
      default:
        console.log(formattedMessage, ...args);
    }
  }

  info(message: string, ...args: any[]): void {
    this.formatMessage('info', message, ...args);
  }

  warn(message: string, ...args: any[]): void {
    this.formatMessage('warn', message, ...args);
  }

  error(message: string, ...args: any[]): void {
    this.formatMessage('error', message, ...args);
  }

  debug(message: string, ...args: any[]): void {
    this.formatMessage('debug', message, ...args);
  }

  group(label: string): void {
    console.group(`${this.prefix} ${label}`);
  }

  groupEnd(): void {
    console.groupEnd();
  }
}

export const logger = new Logger();
