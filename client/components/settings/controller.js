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
			c.get().addStyle({display: 'block'});
		};

		c.changeBg = function (e) {
			setBg(e.target.getAttribute('data-index'));
		};

		c.changeAudio = function (e) {
			setAudio(e.target.checked)
		};

		c.initSettings = function () {
			setBg(localStorage.getItem('bg-image') || 1);
			setAudio(localStorage.getItem('audio-on') === 'true');
			document.body.className = '';
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

        return c;

    }

};
