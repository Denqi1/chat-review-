import Cookies from 'js-cookie';
import {authorizationKey} from './consts';
import {renderHistoryMessages} from '../../messageHistoryUpload/renderMessages';
import {createTemplateMessage} from '../../sendMessage/logic';
import {authorizationConfirmBackHandler, authorizationGetHandler, authorizationSetHandler, authorizedConfirmHandler, validationInputHandler} from './handlers';
import {type CheckAuthorizationUser, type AuthorizationConfirmElements, type AuthorizationElements, type StartChatRoom} from './types';
import {type TypeSendMessageElements} from '../../sendMessage/uiElements';
import {type SettingsModalElements} from '../../changeName/types';
import {type TypeSignOutElements} from '../signOut/uiElements';
import {addMessageFormHandler} from '../../sendMessage/handlers';
import {closeSettingsModalHandler, openSettingsModalHandler, setNameHandler} from '../../changeName/handlers';
import {signOutHandler} from '../signOut/handlers';
import {getHistoryMessages} from '../../messageHistoryUpload/requests';
import {historyUrl, keyAllHistoryMessages} from '../../messageHistoryUpload/consts';
import {type Message, Messages} from '../../messageHistoryUpload/typeMessages';

function isEmailValid(value: string, emailRegexp: RegExp) {
	return emailRegexp.test(value);
}

async function checkAuthorizationUser({
	authorizationElements,
	authorizationConfirmElements,
	sendMessageElements,
	settingsModalElements,
	signOutElements}: CheckAuthorizationUser) {
	const token = Cookies.get(authorizationKey);

	if (!token) {
		startAuthorizeTheUser(authorizationElements, authorizationConfirmElements);
		return;
	}

	const historyMessages = await getHistoryMessages(historyUrl, token);
	if (!historyMessages) {
		throw new Error('Cannot get history messages');
	}

	const messagesList = historyMessages.messages;
	startChatRoom({token, sendMessageElements, settingsModalElements, signOutElements, messagesList});
}

function startAuthorizeTheUser(authorizationElements: AuthorizationElements, authorizationConfirmElements: AuthorizationConfirmElements) {
	authorizationElements.modal.showModal();

	authorizationElements.modalInput.addEventListener('input', validationInputHandler);
	authorizationElements.modalButtonGet.addEventListener('click', authorizationGetHandler);
	authorizationElements.modalButtonEnter.addEventListener('click', authorizationSetHandler);
	authorizationConfirmElements.modalBackButton.addEventListener('click', authorizationConfirmBackHandler);
	authorizationConfirmElements.modalButton.addEventListener('click', authorizedConfirmHandler);
}

function startChatRoom({token, sendMessageElements, settingsModalElements, signOutElements, messagesList}: StartChatRoom) {
	sendMessageElements.form.addEventListener('submit', addMessageFormHandler);
	settingsModalElements.openButton.addEventListener('click', openSettingsModalHandler);
	settingsModalElements.closeButton.addEventListener('click', closeSettingsModalHandler);
	settingsModalElements.setButton.addEventListener('click', setNameHandler);
	signOutElements.button.addEventListener('click', signOutHandler);

	renderHistoryMessages(createTemplateMessage, sendMessageElements, messagesList);

	sendMessageElements.templateRoot.scrollTop = sendMessageElements.templateRoot.scrollHeight;
}

export {isEmailValid, checkAuthorizationUser};
