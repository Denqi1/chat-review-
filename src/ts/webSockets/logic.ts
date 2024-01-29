import {type Message} from '../messageHistoryUpload/typeMessages';
import {urlWebSocket} from './connectToWebSocket';
import {authorizationKey} from '../authorization/signIn/consts';
import Cookies from 'js-cookie';
import {createOneMessage, getLazyTemplateMessage} from '../messageHistoryUpload/renderMessages';
import {sendMessageElements} from '../sendMessage/uiElements';
import {createLazyTemplateMessage} from '../sendMessage/logic';
import {userEmailKey} from '../consts';

function connectToWebSocket(webSocket: WebSocket) {
	const token = Cookies.get(authorizationKey);

	webSocket = new WebSocket(urlWebSocket + token);

	webSocket.onmessage = function (event: MessageEvent<string>) {
		const eventData = event.data;
		const message = JSON.parse(eventData) as Message;

		createOneMessage(createLazyTemplateMessage, message, sendMessageElements, getLazyTemplateMessage);

		const yourEmail = Cookies.get(userEmailKey);
		if (message.user.email === yourEmail) {
			sendMessageElements.templateRoot.scrollTop = sendMessageElements.templateRoot.scrollHeight;
		}
	};

	webSocket.onclose = event => {
		setTimeout(() => {
			connectToWebSocket(webSocket);
		}, 1000);
	};

	webSocket.onerror = event => {
		console.warn('Socket ended up with an error');

		webSocket.close();
	};
}

export {connectToWebSocket};
