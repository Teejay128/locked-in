import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const Dashboard = ({ user }) => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [newEntry, setNewEntry] = useState("");
	const [socialMediaPackage, setSocialMediaPackage] = useState(null);

	const [dailyQuote, setDailyQuote] = useState(
		"Locking in for today's motivation...",
	);

	useEffect(() => {
		const fetchDailyQuote = async () => {
			try {
				const today = new Date().toISOString().split("T")[0];
				const quoteRef = doc(db, "quotes", today);
				const quoteSnap = await getDoc(quoteRef);

				if (quoteSnap.exists()) {
					console.log("Quote snap exists: ", quoteSnap.data());
					setDailyQuote(quoteSnap.data().quote);
				} else {
					setDailyQuote(
						"No fancy motivation today, you just need to LOCK IN!",
					);
				}
			} catch (err) {
				console.error("Error fetching daily quote:", err);
				setDailyQuote(
					"No fancy motivation today, you just need to LOCK IN!",
				);
			}
		};

		fetchDailyQuote();
	}, []);

	const handleNewEntry = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError(null);
		setSocialMediaPackage(null);

		try {
			const token = await user.getIdToken();
			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/journal`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({ content: newEntry }),
				},
			);

			if (!response.ok) {
				throw new Error("Failed to create a new entry.");
			}

			const data = await response.json();
			setSocialMediaPackage({
				summary: data.summary,
				fullText: data.content,
			});
			setNewEntry("");
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	// Mock Data
	const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
	const activeStreakDays = 3;
	const currentStreak = 3;
	const longestStreak = 10;
	const totalEntries = 50;

	return (
		<div className="w-full max-w-5xl mx-auto space-y-8">
			{/* ==============================
          1. HEADER SECTION
      ============================== */}
			<header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
				<div>
					<h1 className="text-3xl font-black text-base-content italic">
						"{dailyQuote}"
					</h1>
					<p className="text-base-content/60 mt-1 text-lg">
						Welcome back,{" "}
						<span className="text-primary font-bold">
							{user.displayName || user.email}
						</span>
					</p>
				</div>
			</header>

			{/* ==============================
          2. STATS & PROGRESS ROW
      ============================== */}
			<section className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{/* Current Streak Stat */}
				<div className="stats shadow bg-base-100 border border-base-200">
					<div className="stat">
						<div className="stat-figure text-primary">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								className="inline-block w-8 h-8 stroke-current"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M13 10V3L4 14h7v7l9-11h-7z"
								></path>
							</svg>
						</div>
						<div className="stat-title">Current Streak</div>
						<div className="stat-value text-primary">
							{currentStreak} Days
						</div>
						<div className="stat-desc">Keep the fire burning!</div>
					</div>
				</div>

				{/* Weekly Progress Visual */}
				<div className="card bg-base-100 shadow border border-base-200 md:col-span-2">
					<div className="card-body p-4 md:p-6">
						<h2 className="card-title text-sm uppercase text-base-content/50">
							This Week
						</h2>
						<div className="flex justify-between items-center mt-2">
							{weekDays.map((day, index) => (
								<div
									key={day}
									className="flex flex-col items-center gap-2"
								>
									<div
										className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all
                      ${
							index < activeStreakDays
								? "bg-primary text-primary-content shadow-lg scale-110"
								: "bg-base-200 text-base-content/40"
						}`}
									>
										{index < activeStreakDays
											? "✓"
											: day.charAt(0)}
									</div>
									<span className="text-xs">{day}</span>
								</div>
							))}
						</div>
					</div>
				</div>
			</section>

			{/* ==============================
          3. NEW ENTRY AREA (The "Action" Center)
      ============================== */}
			<section className="card bg-base-100 shadow-xl border border-primary/20">
				<div className="card-body">
					<h2 className="card-title mb-2">
						<span className="text-2xl">✍️</span> New Journal Entry
					</h2>

					<form onSubmit={handleNewEntry}>
						<textarea
							className="textarea textarea-bordered textarea-lg w-full h-40 focus:outline-none focus:border-primary resize-none leading-relaxed"
							value={newEntry}
							onChange={(e) => setNewEntry(e.target.value)}
							placeholder="What did you build, learn, or fix today?"
							required
						/>

						<div className="card-actions justify-between items-center mt-4">
							{error && (
								<span className="text-error text-sm font-bold">
									{error}
								</span>
							)}
							{!error && <div></div>} {/* Spacer */}
							<button
								type="submit"
								className={`btn btn-primary px-8 ${loading ? "loading" : ""}`}
								disabled={loading}
							>
								{loading ? "Saving..." : "Create Entry"}
							</button>
						</div>
					</form>

					{/* Social Media Preview (Conditional) */}
					{socialMediaPackage && (
						<div className="mt-6 animate-fade-in-up">
							<div className="alert bg-base-200 shadow-sm border-l-4 border-secondary">
								<div>
									<h3 className="font-bold text-secondary">
										✨ AI Generated Preview
									</h3>
									<div className="text-xs text-base-content/60 mb-2">
										Based on your entry
									</div>
									<p className="italic text-base-content/80">
										"{socialMediaPackage.summary}"
									</p>
								</div>
							</div>
						</div>
					)}
				</div>
			</section>

			{/* ==============================
          4. LIFETIME STATS (Secondary Info)
      ============================== */}
			<section className="stats w-full shadow bg-base-200/50">
				<div className="stat place-items-center">
					<div className="stat-title">Longest Streak</div>
					<div className="stat-value text-secondary">
						{longestStreak}
					</div>
					<div className="stat-desc">Days in a row</div>
				</div>

				<div className="stat place-items-center">
					<div className="stat-title">Total Entries</div>
					<div className="stat-value">{totalEntries}</div>
					<div className="stat-desc">Lifetime contributions</div>
				</div>

				<div className="stat place-items-center">
					<div className="stat-title">Level</div>
					<div className="stat-value">Novice</div>
					<div className="stat-desc">Next: Apprentice</div>
				</div>
			</section>
		</div>
	);
};

export default Dashboard;
