import "./index.css";
import {
  enableValidation,
  resetValidation,
  disableButton,
} from "../scripts/validation";
import Api from "../utils/Api.js";
import { settings, initialCards } from "../utils/constants.js";

import { handleSubmit } from "../utils/handleSubmit.js";

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "2d4b9f7c-b9f4-4e18-86c3-caa0e9c274de",
    "Content-Type": "application/json",
  },
});

api
  .getAppInfo()
  .then(([cards, userInfo]) => {
    cards.forEach((card) => {
      const cardElement = getCardElement(card);
      cardsList.prepend(cardElement);
    });

    profileName.textContent = userInfo.name;
    profileDescription.textContent = userInfo.about;

    const avatarImage = document.querySelector(".profile__avatar");
    avatarImage.src = userInfo.avatar;
  })
  .catch(console.error);

const profileForm = document.forms["profile-form"];
const cardForm = document.forms["card-form"];
const profileEditButton = document.querySelector(".profile__edit-btn");
const cardModalbtn = document.querySelector(".profile__add-btn");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");
const cardSubmitBtn = cardForm.querySelector(".modal__submit-btn");
const cancelButton = document.querySelector(".modal__submit-btn--cancel");

const editModal = document.querySelector("#modal-edit");

const editModalCloseBtn = editModal.querySelector(".modal__close-btn");
const editModalNameInput = editModal.querySelector("#modal-profile-name-input");
const editModalDescriptionInput = editModal.querySelector(
  "#modal-profile-description-input"
);

const cardModal = document.querySelector("#modal__add-card");

const cardModalClosebtn = cardModal.querySelector(".modal__close-btn");
const cardNameInput = cardModal.querySelector("#modal__add-card-name-input");
const cardLinkInput = cardModal.querySelector("#modal__add-card-link-input");

const avatarModal = document.getElementById("modal-avatar-edit");
const avatarElement = document.querySelector(".profile__avatar");
const avatarEditButton = document.querySelector(".profile__avatar-btn");
const avatarForm = avatarModal.querySelector(".modal__form");
const avatarInput = avatarModal.querySelector(
  "#modal-avatar-description-input"
);
const avatarSubmitBtn = avatarModal.querySelector(".modal__submit-btn");
const avatarModalCloseBtn = avatarModal.querySelector(".modal__close-btn");

const deleteModal = document.querySelector("#modal__delete");
const deleteForm = deleteModal.querySelector(".modal__form");

const previewModal = document.querySelector("#modal__preview");
const previewModalImageEl = previewModal.querySelector(".modal__image");
const previewModalCaptionEl = previewModal.querySelector(".modal__caption");
const previewModalCloseBtn = previewModal.querySelector(".modal__close-btn");

const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

let currentModal = null;

let selectedCard;
let selectedCardId;
function handleEscKey(evt) {
  if (evt.key === "Escape" && currentModal) {
    closeModal(currentModal);
  }
}

function handleOutsideClick(evt) {
  if (currentModal && evt.target === currentModal) {
    closeModal(currentModal);
  }
}

function openModal(modal) {
  modal.classList.add("modal_opened");
  currentModal = modal;
  document.addEventListener("keydown", handleEscKey);
  document.addEventListener("click", handleOutsideClick);
  console.log("Modal opened and Escape key listener added");
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  if (currentModal === modal) {
    currentModal = null;
  }
  document.removeEventListener("keydown", handleEscKey);
  document.removeEventListener("click", handleOutsideClick);
  console.log("Modal closed and Escape key listener removed");
}

const closeButtons = document.querySelectorAll(".modal__close-btn");

closeButtons.forEach((button) => {
  const modal = button.closest(".modal");

  button.addEventListener("click", () => closeModal(modal));
});

function handleDeleteCard(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;
  openModal(deleteModal);
}

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);
  const cardNameEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardLikeBtn = cardElement.querySelector(".card__like-btn");
  const cardDeleteBtn = cardElement.querySelector(".card__delete-btn");

  cardNameEl.textContent = data.name;
  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;

  if (data.isLiked) {
    cardLikeBtn.classList.add("card__like-btn_liked");
  }

  function handleLike(evt, id) {
    const isLiked = cardLikeBtn.classList.contains("card__like-btn_liked");
    api
      .changeLikeStatus(data._id, isLiked)
      .then((res) => {
        cardLikeBtn.classList.toggle("card__like-btn_liked", res.isLiked);
      })
      .catch(console.error);
  }

  cardLikeBtn.addEventListener("click", handleLike);

  cardImageEl.addEventListener("click", () => {
    openModal(previewModal);
    previewModalImageEl.src = data.link;
    previewModalCaptionEl.textContent = data.name;
    previewModalImageEl.alt = data.name;
  });

  cardDeleteBtn.addEventListener("click", (evt) => {
    handleDeleteCard(cardElement, data._id);
  });

  return cardElement;
}

profileEditButton.addEventListener("click", () => {
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;
  resetValidation(
    profileForm,
    [editModalNameInput, editModalDescriptionInput],
    settings
  );
  openModal(editModal);
});

cardModalbtn.addEventListener("click", () => {
  openModal(cardModal);
});

avatarEditButton.addEventListener("click", () => {
  openModal(avatarModal);
});

avatarForm.addEventListener("submit", handleAvatarSubmit);
profileForm.addEventListener("submit", handleEditForSubmit);
cardForm.addEventListener("submit", handleAddCardSubmit);
deleteForm.addEventListener("submit", handleDeleteSubmit);
cancelButton.addEventListener("click", () => closeModal(deleteModal));

enableValidation(settings);

function handleEditForSubmit(e) {
  handleSubmit(
    () =>
      api.editUserInfo({
        name: editModalNameInput.value,
        about: editModalDescriptionInput.value,
      }),
    e
  ).then(() => {
    closeModal(editModal);
  });
}

function handleAddCardSubmit(e) {
  const inputValues = { name: cardNameInput.value, link: cardLinkInput.value };

  handleSubmit(() => api.addNewCard(inputValues), e).then(() => {
    closeModal(cardModal);
  });
}

function handleDeleteSubmit(evt) {
  handleSubmit(() => api.deleteCard(selectedCardId), evt, "Deleting...").then(
    () => {
      closeModal(deleteModal);
    }
  );
}

function handleAvatarSubmit(evt) {
  handleSubmit(() => api.editAvatarInfo(avatarInput.value), evt).then(() => {
    closeModal(avatarModal);
  });
}
