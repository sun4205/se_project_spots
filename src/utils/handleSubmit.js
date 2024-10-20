import { renderLoading } from "./helpers.js";
import api from "./Api.js";
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

  return request()
    .then(() => {
      evt.target.reset();
    })
    .catch(console.error)
    .finally(() => {
      renderLoading(false, submitButton, initialText);
    });
}
