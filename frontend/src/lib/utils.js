import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}


export function getAvatarFallbackText(name) {
  if(!name) return '👤';
  
  return name.split(/\s+/).map(word=>
    word[0].toUpperCase()
  ).join('')
}

export function slug(text) {
  return text
    .toString()                     // Convert to string in case of numbers
    .toLowerCase()                  // Convert to lowercase
    .trim()                         // Remove leading/trailing whitespace
    .replace(/\s+/g, '-')           // Replace spaces with hyphens
    .replace(/[^\w\-]+/g, '')       // Remove all non-word characters except hyphens
    .replace(/\-\-+/g, '-')         // Replace multiple hyphens with single hyphen
    .replace(/^-+/, '')             // Remove leading hyphens
    .replace(/-+$/, '');            // Remove trailing hyphens
}

export function timeAgo(date) {
  if (!date) return "just now"

  // If Firestore Timestamp → convert
  if (date.toDate) {
    date = date.toDate()
  }

  const now = new Date()
  const past = new Date(date)
  const seconds = Math.floor((now.getTime() - past.getTime()) / 1000)

  const units = [
    { name: "year", value: 31536000 },
    { name: "month", value: 2592000 },
    { name: "week", value: 604800 },
    { name: "day", value: 86400 },
    { name: "hour", value: 3600 },
    { name: "minute", value: 60 },
  ]

  for (const unit of units) {
    const count = Math.floor(seconds / unit.value)
    if (count >= 1) {
      return `${count} ${unit.name}${count > 1 ? "s" : ""} ago`
    }
  }

  return "just now"
}
