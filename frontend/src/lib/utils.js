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
