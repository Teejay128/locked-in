import React, { useState, useEffect } from "react";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db, auth } from "../firebase";
import EntryComponent from "../components/EntryComponent";

const Journal = ({ user }) => {
	const [entries, setEntries] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(
		"Simulated Error message is not working",
	);

	// Accordion State: tracks which item is currently open.
	// Defaults to "new" so the form is ready to go immediately.
	const [expandedId, setExpandedId] = useState("new");

	// States for the New Entry creation process
	const [isCreating, setIsCreating] = useState(false);
	const [creationError, setCreationError] = useState(null);
	const [newEntryData, setNewEntryData] = useState(null);

	// Mock state for the AI personalized message
	const [aiSuggestion, setAiSuggestion] = useState(
		"Loading today's personalized focus...",
	);

	useEffect(() => {
		const fetchHistory = async () => {
			try {
				const currentUser = auth.currentUser;
				if (!currentUser) return;

				// Fetch entries ordered by newest first
				const entriesRef = collection(
					db,
					"users",
					currentUser.uid,
					"entries",
				);
				const q = query(entriesRef, orderBy("createdAt", "desc"));
				const snapshot = await getDocs(q);

				const fetchedEntries = snapshot.docs.map((doc) => ({
					entryId: doc.id,
					...doc.data(),
					// Ensure we don't crash if a timestamp is somehow missing
					createdAt:
						doc.data().createdAt?.toDate().toISOString() ||
						new Date().toISOString(),
				}));

				setEntries(fetchedEntries);

				// TODO: In the future, you can take the top 3 fetchedEntries,
				// send them to a new backend route (e.g., /api/journal/suggestions),
				// and ask Gemini: "Based on these recent updates, what should the user focus on today?"
				setAiSuggestion(
					"You've been making great progress on the API and Firebase integration. Want to focus on the frontend UI today, or squash some bugs?",
				);
			} catch (err) {
				console.error("Error fetching history:", err);
				setError("Failed to load your journal entries.");
			} finally {
				setLoading(false);
			}
		};

		fetchHistory();
	}, []);

	const handleNewEntrySubmit = async (content) => {
		setIsCreating(true);
		setCreationError(null);

		try {
			const token = await auth.currentUser.getIdToken();
			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/journal`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({ content }),
				},
			);

			if (!response.ok)
				throw new Error("Failed to connect to AI Service.");

			const data = await response.json();

			// Update the "New Entry" slot to show the success view
			setNewEntryData(data);

			// Prepend the new entry to the history list seamlessly
			setEntries((prev) => [data, ...prev]);
		} catch (err) {
			setCreationError(err.message);
		} finally {
			setIsCreating(false);
		}
	};

	const toggleAccordion = (id) => {
		// If clicking the already open item, close it. Otherwise, open the new one.
		setExpandedId((prev) => (prev === id ? null : id));
	};

	if (loading) {
		return (
			<div className="w-full max-w-4xl mx-auto space-y-6">
				<div className="skeleton h-32 w-full rounded-xl"></div>
				<div className="skeleton h-16 w-full rounded-xl mt-8"></div>
				<div className="skeleton h-16 w-full rounded-xl"></div>
			</div>
		);
	}

	return (
		<div className="w-full max-w-4xl mx-auto space-y-8 pb-12">
			{/* ==============================
          HEADER & AI SUGGESTION
      ============================== */}
			<div className="flex flex-col gap-2">
				<h1 className="text-3xl font-bold">
					Welcome back, {user.displayName || user.email.split("@")[0]}
				</h1>
				<div className="alert bg-primary/10 border border-primary/20 text-base-content shadow-sm mt-2">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						className="stroke-primary shrink-0 w-6 h-6"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						></path>
					</svg>
					<div>
						<h3 className="font-bold text-sm text-primary">
							AI Insights
						</h3>
						<div className="text-sm opacity-80">{aiSuggestion}</div>
					</div>
				</div>
			</div>

			{/* ==============================
          ACCORDION LIST
      ============================== */}
			<div className="space-y-4">
				{/* --- SLOT 1: NEW ENTRY --- */}
				<div className="border border-base-300 bg-base-100 rounded-xl overflow-hidden shadow-sm transition-all duration-300">
					<button
						className={`w-full text-left px-6 py-4 flex justify-between items-center hover:bg-base-200 transition-colors ${expandedId === "new" ? "bg-base-200" : ""}`}
						onClick={() => toggleAccordion("new")}
					>
						<span className="font-bold flex items-center gap-2">
							<span>✍️</span> Log a New Update
						</span>
						<span
							className="text-xl opacity-50 transition-transform duration-300"
							style={{
								transform:
									expandedId === "new"
										? "rotate(180deg)"
										: "rotate(0deg)",
							}}
						>
							▼
						</span>
					</button>

					<div
						className={`transition-all duration-300 ease-in-out ${expandedId === "new" ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}
					>
						<div className="p-4 pt-0">
							<EntryComponent
								entry={newEntryData}
								isLoading={isCreating}
								isError={!!creationError}
								errorMessage={creationError}
								onSubmit={handleNewEntrySubmit}
							/>
							{/* Reset button to write another entry without refreshing */}
							{newEntryData && (
								<div className="flex justify-end mt-[-1rem] mb-2 pr-2">
									<button
										className="btn btn-sm btn-ghost text-primary"
										onClick={() => {
											setNewEntryData(null);
											setExpandedId("new");
										}}
									>
										+ Start Another Entry
									</button>
								</div>
							)}
						</div>
					</div>
				</div>

				{/* --- HISTORY SLOTS --- */}
				<div className="divider opacity-50 text-sm">
					Previous Entries
				</div>

				{!!error && (
					<div className="text-error text-sm font-medium flex text-center gap-1.5 animate-fade-in-up">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-4 w-4"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fillRule="evenodd"
								d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
								clipRule="evenodd"
							/>
						</svg>
						<span>{error || "Save failed. Please try again."}</span>
					</div>
				)}

				{entries.length === 0 && (
					<div className="text-center opacity-50 italic py-8">
						No entries yet. Start building your history above!
					</div>
				)}

				{entries.map((entry) => (
					<div
						key={entry.entryId}
						className="border border-base-300 bg-base-100 rounded-xl overflow-hidden shadow-sm transition-all duration-300"
					>
						<button
							className={`w-full text-left px-6 py-4 flex justify-between items-center hover:bg-base-200 transition-colors ${expandedId === entry.entryId ? "bg-base-200" : ""}`}
							onClick={() => toggleAccordion(entry.entryId)}
						>
							<div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 truncate pr-4">
								<span className="font-semibold whitespace-nowrap">
									{new Date(
										entry.createdAt,
									).toLocaleDateString(undefined, {
										month: "short",
										day: "numeric",
										year: "numeric",
									})}
								</span>
								<span className="text-sm opacity-60 truncate max-w-[200px] sm:max-w-md">
									{entry.content.slice(0, 50)}...
								</span>
							</div>
							<span
								className="text-xl opacity-50 transition-transform duration-300 shrink-0"
								style={{
									transform:
										expandedId === entry.entryId
											? "rotate(180deg)"
											: "rotate(0deg)",
								}}
							>
								▼
							</span>
						</button>

						<div
							className={`transition-all duration-300 ease-in-out ${expandedId === entry.entryId ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}
						>
							<div className="p-4 pt-0">
								<EntryComponent entry={entry} />
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default Journal;
