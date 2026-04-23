import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

const LockIn = ({ defaultIsRegister = false }) => {
	const [isRegister, setIsRegister] = useState(defaultIsRegister);
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const toggleMode = () => {
		setIsRegister(!isRegister);
		setError(null);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(null);
		setLoading(true);

		try {
			if (isRegister) {
				const userCredential = await createUserWithEmailAndPassword(auth, email, password);
				if (name) {
					await updateProfile(userCredential.user, { displayName: name });
				}
				navigate("/app/dashboard");
			} else {
				await signInWithEmailAndPassword(auth, email, password);
				navigate("/app/dashboard");
			}
		} catch (err) {
			console.log(err);
			const message = err.message
				.replace("Firebase: ", "")
				.replace("auth/", "");
			setError(message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="bg-surface h-screen w-screen overflow-hidden font-body flex flex-col items-center justify-center p-4 relative z-0 text-on-background">
			{/* Decorative Elements (Neo-Brutalism Flair) */}
			<div className="absolute top-12 left-12 w-24 h-24 border-4 border-primary -z-10 opacity-20 hidden lg:block"></div>
			<div className="absolute bottom-12 right-12 w-48 h-12 bg-primary -z-10 opacity-10 rotate-12 hidden lg:block"></div>
			<div className="absolute top-1/2 left-4 w-2 h-32 bg-error -z-10 hidden xl:block"></div>

			{/* Background texture simulation */}
			<div className="absolute inset-0 pointer-events-none -z-20 bg-[url('https://lh3.googleusercontent.com/aida-public/AB6AXuCkupORk6Z9gC9f5jZZlSvUoe5Q6THTUnKzyvxgMKq6JFW9kVDhsLjee9hhdFzQVwwlcxRe2YPLNEbXLaZ-gf_V11m_Ps1JBF2if4TdUb7Q8B45zZtlJ_NmmO2kEtQKNOrI18C1lku4MREkOjE7VXKwz7xWCKnPm4NxRomyJ0TsrkE1UGhrt83jl3io-1yraG6MnxeJCsZDCOXIqoub2Ir85qG5o6GaJn12kE6ra_aUiA-NVjY5QrOafvOu2b8l0CIvK2gUXpna6Ic')] opacity-[0.03]"></div>

			<main className="w-full max-w-md z-10 flex flex-col items-center">
				{/* Logo Anchor */}
				<div className="mb-6 text-center">
					<Link
						to="/"
						className="inline-block hover:scale-105 transition-transform"
					>
						<h1 className="text-3xl lg:text-4xl font-black italic tracking-tighter uppercase font-headline text-primary">
							LOCKED-IN
						</h1>
					</Link>
				</div>

				{/* Central Modal Card */}
				<div className="bg-surface-container-lowest border-4 border-primary rounded-xl p-6 md:p-8 neo-shadow w-full relative overflow-y-auto max-h-[80vh]">
					{/* Form */}
					<form
						className="space-y-4 md:space-y-5"
						onSubmit={handleSubmit}
					>
						{error && (
							<div className="bg-error text-on-error px-4 py-2 border-2 border-primary rounded-md font-label text-sm font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
								{error}
							</div>
						)}
						{/* Name Input (Only on Register) */}
						{isRegister && (
							<div className="relative flex flex-col group focus-within:[&>label]:-translate-y-5 focus-within:[&>label]:scale-90 focus-within:[&>label]:bg-primary focus-within:[&>label]:text-surface-container-lowest focus-within:[&>label]:px-1">
								<label
									className="absolute left-3 top-3 font-label font-bold text-sm uppercase transition-all duration-200 pointer-events-none text-on-surface-variant origin-left"
									htmlFor="name"
								>
									Full Name
								</label>
								<input
									className="w-full pt-6 pb-2 px-3 bg-surface border-4 border-primary rounded-lg font-label focus:outline-none transition-all placeholder:text-transparent focus:placeholder:text-on-surface-variant/50"
									id="name"
									placeholder="JOHN DOE"
									type="text"
									value={name}
									onChange={(e) => setName(e.target.value)}
								/>
							</div>
						)}

						{/* Email Input */}
						<div className="relative flex flex-col group focus-within:[&>label]:-translate-y-5 focus-within:[&>label]:scale-90 focus-within:[&>label]:bg-primary focus-within:[&>label]:text-surface-container-lowest focus-within:[&>label]:px-1">
							<label
								className="absolute left-3 top-3 font-label font-bold text-sm uppercase transition-all duration-200 pointer-events-none text-on-surface-variant origin-left"
								htmlFor="email"
							>
								Email Address
							</label>
							<input
								className="w-full pt-6 pb-2 px-3 bg-surface border-4 border-primary rounded-lg font-label focus:outline-none transition-all placeholder:text-transparent focus:placeholder:text-on-surface-variant/50"
								id="email"
								placeholder="REBEL@LOCKEDIN.TERMINAL"
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
						</div>

						{/* Password Input */}
						<div className="relative flex flex-col group focus-within:[&>label]:-translate-y-5 focus-within:[&>label]:scale-90 focus-within:[&>label]:bg-primary focus-within:[&>label]:text-surface-container-lowest focus-within:[&>label]:px-1">
							<label
								className="absolute left-3 top-3 font-label font-bold text-sm uppercase transition-all duration-200 pointer-events-none text-on-surface-variant origin-left"
								htmlFor="password"
							>
								Password
							</label>
							<input
								className="w-full pt-6 pb-2 px-3 bg-surface border-4 border-primary rounded-lg font-label focus:outline-none transition-all placeholder:text-transparent focus:placeholder:text-on-surface-variant/50"
								id="password"
								placeholder="••••••••••••"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
						</div>

						{/* Primary CTA */}
						<button
							className={`w-full py-1 md:py-2 bg-primary text-on-primary-container font-headline font-extrabold text-md uppercase tracking-widest border-4 border-primary rounded-lg neo-shadow active-press transition-transform ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
							type="submit"
							disabled={loading}
						>
							{loading ? (isRegister ? "REGISTERING..." : "SIGNING IN...") : (isRegister ? "REGISTER" : "SIGN IN")}
						</button>

						{/* Divider */}
						<div className="flex items-center gap-4 py-1">
							<div className="grow h-1 bg-primary/20"></div>
							<span className="font-label font-bold text-[10px] uppercase text-primary/60">
								Terminal Auth
							</span>
							<div className="grow h-1 bg-primary/20"></div>
						</div>

						{/* Secondary CTA */}
						<button
							className="w-full py-2 md:py-3 bg-surface-container-lowest text-primary font-label font-bold text-sm md:text-base uppercase flex items-center justify-center gap-3 border-4 border-primary rounded-lg neo-shadow-sm active-press transition-transform"
							type="button"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 48 48"
								className="w-5 h-5 md:w-6 md:h-6"
							>
								<path
									fill="#FFC107"
									d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
								/>
								<path
									fill="#FF3D00"
									d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
								/>
								<path
									fill="#4CAF50"
									d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
								/>
								<path
									fill="#1976D2"
									d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
								/>
							</svg>
							GOOGLE {isRegister ? "SIGNUP" : "LOGIN"}
						</button>
					</form>

					{/* Forgot Password Placeholder */}
					{!isRegister && (
						<div className="mt-5 text-center">
							<Link
								className="font-label text-sm font-bold uppercase text-primary hover:underline decoration-4 underline-offset-4"
								to="#"
							>
								Forgot password?
							</Link>
						</div>
					)}
				</div>

				{/* Footer Link */}
				<div className="mt-5 text-center">
					<p className="font-headline font-bold text-sm text-primary flex flex-col md:flex-row items-center justify-center gap-2">
						{isRegister ? "Already have an account?" : "New here?"}
						<button
							onClick={toggleMode}
							className="inline-block px-3 py-1 bg-primary text-on-primary-container hover:bg-transparent hover:text-primary border-4 border-primary font-black text-sm uppercase tracking-wide transition-colors duration-200 active-press rounded-md"
						>
							{isRegister
								? "Sign In Instead"
								: "Create an account"}
						</button>
					</p>
				</div>
			</main>
		</div>
	);
};

export default LockIn;
