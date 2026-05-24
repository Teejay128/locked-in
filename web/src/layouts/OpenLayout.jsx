import React, { useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import { auth } from "../firebase";
import TinyButton from "../components/stitch/TinyButton";

const OpenLayout = () => {
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const [user, setUser] = useState(auth.currentUser);

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((u) => {
			setUser(u);
		});
		return () => unsubscribe();
	}, []);

	return (
		<div className="bg-surface text-on-background min-h-screen pb-12 flex flex-col pt-6">
			{/* 1. Navigation Bar */}
			<header className="w-full max-w-[98%] mx-auto px-4 sticky top-0 z-50">
				<nav className="bg-surface-container-lowest border-2 border-primary neo-shadow p-3 md:px-6 md:py-3 flex flex-row justify-between items-center gap-4 rounded-xl">
					<div className="flex items-center gap-2">
						<Link
							to="/"
							className="flex items-center gap-2 text-primary"
						>
							<span className="text-xl md:text-3xl font-black italic tracking-tighter uppercase font-headline text-on-background">
								LOCKED-IN
							</span>
						</Link>
					</div>

					{/* Desktop Links */}
					<div className="hidden md:flex items-center gap-8 font-label font-bold text-sm">
						<Link
							to="/tools"
							className="hover:underline decoration-primary decoration-2 transition-all"
						>
							Tools
						</Link>
						<Link
							to="/about"
							className="hover:underline decoration-primary decoration-2 transition-all"
						>
							About
						</Link>
					</div>

					<div className="flex items-center">
						{/* Desktop Lock-In Button */}
						<Link
							to={user ? "/app/dashboard" : "/register"}
							className="hidden md:flex bg-primary text-on-primary-container px-5 py-2.5 border-2 border-primary font-bold neo-shadow active-press items-center gap-2 rounded-lg text-base shrink-0"
						>
							{user ? "Dashboard" : "Lock-in"}
							<span
								className="material-symbols-outlined text-sm"
								data-icon={user ? "dashboard" : "login"}
							>
								{user ? "dashboard" : "login"}
							</span>
						</Link>

						{/* Mobile Menu Dropdown */}
						<div className="relative md:hidden">
							<button
								onClick={() => setDropdownOpen(!dropdownOpen)}
								className="bg-primary text-on-primary-container px-4 py-2 border-2 border-primary font-bold neo-shadow active-press flex items-center gap-2 rounded-lg text-sm shrink-0"
							>
								Menu
								<span
									className="material-symbols-outlined text-sm"
									data-icon={
										dropdownOpen
											? "expand_less"
											: "expand_more"
									}
								>
									{dropdownOpen
										? "expand_less"
										: "expand_more"}
								</span>
							</button>

							{dropdownOpen && (
								<ul className="absolute right-0 top-full mt-4 z-60 p-2 shadow-xl bg-surface-container-lowest border-2 border-primary rounded-xl w-52 font-label font-bold flex flex-col gap-1">
									<li>
										<Link
											to="/tools"
											className="block px-4 py-2 hover:bg-primary/10 rounded-lg transition-colors"
											onClick={() =>
												setDropdownOpen(false)
											}
										>
											Tools
										</Link>
									</li>
									<li>
										<Link
											to="/about"
											className="block px-4 py-2 hover:bg-primary/10 rounded-lg transition-colors"
											onClick={() =>
												setDropdownOpen(false)
											}
										>
											About
										</Link>
									</li>
									<div className="my-1 border-t-2 border-primary/20"></div>
									<li>
										<Link
											to={user ? "/app/dashboard" : "/register"}
											className="bg-primary text-on-primary-container hover:bg-primary/90 flex justify-center text-center py-2 mt-1 neo-shadow-sm active-press rounded-lg transition-all"
											onClick={() =>
												setDropdownOpen(false)
											}
										>
											{user ? "Dashboard" : "Lock-In"}
										</Link>
									</li>
								</ul>
							)}
						</div>
					</div>
				</nav>
			</header>

			{/* 2. Content */}
			<main className="max-w-[98%] mx-auto px-4 mt-8 mb-16 flex flex-col gap-8">
				<Outlet />
			</main>

			{/* 3. CTA & Footer */}
			<div className="max-w-[98%] mx-auto px-4 mt-auto mb-8 w-full">
				<section className="bg-primary text-white border-4 border-primary neo-shadow-lg p-12 md:p-24 text-center rounded-2xl">
					<h2 className="text-5xl md:text-8xl font-black font-headline uppercase leading-none tracking-tighter mb-12">
						You just need to
					</h2>
					<Link
						to="/login"
						className="inline-block bg-surface-container-lowest text-primary text-2xl md:text-3xl px-12 py-6 border-4 border-primary neo-shadow font-black active-press uppercase font-headline mb-16 rounded-xl"
					>
						Lock-in
					</Link>
					<footer className="flex flex-col gap-12 pt-16 border-t border-white/20 text-left w-full">
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
							{/* Section 1: Resources & Company */}
							<div className="grid grid-cols-2 gap-8">
								<div className="space-y-4">
									<h5 className="font-black font-headline text-2xl">
										RESOURCES
									</h5>
									<div className="flex flex-col gap-2 font-label">
										<Link
											className="hover:underline"
											to="#"
										>
											Documentation
										</Link>
										<Link
											className="hover:underline"
											to="#"
										>
											SDK Reference
										</Link>
										<Link
											className="hover:underline"
											to="#"
										>
											Changelog
										</Link>
									</div>
								</div>
								<div className="space-y-4">
									<h5 className="font-black font-headline text-2xl">
										COMPANY
									</h5>
									<div className="flex flex-col gap-2 font-label">
										<Link
											className="hover:underline"
											to="#"
										>
											Pricing
										</Link>
										<Link
											className="hover:underline"
											to="#"
										>
											Legal &amp; Privacy
										</Link>
										<Link
											className="hover:underline"
											to="#"
										>
											Contact
										</Link>
									</div>
								</div>
							</div>

							{/* Section 2: About Developer & Socials (80/20) */}
							<div className="grid grid-cols-1 md:grid-cols-6 gap-8">
								<div className="md:col-span-4 xl:col-span-4">
									<h5 className="font-black font-headline text-2xl mb-4">
										ABOUT DEVELOPER
									</h5>
									<p className="text-base font-medium opacity-90 max-w-2xl">
										I built Locked In because I needed a
										better way to track my own progress.
										<br />
										Open source and built with
										<span
											className="material-symbols-outlined text-error align-middle mx-1"
											data-icon="favorite"
											style={{
												fontVariationSettings:
													'"FILL" 1',
											}}
										>
											favorite
										</span>
										in Lagos.
									</p>
								</div>

								<div className="md:col-span-2 xl:col-span-2 flex flex-col gap-4">
									<a
										href="https://github.com/your-username"
										target="_blank"
										rel="noopener noreferrer"
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
						<p className="text-white/60 font-label text-sm uppercase text-center mt-8">
							© 2026 ARIBAD TECHNOLOGIES
						</p>
					</footer>
				</section>
			</div>
		</div>
	);
};

export default OpenLayout;
