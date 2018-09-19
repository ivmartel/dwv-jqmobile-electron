// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
const log = require('electron-log')
const argv = require('yargs')
    .usage('Standalone medical image viewer using dwv. \n\nUsage: dwv-jqmobile-electron [files] [options]')
    .boolean('d')
    .alias('d', 'dev')
    .describe('d', 'Run with dev tools')
    .alias('h', 'help')
    .example('dwv-jqmobile-electron file1.dcm file2.dcm')
    .parse(process.argv.slice(1))

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600})
  mainWindow.setMenu(null)

  // Open the DevTools if dev mode.
  if (argv.dev) {
    mainWindow.webContents.openDevTools()
  }

  // input file list
  let fileList = argv._
  if (fileList.length !== 0 && fileList[0] === ".") {
    fileList = fileList.slice(1)
  }
  if (fileList.length !== 0) {
    log.debug('fileList', fileList)
  }

  // associated viewer
  const rootUrl = `file://${__dirname}/dwv-jqmobile-0.2.0/index.html`

  // parse command line to get file list
  let inputUrl = ""
  if (fileList.length !== 0) {
    inputUrl += "?input="
    let inputQuery = ""
    const isOneFile = fileList.length === 1
    if (!isOneFile) {
      inputQuery += "?file="
    }
    for (let i = 0; i < fileList.length; ++i) {
      if (i !== 0) {
        inputQuery += "&file="
      }
      inputQuery += fileList[i]
    }
    inputUrl += encodeURIComponent(inputQuery)
    if (!isOneFile) {
      inputUrl += "&dwvReplaceMode=void"
    }
  }
  if (inputUrl.length !== 0) {
    log.debug('inputUrl', inputUrl)
  }

  // and load the index.html of the app.
  //mainWindow.loadFile('dwv-simplistic-0.2.0/index.html')
  mainWindow.loadURL(rootUrl+inputUrl)

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// TODO Handle multiple instances...
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
