export function setButtonText(
  btn,
  isLoading,
  defaultText = "save",
  loadingText = "saving..."
) {
  if (isLoading) {
    btn.textContent = loadingText;
    btn.disabled = true;
  } else {
    btn.textContent = defaultText;
    btn.disabled = false;
  }
}
