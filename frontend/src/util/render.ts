export const render = (
  id: string,
  template: string,
  config?: Record<string, Record<string, (event: Event) => void>>
) => {
  const activeElement = document.activeElement
  const cursorPosition = (activeElement as HTMLInputElement).selectionStart

  document.getElementById(id)!.innerHTML = template
  if (config) {
    for (let [id, listeners] of Object.entries(config)) {
      const element = document.getElementById(id)
      for (let [event, func] of Object.entries(listeners))
      element!.addEventListener(event, func)
    }
  }

  if (activeElement) {
    document.getElementById(activeElement.id)?.focus()
    if (cursorPosition !== null && cursorPosition !== undefined) {
      (document.getElementById(activeElement.id) as HTMLInputElement).selectionStart = cursorPosition
    } 
  }
}
