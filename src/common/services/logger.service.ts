import { ConsoleLogger, LoggerService, LogLevel } from '@nestjs/common';
import * as fs from 'node:fs';
import { writeFile } from 'node:fs/promises';
import { dirname, join } from 'path';
import 'dotenv/config';

export class CustomLoggerService implements LoggerService {
  private logFile = join(__dirname, '../../../logs/app0.log');
  private errorLogFile = join(__dirname, '../../../logs/error.app0.log');
  private logMaxSize;
  private consoleLogger = new ConsoleLogger();
  private logFilesNum = 0;
  private errorFilesNum = 0;
  private rotationNum;
  private logLevels = {
    error: 0,
    warn: 1,
    log: 2,
    debug: 3,
    verbose: 4,
  };
  private currentLogLevel: number;

  constructor() {
    this.rotationNum = +process.env.LOGS_ROTATION_NUM;
    this.currentLogLevel = +process.env.LOGS_LEVEL_NUM;
    this.logMaxSize = +process.env.LOGS_FILE_SIZE;

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

    const logDir = dirname(this.logFile);

    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    if (
      fs.existsSync(this.logFile) &&
      fs.statSync(this.logFile).size >= this.logMaxSize
    ) {
      this.logFilesNum =
        this.logFilesNum === this.rotationNum ? 0 : this.logFilesNum + 1;

      this.logFile = join(
        __dirname,
        `../../../logs/app${this.logFilesNum}.log`,
      );
      await writeFile(this.logFile, log);
    } else {
      fs.appendFileSync(this.logFile, log);
    }
    if (level === 'error') {
      if (
        fs.existsSync(this.errorLogFile) &&
        fs.statSync(this.errorLogFile).size >= this.logMaxSize
      ) {
        this.errorFilesNum =
          this.errorFilesNum === this.rotationNum ? 0 : this.errorFilesNum + 1;

        this.errorLogFile = join(
          __dirname,
          `../../../logs/error.app${this.errorFilesNum}.log`,
        );
        await writeFile(this.errorLogFile, log);
      } else {
        fs.appendFileSync(this.errorLogFile, log);
      }
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
