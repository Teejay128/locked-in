import React from "react";
import { Link, useNavigate } from "react-router-dom";

const NotFoundPage = () => {
	const navigate = useNavigate();

	return (
		<div className="hero min-h-screen bg-base-200">
			<div className="hero-content text-center">
				<div className="max-w-lg">
					{/* TODO: Replace this placeholder URL with your actual cartoon jail image.
            I've set a max-height to keep it proportional.
          */}
					<div className="mb-8 flex justify-center">
						<img
							src="https://cdn-icons-png.flaticon.com/512/755/755014.png"
							alt="Cartoon character in jail"
							className="h-64 w-auto opacity-80 hover:opacity-100 transition-opacity drop-shadow-xl"
						/>
					</div>

					<h1 className="text-5xl font-black text-base-content mb-4">
						You have been{" "}
						<span className="text-error italic font-serif">
							locked out
						</span>{" "}
						in cell 404.
					</h1>

					<p className="py-6 text-xl text-base-content/70">
						We couldn't find the page you were looking for. Looks
						like you took a wrong turn and ended up in solitary
						confinement.
					</p>

					<div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
						{/* Primary Action: Go Home */}
						<Link to="/" className="btn btn-primary btn-lg">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-5 w-5 mr-2"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
								/>
							</svg>
							Return to Safety
						</Link>

						{/* Secondary Action: Go Back History */}
						<button
							onClick={() => navigate(-1)}
							className="btn btn-outline btn-ghost btn-lg"
						>
							Go Back
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default NotFoundPage;
