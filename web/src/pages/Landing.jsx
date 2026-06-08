import React from "react";
import { Link } from "react-router-dom";
import Card from "../components/stitch/Card";

const LandingPage = () => {
	return (
		<div className="flex flex-col w-full gap-16 md:gap-24">
			{/* 1. HERO SECTION */}
			<section className="bg-primary text-white p-12 md:p-24 text-center rounded-2xl relative overflow-hidden flex items-center justify-center min-h-[75vh]">
				{/* Dark Overlay */}
				<div className="absolute inset-0 bg-black/40 z-0"></div>
				{/* Image background */}
				<div 
					className="absolute inset-0 bg-cover bg-center z-0 opacity-45"
					style={{
						backgroundImage: "url(https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80)"
					}}
				></div>

				<div className="max-w-2xl relative z-10">
					<h1 className="mb-5 text-6xl md:text-8xl font-black font-headline leading-[0.9] tracking-tighter text-white">
						"You just need to <br />
						<span className="bg-surface-container-lowest text-primary px-2 rounded-lg mt-2 inline-block">
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
						className="btn-dark neo-btn text-xl md:text-2xl px-10 py-5"
					>
						Get Started
					</Link>
				</div>
			</section>

			{/* 2. VALUE PROP SECTION */}
			<section className="w-full flex flex-col items-center text-center max-w-4xl mx-auto py-8">
				<h2 className="text-4xl md:text-6xl font-black font-headline mb-6 uppercase tracking-tight text-primary">
					More Than Just a Journal
				</h2>
				<p className="text-xl md:text-2xl font-medium mb-12 text-on-surface/80">
					Locked In is designed for developers who want to
					maintain momentum. We help you document your wins, learn
					from your bugs, and visualize your growth over time.
				</p>

				{/* Infographic Area as a card-container */}
				<Card variant="container" padding="large" className="w-full mb-12">
					<div className="w-full h-48 md:h-64 flex items-center justify-center">
						<span className="font-label font-bold tracking-widest uppercase opacity-60">
							[ Infographic Carousel Area ]
						</span>
					</div>
				</Card>

				<Link
					to="/register"
					className="btn-dark neo-btn text-lg px-8 py-4"
				>
					Start Your Streak
				</Link>
			</section>

			{/* 3. FREE AI TOOL PROMO */}
			<section className="w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-8">
				{/* Text Content */}
				<div>
					<div className="inline-block border border-primary px-4 py-2 bg-surface-container-lowest font-label font-bold rounded-lg mb-6 uppercase text-sm">
						Free Tool
					</div>
					<h2 className="text-4xl md:text-6xl font-black font-headline mb-6 leading-tight text-primary uppercase">
						Turn "I coded" into Content.
					</h2>
					<p className="mb-8 text-xl font-medium text-on-surface/80">
						Struggling to write your daily update on X or
						LinkedIn? Our <strong>AI Post Generator</strong>{" "}
						takes your rough notes and turns them into engaging
						social media posts instantly.
					</p>

					<Card variant="naked" padding="small" className="mb-8 font-label flex items-center gap-3">
						<span className="material-symbols-outlined text-primary text-2xl">
							info
						</span>
						<span className="font-bold">
							No sign-up required. Just use it.
						</span>
					</Card>

					<Link
						to="/tools"
						className="btn-dark neo-btn text-lg px-8 py-4"
					>
						Try It Out Now
					</Link>
				</div>

				{/* Visual Representation Card (popping card) */}
				<Card className="rotate-2 hover:rotate-0 transition-all duration-500">
					<h3 className="font-headline font-black text-2xl mb-2 text-primary uppercase">
						Input:
					</h3>
					<div className="border border-primary/20 bg-background/50 rounded-lg p-3 mb-6 font-mono text-sm">
						"Fixed a bug in the auth system and learned about Firebase triggers."
					</div>
					<h3 className="font-headline font-black text-2xl mb-2 text-primary uppercase">
						Output:
					</h3>
					<div className="border border-primary/20 bg-background/50 rounded-lg p-3 font-mono text-sm">
						"🐛 Just squashed a major bug! Deep dived into Firebase triggers today and learned so much about event-driven architecture. The journey continues! 🚀 #100DaysOfCode"
					</div>
				</Card>
			</section>
		</div>
	);
};

export default LandingPage;

