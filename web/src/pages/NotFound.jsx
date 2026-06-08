import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { auth } from "../firebase";

const NotFoundPage = () => {
	const [user, setUser] = useState(auth.currentUser);

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((u) => {
			setUser(u);
		});
		return () => unsubscribe();
	}, []);

	return (
		<main className="h-screen w-screen flex items-center justify-center p-4 bg-surface relative overflow-hidden text-on-surface font-body z-0">
			{/* Abstract Background Elements */}
			<div className="absolute top-10 right-10 w-64 h-64 bg-surface-container-low border-2 border-primary rounded-lg -rotate-6 z-0 hidden lg:block"></div>
			<div className="absolute bottom-10 left-10 w-48 h-48 bg-secondary-container border-2 border-primary rounded-full rotate-12 z-0 hidden lg:block"></div>
			
			{/* Error Container Card */}
			<div className="relative z-10 w-full max-w-lg bg-surface-container-lowest border-4 border-primary rounded-xl neo-shadow p-6 md:p-10 flex flex-col items-center text-center overflow-y-auto max-h-[90vh]">
				{/* Broken Padlock Illustration */}
				<div className="mb-6 relative">
					<div className="bg-surface p-5 md:p-6 rounded-2xl border-4 border-primary rotate-3">
						<span
							className="material-symbols-outlined text-[80px] md:text-[100px] text-primary"
							style={{ fontVariationSettings: '"FILL" 1' }}
						>
							lock_open
						</span>
						{/* Decorative "Break" lines */}
						<div className="absolute -top-3 -right-3 w-10 h-10 bg-error border-4 border-primary rounded-full flex items-center justify-center text-white font-bold text-lg rotate-12 neo-shadow-sm">
							!
						</div>
					</div>
				</div>
				
				{/* Massive Editorial Headline */}
				<h1 className="text-4xl md:text-5xl font-headline font-black tracking-tighter text-primary uppercase mb-4 leading-none">
					404 - <span className="text-tertiary-fixed italic">YOU'RE</span><br className="md:hidden" /> LOCKED OUT!
				</h1>
				
				{/* Subtext with Technical Voice */}
				<p className="font-label text-lg md:text-xl text-secondary max-w-md mb-8 tracking-tight leading-relaxed">
					It looks like you've wandered off the track. Don't break
					your streak now.
				</p>
				
				{/* Primary Action Button */}
				<Link
					className="group relative inline-flex items-center gap-3 bg-primary text-on-primary-container font-headline font-extrabold text-xl px-8 py-4 rounded-lg border-4 border-primary neo-shadow active-press transition-transform"
					to={user ? "/dashboard" : "/"}
				>
					LOCK BACK IN
					<span className="material-symbols-outlined transition-transform group-hover:translate-x-1">
						arrow_forward
					</span>
				</Link>
				
				{/* Technical Detail Meta-tag */}
				<div className="mt-8 py-1.5 px-3 bg-surface-container-low border-2 border-primary font-label text-xs md:text-sm uppercase tracking-widest text-primary">
					Error Code: 0x404_NULL_REF
				</div>
			</div>
		</main>
	);
};

export default NotFoundPage;
