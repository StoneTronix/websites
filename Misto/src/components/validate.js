export function enableValidation(settings) {
  /*
  const validationSettings = {
    formSelector: '.popup__form',
    inputSelector: '.popup__input',
    submitButtonSelector: '.popup__button',
    inactiveButtonClass: 'popup__button_disabled',
    inputErrorClass: 'popup__input_type_error',
    errorClass: 'popup__error_visible'
  }  
  */  
  var formList = Array.from(document.querySelectorAll(settings.formSelector));
  
  formList.forEach((form) => {
    form.addEventListener( 'submit', (evt) => { evt.preventDefault() } );
    setEventListeners(form, settings);
  }); 
}


function setEventListeners(formElement, settings) {
  const inputList = Array.from(formElement.querySelectorAll(settings.inputSelector));
  const submitButton = formElement.querySelector(settings.submitButtonSelector);

  toggleSubmitButton(inputList, submitButton, settings);    // Кнопка подтверждения отключается заранее   
  inputList.forEach((input) => {
    input.addEventListener('input',   // Проверка повторяется во время ввода каждого символа
      () => {
        checkInputValidity(formElement, input, settings);
        toggleSubmitButton(inputList, submitButton, settings); 
      }
    );
  });
}


function checkInputValidity(formElement, inputElement, settings) {
  const errorElement = formElement.querySelector(`.${inputElement.name}-error`);  // Сообщение об ошибке
  
  if (!inputElement.validity.valid) {
    const errorMessage = inputElement.validationMessage;
    
    inputElement.classList.add(settings.inputErrorClass);    
    errorElement.classList.add(settings.errorClass);
    errorElement.textContent = errorMessage;    
  } else {    
    inputElement.classList.remove(settings.inputErrorClass);  
    errorElement.classList.remove(settings.errorClass);
    errorElement.textContent = '';
  }
}


function toggleSubmitButton(inputList, submitButton, settings) {
  function hasInvalidInput (inputList) {
    return inputList.some(
      (inputElement) => {
        return !inputElement.validity.valid;
      }
    ); 
  }

  if (hasInvalidInput(inputList)) {
    submitButton.disabled = true;
    submitButton.classList.add(settings.inactiveButtonClass);
  } else {
    submitButton.disabled = false;
    submitButton.classList.remove(settings.inactiveButtonClass);
  }
}


export function resetForm(formElement, settings) {
  const inputList = formElement.querySelectorAll('input');

  inputList.forEach(
    (inputElement) => {
      const errorElement = formElement.querySelector(`.${inputElement.name}-error`);
      
      inputElement.classList.remove(settings.inputErrorClass);  
      errorElement.classList.remove(settings.errorClass);
      errorElement.textContent = '';
    }
  )
  formElement.reset();
}