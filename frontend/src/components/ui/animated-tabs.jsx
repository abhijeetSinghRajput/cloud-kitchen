// AnimatedTabs.jsx
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
  const tabRefs = useRef([]);

  useEffect(() => {
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
  }, [activeTab, tabs]);

  const activeTabContent = tabs.find(tab => tab.value === activeTab)?.content;

  return (
    <div className={`${className}`}>
      {/* Tabs List */}
      <div
        className={`relative w-max inline-flex rounded-lg bg-muted p-1 ${tabsListClassName}`}
      >
        {/* Highlight */}
        <motion.div
          className="absolute bg-background rounded-lg shadow-sm border"
          animate={highlightStyle}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
        />

        {/* Tab Triggers */}
        {tabs.map((tab, index) => (
          <button
            key={tab.value}
            ref={(el) => (tabRefs.current[index] = el)}
            className={`relative z-10 py-1.5 px-4 text-sm font-medium transition-colors rounded-md ${
              activeTab === tab.value
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setActiveTab(tab.value)}
          >
            {tab.title}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          className={`mt-4 ${tabContentClassName}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{
            duration: 0.2,
            ease: "easeInOut",
          }}
        >
          {activeTabContent}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AnimatedTabs;
