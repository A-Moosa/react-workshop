import React, { useState, useId, use, createContext } from 'react'
import { wrapEvent } from '../../utils'

const AccordionContext = createContext()

/**
 * Accordion
 */

export const Accordion = React.forwardRef(
  ({ children, onChange, defaultIndex = 0, id, ...props }, forwardedRef) => {
    const [selectedIndex, setSelectedIndex] = useState(defaultIndex)
    const accordionId = useId(id)

    // We're mapping over the children (AccordionItem) to get their index. Then we're
    // creating a context for each one.
    children = React.Children.map(children, (child, index) => {
      const panelId = `accordion-${accordionId}-panel-${index}`
      const buttonId = `accordion-${accordionId}-button-${index}`

      const context = {
        buttonId,
        panelId,
        selected: selectedIndex === index,
        selectPanel: () => {
          onChange && onChange(index)
          setSelectedIndex(index)
        },
      }
      return <AccordionContext value={context} children={child} />
    })

    function onKeyDown(event) {
      event.preventDefault()
      const i = selectedIndex

      switch (event.key) {
        case 'ArrowUp':
          if (i !== 0) {
            setSelectedIndex(i - 1)
          }
          break
        case 'ArrowDown':
          if (i < React.Children.count(children) - 1) {
            setSelectedIndex(i + 1)
          }
          break
        default:
          break
      }
    }

    return (
      <div data-accordion="" onKeyDown={onKeyDown} ref={forwardedRef} {...props}>
        {children}
      </div>
    )
  }
)

Accordion.displayName = 'Accordion'

/**
 * Accordion Item
 */

export const AccordionItem = React.forwardRef(({ children, ...props }, forwardedRef) => {
  const { selected } = use(AccordionContext)

  return (
    <div
      {...props}
      data-accordion-item=""
      data-state={selected ? 'open' : 'collapsed'}
      ref={forwardedRef}
    >
      {children}
    </div>
  )
})

AccordionItem.displayName = 'AccordionItem'

/**
 * Accordion Button
 */

export const AccordionButton = React.forwardRef(({ children, onClick, ...props }, forwardedRef) => {
  const { buttonId, panelId, selected, selectPanel } = use(AccordionContext)

  return (
    <button
      {...props}
      onClick={wrapEvent(onClick, selectPanel)}
      data-accordion-button=""
      data-state={selected ? 'open' : 'collapsed'}
      aria-expanded={selected}
      id={buttonId}
      aria-controls={panelId}
      ref={forwardedRef}
    >
      {children}
    </button>
  )
})

AccordionButton.displayName = 'AccordionButton'

/**
 * Accordion Panel
 */

export const AccordionPanel = React.forwardRef(({ children, ...props }, forwardedRef) => {
  const { buttonId, panelId, selected } = use(AccordionContext)

  return (
    <div
      role="region"
      {...props}
      id={panelId}
      aria-labelledby={buttonId}
      hidden={!selected}
      data-accordion-panel=""
      data-state={selected ? 'open' : 'collapsed'}
      ref={forwardedRef}
    >
      {children}
    </div>
  )
})

AccordionPanel.displayName = 'AccordionPanel'
