import * as React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useNavigate, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"

const buttonVariants = {
  initial: {
    gap: 0,
    paddingLeft: ".5rem",
    paddingRight: ".5rem",
  },
  animate: (isSelected) => ({
    gap: isSelected ? ".5rem" : 0,
    paddingLeft: isSelected ? "1rem" : ".5rem",
    paddingRight: isSelected ? "1rem" : ".5rem",
  }),
}

const spanVariants = {
  initial: { width: 0, opacity: 0 },
  animate: { width: "auto", opacity: 1 },
  exit: { width: 0, opacity: 0 },
}

const transition = { delay: 0.1, type: "spring", bounce: 0, duration: 0.6 }

export function ExpandedTabs({
  tabs,
  className,
  activeColor = "",
  onChange,
}) {
  const navigate = useNavigate()
  const location = useLocation()
  const [selected, setSelected] = React.useState(null)

  // keep selected in sync with active route
  React.useEffect(() => {
    const activeIndex = tabs.findIndex((tab) => tab.path === location.pathname)
    if (activeIndex !== -1) {
      setSelected(activeIndex)
      onChange?.(activeIndex)
    }
  }, [location.pathname, tabs, onChange])

  const handleSelect = (index) => {
    const tab = tabs[index]
    if (!tab?.path) return
    setSelected(index)
    onChange?.(index)
    navigate(tab.path) // ✅ navigate
  }

  const Separator = () => (
    <div className="h-[24px] w-[1.2px] bg-border" aria-hidden="true" />
  )

  return (
    <div
      className={cn(
        "flex gap-2 rounded-2xl border bg-background p-1 shadow-sm",
        className
      )}
    >
      {tabs.map((tab, index) => {
        if (tab.type === "separator") {
          return <Separator key={`separator-${index}`} />
        }

        const Icon = tab.icon
        return (
          <motion.button
            key={tab.label}
            variants={buttonVariants}
            initial={false}
            animate="animate"
            custom={selected === index}
            onClick={() => handleSelect(index)}
            transition={transition}
            className={cn(
              "relative flex items-center rounded-xl px-4 py-2 text-sm font-medium transition-colors duration-300",
              selected === index
                ? cn("bg-primary text-primary-foreground", activeColor)
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon size={20} className="flex-shrink-0" />
            <AnimatePresence initial={false}>
              {selected === index && (
                <motion.span
                  variants={spanVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={transition}
                  className="overflow-hidden whitespace-nowrap"
                >
                  {tab.label}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        )
      })}
    </div>
  )
}
