import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

import EntryComponent from "../components/EntryComponent";
import Card from "../components/stitch/Card";

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
				<Card>
					<div className="flex justify-between items-center">
						<div>
							<div className="font-label font-bold text-xs uppercase tracking-wider text-base-content/50">Current Streak</div>
							<div className="text-3xl font-headline font-black text-primary mt-1">
								{currentStreak} Days
							</div>
							<div className="text-sm font-body mt-1 text-base-content/70">Keep the fire burning!</div>
						</div>
						<div className="text-primary bg-surface-container-low p-3 rounded-lg border-2 border-primary">
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
					</div>
				</Card>

				{/* Weekly Progress Visual */}
				<Card className="md:col-span-2">
					<h2 className="font-label font-bold text-xs uppercase tracking-wider text-base-content/50 mb-4">
						This Week
					</h2>
					<div className="flex justify-between items-center mt-2">
						{weekDays.map((day, index) => (
							<div
								key={day}
								className="flex flex-col items-center gap-2"
							>
								<div
									className={`w-10 h-10 rounded-full flex items-center justify-center font-headline font-black border-2 border-primary transition-all
                      ${
							index < activeStreakDays
								? "bg-primary text-surface-container-lowest shadow-[2px_2px_0px_0px_#000000] scale-110"
								: "bg-surface-container-low text-primary/40"
						}`}
								>
									{index < activeStreakDays
										? "✓"
										: day.charAt(0)}
								</div>
								<span className="text-xs font-label font-bold">{day}</span>
							</div>
						))}
					</div>
				</Card>
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
			<section className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<Card className="text-center" variant="low">
					<div className="font-label font-bold text-xs uppercase tracking-wider text-base-content/50">Longest Streak</div>
					<div className="text-3xl font-headline font-black text-primary mt-2">
						{longestStreak}
					</div>
					<div className="text-sm font-body mt-1 text-base-content/70">Days in a row</div>
				</Card>

				<Card className="text-center" variant="low">
					<div className="font-label font-bold text-xs uppercase tracking-wider text-base-content/50">Total Entries</div>
					<div className="text-3xl font-headline font-black text-primary mt-2">{totalEntries}</div>
					<div className="text-sm font-body mt-1 text-base-content/70">Lifetime contributions</div>
				</Card>

				<Card className="text-center" variant="low">
					<div className="font-label font-bold text-xs uppercase tracking-wider text-base-content/50">Level</div>
					<div className="text-3xl font-headline font-black text-primary mt-2">Novice</div>
					<div className="text-sm font-body mt-1 text-base-content/70">Next: Apprentice</div>
				</Card>
			</section>
		</div>
	);
};

export default Dashboard;
