import { ConsoleLogger, LoggerService, LogLevel } from '@nestjs/common';
import * as fs from 'node:fs';
import { writeFile } from 'node:fs/promises';
import { join } from 'path';
import 'dotenv/config';

export class CustomLoggerService implements LoggerService {
  private baseLogPath = join(__dirname, '../../../logs');
  private logFile: string;
  private errorLogFile: string;
  private logMaxSize: number;
  private rotationNum: number;
  private logFilesNum: number;
  private errorFilesNum: number;
  private consoleLogger = new ConsoleLogger();
  private currentLogLevel: number;

  private logLevels = {
    error: 0,
    warn: 1,
    log: 2,
    debug: 3,
    verbose: 4,
  };

  constructor() {
    this.rotationNum = +process.env.LOGS_ROTATION_NUM || 5;
    this.currentLogLevel = +process.env.LOGS_LEVEL_NUM || 2;
    this.logMaxSize = +process.env.LOGS_FILE_SIZE || 1024 * 1024;

    this.logFilesNum = this.findLatestFileIndex('app');
    this.errorFilesNum = this.findLatestFileIndex('error.app');

    this.logFile = this.buildLogFilename('app', this.logFilesNum);
    this.errorLogFile = this.buildLogFilename('error.app', this.errorFilesNum);

    this.ensureLogDir();
    this.addProcessListeners();
  }

  log(message, context: string) {
    this.writeToFile('log', message, context);
  }

  error(message, context?: string, trace?: string) {
    this.writeToFile('error', message, context, trace);
  }

  warn(message, context: string) {
    this.writeToFile('warn', message, context);
  }

  debug(message, context: string) {
    this.writeToFile('debug', message, context);
  }

  verbose(message, context: string) {
    this.writeToFile('verbose', message, context);
  }

  private buildLogFilename(prefix: string, index: number) {
    return join(this.baseLogPath, `${prefix}${index}.log`);
  }

  private ensureLogDir() {
    if (!fs.existsSync(this.baseLogPath)) {
      fs.mkdirSync(this.baseLogPath, { recursive: true });
    }
  }

  private findLatestFileIndex(prefix: string): number {
    if (!fs.existsSync(this.baseLogPath)) return 0;
    const files = fs.readdirSync(this.baseLogPath);
    const regex = new RegExp(`^${prefix}(\\d+)\\.log$`);
    const indexes = files
      .map((file) => {
        const match = file.match(regex);
        return match ? +match[1] : -1;
      })
      .filter((index) => index >= 0);

    return indexes.length ? Math.max(...indexes) : 0;
  }

  private async writeToFile(
    level: LogLevel,
    message,
    context?: string,
    trace?: string,
  ) {
    if (this.logLevels[level] > this.currentLogLevel) return;

    const time = new Date().toISOString();
    const log = `[${time}] [${level}] ${context ? `[${context}]` : ''} ${message}${trace ? `\nTRACE: ${trace}` : ''}\n`;

    this.consoleLogger[level](message, context, ...(trace ? [trace] : []));

    await this.handleWrite(this.logFile, log, 'app');

    if (level === 'error') {
      await this.handleWrite(this.errorLogFile, log, 'error.app', true);
    }
  }

  private async handleWrite(
    filePath: string,
    content: string,
    prefix: string,
    isError = false,
  ) {
    try {
      if (
        fs.existsSync(filePath) &&
        fs.statSync(filePath).size >= this.logMaxSize
      ) {
        const nextIndex = isError
          ? (this.errorFilesNum + 1) % (this.rotationNum + 1)
          : (this.logFilesNum + 1) % (this.rotationNum + 1);

        filePath = this.buildLogFilename(prefix, nextIndex);

        if (isError) {
          this.errorFilesNum = nextIndex;
          this.errorLogFile = filePath;
        } else {
          this.logFilesNum = nextIndex;
          this.logFile = filePath;
        }

        await writeFile(filePath, content);
      } else {
        fs.appendFileSync(filePath, content);
      }
    } catch (err) {
      this.consoleLogger.error(`Failed to write log: ${err.message}`);
    }
  }

  private addProcessListeners() {
    process.on('uncaughtException', (error) => {
      this.error(
        `[Uncaught Exception]: ${error.message}`,
        error.stack,
        'Process',
      );
      process.exit(1);
    });

    process.on('unhandledRejection', (reason: any) => {
      this.error(
        `[Unhandled Rejection]: ${reason.message}`,
        reason.stack,
        'Process',
      );
      process.exit(1);
    });
  }
}
