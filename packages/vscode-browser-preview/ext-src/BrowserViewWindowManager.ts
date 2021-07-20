import * as path from 'path';
import * as vscode from 'vscode';
import * as EventEmitter from 'eventemitter2';

import Browser from './browser';
import {ExtensionConfiguration} from './extensionConfiguration';
import {BrowserViewWindow} from './BrowserViewWindow';
import {Telemetry} from './telemetry';

export class BrowserViewWindowManager extends EventEmitter.EventEmitter2 {
  public openWindows: Set<BrowserViewWindow>;
  private browser: any;
  private defaultConfig: ExtensionConfiguration;
  private readonly telemetry: Telemetry;

  constructor(extensionPath: string, telemetry: Telemetry) {
    super();
    this.openWindows = new Set();
    this.telemetry = telemetry;
    this.defaultConfig = {
      extensionPath,
      startUrl: 'http://code.visualstudio.com',
      format: 'jpeg',
      columnNumber: 2
    };
    this.refreshSettings();

    this.on('windowOpenRequested', (parameters) => {
      this.create(parameters.url);
    });
  }

  private refreshSettings() {
    const extensionSettings = vscode.workspace.getConfiguration('browser-preview');
    if (extensionSettings) {
      const chromeExecutable = extensionSettings.get<string>('chromeExecutable');
      if (chromeExecutable !== undefined) {
        this.defaultConfig.chromeExecutable = chromeExecutable;
      }

      const startUrl = extensionSettings.get<string>('startUrl');
      if (startUrl !== undefined) {
        this.defaultConfig.startUrl = startUrl;
      }

      const isVerboseMode = extensionSettings.get<boolean>('verbose');
      if (isVerboseMode !== undefined) {
        this.defaultConfig.isVerboseMode = isVerboseMode;
      }

      const format = extensionSettings.get<string>('format');
      if (format !== undefined) {
        this.defaultConfig.format = format.includes('png') ? 'png' : 'jpeg';
      }
    }
  }

  getLastColumnNumber() {
    const lastWindow = Array.from(this.openWindows).pop();
    if (lastWindow) {
      return lastWindow.config.columnNumber;
    }

    return 1;
  }

  public async create(startUrl?: string, id?: string) {
    this.refreshSettings();
    const config = { ...this.defaultConfig };

    if (!this.browser) {
      this.browser = new Browser(config, this.telemetry);
    }

    const lastColumnNumber = this.getLastColumnNumber();
    if (lastColumnNumber) {
      config.columnNumber = lastColumnNumber + 1;
    }

    const window = new BrowserViewWindow(config, this.browser, id);

    await window.launch(startUrl);
    window.once('disposed', () => {
      const id = window.id;
      this.openWindows.delete(window);
      if (this.openWindows.size === 0) {
        this.browser.dispose();
        this.browser = null;
      }

      this.emit('windowDisposed', id);
    });

    window.on('windowOpenRequested', (parameters) => {
      this.emit('windowOpenRequested', parameters);
    });

    this.openWindows.add(window);

    this.emit('windowCreated', window.id);

    return window;
  }

  public getDebugPort() {
    return this.browser ? this.browser.remoteDebugPort : null;
  }

  public disposeByUrl(url: string) {
    for (const b: BrowserViewWindow of this.openWindows) {
      if (b.config.startUrl == url) {
        b.dispose();
      }
    }
  }

  public getByUrl(url: string): BrowserViewWindow | undefined {
    let match;
    for (const b: BrowserViewWindow of this.openWindows) {
      if (b.config.startUrl == url) {
        match = b;
      }
    }
    return match;
  }

  public getById(id: string): BrowserViewWindow | undefined {
    let match;
    for (const b: BrowserViewWindow of this.openWindows) {
      if (b.id == id) {
        match = b;
      }
    }
    return match;
  }
}
