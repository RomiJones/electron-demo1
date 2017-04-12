const electron = require("electron");
const app = electron.app;
const ipcMain = electron.ipcMain;
const BrowserWindow = electron.BrowserWindow;
const nativeImage = electron.nativeImage;

var hello = require("hello");

var mainWindow = null;
var onlineStatusWindow = null;

//初始化并准备创建主窗口
app.on("ready", function ()
{	
    //创建一个宽800px 高700px的窗口
    mainWindow = new BrowserWindow({width:800,height:500,frame:false});
	
	//console.log("dirname:%s", __dirname);
	//mainWindow.loadURL("https://www.baidu.com");
    mainWindow.loadURL("file://" + __dirname + "/index.html");//载入应用的inde.html	
	
    //mainWindow.openDevTools();	//打开浏览器调试工具
	
	//
	var iconImage = nativeImage.createFromPath(__dirname + "/logo.png");
	console.log(iconImage);
	mainWindow.setIcon(iconImage);
	
    //窗口关闭时触发
    mainWindow.on('closed', function(){
        //想要取消窗口对象的引用， 如果你的应用支持多窗口，
		//你需要将所有的窗口对象存储到一个数组中，然后在这里删除想对应的元素
		console.log("mainWindow closed...");
        mainWindow = null            
    });

    onlineStatusWindow = new BrowserWindow({width:300,height:300,frame:true,show:true});
    onlineStatusWindow.loadURL("file://" + __dirname + "/online-status.html");
	onlineStatusWindow.setIcon(iconImage);

    onlineStatusWindow.on('closed', function(){
    	console.log("onlineStatusWindow closed...");
        onlineStatusWindow = null            
    });

});

// Quit when all windows are closed.
app.on('window-all-closed', function() {
	app.quit();
});

//ipcMain对同步消息的处理
ipcMain.on('sync-message', function (event, arg){
	console.log(arg);	// prints "ping"
	event.returnValue = "sync-message-reply";
});

//ipcMain对异步消息的处理
ipcMain.on("invoke-cpp-module", function(event, originStr) {
	var retStr = hello.f1();
	var curProcessId = hello.getCurrentProcessId();
	console.log("current process id :" + curProcessId); //在main process中会输出到黑框console，在renderer process中会输出到devtool的console
	event.sender.send("invoke-cpp-module-reply", originStr +  " " + retStr + " [Main Process Id : " + curProcessId + "]");
});

ipcMain.on("online-status-changed", function(event, status){
	console.log(status)
	event.sender.send("online-status-changed-reply","[async msg received by ipcMain]" + " " + status);
});


