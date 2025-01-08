import '../pages/index.css';
import { 
  openModal, 
  closeModal } from './modal.js';
import {
  cardRenderer,
  likeCard,
  removeCard } from './card.js';
import { enableValidation } from './validate.js';
import { getInitialCards, getUserInfo, updateUserInfo, sendCard, changeAvatarRequest} from './api.js';


const avatar = document.querySelector(".profile__image");
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const profileEditButton = document.querySelector('.profile__edit-button'); 
const profileAddButton = document.querySelector('.profile__add-button');
const placesList = document.querySelector('.places__list');
export let validationSettings;


function editAvatar() {
  const avatarPopup = document.querySelector(".popup_type_avatar");
  const avatarPopupClose = avatarPopup.querySelector('.popup__close');
  const submitButton = avatarPopup.querySelector(".popup__button");
  const avatarForm = avatarPopup.querySelector('form');
  const linkInput = avatarPopup.querySelector('.popup__input_type_url');
  
  openModal(avatarPopup);
  avatarPopupClose.addEventListener('click', () => { 
    closeModal(avatarPopup);
  });

  function avatarFormSubmitHandler(evt) {
    evt.preventDefault();
    
    const link = linkInput.value;
    submitButton.disabled = true;        
    submitButton.textContent = "Сохраняем...";    

    changeAvatarRequest(link)    
      .then(() => {
        avatar.style.backgroundImage = `url(${link})`;
      })
      .finally(() => {
        submitButton.textContent = "Сохранить";
        submitButton.disabled = false;
        closeModal(avatarPopup);
      });

    avatarForm.removeEventListener("submit", avatarFormSubmitHandler);
  }
avatarForm.addEventListener("submit", avatarFormSubmitHandler);
}
avatar.addEventListener("click", editAvatar);

function editProfile() /* Редактирование профиля */ {
  const profilePopup = document.querySelector('.popup_type_edit');
  const profilePopupClose = profilePopup.querySelector('.popup__close');
  const profileForm = profilePopup.querySelector("form"); 
  const nameInput = profilePopup.querySelector(".popup__input_type_name");
  const profileBio = profilePopup.querySelector('.popup__input_type_description');  
  const submitButton = profileForm.querySelector("button");

  nameInput.value = profileTitle.textContent;
  profileBio.value = profileDescription.textContent;  

  openModal(profilePopup);   

  function profileFormSubmitHandler(evt) {
    evt.preventDefault();   // Чтобы форма не отправлялась сразу
    
    submitButton.disabled = true;
    submitButton.textContent = "Сохраняем...";    
    
    updateUserInfo(nameInput.value, profileBio.value)
      .then((answer) => {
        // console.log(answer);
        profileTitle.textContent = answer.name;
        profileDescription.textContent = answer.about;
      })
      .finally(() => {
        closeModal(profilePopup);          
        submitButton.textContent = "Сохранить";
        submitButton.disabled = false;
      });
  }
  profileForm.addEventListener('submit', profileFormSubmitHandler);
}
profileEditButton.addEventListener("click", editProfile);


function cardHandler (evt) /* Обработчик действий внутри карт */ {  
  // Обработчик висит на "evt.currentTarget"
  const target = evt.target;  // На нём сработало событие
  const card = target.parentNode;
  const imagePopup = document.querySelector('.popup_type_image');
  const imagePopupClose = imagePopup.querySelector('.popup__close'); 
 
  if (target.classList.contains('card__delete-button')) {     // Это кнопка удаления?
    removeCard(target.parentNode);  // Передаётся карта
  }
  else if (target.classList.contains('card__like-button')) {  // Это кнопка подобайки?    
    likeCard(target.parentNode.parentNode.parentNode);
  }
  else if (target.classList.contains('card__image')) {        // Это изображение?
    openModal(imagePopup);    
    imagePopupClose.addEventListener('click', function(){ closeModal(imagePopup) });
    
    imagePopup.querySelector('.popup__caption').textContent = card.querySelector('.card__title').textContent;
    imagePopup.querySelector('.popup__image').src = target.src;
    imagePopup.querySelector('.popup__image').alt = String(card.querySelector('.card__title').textContent);
  }
}
placesList.addEventListener('click', (evt) => { cardHandler(evt) });


function createCard() /* Создание карты */ {
  const cardPopup = document.querySelector('.popup_type_new-card');
  const cardPopupClose = cardPopup.querySelector('.popup__close');  
  const cardForm = cardPopup.querySelector('form');
  const nameInput = cardPopup.querySelector('.popup__input_type_card-name');
  const linkInput = cardPopup.querySelector('.popup__input_type_url');
  const submitButton = cardForm.querySelector("button"); 
  
  openModal(cardPopup);  
  
  function cardFormSubmitHandler(evt) {
    evt.preventDefault();

    submitButton.disabled = true;
    submitButton.textContent = "Сохраняем...";
    
    var newCardName = nameInput.value;
    var newCardLink = linkInput.value;

    sendCard(newCardName, newCardLink)
      .then((answer) => {
        console.log(answer);
        placesList.prepend(cardRenderer(answer));
      })
      .finally(() => {
        closeModal(cardPopup);
        cardPopup.querySelector('.popup__input_type_card-name').value = '';
        cardPopup.querySelector('.popup__input_type_url').value = '';

        submitButton.textContent = "Сохранить";
        submitButton.disabled = false;
      });    
  }  
  cardForm.addEventListener('submit', cardFormSubmitHandler); /* Подтверждение создания карточки */
}
profileAddButton.addEventListener('click', createCard);


// Загрузка с сервера
function loadDataFromServer() {
  function addCardToPage(card) /* Добавление новой карты на страницу */ {   
    placesList.append(card);
  }

  Promise.all([getUserInfo(), getInitialCards()])  
    .then(
      (loaded) => {        
        avatar.style.backgroundImage = `url(${loaded[0].avatar})`;
        profileTitle.textContent = loaded[0].name;
        profileDescription.textContent = loaded[0].about;

        for (let i = 0; i < loaded[1].length; i++) {          
          addCardToPage(cardRenderer(loaded[1][i]));
        }
      }
    );
}




// Main
validationSettings = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
}
const popups = document.querySelectorAll('.popup');
for (let i = 0; i < popups.length; i++) /* Анимация всплывающим окнам */ {
  popups[i].classList.add('popup_is-animated');
}
loadDataFromServer();
enableValidation(validationSettings);



