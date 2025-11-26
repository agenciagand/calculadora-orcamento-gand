import { cn } from "@/lib/utils";
import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Card({ className, ...props }: CardProps) {
    return (
        <div
            className={cn(
                "rounded-xl border border-gray-800 bg-gray-900/50 p-6 shadow-lg backdrop-blur-sm transition-all hover:border-gray-700",
                className
            )}
            {...props}
        />
    );
}
