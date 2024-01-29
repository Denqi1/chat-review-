import {authorizationConfirmElements, authorizationElements} from './uiElements';
import {makeAuthorizationRequest} from './requests';
import {authorizationKey, emailRegexp, messageEmailIsInvalid, messageEmailIsValid, userUrl} from './consts';
import {closeAuthorizationModal} from './view';
import {type PostData} from './types';
import Cookies from 'js-cookie';
import {isEmailValid} from './logic';
import {getUserInfoRequest} from '../../changeName/requests';
import {getUserUrl} from '../../changeName/consts';
import {renderHistoryMessages} from '../../messageHistoryUpload/renderMessages';
import {createTemplateMessage} from '../../sendMessage/logic';
import {sendMessageElements} from '../../sendMessage/uiElements';
import {emptyValue, userEmailKey} from '../../consts';
import {historyUrl} from '../../messageHistoryUpload/consts';
import {getHistoryMessages} from '../../messageHistoryUpload/requests';

async function authorizationGetHandler(event: Event) {
	event.preventDefault();

	if (authorizationElements.modalButtonGet === null) {
		throw new Error('Кнопки получиь код не найдено');
	}

	const email = authorizationElements.modalInput.value;
	const postData: PostData = {
		email,
	};

	if (!isEmailValid(email, emailRegexp)) {
		return;
	}

	Cookies.set(userEmailKey, email);

	authorizationElements.modalInputValidation.textContent = messageEmailIsValid;
	authorizationElements.modalInputValidation.classList.toggle('code-sent');

	try {
		await makeAuthorizationRequest(postData, userUrl);
	} catch (error) {
		console.error(error);
	}

	closeAuthorizationModal();
	authorizationConfirmElements.modal.showModal();

	authorizationElements.modalInputValidation.classList.toggle('code-sent');
}

function authorizationSetHandler(event: Event) {
	event.preventDefault();

	closeAuthorizationModal();
	authorizationConfirmElements.modal.showModal();

	if (authorizationConfirmElements.modalButton === null) {
		throw new Error('authorizationConfirmElements.modalButton такого элемента не найдено');
	}
}

async function authorizedConfirmHandler(event: Event) {
	event.preventDefault();

	const inputValue = authorizationConfirmElements.modalInput.value.trim();

	try {
		const data = await getUserInfoRequest(getUserUrl, inputValue);

		if (data.message === 'Authentication failed!') {
			throw new Error('Invalid token');
		}
	} catch (error) {
		authorizationConfirmElements.modalValidationTokenResult.textContent = 'Error: Invalid token!';

		throw new Error('Invalid token');
	}

	Cookies.set(authorizationKey, inputValue);

	authorizationConfirmElements.modal.close();

	const messagesList = await getHistoryMessages(historyUrl, inputValue);

	if (!messagesList) {
		throw new Error('not found history messages');
	}

	renderHistoryMessages(createTemplateMessage, sendMessageElements, messagesList.messages);

	sendMessageElements.templateRoot.scrollTop = sendMessageElements.templateRoot.scrollHeight;
}

function authorizationConfirmBackHandler() {
	authorizationConfirmElements.modal.close();
	authorizationElements.modal.showModal();
}

function validationInputHandler() {
	if (authorizationElements.modalInputValidation === null) {
		throw new Error('not found authorizationElements.modalInputValidation');
	}

	if (isEmailValid(authorizationElements.modalInput.value, emailRegexp)) {
		authorizationElements.modalInputValidation.textContent = emptyValue;
	} else {
		authorizationElements.modalInputValidation.textContent = messageEmailIsInvalid;
	}
}

export {authorizationGetHandler, authorizationSetHandler, validationInputHandler, authorizationConfirmBackHandler, authorizedConfirmHandler};
