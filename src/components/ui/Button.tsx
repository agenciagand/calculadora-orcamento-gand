import { cn } from "@/lib/utils";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost";
    size?: "sm" | "md" | "lg";
}

export function Button({
    className,
    variant = "primary",
    size = "md",
    ...props
}: ButtonProps) {
    const variants = {
        primary: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg",
        secondary: "bg-emerald-500 text-white hover:bg-emerald-600 shadow-md hover:shadow-lg",
        outline: "border border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white",
        ghost: "text-gray-400 hover:text-white hover:bg-gray-800/50",
    };

    const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2",
        lg: "px-6 py-3 text-lg",
    };

    return (
        <button
            className={cn(
                "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95",
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        />
    );
}
