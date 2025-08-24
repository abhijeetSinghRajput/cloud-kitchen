import { Triangle } from "lucide-react"

export const Veg = ()=>{
    return (
        <div className="flex items-center justify-center size-4 bg-green-200 border-2 rounded border-green-600">
            <div className="rounded-full size-2/3 bg-green-600"/>
        </div>
    )
}

export const NonVeg = ()=>{
    return (
        <div className="flex items-center justify-center size-4 bg-red-200 border-2 rounded border-red-600">
            <Triangle className="size-2/3 fill-red-600 stroke-red-600"/>
        </div>
    )
}