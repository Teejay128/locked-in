import React from "react";
import { Link } from "react-router-dom";
import TinyButton from "./stitch/TinyButton";

const Footer = ({ hideCta = false }) => {
	return (
		<div className="w-full mt-auto pt-12 pb-8">
			<section className="bg-primary text-white border-4 border-primary neo-shadow-lg p-12 md:p-20 text-center rounded-2xl">
				{!hideCta && (
					<>
						<h2 className="text-4xl md:text-6xl font-black font-headline uppercase leading-none tracking-tighter mb-8">
							You just need to
						</h2>
						<Link
							to="/login"
							className="btn-dark neo-btn text-xl md:text-2xl px-10 py-5 mb-12"
						>
							Lock-in
						</Link>
					</>
				)}
				<footer className={`flex flex-col gap-12 text-left w-full ${!hideCta ? "pt-12 border-t border-white/20" : ""}`}>
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
						{/* Section 1: Resources & Company */}
						<div className="grid grid-cols-2 gap-8">
							<div className="space-y-4">
								<h5 className="font-black font-headline text-xl">
									RESOURCES
								</h5>
								<div className="flex flex-col gap-2 font-label text-sm">
									<Link className="hover:underline" to="#">
										Documentation
									</Link>
									<Link className="hover:underline" to="#">
										SDK Reference
									</Link>
									<Link className="hover:underline" to="#">
										Changelog
									</Link>
								</div>
							</div>
							<div className="space-y-4">
								<h5 className="font-black font-headline text-xl">
									COMPANY
								</h5>
								<div className="flex flex-col gap-2 font-label text-sm">
									<Link className="hover:underline" to="#">
										Pricing
									</Link>
									<Link className="hover:underline" to="#">
										Legal &amp; Privacy
									</Link>
									<Link className="hover:underline" to="#">
										Contact
									</Link>
								</div>
							</div>
						</div>

						{/* Section 2: About Developer & Socials (80/20) */}
						<div className="grid grid-cols-1 md:grid-cols-6 gap-8">
							<div className="md:col-span-4">
								<h5 className="font-black font-headline text-xl mb-4">
									ABOUT DEVELOPER
								</h5>
								<p className="text-sm font-medium opacity-90 max-w-2xl">
									I built Locked In because I needed a better way to track my own progress.
									<br />
									Open source and built with
									<span
										className="material-symbols-outlined text-error align-middle mx-1"
										style={{
											fontVariationSettings: '"FILL" 1',
										}}
									>
										favorite
									</span>
									in Lagos.
								</p>
							</div>

							<div className="md:col-span-2 flex flex-col gap-3">
								<a
									href="https://github.com/your-username"
									target="_blank"
									rel="noopener noreferrer"
									className="w-full"
								>
									<TinyButton
										text="GitHub"
										icon="code"
										className="w-full text-on-background hover:text-primary"
									/>
								</a>
								<a
									href="https://twitter.com/your-handle"
									target="_blank"
									rel="noopener noreferrer"
									className="w-full"
								>
									<TinyButton
										text="Twitter"
										icon="tag"
										className="w-full text-on-background hover:text-primary"
									/>
								</a>
							</div>
						</div>
					</div>

					{/* Section 3: Copyright */}
					<p className="text-white/60 font-label text-xs uppercase text-center mt-4">
						© 2026 ARIBAD TECHNOLOGIES
					</p>
				</footer>
			</section>
		</div>
	);
};

export default Footer;
