import { Children, isValidElement, useId, useRef, useState } from 'react';

export function ContentTab({ children }) {
  return children;
}

export default function ContentTabs({ ariaLabel, children }) {
  const tabs = Children.toArray(children).filter(isValidElement);
  const [activeIndex, setActiveIndex] = useState(0);
  const tabsId = useId();
  const tabRefs = useRef([]);

  function selectTab(index, shouldFocus = false) {
    setActiveIndex(index);

    if (shouldFocus) {
      tabRefs.current[index]?.focus();
    }
  }

  function handleTabKeyDown(event, index) {
    const lastIndex = tabs.length - 1;
    let nextIndex = index;

    if (event.key === 'ArrowRight') nextIndex = index === lastIndex ? 0 : index + 1;
    if (event.key === 'ArrowLeft') nextIndex = index === 0 ? lastIndex : index - 1;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = lastIndex;

    if (nextIndex !== index) {
      event.preventDefault();
      selectTab(nextIndex, true);
    }
  }

  return (
    <div className="content-tabs">
      <div
        className="content-tab-list"
        role="tablist"
        aria-label={ariaLabel}
        aria-orientation="horizontal"
      >
        {tabs.map((tab, index) => (
          <button
            className="content-tab-button"
            type="button"
            role="tab"
            id={`${tabsId}-tab-${index}`}
            aria-selected={activeIndex === index}
            aria-controls={`${tabsId}-panel-${index}`}
            tabIndex={activeIndex === index ? 0 : -1}
            onClick={() => selectTab(index)}
            onKeyDown={(event) => handleTabKeyDown(event, index)}
            ref={(element) => {
              tabRefs.current[index] = element;
            }}
            key={tab.props.label}
          >
            {tab.props.label}
          </button>
        ))}
      </div>
      {tabs.map((tab, index) => (
        <div
          className="content-tab-panel prose"
          role="tabpanel"
          id={`${tabsId}-panel-${index}`}
          aria-labelledby={`${tabsId}-tab-${index}`}
          hidden={activeIndex !== index}
          key={tab.props.label}
        >
          {tab.props.children}
        </div>
      ))}
    </div>
  );
}
