import React, { useState } from "react";
import { Link } from "react-router-dom";
import Card from "../components/stitch/Card";
import PopButton from "../components/stitch/PopButton";

const apiUrl = import.meta.env.VITE_API_URL;

function QuickTools() {
	// State for Tool #1: Social Generator
	const [socialInput, setSocialInput] = useState("");
	const [socialResult, setSocialResult] = useState(null);
	const [socialLoading, setSocialLoading] = useState(false);
	const [socialError, setSocialError] = useState(null);

	const handleSocialSubmit = async (e) => {
		e.preventDefault();
		if (!socialInput.trim()) return;

		setSocialLoading(true);
		setSocialError(null);
		setSocialResult(null);

		try {
			const response = await fetch(`${apiUrl}/tools/social`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ content: socialInput }),
			});

			const data = await response.json();
			if (data.success) {
				setSocialResult(data.social);
			} else {
				throw new Error(data.error || "Failed to generate content.");
			}
		} catch (err) {
			console.log(err);
			setSocialError(
				"Could not connect to the AI engine. Please try again.",
			);
		} finally {
			setSocialLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-base-200 font-sans">
			{/* ==============================
          1. PAGE HEADER
      ============================== */}
			<div className="bg-base-100 py-16 px-6 text-center shadow-sm">
				<div className="max-w-3xl mx-auto">
					<h1 className="text-4xl font-black text-primary mb-4">
						Dev Utility Belt 🛠️
					</h1>
					<p className="text-xl text-base-content/70">
						A collection of free AI tools to speed up your workflow.
						<span className="font-bold text-base-content block mt-1">
							No signup required. No limits.
						</span>
					</p>
				</div>
			</div>

			<div className="max-w-7xl mx-auto px-6 py-12 space-y-24">
				{/* ==============================
            TOOL #1: SOCIAL POST GENERATOR
        ============================== */}
				<section
					id="social-generator"
					className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start"
				>
					{/* LEFT COLUMN: Input & Description */}
					<div className="space-y-6">
						<div>
							<div className="badge badge-secondary border-secondary text-secondary font-label font-bold text-xs uppercase px-2 py-1 rounded mb-2 inline-block">
								Content Creation
							</div>
							<h2 className="text-3xl font-headline font-black uppercase text-primary mb-3">
								Social Post Generator
							</h2>
							<p className="text-base-content/70 text-lg leading-relaxed font-body">
								Don't let your coding sessions go unnoticed.
								Paste your rough notes, commit messages, or
								thoughts here, and we'll craft the perfect{" "}
								<strong>Twitter</strong> and{" "}
								<strong>LinkedIn</strong> updates for you.
							</p>
						</div>

						<form onSubmit={handleSocialSubmit}>
							<Card variant="container" className="bg-surface-container-lowest">
								<label className="label font-label font-bold text-xs uppercase tracking-wider text-base-content/50 mb-2 block">
									Your Rough Notes
								</label>
								<textarea
									className="neo-input w-full h-48 text-lg resize-none font-body"
									placeholder="e.g., Struggled with React Context today but finally fixed the re-rendering issue..."
									value={socialInput}
									onChange={(e) =>
										setSocialInput(e.target.value)
									}
									maxLength={500}
								></textarea>

								{socialError && (
									<p className="text-error text-sm mt-2 font-label font-bold">
										{socialError}
									</p>
								)}

								<div className="flex justify-between items-center mt-4">
									<span
										className={`text-xs font-label font-bold ${socialInput.length > 450 ? "text-error" : "text-base-content/40"}`}
									>
										{socialInput.length}/500 chars
									</span>
									<PopButton
										type="submit"
										variant="primary"
										className="py-2 px-6"
										disabled={socialLoading || !socialInput.trim()}
										shadow="md"
									>
										{socialLoading ? "Generating..." : "Generate Posts"}
									</PopButton>
								</div>
							</Card>
						</form>
					</div>

					{/* RIGHT COLUMN: Visuals OR Results */}
					<div className="relative w-full">
						{/* STATE A: INFOGRAPHIC (Show when no result yet) */}
						{!socialResult && !socialLoading && (
							<Card variant="naked" className="border-dashed bg-surface-container-lowest p-8 h-full flex flex-col items-center justify-center text-center opacity-70 min-h-[300px]">
								{/* Simple CSS Graphic Placeholder */}
								<div className="flex items-center gap-4 mb-6">
									<div className="w-16 h-20 bg-base-300 rounded-lg animate-pulse"></div>
									<svg
										className="w-8 h-8 text-base-content/30"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M17 8l4 4m0 0l-4 4m4-4H3"
										/>
									</svg>
									<div className="w-16 h-20 bg-primary/20 rounded-lg"></div>
								</div>
								<h3 className="font-headline font-black text-lg text-primary uppercase">
									How it works
								</h3>
								<p className="text-sm font-body text-base-content/50 max-w-xs mt-2">
									1. Paste your "brain dump"
									<br />
									2. AI structures the narrative
									<br />
									3. Get formatted posts instantly
								</p>
							</Card>
						)}

						{/* STATE B: LOADING SKELETON */}
						{socialLoading && (
							<div className="space-y-4">
								<div className="h-40 bg-base-300 rounded-xl animate-pulse"></div>
								<div className="h-40 bg-base-300 rounded-xl animate-pulse delay-75"></div>
							</div>
						)}

						{/* STATE C: RESULTS */}
						{socialResult && (
							<div className="space-y-6 animate-fade-in-up">
								{/* Twitter Result */}
								<Card variant="naked" className="bg-white border-l-4 border-[#1DA1F2] text-gray-800">
									<h3 className="font-headline font-black text-[#1DA1F2] flex items-center gap-2 text-sm uppercase tracking-wide border-b border-[#1DA1F2]/20 pb-2">
										<svg
											className="w-4 h-4"
											fill="currentColor"
											viewBox="0 0 24 24"
										>
											<path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
										</svg>
										Twitter
									</h3>
									<p className="text-sm font-body whitespace-pre-wrap mt-3">
										{socialResult.twitter.text}
									</p>
									<div className="flex justify-end mt-4">
										<a
											href={socialResult.twitter.link}
											target="_blank"
											rel="noreferrer"
										>
											<PopButton className="py-1.5 px-4 text-xs" shadow="sm">
												Tweet This
											</PopButton>
										</a>
									</div>
								</Card>

								{/* LinkedIn Result */}
								<Card variant="naked" className="bg-white border-l-4 border-[#0A66C2] text-gray-800">
									<h3 className="font-headline font-black text-[#0A66C2] flex items-center gap-2 text-sm uppercase tracking-wide border-b border-[#0A66C2]/20 pb-2">
										<svg
											className="w-4 h-4"
											fill="currentColor"
											viewBox="0 0 24 24"
										>
											<path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
										</svg>
										LinkedIn
									</h3>
									<p className="text-sm font-body whitespace-pre-wrap mt-3">
										{socialResult.linkedin.text}
									</p>
									<div className="flex justify-end mt-4">
										<a
											href={socialResult.linkedin.link}
											target="_blank"
											rel="noreferrer"
										>
											<PopButton variant="primary" className="py-1.5 px-4 text-xs" shadow="sm">
												Post This
											</PopButton>
										</a>
									</div>
								</Card>

								<div className="text-center">
									<PopButton
										onClick={() => setSocialResult(null)}
										className="py-1.5 px-4 text-xs bg-transparent border-transparent hover:bg-surface-container-low shadow-none hover:shadow-none hover:translate-x-0 hover:translate-y-0 active:translate-x-0 active:translate-y-0"
									>
										Clear & Start Over
									</PopButton>
								</div>
							</div>
						)}
					</div>
				</section>

				{/* ==============================
            TOOL #2: COMING SOON PLACEHOLDER
            (To show scalability)
        ============================== */}
				<section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center opacity-50 grayscale hover:grayscale-0 transition-all duration-500 cursor-not-allowed">
					<div className="space-y-6">
						<div className="badge badge-ghost border-primary text-primary font-label font-bold text-xs uppercase px-2 py-1 rounded mb-2 inline-block">
							Coming Soon
						</div>
						<h2 className="text-3xl font-headline font-black uppercase text-primary mb-3">
							Commit Message Beautifier
						</h2>
						<p className="text-base-content/70 text-lg font-body">
							Turn "fixed stuff" into professional, semantic
							commit messages instantly.
						</p>
					</div>
					<Card variant="naked" className="h-64 border-dashed bg-surface-container-low flex items-center justify-center">
						<span className="font-headline font-black text-2xl text-primary/20 uppercase">
							Coming Soon
						</span>
					</Card>
				</section>
			</div>

			{/* ==============================
          3. UPSELL / PROMOTIONAL FOOTER
      ============================== */}
			<div className="bg-neutral text-neutral-content py-16 mt-12 border-t-4 border-primary">
				<div className="max-w-4xl mx-auto px-6 text-center">
					<h2 className="text-3xl font-headline font-black uppercase mb-6 text-white tracking-tighter">
						Need to save your history?
					</h2>
					<p className="text-lg font-body text-gray-300 mb-8 max-w-2xl mx-auto">
						These tools are free forever, but your data disappears
						when you refresh. Create a free account to{" "}
						<strong>save your generated posts</strong>,{" "}
						<strong>track your coding streak</strong>, and unlock
						the full developer journal.
					</p>

					<div className="flex flex-col sm:flex-row gap-6 justify-center">
						<Link to="/register">
							<PopButton variant="primary" className="py-4 px-8 text-lg w-full sm:w-auto" shadow="md">
								Create Free Account
							</PopButton>
						</Link>
						<Link to="/login">
							<PopButton className="py-4 px-8 text-lg w-full sm:w-auto" shadow="md">
								Sign In
							</PopButton>
						</Link>
					</div>

					<div className="mt-8">
						<Link
							to="/"
							className="link link-hover text-sm text-gray-500"
						>
							Back to Landing Page
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}

export default QuickTools;
