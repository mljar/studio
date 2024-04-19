// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import * as ejs from 'ejs';
import * as path from 'path';
import { ThemedWindow } from '../dialog/themedwindow';

export class UpdateDialog {
  constructor(options: UpdateDialog.IOptions) {
    this._window = new ThemedWindow({
      isDarkTheme: options.isDarkTheme,
      title: 'New version available',
      width: 400,
      height: 180,
      resizable: false,
      preload: path.join(__dirname, './preload.js')
    });

    let message = '';

    if (options.type === 'error') {
      message = 'Error occurred while checking for updates!';
    } else if (options.type === 'no-updates') {
      message = 'There are no updates available.';
    } else {
      if (options.isPro) {
        message = `There is a new version (${options.newestVersion}) available. 
        <br/><br/>
        <a href="javascript:void(0)" onclick='handleUpdate(this);'>Update</a>
        `;
      } else {
        message = `There is a new version (${options.newestVersion}) available. Download the latest version from 
        <a href="javascript:void(0)" onclick='handleReleasesLink(this);'>https://licenses.mljar.com</a>.`;
      }

    }
    const template = `
      <style>
        .update-result-container {
          style="height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .update-result-container a {
          color: #222222;
          outline: none;
        }
        .app-ui-dark .update-result-container a {
          color: #5d96ed;
        }
      </style>
      <div class="update-result-container">
        <div>
        <%- message %>
        </div>
      </div>

      <script>
        
        function handleUpdate(el) {
          window.electronAPI.launchAutomaticUpdate('${options.pocName}', '${options.newestVersion}', ${options.releaseId});
        }

        function handleReleasesLink(el) {
          window.electronAPI.launchInstallerDownloadPage();
        }
      </script>
    `;
    this._pageBody = ejs.render(template, { message });
  }

  get window(): ThemedWindow {
    return this._window;
  }

  load() {
    this._window.loadDialogContent(this._pageBody);
  }

  private _window: ThemedWindow;
  private _pageBody: string;
}

export namespace UpdateDialog {
  export interface IOptions {
    isDarkTheme: boolean;
    type: 'updates-available' | 'error' | 'no-updates';
    isPro: boolean;
    newestVersion: string;
    pocName?: string,
    releaseId?: number;
  }
}
