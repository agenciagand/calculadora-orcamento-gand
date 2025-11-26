import { cn } from "@/lib/utils";
import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, icon, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="mb-2 block text-sm font-medium text-gray-300">
                        {label}
                    </label>
                )}
                <div className="relative">
                    {icon && (
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                            {icon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        className={cn(
                            "block w-full rounded-lg border border-gray-700 bg-gray-800 p-2.5 text-white placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none transition-colors",
                            icon && "pl-10",
                            className
                        )}
                        {...props}
                    />
                </div>
            </div>
        );
    }
);
Input.displayName = "Input";
