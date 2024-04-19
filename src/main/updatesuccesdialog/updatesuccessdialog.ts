// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import * as ejs from 'ejs';
import { ThemedWindow } from '../dialog/themedwindow';

export class UpdateSuccessDialog {
  constructor() {
    this._window = new ThemedWindow({
      isDarkTheme: false,
      title: 'MLJAR Studio update',
      width: 400,
      height: 180,
      resizable: false
    });
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
       MLJAR Studio update successful.
        </div>
      </div>
    `;
    this._pageBody = ejs.render(template);
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
