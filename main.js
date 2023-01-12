const { app, BrowserWindow,Menu,Tray,shell,dialog} = require('electron')
const path = require('path');
var mainWindow;
var appTray;  //系统图盘显示
function createWindow () {
  // 创建浏览器窗口
 mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    show: false,
    // fullscreen: true,  //是否全屏  隐藏任务栏
    icon:path.join(__dirname,'/images/favicon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })


  const template = [
    {
        label: '实用工具',
        submenu: [
            {
                label: '刷新(当前窗口)',
                role: 'reload'
            },
            {
                label: '强制刷新(当前窗口忽略缓存)',
                role: 'forceReload'                                                                                
            },
            {
                label: '开发着工具',
                role: 'toggleDevTools'
            }
        ]
    },
    {
        label: '使用浏览器打开',
          click: () => {
            shell.openExternal('http://118.195.194.140/')
         }
    },
    {
        label: '检查更新',
          click: () => {
            dialog.showMessageBox(mainWindow,{
              title:"检查更新",
              type:'question',
              message:`当前已是最新版本，无需更新软件！`,
              noLink:true,
              buttons:['下载','取消'],
            }).then(res=>{
              if(res.response == 0){ //下载
                getUpdate()
                // shell.openExternal('http://192.168.0.111:9090/qmms/20230111/87eb4437e10342ec8101de59ea345723.png')
              }
              console.log(res,'==========.')
            })
         }
    }
  ];  
  mainWindow.excludedFromShownWindowsMenu = true
  const createContextMenu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(createContextMenu)


  mainWindow.maximize() //窗口最大化， 显示任务栏

  // 加载 index.html
  mainWindow.loadFile('index.html')

  // 优雅地显示窗口
  mainWindow.once('ready-to-show', () => {
    mainWindow.show() 
  })

  //托盘图标功能
  const trayMenuTemplate  = [
    {label: '退出', click: () => {mainWindow.close(),app.quit()}}
  ]
  let trayIcon = path.join(__dirname, '/images/ico.png');
  appTray = new Tray(trayIcon)
  const contextMenu = Menu.buildFromTemplate(trayMenuTemplate);
  appTray.setToolTip('企梦内部管理系统');
  appTray.setContextMenu(contextMenu);
  appTray.on('click',function(){
    mainWindow.show()
    mainWindow.maximize()
  })

  mainWindow.on('close',(e) => {
    // 点击直接关闭窗口和系统托盘
    mainWindow = null;
    app.quit()

    // 点击托盘关闭 窗口关闭最小化
    // if(mainWindow.isMinimized()){
    //   mainWindow = null;
    // }else{
    //   // e.preventDefault();
    //   // mainWindow.minimize();
    // } 
  });
}


// var myNotification = new Notification(option.title, option);
// // 给提示添加点击事件
// myNotification.onclick = function () {
//   console.log('点击了');
// }
// 部分 API 在 ready 事件触发s后才能使用。
app.whenReady().then(() => {
  createWindow();
  
})

app.on('activate', function () {
  if (mainWindow === null){
    createWindow()
  } 
})

// 任务栏上的图标来说，应当保持活跃状态，直到用户使用 Cmd + Q 退出。
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})