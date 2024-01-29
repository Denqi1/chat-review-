import {sendMessageElements} from './uiElements';
import {NotFoundElement} from './errors';
import {emptyValue} from '../consts';
import {urlWebSocket} from '../webSockets/connectToWebSocket';
import Cookies from 'js-cookie';
import {authorizationKey} from '../authorization/signIn/consts';

function addMessageFormHandler(event: Event) {
	event.preventDefault();

	if (!sendMessageElements.formInput) {
		throw new NotFoundElement('elements.formInput');
	}

	const inputValue = sendMessageElements.formInput.value.trim();

	if (!inputValue) {
		sendMessageElements.formInput.value = emptyValue;
		sendMessageElements.formInput.classList.add('shake');

		setTimeout(() => {
			sendMessageElements.formInput.classList.remove('shake');
		}, 600);
		return;
	}

	sendMessageElements.formInput.value = emptyValue;

	const token = Cookies.get(authorizationKey);
	const newWs = new WebSocket(urlWebSocket + token);

	newWs.onopen = function (e) {
		newWs.send(JSON.stringify({text: inputValue}));
	};
}

export {addMessageFormHandler};
