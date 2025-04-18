// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import { BrowserView } from 'electron';
import { DarkThemeBGColor, getUserHomeDir, LightThemeBGColor } from '../utils';
import * as path from 'path';
import { SettingType, userSettings } from '../config/settings';
import { appData, INewsItem } from '../config/appdata';
import { IRegistry } from '../registry';
import { EventTypeMain, EventTypeRenderer } from '../eventtypes';

const maxRecentItems = 5;

interface IRecentSessionListItem {
  isRemote: boolean;
  linkLabel: string;
  linkTooltip: string;
  linkDetail?: string;
}

export class WelcomeView {
  constructor(options: WelcomeView.IOptions) {
    this._registry = options.registry;
    this._isDarkTheme = false; //options.isDarkTheme;
    this._view = new BrowserView({
      webPreferences: {
        preload: path.join(__dirname, './preload.js'),
        devTools: process.env.NODE_ENV === 'development'
      }
    });

    this._view.setBackgroundColor(
      this._isDarkTheme ? DarkThemeBGColor : LightThemeBGColor
    );

    const showNewsFeed = userSettings.getValue(SettingType.showNewsFeed);
    if (showNewsFeed) {
      // initalize from app cache
      WelcomeView._newsList = appData.newsList;
    }

    this._pageSource = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
          <title>MLJAR Studio</title>
          <style>
            body {
              /* background-color: rgba(249, 250, 251, 0.5); */
              /* background: ${LightThemeBGColor}; */
              background-color: #f8f8f8;
              font-family: Arial, sans-serif;
              
              /* color: rgb(55, 65, 81); */
              margin: 0;
              overflow: hidden;
              /*font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;*/
              font-size: 13px;
              -webkit-user-select: none;
              user-select: none;
            }
            body.app-ui-dark {
              background: ${DarkThemeBGColor};
              color: #ffffff;
            }
   /* Container to standardize the width of all elements */
    .newcontainer {
      max-width: 800px; 
      margin: auto;
      padding-top: 10vh;
      padding-left:10px;
      padding-right:10px;
      height: calc(100vh - 100px);
      
              font-size: 16px;
              display: flex;
              flex-direction: column;
    }

    header {
      text-align: left;
      margin-bottom: 30px;
    }
    
    header h1 {
      font-size: 2.5em;
      margin: 0;
    }
    
    header p {
      font-size: 1.2em;
      margin: 10px 0 0;
    }

    /* Button row container */
    .button-container {
      display: flex;
      gap: 20px;
      margin-bottom: 30px;
    }

    /* Outline Button styling with a thinner border and larger font */
    .btn {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 20px;
      font-size: 1.1em; /* Increased font size */
      background-color: #fff;
      color: #007BFF;
      border: 1px solid #007BFF; /* Thinner border */
      border-radius: 5px;
      cursor: pointer;
      transition: background-color 0.3s ease, color 0.3s ease;
    }

    .disabled {
      pointer-events: none;
      opacity: 0.5;
    }
    
    .btn:hover {
      background-color: #007BFF;
      color: #fff;
    }

    /* Icon styling inside buttons */
    .btn-icon svg {
      width: 24px;
      height: 24px;
      fill: currentColor;
    }

    /* Text within each button */
    .btn-text {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }
    
    .btn-title {
      font-weight: bold;
      margin: 0;
    }
    
    .btn-desc {
      font-size: 0.9em;
      opacity: 0.9;
      margin: 0;
    }

    /* Information box styling */
    .info-box {
      background-color: #e9ecef;
      border-left: 4px solid #007BFF;
      padding: 15px;
      margin-bottom: 30px;
      font-size: 0.95em;
    }

    /* Documentation link styling */
    .documentation {
      font-size: 1em;
    }
    
    .documentation a {
      color: #007BFF;
      text-decoration: none;
    }
    
    .documentation a:hover {
      text-decoration: underline;
    }
    /********************/

            .container {
              height: calc(100vh - 100px);
              padding: 80px 120px 20px 120px;
              font-size: 16px;
              display: flex;
              flex-direction: column;
            }
            .row {
              display: flex;
              flex-direction: row;
              font-size: 14px;
              line-height: 18px;
            }
            .col {
              display: flex;
              flex-direction: column;
            }
            .logo svg {
              width: 80px;
              height: 80px;
            }
            .app-title {
              font-size: 20px;
            }
            .content-row {
              flex-grow: 1;
            }
            .start-recent-col {
              width: 40%;
              flex-basis: 40%;
              flex-grow: 1;
            }
            .news-list-hidden .start-recent-col {
              width: 60%;
              flex-basis: 60%;
            }
            .start-col {
              margin-bottom: 40px;
              row-gap: 2px;
            }
            .recent-col {
              row-gap: 5px;
              max-height: 200px;
              overflow-y: hidden;
            }
            .recent-col.recents-expanded {
              overflow-y: auto;
            }
            .recent-col .row-title {
              position: sticky;
              top: 0;
              background: ${LightThemeBGColor};
            }
            .app-ui-dark .recent-col .row-title {
              background: ${DarkThemeBGColor};
            }
            .recent-col.recents-collapsed > div:nth-child(n+${maxRecentItems + 2
      }).recent-session-row {
              display: none;
            }
            .news-col {
              width: 40%;
              flex-basis: 40%;
              flex-grow: 1;
              row-gap: 5px;
              padding-left: 10px;
            }
            .news-list-hidden .news-col {
              width: 20%;
              flex-basis: 20%;
            }
            .news-list-col {
              display: flex;
              flex-direction: column;
              row-gap: 5px;
            }
            .news-col-footer {
              margin-top: 5px;
            }
            .row-title {
              font-weight: bold;
              margin-bottom: 5px;
              font-size: 16px;
            }
            a, .recent-session-link {
              color: #555555;
              text-decoration: none;
              cursor: pointer;
            }
            a:hover, .recent-session-link:hover {
              color: #777777;
            }
            .app-ui-dark a, .app-ui-dark .recent-session-link {
              color: #cccccc;
            }
            .app-ui-dark a:hover, .app-ui-dark .recent-session-link:hover {
              color: #eeeeee;
            }
            .more-row a {
              color: #202020;
            }
            a.disabled, .recent-session-link.disabled {
              pointer-events: none;
              opacity: 0.5;
            }
            .app-ui-dark .more-row a {
              color: #f0f0f0;
            }
            .large-logo svg {
              width: 300px;
            }
            .recent-session-link {
              white-space: nowrap;
            }
            .recent-session-detail {
              padding-left: 10px;
            }
            .recent-session-detail, .news-list-col .row a {
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
            }
            .recent-session-row {
              align-items: center;
            }
            .recent-session-delete {
              height: 18px;
              margin-left: 10px;
              visibility: hidden;
            }
            .recent-session-row:hover .recent-session-delete {
              visibility: visible;
              transition-delay: 1s;
              cursor: pointer;
            }
            .recent-session-row .delete-button {
              width: 16px;
              height: 16px;
              padding-top: 1px;
              fill: #555555;
            }
            .app-ui-dark .recent-session-row .delete-button {
              fill: #bcbcbc;
            }
            .no-recent-message {
              color: #777777;
            }
            .app-ui-dark .no-recent-message {
              color: #999999;
            }
            .action-row a { 
              display: flex;
              flex-direction: row;
              align-items: center;
            }
            .action-row span {
              margin-right: 8px;
              padding-top: 4px;
              width: 26px;
              height: 26px;
            }
            .action-row svg {
              width: 22px;
              height: 22px;
            }
            .app-ui-dark .action-row {
              fill: #efefef;
            }
            .new-notebook-action-row svg {
              width: 25px;
              height: 25px;
              margin-left: -1px;
            }
            .new-session-action-row svg {
              width: 26px;
              height: 26px;
              margin-left: -2px;
            }
            #notification-panel {
              position: sticky;
              bottom: 0;
              display: none;
              height: 250px;
              padding-top: 0px;
              padding-bottom: 100px;
              padding-left: 40px;
              padding-right: 40px;
              background: inherit;
              border-top: 1px solid #585858;
              align-items: center;
              font-size: 16px;
            }
            #notification-panel-message {
              align-items: center;
            }
            #notification-panel-message a {
              margin: 0 4px;
            }
            #notification-panel .close-button {
              width: 20px;
              height: 20px;
              fill: #555555;
              cursor: pointer;
            }
            .app-ui-dark #notification-panel .close-button {
              fill: #bcbcbc;
            }
            .recent-expander-col {
              display: none;
            }
            .install-button {
              font-weight: bold;
              -webkit-text-size-adjust: 100%;
              -webkit-tap-highlight-color: transparent;
              tab-size: 4;
              --tw-bg-opacity: 1;
              -webkit-font-smoothing: antialiased;
              border: 0 solid #e5e7eb;
              box-sizing: border-box;
              --tw-border-spacing-x: 0;
              --tw-border-spacing-y: 0;
              --tw-translate-x: 0;
              --tw-translate-y: 0;
              --tw-rotate: 0;
              --tw-skew-x: 0;
              --tw-skew-y: 0;
              --tw-scale-x: 1;
              --tw-scale-y: 1;
              --tw-pan-x: ;
              --tw-pan-y: ;
              --tw-pinch-zoom: ;
              --tw-scroll-snap-strictness: proximity;
              --tw-gradient-from-position: ;
              --tw-gradient-via-position: ;
              --tw-gradient-to-position: ;
              --tw-ordinal: ;
              --tw-slashed-zero: ;
              --tw-numeric-figure: ;
              --tw-numeric-spacing: ;
              --tw-numeric-fraction: ;
              --tw-ring-inset: ;
              --tw-ring-offset-width: 0px;
              --tw-ring-offset-color: #fff;
              --tw-ring-color: rgba(63,131,248,.5);
              --tw-ring-offset-shadow: 0 0 #0000;
              --tw-ring-shadow: 0 0 #0000;
              --tw-shadow: 0 0 #0000;
              --tw-shadow-colored: 0 0 #0000;
              --tw-blur: ;
              --tw-brightness: ;
              --tw-contrast: ;
              --tw-grayscale: ;
              --tw-hue-rotate: ;
              --tw-invert: ;
              --tw-saturate: ;
              --tw-sepia: ;
              --tw-drop-shadow: ;
              --tw-backdrop-blur: ;
              --tw-backdrop-brightness: ;
              --tw-backdrop-contrast: ;
              --tw-backdrop-grayscale: ;
              --tw-backdrop-hue-rotate: ;
              --tw-backdrop-invert: ;
              --tw-backdrop-opacity: ;
              --tw-backdrop-saturate: ;
              --tw-backdrop-sepia: ;
              font-feature-settings: inherit;
              font-family: inherit;
              font-variation-settings: inherit;
              margin: 0;
              text-transform: none;
              cursor: pointer;
              -webkit-appearance: button;
              background-color: transparent;
              margin-bottom: .5rem;
              margin-inline-end: .5rem;
              border-radius: .5rem;
              background-image: linear-gradient(to right,var(--tw-gradient-stops));
              --tw-gradient-from: #06b6d4 var(--tw-gradient-from-position);
              --tw-gradient-stops: var(--tw-gradient-from),var(--tw-gradient-to);
              --tw-gradient-to: #3f83f8 var(--tw-gradient-to-position);
              padding-left: 1.25rem;
              padding-right: 1.25rem;
              padding-bottom: .625rem;
              padding-top: .625rem;
              text-align: center;
              font-size: .875rem;
              line-height: 1.25rem;
              --tw-text-opacity: 1;
              color: rgb(255 255 255/var(--tw-text-opacity));
            }
            .install-button:hover {
              -webkit-text-size-adjust: 100%;
              -webkit-tap-highlight-color: transparent;
              tab-size: 4;
              --tw-bg-opacity: 1;
              -webkit-font-smoothing: antialiased;
              border: 0 solid #e5e7eb;
              box-sizing: border-box;
              --tw-border-spacing-x: 0;
              --tw-border-spacing-y: 0;
              --tw-translate-x: 0;
              --tw-translate-y: 0;
              --tw-rotate: 0;
              --tw-skew-x: 0;
              --tw-skew-y: 0;
              --tw-scale-x: 1;
              --tw-scale-y: 1;
              --tw-pan-x: ;
              --tw-pan-y: ;
              --tw-pinch-zoom: ;
              --tw-scroll-snap-strictness: proximity;
              --tw-gradient-from-position: ;
              --tw-gradient-via-position: ;
              --tw-gradient-to-position: ;
              --tw-ordinal: ;
              --tw-slashed-zero: ;
              --tw-numeric-figure: ;
              --tw-numeric-spacing: ;
              --tw-numeric-fraction: ;
              --tw-ring-inset: ;
              --tw-ring-offset-width: 0px;
              --tw-ring-offset-color: #fff;
              --tw-ring-color: rgba(63,131,248,.5);
              --tw-ring-offset-shadow: 0 0 #0000;
              --tw-ring-shadow: 0 0 #0000;
              --tw-shadow: 0 0 #0000;
              --tw-shadow-colored: 0 0 #0000;
              --tw-blur: ;
              --tw-brightness: ;
              --tw-contrast: ;
              --tw-grayscale: ;
              --tw-hue-rotate: ;
              --tw-invert: ;
              --tw-saturate: ;
              --tw-sepia: ;
              --tw-drop-shadow: ;
              --tw-backdrop-blur: ;
              --tw-backdrop-brightness: ;
              --tw-backdrop-contrast: ;
              --tw-backdrop-grayscale: ;
              --tw-backdrop-hue-rotate: ;
              --tw-backdrop-invert: ;
              --tw-backdrop-opacity: ;
              --tw-backdrop-saturate: ;
              --tw-backdrop-sepia: ;
              font-feature-settings: inherit;
              font-family: inherit;
              font-variation-settings: inherit;
              margin: 0;
              text-transform: none;
              cursor: pointer;
              -webkit-appearance: button;
              background-color: transparent;
              margin-bottom: .5rem;
              margin-inline-end: .5rem;
              border-radius: .5rem;
              --tw-gradient-from: #06b6d4 var(--tw-gradient-from-position);
              --tw-gradient-stops: var(--tw-gradient-from),var(--tw-gradient-to);
              --tw-gradient-to: #3f83f8 var(--tw-gradient-to-position);
              padding-left: 1.25rem;
              padding-right: 1.25rem;
              padding-bottom: .625rem;
              padding-top: .625rem;
              text-align: center;
              font-size: .875rem;
              line-height: 1.25rem;
              
              --tw-text-opacity: 1;
              color: rgb(255 255 255/var(--tw-text-opacity));
              background-image: linear-gradient(to bottom left,var(--tw-gradient-stops));
            }
          </style>
          <script>
            document.addEventListener("DOMContentLoaded", () => {
              const platform = "${process.platform}";
              document.body.dataset.appPlatform = platform;
              document.body.classList.add('app-ui-' + platform);
            });
          </script>
        </head>
      
        <body class="${this._isDarkTheme ? 'app-ui-dark' : ''} ${showNewsFeed ? '' : 'news-list-hidden'
      }" title="">
          <svg class="symbol" style="display: none;">
          <defs>
            <symbol id="circle-xmark" viewBox="0 0 512 512">
              <!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M256 512c141.4 0 256-114.6 256-256S397.4 0 256 0S0 114.6 0 256S114.6 512 256 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"/>
            </symbol>
            <symbol id="triangle-exclamation" viewBox="0 0 512 512">
              <!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480H40c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24V296c0 13.3 10.7 24 24 24s24-10.7 24-24V184c0-13.3-10.7-24-24-24zm32 224c0-17.7-14.3-32-32-32s-32 14.3-32 32s14.3 32 32 32s32-14.3 32-32z"/></svg>
            </symbol>
          </defs>
          </svg>
          <div class="newcontainer">
    <!-- Header with left-aligned title and subtitle -->
    <header>
      <h1>Welcome!</h1>
      <p>Let's crunch some data</p>
    </header>
    
    <!-- Button row container -->
    <div class="button-container" >
      <!-- Button: Create a new analysis with a refreshed chart icon -->
      <button class="btn disabled" onclick="handleNewSessionClick('blank');" id="new-session-link">
        <div class="btn-icon">
          <!-- Chart icon (line chart) -->
          <svg viewBox="0 0 24 24">
            <polyline fill="none" stroke="currentColor" stroke-width="2" points="3,17 9,11 13,15 21,7"/>
            <circle cx="3" cy="17" r="1" fill="currentColor"/>
            <circle cx="9" cy="11" r="1" fill="currentColor"/>
            <circle cx="13" cy="15" r="1" fill="currentColor"/>
            <circle cx="21" cy="7" r="1" fill="currentColor"/>
          </svg>
        </div>
        <div class="btn-text">
          <div class="btn-title">Create a New Analysis</div>
          <div class="btn-desc">Start a new project using your data</div>
        </div>
      </button>
      
      <!-- Button: Open previous analysis file -->
      <button class="btn disabled" onclick="handleNewSessionClick('open-file');" id="open-file-link">
        <div class="btn-icon">
          <!-- Folder icon -->
          <svg viewBox="0 0 20 20">
            <path d="M2 4a2 2 0 0 1 2-2h4l2 2h6a2 2 0 0 1 2 2v2H2V4zm0 4h16v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8z"/>
          </svg>
        </div>
        <div class="btn-text">
          <div class="btn-title">Open Previous Analysis File</div>
          <div class="btn-desc">Access your saved projects quickly</div>
        </div>
      </button>
    </div>
    
    <!-- Information box -->
    <div class="info-box">
      Your analyses are saved as <code>.ipynb</code> files on your local hard drive.
    </div>
    
    <!-- Documentation paragraph -->
    <p class="documentation">
      If you would like to learn more, please check out our <a href="https://mljar.com/docs/" target="_blank">documentation</a>.
    </p>
  </div>


          
          <div id="notification-panel">
            <div id="notification-panel-message">
            </div>
            <div id="notification-panel-close" >         
            </div>
          </div>

          <script>
          const newsListContainer = document.getElementById('news-list');
          const notificationPanel = document.getElementById('notification-panel');
          const notificationPanelMessage = document.getElementById('notification-panel-message');
          const notificationPanelCloseButton = document.getElementById('notification-panel-close');
          const recentSessionsCol = document.getElementById('recent-sessions-col');
          const recentSessionsTitle = document.getElementById('recent-sessions-title');

          function updateRecentSessionList(recentSessions, resetCollapseState) {
            const maxRecentItems = ${maxRecentItems};
            // clear list
            while (recentSessionsTitle.nextSibling) {
              recentSessionsTitle.nextSibling.remove();
            }

            let recentSessionCount = 0;

            const fragment = new DocumentFragment();

            for (const recentSession of recentSessions) {
              const {isRemote, linkLabel, linkTooltip, linkDetail} = recentSession;
              const recentSessionRow = document.createElement('div');
              recentSessionRow.classList.add("row");
              recentSessionRow.classList.add("recent-session-row");
              recentSessionRow.dataset.sessionIndex = recentSessionCount;
              recentSessionRow.innerHTML = \`
                  <div class="recent-session-link\$\{!isRemote ? ' recent-item-local' : ''\}" onclick='handleRecentSessionClick(event);' title="\$\{linkTooltip\}">\$\{linkLabel\}</div>
                  \$\{linkDetail ? \`<div class="recent-session-detail" title="\$\{linkDetail\}">\$\{linkDetail\}</div>\`: ''}
                  <div class="recent-session-delete" title="Remove" onclick="handleRecentSesssionDeleteClick(event)">
                    <svg class="delete-button" version="2.0">
                      <use href="#circle-xmark" />
                    </svg>
                  </div>\`;

              fragment.append(recentSessionRow);

              recentSessionCount++;
            }

            if (recentSessionCount === 0) {
              const noHistoryMessage = document.createElement('div');
              noHistoryMessage.className = 'no-recent-message';
              noHistoryMessage.innerText = 'No history yet';
              fragment.append(noHistoryMessage);
            }

            recentSessionsCol.append(fragment);

            // also reset if item remove causes count to get back to limit
            resetCollapseState = resetCollapseState || recentSessionCount <= maxRecentItems;

            if (resetCollapseState) {
              const recentExpanderCol = document.getElementById('recent-expander-col');
              if (recentSessionCount > maxRecentItems) {
                recentSessionsCol.classList.add('recents-collapsed');
                recentExpanderCol.style.display = 'block';
              } else {
                recentSessionsCol.classList.remove('recents-collapsed');
                recentSessionsCol.classList.remove('recents-expanded');
                recentExpanderCol.style.display = 'none';
              }
            }
          }

          window.electronAPI.onSetRecentSessionList((recentSessions, resetCollapseState) => {
            updateRecentSessionList(recentSessions, resetCollapseState);
          });
          
          window.electronAPI.onSetNewsList((newsList) => {
            // clear list
            while (newsListContainer.firstChild) {
              newsListContainer.firstChild.remove();
            }

            const fragment = new DocumentFragment();
            for (const news of newsList) {
              const newsRow = document.createElement('div');
              newsRow.innerHTML = \`
                <div class="row">
                  <a href="javascript:void(0)" onclick=\'handleNewsClick("\$\{news.link\}");\' title="\$\{news.title\}">\$\{news.title\}</a>
                </div>\`;
              fragment.append(newsRow);
            }

            newsListContainer.append(fragment);
          });

          document.addEventListener('dragover', (event) => {
            event.preventDefault();
            event.stopPropagation();
          });
          
          document.addEventListener('drop', (event) => {
            event.preventDefault();
            event.stopPropagation();
        
            const files = [];
            for (const file of event.dataTransfer.files) {
              files.push(file.path);
            }

            window.electronAPI.openDroppedFiles(files);
          });

          function handleNewSessionClick(type) {
            window.electronAPI.newSession(type);
          }

          function handleRecentSessionClick(event) {
            const row = event.currentTarget.closest('.recent-session-row');
            if (!row) {
              return;
            }
            const sessionIndex = parseInt(row.dataset.sessionIndex);
            window.electronAPI.openRecentSession(sessionIndex);
          }

          function handleRecentSesssionDeleteClick(event) {
            const row = event.currentTarget.closest('.recent-session-row');
            if (!row) {
              return;
            }
            const sessionIndex = parseInt(row.dataset.sessionIndex);
            window.electronAPI.deleteRecentSession(sessionIndex);
          }

          function handleNewsClick(newsLink) {
            window.electronAPI.openNewsLink(newsLink);
          }

          function handleExpandCollapseRecents() {
            const expandCollapseButton = document.getElementById("expand-collapse-recents");
            const classList = recentSessionsCol.classList;
            const isCollapsed = classList.contains("recents-collapsed");
            if (isCollapsed) {
              classList.remove("recents-collapsed");
              classList.add("recents-expanded");
              expandCollapseButton.innerText = "Less...";
            } else {
              classList.remove("recents-expanded");
              classList.add("recents-collapsed");
              expandCollapseButton.innerText = "More...";
            }
          }

          function sendMessageToMain(message, ...args) {
            window.electronAPI.sendMessageToMain(message, ...args);
          }

          function showNotificationPanel(message, closable) {
            notificationPanelMessage.innerHTML = message;
            notificationPanelCloseButton.style.display = closable ? 'block' : 'none'; 
            notificationPanel.style.display = message === "" ? "none" : "flex";
          }

          function closeNotificationPanel() {
            notificationPanel.style.display = "none";
          }

          function enableLocalServerActions(enable) {
            const serverActionIds = ["new-notebook-link", "new-session-link", "open-file-or-folder-link", "open-file-link", "open-folder-link"];
            serverActionIds.forEach(id => {
              const link = document.getElementById(id);
              if (link) {
                if (enable) {
                  link.classList.remove("disabled");
                } else {
                  link.classList.add("disabled");
                }
              }
            });

            document.querySelectorAll('div.recent-item-local').forEach(link => {
              if (enable) {
                link.classList.remove("disabled");
              } else {
                link.classList.add("disabled");
              }
            });
          }

          window.electronAPI.onSetNotificationMessage((message, closable) => {
            showNotificationPanel(message, closable);
          });

          window.electronAPI.onEnableLocalServerActions((enable) => {
            enableLocalServerActions(enable);
          });

          window.electronAPI.onInstallBundledPythonEnvStatus((status, detail) => {
            let message;
            if(status === 'RUNNING') {
              message = \`
              <p style="font-weight: bold; font-size: 20px">Installing Python environment, please wait ...</p>
              <progress style="width: 100%;" value=\$\{detail\} max="100"></progress>
              <p style="font-weight: bold; font-size: 15px">Progress: \$\{detail\}%</p>
              \`;
            } else if (status === 'CANCELLED') {
              message = \`
              <p style="font-weight: bold; font-size: 20px">Installation cancelled!</p>
              \`;
            } else if (status === 'FAILURE') {
              message = \`
              <p style="font-weight: bold; font-size: 20px">Failed to install!</p>
              \`;
            } else if (status === 'SUCCESS') {
              message = \`
              <p style="font-weight: bold; font-size: 20px">👍 Installation succeeded!</p>
              \`;
            } else if (status === 'STARTED') {
              message = \`
              <p style="font-weight: bold; font-size: 20px">Installation started.</p>
              \`;
            }
            showNotificationPanel(message, status === 'CANCELLED' || status === 'FAILURE' || status === 'SUCCESS');
            if (status === 'SUCCESS') {
              setTimeout(() => {
                showNotificationPanel('', true);
              }, 3000);
            }
          });
          </script>
        </body>
      </html>
      `;
  }

  get view(): BrowserView {
    return this._view;
  }

  load() {
    this._view.webContents.loadURL(
      `data:text/html;charset=utf-8,${encodeURIComponent(this._pageSource)}`
    );

    this._viewReady = new Promise<void>(resolve => {
      this._view.webContents.on('dom-ready', () => {
        resolve();
      });
    });

    this.updateRecentSessionList(true);

    if (userSettings.getValue(SettingType.showNewsFeed)) {
      this._updateNewsList();
    }

    this._registry.environmentListUpdated.connect(
      this._onEnvironmentListUpdated,
      this
    );

    this._view.webContents.on('destroyed', () => {
      this._registry.environmentListUpdated.disconnect(
        this._onEnvironmentListUpdated,
        this
      );
    });
    this._onEnvironmentListUpdated();
  }

  enableLocalServerActions(enable: boolean) {
    this._viewReady.then(() => {
      this._view.webContents.send(
        EventTypeRenderer.EnableLocalServerActions,
        enable
      );
    });
  }

  showNotification(message: string, closable: boolean) {
    this._viewReady.then(() => {
      this._view.webContents.send(
        EventTypeRenderer.SetNotificationMessage,
        message,
        closable
      );
    });
  }

  private async _onEnvironmentListUpdated() {

    this._registry
      .getDefaultEnvironment()
      .then(() => {
        this.enableLocalServerActions(true);
        this.showNotification('', false);
      })
      .catch(() => {
        this.enableLocalServerActions(false);
        this.showNotification(
          `
          
        <h2>Python environment not set</h2>
        <p>MLJAR Studio comes with a bundled Python environment. You need to set it only once, at first use. Please click the below install button and wait a while.</p>
        <button type="button" class="install-button" onclick="sendMessageToMain('${EventTypeMain.InstallBundledPythonEnv}')">Install Python</button> 
        
        `,
          true
        );
      });
  }

  private _updateNewsList() {
    WelcomeView._newsListFetched = true;
    /*
    if (WelcomeView._newsListFetched) {
      return;
    }
    
    const newsFeedUrl = 'https://blog.jupyter.org/feed';
    const maxNewsToShow = 10;

    fetch(newsFeedUrl)
      .then(async response => {
        try {
          const data = await response.text();
          const parser = new XMLParser();
          const feed = parser.parse(data);
          const newsList: INewsItem[] = [];
          for (const item of feed.rss.channel.item) {
            newsList.push({
              title: item.title,
              link: encodeURIComponent(item.link)
            });
            if (newsList.length === maxNewsToShow) {
              break;
            }
          }

          this._view.webContents.send(EventTypeRenderer.SetNewsList, newsList);

          WelcomeView._newsList = newsList;
          appData.newsList = [...newsList];
          if (newsList.length > 0) {
            WelcomeView._newsListFetched = true;
          }
        } catch (error) {
          console.error('Failed to parse news list:', error);
        }
      })
      .catch(error => {
        console.error('Failed to fetch news list:', error);
      });
      */
  }

  updateRecentSessionList(resetCollapseState: boolean) {
    const recentSessionList: IRecentSessionListItem[] = [];
    const home = getUserHomeDir();

    for (const recentSession of appData.recentSessions) {
      let sessionItem = '';
      let sessionDetail = '';
      let tooltip = '';
      let parent = '';
      if (recentSession.remoteURL) {
        const url = new URL(recentSession.remoteURL);
        sessionItem = url.origin;
        tooltip = `${recentSession.remoteURL}\nSession data ${recentSession.persistSessionData ? '' : 'not '
          }persisted`;
        sessionDetail = '';
      } else {
        // local
        if (recentSession.filesToOpen.length > 0) {
          sessionItem = path.basename(recentSession.filesToOpen[0]);
          tooltip = recentSession.filesToOpen.join(', ');
          parent = recentSession.workingDirectory;
        } else {
          sessionItem = path.basename(recentSession.workingDirectory);
          parent = path.dirname(recentSession.workingDirectory);
          tooltip = recentSession.workingDirectory;
        }

        if (parent.startsWith(home)) {
          const relative = path.relative(home, parent);
          sessionDetail = `~${path.sep}${relative}`;
        } else {
          sessionDetail = parent;
        }
      }

      recentSessionList.push({
        isRemote: !!recentSession.remoteURL,
        linkLabel: sessionItem,
        linkTooltip: tooltip,
        linkDetail: sessionDetail
      });
    }

    this._viewReady.then(() => {
      this._view.webContents.send(
        EventTypeRenderer.SetRecentSessionList,
        recentSessionList,
        resetCollapseState
      );
    });
  }

  private _isDarkTheme: boolean;
  private _view: BrowserView;
  private _viewReady: Promise<void>;
  private _registry: IRegistry;
  private _pageSource: string;
  static _newsList: INewsItem[] = [];
  static _newsListFetched = false;
}

export namespace WelcomeView {
  export interface IOptions {
    isDarkTheme: boolean;
    registry: IRegistry;
  }
}
