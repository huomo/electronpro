const { app, BrowserWindow,Menu,Tray,shell,dialog} = require('electron');
const path = require('path');

const Store = require('electron-store');
const store = new Store();

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
        label: '客户端更新',
          click: () => {
            console.log(process.env.npm_package_version,'0versionversionversion') //检查版本更新
            var btn_text = 0;
            var message_text = 0;

            if(!store.get('version')){  //没有先添加
              store.set('version', process.env.npm_package_version);
              console.log(store.get('version'),'meiyou========');
            }else{
              if(store.get('version') !== process.env.npm_package_version){
                btn_text = 1;
                message_text = 1;
              }else{
                btn_text = 0;
                message_text = 0;
              }
              console.log(store.get('version'),'========version');
            }
            dialog.showMessageBox(mainWindow,{
              title:"检查更新",
              type:'question',
              message:message_text == 0?`当前已是最新版本，无需更新软件！`:`检测客户端有新的安装包。是否下载更新！`,
              noLink:true,
              buttons:btn_text == 0?['确定']:['下载','取消'],
            }).then(res=>{
              if(res.response == 0 && btn_text !== 0){ //下载
                store.set('version', process.env.npm_package_version);
                if(process.platform == 'darwin'){ //mac
                  shell.openExternal('http://192.168.0.214:30079/client/企梦内部管理系统.dmg')
                }else{ //window
                  shell.openExternal('http://192.168.0.214:30079/client/企梦内部管理系统.exe')
                }
              }
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