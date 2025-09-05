import { useState, useRef, useEffect } from "react";

const AnimatedTabs = ({
  tabs,
  defaultValue,
  className = "",
  tabsListClassName = "",
  tabContentClassName = "",
  orientation = "horizontal"
}) => {
  const [activeTab, setActiveTab] = useState(defaultValue || tabs[0]?.value);
  const [highlightStyle, setHighlightStyle] = useState({});
  const [isTransitioning, setIsTransitioning] = useState(false);
  const tabRefs = useRef([]);

  useEffect(() => {
    const updateHighlight = () => {
      const activeIndex = tabs.findIndex(tab => tab.value === activeTab);
      const el = tabRefs.current[activeIndex];
      if (el) {
        const rect = el.getBoundingClientRect();
        const parentRect = el.parentElement.getBoundingClientRect();
        setHighlightStyle({
          left: rect.left - parentRect.left,
          top: rect.top - parentRect.top,
          width: rect.width,
          height: rect.height,
        });
      }
    };

    updateHighlight();
    
    // Add resize listener to recalculate on window resize
    window.addEventListener('resize', updateHighlight);
    return () => window.removeEventListener('resize', updateHighlight);
  }, [activeTab, tabs]);

  const handleTabChange = (newTab) => {
    if (newTab !== activeTab) {
      setIsTransitioning(true);
      setActiveTab(newTab);
      setTimeout(() => setIsTransitioning(false), 200);
    }
  };

  const activeTabContent = tabs.find(tab => tab.value === activeTab)?.content;

  return (
    <div className={`${className}`}>
      {/* Tabs List */}
      <div
        className={`relative inline-flex rounded-xl bg-muted p-1 ${tabsListClassName}`}
        style={{ width: tabsListClassName.includes('w-full') ? '100%' : 'fit-content' }}
      >
        {/* Highlight */}
        <div
          className="absolute bg-background rounded-lg shadow-sm border"
          style={{
            ...highlightStyle,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            zIndex: 1
          }}
        />

        {/* Tab Triggers */}
        {tabs.map((tab, index) => (
          <button
            key={tab.value}
            ref={(el) => (tabRefs.current[index] = el)}
            className={`relative z-10 py-2 px-4 text-sm font-medium transition-all duration-200 rounded-md ${
              tabsListClassName.includes('w-full') ? 'flex-1' : ''
            } ${
              activeTab === tab.value
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => handleTabChange(tab.value)}
            style={{
              transition: 'color 0.2s ease-in-out'
            }}
          >
            {tab.title}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className={`mt-4 ${tabContentClassName}`}>
        <div
          key={activeTab}
          className="tab-content"
          style={{
            opacity: isTransitioning ? 0 : 1,
            transform: isTransitioning ? 'translateX(10px)' : 'translateX(0px)',
            transition: 'opacity 0.2s ease-in-out, transform 0.2s ease-in-out'
          }}
        >
          {activeTabContent}
        </div>
      </div>
    </div>
  );
};

export default AnimatedTabs;