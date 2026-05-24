import React from "react";
import { Link } from "react-router-dom";
import WideCard from "../components/stitch/WideCard";

const LandingPage = () => {
	return (
		<div className="flex flex-col w-full gap-8">
			<WideCard padding="none" className="overflow-hidden">
				<div
					className="hero min-h-[80vh] relative"
					style={{
						// TODO: Replace this URL with your actual background image later
						backgroundImage:
							"url(https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80)",
					}}
				>
					{/* Dark Overlay to make text readable */}
					<div className="hero-overlay bg-opacity-70"></div>

					<div className="hero-content text-center text-neutral-content py-16">
						<div className="max-w-2xl relative z-10">
							<h1 className="mb-5 text-6xl md:text-8xl font-black font-headline leading-[0.9] tracking-tighter text-white">
								"You just need to <br />
								<span className="bg-primary text-white px-2 rounded-lg mt-2 inline-block">
									Lock In.
								</span>
								"
							</h1>
							<p className="mb-8 text-xl md:text-2xl font-medium text-gray-200">
								Consistency is the only algorithm that matters.
								Track your progress, build your streak, and
								showcase your journey.
							</p>
							<Link
								to="/register"
								className="bg-primary text-on-primary-container text-2xl md:text-3xl px-10 py-5 border-2 border-primary neo-shadow-lg font-black active-press uppercase font-headline rounded-xl inline-block"
							>
								Get Started
							</Link>
						</div>
					</div>
				</div>
			</WideCard>

			<WideCard>
				<div className="max-w-4xl mx-auto">
					<h2 className="text-4xl md:text-6xl font-black font-headline mb-6">
						More Than Just a Journal
					</h2>
					<p className="text-xl md:text-2xl font-medium mb-12">
						Locked In is designed for developers who want to
						maintain momentum. We help you document your wins, learn
						from your bugs, and visualize your growth over time.
					</p>

					{/* CAROUSEL PLACEHOLDER */}
					<div className="w-full h-64 md:h-96 bg-surface-container rounded-xl flex items-center justify-center border-4 border-primary neo-shadow mb-12">
						<span className="font-label font-bold tracking-widest uppercase opacity-60">
							[ Infographic Carousel Area ]
						</span>
					</div>

					<Link
						to="/register"
						className="inline-block bg-primary text-on-primary-container text-xl px-8 py-4 border-2 border-primary neo-shadow-lg font-black active-press uppercase font-headline rounded-xl"
					>
						Start Your Streak
					</Link>
				</div>
			</WideCard>

			<WideCard>
				<div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
					{/* Text Content */}
					<div>
						<div className="inline-block border-2 border-primary px-4 py-2 bg-surface-container-low font-label font-bold rounded-lg mb-6 uppercase text-sm">
							Free Tool
						</div>
						<h2 className="text-4xl md:text-6xl font-black font-headline mb-6 leading-tight">
							Turn "I coded" into Content.
						</h2>
						<p className="mb-8 text-xl font-medium">
							Struggling to write your daily update on X or
							LinkedIn? Our <strong>AI Post Generator</strong>{" "}
							takes your rough notes and turns them into engaging
							social media posts instantly.
						</p>

						<div className="flex items-center gap-4 bg-surface-container border-2 border-primary p-4 rounded-xl mb-8 font-label">
							<span
								className="material-symbols-outlined text-primary text-2xl"
								data-icon="info"
							>
								info
							</span>
							<span className="font-bold">
								No sign-up required. Just use it.
							</span>
						</div>

						<Link
							to="/tools"
							className="inline-block bg-surface-container-lowest text-primary text-xl px-8 py-4 border-4 border-primary neo-shadow font-black active-press uppercase font-headline rounded-xl"
						>
							Try It Out Now
						</Link>
					</div>

					{/* Visual / Icon Representation */}
					<div className="bg-surface-container-lowest border-4 border-primary neo-shadow-lg p-6 rounded-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
						<h3 className="font-headline font-black text-2xl mb-2 text-primary uppercase">
							Input:
						</h3>
						<div className="bg-surface-container p-4 border-2 border-primary rounded-xl text-sm font-mono opacity-80 mb-6">
							"Fixed a bug in the auth system and learned about
							Firebase triggers."
						</div>
						<h3 className="font-headline font-black text-2xl mb-2 text-primary uppercase">
							Output:
						</h3>
						<div className="bg-surface-container-low p-4 border-2 border-primary rounded-xl text-base font-body font-medium">
							"🐛 Just squashed a major bug! Deep dived into
							Firebase triggers today and learned so much about
							event-driven architecture. The journey continues! 🚀
							#100DaysOfCode"
						</div>
					</div>
				</div>
			</WideCard>

			{/* Developer Section moved to OpenLayout footer */}
		</div>
	);
};

export default LandingPage;
