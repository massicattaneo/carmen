import NfcApp from './nfc-reader/index';
import ServerApp from './server/index';
import electronGoogleOauth from 'electron-google-oauth';
import fetch from 'node-fetch';
const {stringify} = require('querystring');

var nfcApp = new NfcApp();
var serverApp = new ServerApp();
const auth = electronGoogleOauth();

nfcApp.on('card-read', function (reader, card, data) {
	serverApp.send(data)
});

serverApp.on('web-socket-message', async (data) => {
	try {
		await nfcApp.write(data.cardId);
		console.log('write done');
	} catch(e) {
		console.log('error', e)
	}
});

const electron = require('electron')
// Module to control application life.
const {app, Menu} = electron;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
var params = {};
process.argv.forEach(function (val) {
	params[val.split('=')[0]] = val.split('=')[1];
});

const preventQuit = e => e.preventDefault();
app.on('will-quit', preventQuit);

async function createWindow () {

	var clientId = '927198449105-uf5fr7b0i475a3hlqk574opkrnph9enk.apps.googleusercontent.com';
	var clientSecret = params.clientSecret;
	let token = await auth.getAccessToken(
		['https://www.googleapis.com/auth/calendar'],
		clientId,
		clientSecret
	);

	app.removeListener('will-quit', preventQuit);
	// Create the browser window.
	console.log(JSON.stringify(token));
	mainWindow = new BrowserWindow({width: 1100, height: 890, icon: __dirname + '/client/images/icon.png'});
	mainWindow.getConfiguration = function () {
		return {password: params.password, token: token.access_token};
	};

	// var agendaWindow = new BrowserWindow({width: 800, height: 600});
	var refreshToken = token.refresh_token;
	setTimeout(function renewToken() {
		var body = stringify({
			refresh_token: refreshToken,
			client_id: clientId,
			client_secret: clientSecret,
			grant_type: 'refresh_token'
		});
		fetch('https://www.googleapis.com/oauth2/v4/token', {
			method: 'POST',
			headers: {
				'accept': 'application/json',
				'content-type': 'application/x-www-form-urlencoded'
			},
			body
		}).catch(function (a) {
		}).then(function (res) {
			return res.json()
		}).then(function (json) {
			token = json;
			mainWindow.webContents.send('renew-token', token.access_token);
			setTimeout(renewToken, (token.expires_in - 60) * 1000);
		});
	}, (token.expires_in - 60) * 1000);

	// and load the index.html of the app.
	mainWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'client/index.html'),
		protocol: 'file:',
		slashes: true
	}));

	// const menu = Menu.buildFromTemplate(template)
	// Menu.setApplicationMenu(menu)

	// agendaWindow.loadURL('https://calendar.google.com/calendar/embed?title=HOY&amp;showNav=0&amp;showDate=0&amp;showPrint=0&amp;showTabs=0&amp;showCalendars=0&amp;showTz=0&amp;mode=AGENDA&amp;height=600&amp;wkst=2&amp;hl=es&amp;bgcolor=%23FFFFFF&amp;ctz=Europe%2FMadrid');

	//8eupe3uc8g0psn6hr9noi879mo%40group.calendar.google.com

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
