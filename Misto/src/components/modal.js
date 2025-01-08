import { resetForm } from "./validate.js";
import { validationSettings } from "./index.js";

const modalSelectors = {
  closeButton: '.popup__close',
  form: '.popup__form'
}

function closeByEsc(evt, popup) {     
  if (evt.key === 'Escape') {    
    closeModal(popup);
  }
}

function closeByOverlay(evt, popup) {  
  if (evt.target === popup) {
    closeModal(popup);
  }
}

export function openModal(popup) {  
  popup.classList.add('popup_is-opened');  
  const popupCloseButton = popup.querySelector(modalSelectors.closeButton);
  popupCloseButton.addEventListener('click', () => closeModal(popup));
  document.addEventListener('keydown', (evt) => { closeByEsc(evt, popup) });
  popup.addEventListener('click', (evt) => { console.log(evt); closeByOverlay(evt, popup) });
}

export function closeModal(popup) {
  popup.classList.remove('popup_is-opened');
  
  /*
    Неловкий скрипт для корректной обработки попапов изображений. Лучше переделать / убрать
  */
  if (popup.querySelector(modalSelectors.form)) {
    resetForm(popup.querySelector(modalSelectors.form), validationSettings);
  }

  const popupCloseButton = popup.querySelector(modalSelectors.closeButton);
  popupCloseButton.removeEventListener('click', () => closeModal(popup));
  document.removeEventListener('keydown', (evt) => { closeByEsc(evt, popup) });
  popup.removeEventListener('click', (evt) => closeByOverlay(evt, popup));
}