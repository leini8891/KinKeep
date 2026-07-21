type SubmitKeyInput = {
  key: string;
  isComposing?: boolean;
  keyCode?: number;
};

export function shouldSubmitOnEnter({
  key,
  isComposing = false,
  keyCode,
}: SubmitKeyInput) {
  return key === "Enter" && !isComposing && keyCode !== 229;
}
