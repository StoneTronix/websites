import { getUserInfo, sendRemoveCardRequest, likeCardRequest, likeCardRevokeRequest } from './api.js';


let currentUserId;
getUserInfo()   // Получение информации о пользователе
  .then(res => {
      currentUserId = res._id;
  });

export function cardRenderer(card) {
  console.log(card);

  const cardTemplate = document.querySelector("#template").content;
  const newCard = cardTemplate.querySelector('.places__item').cloneNode(true);  // Скопировали шаблон  
  const cardLikeButton = newCard.querySelector('.card__like-button');
  const deleteButton = newCard.querySelector('.card__delete-button')
  
  newCard.id = card._id;
  newCard.querySelector('.card__image').src = card.link;  
  newCard.querySelector('.card__description').querySelector('.card__title').textContent = card.name; // Выбрали и добавили описание
  newCard.querySelector(".card__like-counter").textContent = card.likes.length;

  if (card.likes.find((likeObj) => likeObj._id === currentUserId)) {
    cardLikeButton.classList.add("card__like-button_is-active");
  }
  if (currentUserId !== card.owner._id) {
    deleteButton.style.display = 'none';
  }

  return newCard;
}

export function removeCard(specifiedCard) {
  sendRemoveCardRequest(specifiedCard.getAttribute('id'));    
  specifiedCard.remove();    
}

export function likeCard(specifiedCard) {  
  const likeSection = specifiedCard.querySelector('.card__like');
  const likeButton = likeSection.querySelector('.card__like-button');

  function updateLike(answer) {    
    const likeCounter = likeSection.querySelector('.card__like-counter');
    
    likeButton.classList.toggle('card__like-button_is-active');
    likeCounter.textContent = answer.likes.length;
  }

  if (!likeButton.classList.contains('card__like-button_is-active')){
    likeCardRequest(specifiedCard.getAttribute('id'))
      .then((answer) => updateLike(answer));      
  } else {
    likeCardRevokeRequest(specifiedCard.getAttribute('id'))
      .then((answer) => updateLike(answer));
  }
}

