import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

const SignInPage = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false); // Added loading state for better UX
	const navigate = useNavigate();

	const handleSignIn = async (e) => {
		e.preventDefault();
		setError(null);
		setLoading(true);

		try {
			await signInWithEmailAndPassword(auth, email, password);
			// Determine where to redirect (could be dashboard or back to previous page)
			navigate("/app/dashboard");
		} catch (error) {
			console.log(error);
			setError("Invalid email or password."); // clearer error message
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-base-200 flex items-center justify-center relative px-4">
			{/* Back to Home Button (Top Left) */}
			<Link to="/" className="absolute top-8 left-8 btn btn-ghost gap-2">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-4 w-4"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
						d="M10 19l-7-7m0 0l7-7m-7 7h18"
					/>
				</svg>
				Back to Home
			</Link>

			<div className="card w-full max-w-md shadow-2xl bg-base-100">
				<div className="card-body">
					<div className="text-center mb-6">
						<h2 className="text-3xl font-bold text-primary">
							Welcome Back
						</h2>
						<p className="text-base-content/60">
							Enter your details to access your dashboard
						</p>
					</div>

					<form onSubmit={handleSignIn} className="space-y-4">
						{/* Error Alert */}
						{error && (
							<div className="alert alert-error text-sm py-2">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="stroke-current shrink-0 h-6 w-6"
									fill="none"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
								<span>{error}</span>
							</div>
						)}

						{/* Email Input */}
						<div className="form-control">
							<label className="label">
								<span className="label-text">Email</span>
							</label>
							<input
								type="email"
								placeholder="name@example.com"
								className="input input-bordered w-full"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
						</div>

						{/* Password Input */}
						<div className="form-control">
							<label className="label">
								<span className="label-text">Password</span>
							</label>
							<input
								type="password"
								placeholder="••••••••"
								className="input input-bordered w-full"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
							<label className="label">
								<a
									href="#"
									className="label-text-alt link link-hover"
								>
									Forgot password?
								</a>
							</label>
						</div>

						{/* Submit Button */}
						<div className="form-control mt-6">
							<button
								type="submit"
								className={`btn btn-primary w-full ${loading ? "loading" : ""}`}
								disabled={loading}
							>
								{loading ? "Signing in..." : "Sign In"}
							</button>
						</div>
					</form>

					{/* Divider */}
					<div className="divider text-xs uppercase text-base-content/50 font-bold">
						Or continue with
					</div>

					{/* Google Button (Disabled) */}
					<button className="btn btn-outline w-full gap-2" disabled>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 48 48"
							className="w-5 h-5"
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
						Sign in with Google
					</button>

					<p className="text-center mt-4 text-sm">
						Don't have an account?{" "}
						<Link
							to="/register"
							className="link link-primary no-underline hover:underline font-bold"
						>
							Register
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
};

export default SignInPage;
