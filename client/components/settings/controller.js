/*/
 ///////////////////////////////////////////////////////////////////////////
 Module: controller
 Created Date: 14 July 2016
 Author: mcattaneo

 //////////////////////////////////////////////////////////////////////////////
 //       Copyright (c) 2016.
 //////////////////////////////////////////////////////////////////////////////
 */

function controller(imports) {

	var template = imports('components/settings/template.html');
	var style = imports('components/settings/style.scss');

	return function (config) {
		var timeout, interval, countDownStart;

		var c = cjs.Component({
			template: template,
			style: style,
			config: config
		});

		c.show = function () {
			c.get().addStyle({ display: 'block' });
		};

		c.changeBg = function (e) {
			setBg(e.target.getAttribute('data-index'));
		};

		c.changeAudio = function (e) {
			setAudio(e.target.checked)
		};

		c.setUserSalitre = function (e) {
			setUser('salitre')
		};

		c.setUserCompania = function (e) {
			setUser('compania')
		};

		function logout() {
			c.get('login').removeStyle('logged-in');
			c.get('login').addStyle('logged-out');
			var css = '.admin { display: none !important; }',
				style = document.createElement('style');
			style.type = 'text/css';
			style.appendChild(document.createTextNode(css));
			document.head.appendChild(style);
			clearTimeout(timeout);
			clearInterval(interval);
			c.get().fire('logout');
			config.isLogged = false;
		}
		function login() {
			c.get('login').removeStyle('logged-out');
			c.get('login').addStyle('logged-in');
			var css = '.admin { display: inline-block !important; }',
				style = document.createElement('style');
			style.type = 'text/css';
			style.appendChild(document.createTextNode(css));
			document.head.appendChild(style);

			var minutes = c.get('minutes').getValue();
			countDownStart = new Date().getTime();
			timeout = setTimeout(logout, 1000 * 60 * minutes);
			interval = setInterval(function () {
				var seconds = (new Date().getTime() - countDownStart) / 1000;
				var remaining = (minutes*60) - seconds;
				var remMinutes = parseInt(remaining/60, 10);
				var remSeconds = remaining - (remMinutes*60);
				c.get('time').setValue(remMinutes + ':' + remSeconds.toString().padLeft(2,'0'))
			}, 1000)
			config.isLogged = true;
		}

		c.initSettings = function () {
			setBg(localStorage.getItem('bg-image') || 1);
			setAudio(localStorage.getItem('audio-on') === 'true');
			setUser(localStorage.getItem('user'));
			document.body.className = '';
			config.user = localStorage.getItem('user');
			logout();
		};

		c.log = function (e) {
			e.preventDefault();
			e.stopPropagation();
			if (e.target.className === 'logged-out' && c.get('password').getValue() === 'paperella') {
				login();
			} else {
				logout();
			}
			c.get('password').get().value = '';
		};

		function setBg(bgIndex) {
			localStorage.setItem('bg-image', bgIndex);
			document.body.style.backgroundImage = 'url(images/bg/' + bgIndex + '.jpg)';
		}

		function setAudio(audioOn) {
			localStorage.setItem('audio-on', audioOn.toString());
			c.get('switch').get('checkbox').get().checked = audioOn;
			if (audioOn) {
				config.audioPlayer.unmute()
			} else {
				config.audioPlayer.mute()
			}
		}

		function setUser(user) {
			localStorage.setItem('user', user);
			c.get('user-salitre').get('checkbox').get().checked = false;
			c.get('user-compania').get('checkbox').get().checked = false;
			if (user !== 'null') c.get('user-' + user).get('checkbox').get().checked = true;
		}

		return c;

	}

};
