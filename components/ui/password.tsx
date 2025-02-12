"use client";

import * as React from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const PasswordInput = React.forwardRef<
	HTMLInputElement,
	React.ComponentProps<"input">
>(({ className, ...props }, ref) => {
	const [showPassword, setShowPassword] = React.useState(false);
	const disabled =
		props.value === "" || props.value === undefined || props.disabled;

	return (
		<div className="relative w-full">
			<Input
				type={showPassword ? "text" : "password"}
				className={cn(
					"flex h-10 w-full rounded border border-input-border bg-input-background px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:bg-input-background placeholder:text-input-placeholder",
					className
				)}
				ref={ref}
				{...props}
			/>
			<Button
				type="button"
				variant="ghost"
				size="sm"
				className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
				onClick={() => setShowPassword((prev) => !prev)}
				disabled={disabled}
			>
				{showPassword && !disabled ? (
					<EyeIcon className="h-[14px] w-[14px]" aria-hidden="true" />
				) : (
					<EyeOffIcon className="h-[14px] w-[14px]" aria-hidden="true" />
				)}
				<span className="sr-only">
					{showPassword ? "Hide password" : "Show password"}
				</span>
			</Button>

			{/* hides browsers password toggles */}
			<style>{`
					.hide-password-toggle::-ms-reveal,
					.hide-password-toggle::-ms-clear {
						visibility: hidden;
						pointer-events: none;
						display: none;
					}
				`}</style>
		</div>
	);
});
PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
