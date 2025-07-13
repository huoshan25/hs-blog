"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

const EnhancedTooltipProvider = TooltipPrimitive.Provider

const EnhancedTooltip = TooltipPrimitive.Root

const EnhancedTooltipTrigger = TooltipPrimitive.Trigger

interface EnhancedTooltipContentProps extends React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> {
  showArrow?: boolean;
}

const EnhancedTooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  EnhancedTooltipContentProps
>(({ className, sideOffset = 8, showArrow = true, children, ...props }, ref) => (
  <AnimatePresence>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 overflow-hidden rounded-lg border bg-popover/95 backdrop-blur-sm px-4 py-3 text-sm text-popover-foreground shadow-xl",
        "data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade",
        "data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade", 
        "data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade",
        "data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade",
        className
      )}
      asChild
      {...props}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 5 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 5 }}
        transition={{
          duration: 0.1,
          ease: "easeOut"
        }}
      >
        {children}
        {showArrow && (
          <TooltipPrimitive.Arrow 
            className="fill-popover/95 drop-shadow-sm" 
            width={12} 
            height={6} 
          />
        )}
      </motion.div>
    </TooltipPrimitive.Content>
  </AnimatePresence>
))
EnhancedTooltipContent.displayName = "EnhancedTooltipContent"

export { 
  EnhancedTooltip, 
  EnhancedTooltipTrigger, 
  EnhancedTooltipContent, 
  EnhancedTooltipProvider 
}
