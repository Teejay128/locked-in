import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

const RegisterPage = () => {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
		confirmPassword: "",
	});
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.id]: e.target.value });
	};

	const handleRegister = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		if (formData.password !== formData.confirmPassword) {
			setError("Passwords do not match");
			setLoading(false);
			return;
		}

		try {
			await createUserWithEmailAndPassword(
				auth,
				formData.email,
				formData.password,
			);
			// Navigate to the protected app layout
			navigate("/app/dashboard");
		} catch (err) {
			// Clean up Firebase error messages for the user
			const message = err.message
				.replace("Firebase: ", "")
				.replace("auth/", "");
			setError(message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-base-200 flex items-center justify-center relative px-4">
			{/* Back to Home Button */}
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
							Create Account
						</h2>
						<p className="text-base-content/60">
							Start your streak today
						</p>
					</div>

					<form onSubmit={handleRegister} className="space-y-4">
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
								id="email"
								placeholder="name@example.com"
								className="input input-bordered w-full"
								value={formData.email}
								onChange={handleChange}
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
								id="password"
								placeholder="Create a password"
								className="input input-bordered w-full"
								value={formData.password}
								onChange={handleChange}
								required
							/>
						</div>

						{/* Confirm Password Input */}
						<div className="form-control">
							<label className="label">
								<span className="label-text">
									Confirm Password
								</span>
							</label>
							<input
								type="password"
								id="confirmPassword"
								placeholder="Confirm password"
								className="input input-bordered w-full"
								value={formData.confirmPassword}
								onChange={handleChange}
								required
							/>
						</div>

						{/* Submit Button */}
						<div className="form-control mt-6">
							<button
								type="submit"
								className={`btn btn-primary ${loading ? "loading" : ""}`}
								disabled={loading}
							>
								{loading ? "Creating Account..." : "Register"}
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
						Sign up with Google
					</button>

					<p className="text-center mt-4 text-sm">
						Already have an account?{" "}
						<Link
							to="/login"
							className="link link-primary no-underline hover:underline font-bold"
						>
							Sign In
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
};

export default RegisterPage;
