import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
	({ className, type, ...props }, ref) => {
		return (
			<input
				type={type}
				className={cn(
					"flex h-10 w-full rounded-lg border border-input-border bg-input-background px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:bg-input-background placeholder:text-input-placeholder",
					className
				)}
				ref={ref}
				{...props}
			/>
		);
	}
);
Input.displayName = "Input";

export { Input };
