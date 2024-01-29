import Cookies from 'js-cookie';
import {keyLeftHistoryMessages} from '../messageHistoryUpload/consts';
import {renderHistoryMessages} from '../messageHistoryUpload/renderMessages';
import {type Message} from '../messageHistoryUpload/typeMessages';
import {createTemplateMessage} from '../sendMessage/logic';
import {sendMessageElements} from '../sendMessage/uiElements';
import {classNoneLogger, loggerElement} from './uiElemets';
import {authorizationKey} from '../authorization/signIn/consts';

function lazyLoadingMessage() {
	const scrollPosition = sendMessageElements.templateRoot.scrollTop;

	if (scrollPosition > 110) {
		return;
	}

	if (scrollPosition === 0) {
		loggerElement?.classList.remove(classNoneLogger);
		return;
	}

	loggerElement?.classList.add(classNoneLogger);

	const token = Cookies.get(authorizationKey);
	if (!token) {
		throw new Error('Not found token');
	}

	const historyMessagesString = localStorage.getItem(keyLeftHistoryMessages);
	if (!historyMessagesString) {
		throw new Error('masd');
	}

	renderHistoryMessages(createTemplateMessage, sendMessageElements, JSON.parse(historyMessagesString) as Message[]);
}

export {lazyLoadingMessage};
