export interface SplitResult {
  /** Word wrappers, in document order. */
  words: HTMLElement[]
  /** Line wrappers (`overflow: hidden` masks) containing the words. */
  lines: HTMLElement[]
  /** Restores the element's original markup. */
  revert: () => void
}

/**
 * Splits an element's content into `.split-word` spans grouped under
 * `.split-line` masks, so words can slide in from below a line mask.
 *
 * Inline child elements (e.g. an italic `<em>`) are treated as atomic words
 * and `<br>` forces a line break. Call `revert()` once the intro animation
 * finishes to restore natural text wrapping.
 */
export function splitLines(el: HTMLElement): SplitResult {
  const originalHTML = el.innerHTML

  // Pass 1: replace content with word spans so they can be measured.
  const words: HTMLElement[] = []
  const flat: (HTMLElement | 'break')[] = []

  const makeWord = (content: Node): HTMLElement => {
    const span = document.createElement('span')
    span.className = 'split-word'
    span.appendChild(content)
    words.push(span)
    return span
  }

  Array.from(el.childNodes).forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      ;(node.textContent ?? '')
        .split(/\s+/)
        .filter(Boolean)
        .forEach((word) => flat.push(makeWord(document.createTextNode(word))))
    } else if (node instanceof HTMLBRElement) {
      flat.push('break')
    } else if (node instanceof HTMLElement) {
      flat.push(makeWord(node.cloneNode(true) as HTMLElement))
    }
  })

  el.innerHTML = ''
  flat.forEach((item) => {
    if (item === 'break') {
      el.appendChild(document.createElement('br'))
    } else {
      el.appendChild(item)
      el.appendChild(document.createTextNode(' '))
    }
  })

  // Pass 2: group words into visual lines by their measured offset.
  const groups: HTMLElement[][] = []
  let currentTop: number | null = null
  words.forEach((word) => {
    const top = word.offsetTop
    if (currentTop === null || Math.abs(top - currentTop) > 2) {
      groups.push([word])
      currentTop = top
    } else {
      groups[groups.length - 1].push(word)
    }
  })

  // Pass 3: rebuild with line masks.
  el.innerHTML = ''
  const lines = groups.map((group) => {
    const line = document.createElement('span')
    line.className = 'split-line'
    group.forEach((word, i) => {
      line.appendChild(word)
      if (i < group.length - 1) line.appendChild(document.createTextNode(' '))
    })
    el.appendChild(line)
    return line
  })

  return {
    words,
    lines,
    revert: () => {
      el.innerHTML = originalHTML
    },
  }
}

/**
 * Splits an element's text content into plain word spans (no line masks),
 * preserving natural wrapping. Ideal for scroll-scrubbed word highlighting.
 */
export function splitWords(el: HTMLElement): SplitResult {
  const originalHTML = el.innerHTML
  const text = el.textContent ?? ''
  const words: HTMLElement[] = []

  el.innerHTML = ''
  text
    .split(/\s+/)
    .filter(Boolean)
    .forEach((word, i, arr) => {
      const span = document.createElement('span')
      span.className = 'split-word'
      span.textContent = word
      words.push(span)
      el.appendChild(span)
      if (i < arr.length - 1) el.appendChild(document.createTextNode(' '))
    })

  return {
    words,
    lines: [],
    revert: () => {
      el.innerHTML = originalHTML
    },
  }
}
