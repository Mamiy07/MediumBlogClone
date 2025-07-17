import type React from "react"

interface CardProps {
  children: React.ReactNode
  className?: string
}

export function Card({ children, className = "" }: CardProps) {
  const classes = `rounded-lg border bg-white shadow-sm ${className}`
  return <div className={classes}>{children}</div>
}

export function CardHeader({ children, className = "" }: CardProps) {
  const classes = `flex flex-col space-y-1.5 p-6 ${className}`
  return <div className={classes}>{children}</div>
}

export function CardTitle({ children, className = "" }: CardProps) {
  const classes = `text-2xl font-semibold leading-none tracking-tight ${className}`
  return <h3 className={classes}>{children}</h3>
}

export function CardDescription({ children, className = "" }: CardProps) {
  const classes = `text-sm text-gray-600 ${className}`
  return <p className={classes}>{children}</p>
}

export function CardContent({ children, className = "" }: CardProps) {
  const classes = `p-6 pt-0 ${className}`
  return <div className={classes}>{children}</div>
}

export function CardFooter({ children, className = "" }: CardProps) {
  const classes = `flex items-center p-6 pt-0 ${className}`
  return <div className={classes}>{children}</div>
}
