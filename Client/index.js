const { app, BrowserWindow, screen, globalShortcut, dialog, session } = require('electron');
const path = require('path');
const url = require('url');
const rpc = require('discord-rpc');

const clientId = '1201030465503645696'; // Discord Developer Portal에서 생성한 애플리케이션의 클라이언트 ID를 여기에 입력하세요.

rpc.register(clientId);

const client = new rpc.Client({ transport: 'ipc' });


let mainWindow;
let originalSize;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 950,
    title: 'ShopKKuTu Client',
    maximizable: false,
    icon: __dirname + '/assets/icon.png',
    autoHideMenuBar: true, // 이 부분이 리본바와 상단바를 없애는 옵션입니다.
    webPreferences: {
      devTools: !app.isPackaged,
      nodeIntegration: true
    }
  });

  originalSize = screen.getPrimaryDisplay().workAreaSize;

  const gameUrl = 'https://kkutu.store/game?server=0&clientVer=1';

  const filter = {
    urls: ['https://kkutu.store/']
  };

  session.defaultSession.webRequest.onBeforeRequest(filter, (details, callback) => {
    callback({
      redirectURL: gameUrl
    });
  });

  mainWindow.loadURL(gameUrl);

  mainWindow.webContents.on('did-finish-load', () => {
  });
  
  mainWindow.on('close', function (e) {
    let response = dialog.showMessageBoxSync(this, {
        type: 'question',
        buttons: ['나가기', '남아있기'],
        title: '정말로 나가시려고요?',
        message: '지금 나가면 너무 아쉬워요!'
    });
    
    if(response == 1) e.preventDefault();
});


  mainWindow.on('closed', function () {
    mainWindow = null;
  });

  // Ctrl+F로 전체 화면 토글
  globalShortcut.register('CommandOrControl+F', () => {
    toggleFullScreen();
  });

  globalShortcut.register('CommandOrControl+Shift+I', () => {
    dialog.showErrorBox("정말로 개발자 도구를 여시려고요?", "개발자 도구를 이용하여 부정하게 승리하는 행위는 양심없는 행위일 뿐더러 이용 정지를 받을 수 있습니다.");
  });

}

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
  if (mainWindow === null) createWindow();
});

// 전체 화면 토글 함수
function toggleFullScreen() {
  if (mainWindow.isFullScreen()) {
    mainWindow.setFullScreen(false);
  } else {
    mainWindow.setFullScreen(true);
  }
}
