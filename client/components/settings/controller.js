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

		c.setUserAdmin = function (e) {
			setUser('admin')
		};

		c.initSettings = function () {
			setBg(localStorage.getItem('bg-image') || 1);
			setAudio(localStorage.getItem('audio-on') === 'true');
			setUser(localStorage.getItem('user'));
			document.body.className = '';
			config.user = localStorage.getItem('user');
			if (config.user === 'compania') {
				var css = '.admin { display: none !important; }',
					style = document.createElement('style');
				style.type = 'text/css';
				style.appendChild(document.createTextNode(css));
				document.head.appendChild(style);
			}
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
			c.get('user-admin').get('checkbox').get().checked = false;
			if (user !== 'null') c.get('user-' + user).get('checkbox').get().checked = true;
		}

		return c;

	}

};
