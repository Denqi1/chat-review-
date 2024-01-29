import {sendMessageElements} from './sendMessage/uiElements';
import {authorizationConfirmElements, authorizationElements} from './authorization/signIn/uiElements';
import {signOutElements} from './authorization/signOut/uiElements';
import {settingsModalElements} from './changeName/uiElements';
import {checkAuthorizationUser} from './authorization/signIn/logic';
import {connectToWebSocket} from './webSockets/logic';
import {webSocket} from './webSockets/connectToWebSocket';
import {lazyLoadingMessage} from './virtualization/logic';

void checkAuthorizationUser({authorizationElements, authorizationConfirmElements, sendMessageElements, settingsModalElements, signOutElements});

connectToWebSocket(webSocket);

sendMessageElements.templateRoot.addEventListener('scroll', lazyLoadingMessage);

