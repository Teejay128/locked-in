import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

import EntryComponent from "../components/EntryComponent";

// const testEntryData = {
// 	success: true,
// 	message: "Entry saved successfully!",
// 	entryId: "gg7Zr8Gy9grPh5rmQkwS",
// 	images: [],
// 	social: {
// 		twitter: {
// 			text: "Weekend app testing: More bugs than expected! Fixing and correcting was a rollercoaster. Who knew testing could be so stressful? 😅 #SoftwareTesting #DevLife #Debugging\n",
// 			link: "https://x.com/intent/post?text=Weekend%20app%20testing%3A%20More%20bugs%20than%20expected!%20Fixing%20and%20correcting%20was%20a%20rollercoaster.%20Who%20knew%20testing%20could%20be%20so%20stressful%3F%20%F0%9F%98%85%20%23SoftwareTesting%20%23DevLife%20%23Debugging%0A",
// 		},
// 		linkedin: {
// 			text: "Spent the weekend putting the finishing touches on an application I've been developing.\n\nLet's just say the testing phase uncovered a few more issues than I anticipated! So many bugs to squash and corrections to make.\n\nIt's amazing how stressful testing can be, almost as much as the initial development itself. A valuable lesson learned.\n\n#SoftwareDevelopment #Testing #Debugging #QA #ProjectManagement #Tech\n",
// 			link: "https://www.linkedin.com/feed/?shareActive=true&text=Spent%20the%20weekend%20putting%20the%20finishing%20touches%20on%20an%20application%20I've%20been%20developing.%0A%0ALet's%20just%20say%20the%20testing%20phase%20uncovered%20a%20few%20more%20issues%20than%20I%20anticipated!%20So%20many%20bugs%20to%20squash%20and%20corrections%20to%20make.%0A%0AIt's%20amazing%20how%20stressful%20testing%20can%20be%2C%20almost%20as%20much%20as%20the%20initial%20development%20itself.%20A%20valuable%20lesson%20learned.%0A%0A%23SoftwareDevelopment%20%23Testing%20%23Debugging%20%23QA%20%23ProjectManagement%20%23Tech%0A",
// 		},
// 	},
// 	content:
// 		"I tested an application I was working on over the weekend, there were so many bugs that I had to fix and correct. Who knew testing could be as stressful as actual development.",
// 	createdAt: "2026-03-19T05:15:54.949Z",
// };

const Dashboard = ({ user }) => {
	const [entryError, setEntryError] = useState("");
	const [entryLoading, setEntryLoading] = useState(false);
	const [entryData, setEntryData] = useState(null);

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

	const handleNewEntry = async (entryContent) => {
		setEntryLoading(true);
		setEntryError(null);
		setEntryData(null);

		try {
			const token = await user.getIdToken();
			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/journal/entry`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({ content: entryContent }),
				},
			);

			if (!response.ok) {
				throw new Error("Failed to create a new entry.");
			}

			const data = await response.json();
			setEntryData(data);
		} catch (err) {
			setEntryError(err.message);
		} finally {
			setEntryLoading(false);
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
							Welcome back,{" "}
							{user.displayName || user.email.split("@")[0]}
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
			<EntryComponent
				entry={entryData}
				isError={!!entryError}
				errorMessage={entryError}
				isLoading={entryLoading}
				onSubmit={handleNewEntry}
			/>

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
