const { app, BrowserWindow } = require('electron');
const path = require('path');
const express = require('express');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
    },
  });

  // Create an Express server
  const server = express();
  const buildPath = path.join(__dirname, 'build');

  // Serve static files from the build directory
  server.use(express.static(buildPath));

  // Serve the index.html file on all routes
  server.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });

  // Start the server on port 3000
  server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
    // Load the app from the local server
    win.loadURL('http://localhost:3000').catch((err) => {
      console.error('Failed to load URL:', err);
    });
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
