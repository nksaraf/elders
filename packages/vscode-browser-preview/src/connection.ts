import Logger from './utils/logger';
import {EventEmitter2} from 'eventemitter2';

export default class Connection extends EventEmitter2 {
  private lastId: number;
  private vscode: any;
  private readonly callbacks: Map<number, object>;
  private readonly logger: Logger;

  constructor() {
    super();
    this.lastId = 0;
    this.callbacks = new Map();
    this.logger = new Logger();

    window.addEventListener('message', (event) => {
      this.onMessage(event);
    });
  }

  async send<T>(method: string, parameters = {}): Promise<T> {
    const id = ++this.lastId;

    this.logger.log('SEND ► ', method, parameters);

    if (!this.vscode) {
      try {
        // @ts-expect-error
        this.vscode = acquireVsCodeApi();
      } catch {
        this.vscode = null;
      }
    }

    if (this.vscode) {
      this.vscode.postMessage({
        callbackId: id,
        params: parameters,
        type: method
      });
    }

    return new Promise((resolve, reject) => {
      this.callbacks.set(id, {resolve, reject, error: new Error('Error'), method});
    });
  }

  onMessage(message: any) {
    const object: any = message.data;

    if (object) {
      if (object.callbackId) {
        this.logger.log(`◀ RECV callbackId: ${object.callbackId}`);
        const callback: any = this.callbacks.get(object.callbackId);
        // Callbacks could be all rejected if someone has called `.dispose()`.
        if (callback) {
          this.callbacks.delete(object.callbackId);
          if (object.error) {
            callback.reject(object.error, callback.method, object);
          } else {
            callback.resolve(object.result);
          }
        }
      } else {
        this.logger.log(`◀ RECV method: ${object.method}`);
        this.emit(object.method, object.result);
      }
    }
  }

  enableVerboseLogging(verbose: boolean) {
    if (verbose) {
      this.logger.enable();
    } else {
      this.logger.disable();
    }
  }
}
