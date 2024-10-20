import { renderLoading } from "./helpers.js";
import Api from "./Api.js";
import {
  enableValidation,
  resetValidation,
  disableButton,
} from "../scripts/validation.js";


export function handleSubmit(request, evt, loadingText = "Saving...") {
  evt.preventDefault();

  const submitButton = evt.submitter;
  const initialText = submitButton.textContent;
  renderLoading(true, submitButton, initialText, loadingText);

  request()
    .then(() => {
      evt.target.reset();
    })
    .catch(console.error)
    .finally(() => {
      renderLoading(false, submitButton, initialText);
    });
}

export function handleEditForSubmit(e) {
  handleSubmit(
    () =>
      api.editUserInfo({
        name: editModalNameInput.value,
        about: editModalDescriptionInput.value,
      }),
    e
  );
}

export function handleAddCardSubmit(e) {
  const inputValues = { name: cardNameInput.value, link: cardLinkInput.value };

  handleSubmit(() => api.addNewCard(inputValues), e);
}

export function handleDeleteSubmit(evt) {
  handleSubmit(() => api.deleteCard(selectedCardId), evt);
}

export function handleAvatarSubmit(evt) {
  handleSubmit(() => api.editAvatarInfo(avatarInput.value), evt);
}
