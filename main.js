// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600})
  mainWindow.setMenu(null);

  // debug
  //mainWindow.webContents.openDevTools()

  const devIncr = process.argv.indexOf('--dev') != -1 ? 2 : 0

  //const rootUrl = `file://${__dirname}/dwv-simplistic-0.2.0/index.html`
  const rootUrl = `file://${__dirname}/dwv-jqmobile-0.2.0/index.html`

  let inputUrl = ""
  if (process.argv.length > devIncr) {
    inputUrl += "?input="
    let inputQuery = ""
    const startIndex = 1 + devIncr;
    const isOneFile = startIndex === process.argv.length - 1
    if (!isOneFile) {
      inputQuery += "?file="
    }
    for (let i = startIndex; i < process.argv.length; ++i) {
      if (i !== startIndex) {
        inputQuery += "&file="
      }
      inputQuery += process.argv[i]
    }
    inputUrl += encodeURIComponent(inputQuery)
    if (!isOneFile) {
      inputUrl += "&dwvReplaceMode=void"
    }
  }
  console.log('inputUrl', inputUrl)

  //const dwv = require('dwv')

  // and load the index.html of the app.
  //mainWindow.loadFile('dwv-simplistic-0.2.0/index.html')
  mainWindow.loadURL(rootUrl+inputUrl)


  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}


// Handle multiple instances...
//
/*const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  app.quit()
}
app.on('second-instance', (commandLine, workingDirectory) => {
  // Someone tried to run a second instance, we should focus our window.
  if (mainWindow) {
    if (mainWindow.isMinimized()) myWindow.restore()
    mainWindow.focus()
  }
})*/

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
