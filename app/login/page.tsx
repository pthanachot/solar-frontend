"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
export const loginSchema = z.object({
	username: z.string().min(1, { message: "Username cannot be blank." }),
	password: z.string().min(1, { message: "Password cannot be blank." }),
});

export default function Login() {
	const [isLoading, setIsLoading] = useState(false);
	const [isRemember, setIsRemember] = useState(false);
	const router = useRouter();
	const form = useForm<z.infer<typeof loginSchema>>({
		resolver: zodResolver(loginSchema),
		mode: "onBlur",
		defaultValues: {
			username:
				typeof window !== "undefined"
					? localStorage.getItem("rememberUsername") ?? ""
					: "",
			password: "",
		},
	});

	async function onSubmit(values: z.infer<typeof loginSchema>) {
		try {
			setIsLoading(true);
			const res = await signIn("credentials", {
				username: values.username,
				password: values.password,
				redirect: false,
			});
			console.log("res: ", res);
			if (!res?.error) {
				router.push("/dashboard");
			} else {
				form.setError("password", {
					message: "ชื่อผู้ใช้หรือรหัสผ่านผิด โปรดลองใหม่อีกครั้ง",
				});
				form.setError("username", { message: "" });
			}
		} catch (error) {
			console.log("error: ", error);
		} finally {
			if (isRemember) {
				localStorage.setItem("rememberUsername", values.username);
			} else {
				localStorage.removeItem("rememberUsername");
			}
			setIsLoading(false);
		}
	}

	return (
		<div className="w-screen h-screen flex bg-[#5726EB]">
			<div className="flex flex-col gap-9 px-[80px] pt-[100px] w-full relative">
				<div className="flex flex-col gap-4">
					<h1 className="text-white text-4xl font-semibold">
						ยินดีต้อนรับสู่ระบบจัดการไฟฟ้าและ <br />
						อาคาร เทศบาลตำบลบ้านเพ
					</h1>
					<p className="text-white text-lg">
						จัดการพลังงานและอาคารแบบครบวงจร จัดการค่าใช้จ่าย
						และดูแลระบบไฟฟ้าภายใน
						<br />
						พื้นที่เทศบาลได้อย่างมีประสิทธิภาพ{" "}
					</p>
				</div>
				<div className="flex-1 relative flex justify-start items-start">
					<Image
						src="/login-bg.png"
						alt="login"
						fill
						className="object-left object-contain"
					/>
				</div>
			</div>
			<div className="flex flex-col bg-[#F9F9F9] w-[50%] login-shadow h-screen absolute right-0 top-0 justify-center items-center">
				<div className="flex flex-col gap-10 justify-between h-full py-[110px] w-[440px]">
					<Image src="/logo.png" alt="logo" width={202} height={40} />
					<div className="flex flex-col gap-8">
						<div className="flex flex-col gap-1">
							<h1 className="font-medium text-[28px]">
								ยินดีต้อนรับสู่ระบบจัดการอาคาร!
							</h1>
							<p className="text-subtitle">
								กรุณาเข้าสู่ระบบด้วยอีเมลและพาสเวิร์ดเพื่อใช้งาน
							</p>
						</div>
						<div className="flex flex-col gap-1">
							<Form {...form}>
								<form
									onSubmit={form.handleSubmit(onSubmit)}
									className="space-y-[26px] w-[439px]"
								>
									<FormField
										control={form.control}
										name="username"
										render={({ field }) => (
											<FormItem>
												<FormControl>
													<div className="flex flex-col gap-1">
														<div className="font-medium">ชื่อผู้ใช้งาน*</div>
														<div
															className={`flex border ${
																form.formState.errors.username
																	? "border-error"
																	: "border-input-border"
															} rounded items-center bg-white`}
														>
															<Input
																placeholder="ใส่ชื่อผู้ใช้งานของคุณ"
																{...field}
																className="border-none"
															/>
														</div>
													</div>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="password"
										render={({ field }) => (
											<FormItem>
												<FormControl>
													<div className="flex flex-col gap-1">
														<div className="font-medium">รหัสผ่าน*</div>
														<div
															className={`flex border ${
																form.formState.errors.password
																	? "border-error"
																	: "border-input-border"
															} rounded items-center bg-white`}
														>
															<PasswordInput
																placeholder="ใส่รหัสผ่านของคุณ"
																{...field}
																className="border-none"
															/>
														</div>
													</div>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<div className="flex items-center space-x-2 !mt-4">
										<Checkbox
											id="remember"
											checked={isRemember}
											onCheckedChange={() => setIsRemember(!isRemember)}
										/>
										<label
											htmlFor="remember"
											className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-subtitle"
										>
											จดจำชื่อผู้ใช้งานของฉัน
										</label>
									</div>
									<div className="flex flex-col pt-[14px] gap-[10px] justify-center items-center">
										<Button type="submit" className="w-full">
											{isLoading ? (
												<LoaderCircle className="animate-spin" />
											) : (
												"เข้าสู่ระบบ"
											)}
										</Button>
									</div>
								</form>
							</Form>
						</div>
					</div>
					<div className="flex flex-col w-full items-center gap-2">
						<div className="text-subtitle text-xs">Powered by</div>
						<Image src="/logo.png" alt="logo" width={202} height={40} />
					</div>
				</div>
			</div>
		</div>
	);
}
