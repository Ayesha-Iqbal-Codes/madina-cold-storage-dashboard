const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, // allows the use of Node.js APIs in the renderer process
      preload: path.join(__dirname, 'preload.js'), // preload script if you need to expose specific Node.js APIs
    },
    icon: path.join(__dirname, 'public/Logo.webp') // Set the app icon
  });

  // Load the React app.
  win.loadURL(
    isDev
      ? 'http://localhost:3000' // In development, load the React app from the localhost server
      : `file://${path.join(__dirname, 'public/index.html')}` // In production, load the compiled React app
  );

  // Open the DevTools in development mode.
  if (isDev) {
    win.webContents.openDevTools();
  }
}

// This method will be called when Electron has finished initialization.
app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
