import React from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
	return (
		<div className="flex flex-col w-full">
			{/* ==============================
          1. HERO SECTION
      ============================== */}
			<div
				className="hero min-h-[80vh] bg-base-200 relative"
				style={{
					// TODO: Replace this URL with your actual background image later
					backgroundImage:
						"url(https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80)",
				}}
			>
				{/* Dark Overlay to make text readable */}
				<div className="hero-overlay bg-opacity-70"></div>

				<div className="hero-content text-center text-neutral-content">
					<div className="max-w-2xl">
						<h1 className="mb-5 text-5xl font-black tracking-tight text-white">
							"You just need to{" "}
							<span className="text-primary">Lock In.</span>"
						</h1>
						<p className="mb-8 text-xl font-light text-gray-200">
							Consistency is the only algorithm that matters.
							Track your progress, build your streak, and showcase
							your journey.
						</p>
						<Link
							to="/register"
							className="btn btn-primary btn-lg border-none shadow-xl hover:scale-105 transition-transform"
						>
							Get Started
						</Link>
					</div>
				</div>
			</div>

			{/* ==============================
          2. APP DESCRIPTION (Carousel Placeholder)
      ============================== */}
			<section className="py-20 px-6 bg-base-100 text-center">
				<div className="max-w-4xl mx-auto">
					<h2 className="text-4xl font-bold mb-6 text-base-content">
						More Than Just a Journal
					</h2>
					<p className="text-lg text-base-content/70 mb-12">
						Locked In is designed for developers who want to
						maintain momentum. We help you document your wins, learn
						from your bugs, and visualize your growth over time.
					</p>

					{/* CAROUSEL PLACEHOLDER */}
					<div className="w-full h-64 md:h-96 bg-base-300 rounded-box flex items-center justify-center border-2 border-dashed border-base-content/20 mb-12">
						<span className="text-base-content/40 font-semibold tracking-widest uppercase">
							[ Infographic Carousel Area ]
						</span>
					</div>

					<Link
						to="/register"
						className="btn btn-outline btn-primary px-10"
					>
						Start Your Streak
					</Link>
				</div>
			</section>

			{/* ==============================
          3. QUICK TOOLS TEASER
      ============================== */}
			<section className="py-20 px-6 bg-neutral text-neutral-content">
				<div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
					{/* Text Content */}
					<div>
						<div className="badge badge-accent badge-outline mb-4">
							Free Tool
						</div>
						<h2 className="text-4xl font-bold mb-4 text-white">
							Turn "I coded" into Content.
						</h2>
						<p className="mb-6 text-gray-300">
							Struggling to write your daily update on X or
							LinkedIn? Our <strong>AI Post Generator</strong>{" "}
							takes your rough notes and turns them into engaging
							social media posts instantly.
						</p>

						<div className="alert alert-info bg-opacity-20 border-none text-blue-200 mb-8 text-sm">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								className="stroke-current shrink-0 w-6 h-6"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								></path>
							</svg>
							<span>No sign-up required. Just use it.</span>
						</div>

						<Link
							to="/quick-tools"
							className="btn btn-accent text-neutral-900 font-bold"
						>
							Try It Out Now
						</Link>
					</div>

					{/* Visual / Icon Representation */}
					<div className="card bg-base-100 text-base-content shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
						<div className="card-body">
							<h3 className="card-title text-primary">Input:</h3>
							<div className="bg-base-200 p-3 rounded-md text-sm font-mono opacity-70 mb-4">
								"Fixed a bug in the auth system and learned
								about Firebase triggers."
							</div>
							<h3 className="card-title text-accent">Output:</h3>
							<div className="bg-base-200 p-3 rounded-md text-sm">
								"🐛 Just squashed a major bug! Deep dived into
								Firebase triggers today and learned so much
								about event-driven architecture. The journey
								continues! 🚀 #100DaysOfCode"
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* ==============================
          4. ABOUT / DEVELOPER SECTION
      ============================== */}
			<section className="py-16 px-6 bg-base-200">
				<div className="max-w-2xl mx-auto text-center">
					<h2 className="text-3xl font-bold mb-4">Built by Aribad</h2>
					<p className="text-base-content/70 mb-8">
						I built Locked In because I needed a better way to track
						my own progress as a student and developer. Open source
						and built with love in Lagos.
					</p>

					<div className="flex justify-center gap-4">
						{/* GitHub Button */}
						<a
							href="https://github.com/your-username"
							target="_blank"
							rel="noopener noreferrer"
							className="btn btn-circle btn-ghost text-2xl"
						>
							<i className="fa-brands fa-github"></i>{" "}
							{/* Make sure you have FontAwesome or use an SVG here */}
							<svg
								viewBox="0 0 24 24"
								className="w-6 h-6 fill-current"
							>
								<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
							</svg>
						</a>

						{/* Twitter/X Button */}
						<a
							href="https://twitter.com/your-handle"
							target="_blank"
							rel="noopener noreferrer"
							className="btn btn-circle btn-ghost text-2xl"
						>
							<svg
								viewBox="0 0 24 24"
								className="w-5 h-5 fill-current"
							>
								<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
							</svg>
						</a>
					</div>
				</div>
			</section>
		</div>
	);
};

export default LandingPage;
