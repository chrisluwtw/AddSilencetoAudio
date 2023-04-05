const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
    autoHideMenuBar: true, // 隐藏菜单栏
  });

 // win.webContents.openDevTools();

  win.loadFile("index.html");
  mainWindow.setMenu(null); // 完全移除菜单栏

  // Log messages from renderer process
  ipcMain.on("log", (event, message) => {
    console.log(message);
    mainWindow.webContents.send("log", message);
  });
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Listen for console.log messages from the renderer process
ipcMain.on("console-log", (event, message) => {
  //console.log("From renderer:", message);
    // Convert the UTF-8 encoded message back to the original string
    const originalMessage = Buffer.from(message, 'utf8').toString();

    // Process the message
    console.log('Received message:', originalMessage);

});

// ipcMain.on('send-main-window', (event, mainWindow) => {
//   global.mainWindow = mainWindow;
// });

// ipcMain.on('update-progress', (event, progress) => {
//   mainWindow.webContents.send('update-progress', progress);
// });
