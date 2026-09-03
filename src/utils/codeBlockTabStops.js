export function syncCodeBlockTabStops(root) {
  root.querySelectorAll('pre').forEach((codeBlock) => {
    const hasOverflow =
      codeBlock.scrollWidth > codeBlock.clientWidth ||
      codeBlock.scrollHeight > codeBlock.clientHeight;

    codeBlock.tabIndex = hasOverflow ? 0 : -1;
  });
}
