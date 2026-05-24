import React, { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import Card from "../components/stitch/Card";
import PopButton from "../components/stitch/PopButton";

const apiUrl = import.meta.env.VITE_API_URL;

// Icon Components (Styled)
const CopyIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="20"
		height="20"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
		<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
	</svg>
);

const RegenerateIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="20"
		height="20"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<polyline points="23 4 23 10 17 10"></polyline>
		<path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
	</svg>
);

const ProfileSettings = () => {
	const [user, setUser] = useState(null);
	const [username, setUsername] = useState("");
	const [bio, setBio] = useState("");
	const [apiKey, setApiKey] = useState("");

	// States for UI feedback
	const [loading, setLoading] = useState(true); // Page load
	const [saving, setSaving] = useState(false); // Save button load
	const [generating, setGenerating] = useState(false); // API regen load
	const [error, setError] = useState(null);
	const [successMsg, setSuccessMsg] = useState(""); // Replaces alert()
	const [copied, setCopied] = useState(false);

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const currentUser = auth.currentUser;
				if (currentUser) {
					const userDocRef = doc(db, "users", currentUser.uid);
					const userDocSnap = await getDoc(userDocRef);

					if (userDocSnap.exists()) {
						const userData = userDocSnap.data();
						setUser(userData);
						setUsername(userData.username || "");
						setBio(userData.bio || "");
						setApiKey(userData.apiKey || "");
					} else {
						// If doc doesn't exist, we might just have a raw auth user
						setUser({ email: currentUser.email });
					}
				}
			} catch (err) {
				console.log(err);
				setError("Failed to fetch user data.");
			} finally {
				setLoading(false);
			}
		};

		fetchUserData();
	}, []);

	const handleSaveChanges = async () => {
		setSaving(true);
		setSuccessMsg("");
		try {
			const currentUser = auth.currentUser;
			if (currentUser) {
				const userDocRef = doc(db, "users", currentUser.uid);
				// Note: Using setDoc with merge:true is often safer if the doc might not exist yet
				await updateDoc(userDocRef, {
					username,
					bio,
				});
				setSuccessMsg("Profile updated successfully!");
				setTimeout(() => setSuccessMsg(""), 3000);
			}
		} catch (err) {
			console.log(err);
			setError("Failed to save changes.");
		} finally {
			setSaving(false);
		}
	};

	const handleRegenerateApiKey = async () => {
		if (
			!window.confirm(
				"Are you sure? This will invalidate your old key immediately.",
			)
		)
			return;

		setGenerating(true);
		try {
			const currentUser = auth.currentUser;
			if (currentUser) {
				const token = await currentUser.getIdToken();
				const response = await fetch(`${apiUrl}/auth/generate-key`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				});

				if (response.ok) {
					const data = await response.json();
					setApiKey(data.apiKey);
					setSuccessMsg("New API Key generated!");
					setTimeout(() => setSuccessMsg(""), 3000);
				} else {
					throw new Error("Failed to regenerate API key.");
				}
			}
		} catch (err) {
			setError(err.message);
		} finally {
			setGenerating(false);
		}
	};

	const copyToClipboard = () => {
		navigator.clipboard.writeText(apiKey);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	// 1. Loading Skeleton
	if (loading) {
		return (
			<div className="w-full max-w-4xl mx-auto space-y-6">
				<div className="skeleton h-32 w-full rounded-xl"></div>
				<div className="skeleton h-64 w-full rounded-xl"></div>
			</div>
		);
	}

	// 2. Error State
	if (error) {
		return (
			<div className="alert alert-error">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="stroke-current shrink-0 h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
						d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
				<span>{error}</span>
			</div>
		);
	}

	return (
		<div className="w-full max-w-4xl mx-auto space-y-8">
			<div className="flex flex-col gap-2">
				<h1 className="text-3xl font-bold">Profile Settings</h1>
				<p className="text-base-content/60">
					Manage your public information and developer keys.
				</p>
			</div>

			{/* SUCCESS TOAST (Replaces Alert) */}
			{successMsg && (
				<div className="toast toast-top toast-center z-50">
					<div className="alert alert-success">
						<span>{successMsg}</span>
					</div>
				</div>
			)}

			{/* ==============================
          CARD 1: PUBLIC PROFILE
      ============================== */}
			<Card className="bg-surface-container-lowest">
				<h2 className="font-headline font-black text-xl border-b border-primary/20 pb-2 mb-4 uppercase">
					Public Info
				</h2>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{/* Email (Read Only) */}
					<div className="form-control">
						<label className="label">
							<span className="label-text font-label font-bold text-xs uppercase tracking-wider text-base-content/50">
								Email Address
							</span>
							<span className="label-text-alt text-error font-label font-bold text-[10px] uppercase">
								Cannot be changed
							</span>
						</label>
						<input
							type="email"
							value={user?.email || ""}
							disabled
							className="input input-bordered bg-base-200 text-base-content/50 cursor-not-allowed border-2 border-primary rounded-lg p-3 font-label"
						/>
					</div>

					{/* Username */}
					<div className="form-control">
						<label className="label" htmlFor="username">
							<span className="label-text font-label font-bold text-xs uppercase tracking-wider text-base-content/50">Display Name</span>
						</label>
						<input
							type="text"
							id="username"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							className="input input-bordered focus:input-primary border-2 border-primary rounded-lg p-3 font-label focus:outline-none"
							placeholder="How should we call you?"
						/>
					</div>

					{/* Bio (Full Width) */}
					<div className="form-control md:col-span-2">
						<label className="label" htmlFor="bio">
							<span className="label-text font-label font-bold text-xs uppercase tracking-wider text-base-content/50">Bio / About</span>
						</label>
						<textarea
							id="bio"
							value={bio}
							onChange={(e) => setBio(e.target.value)}
							className="textarea textarea-bordered h-32 focus:textarea-primary resize-none border-2 border-primary rounded-lg p-3 font-body focus:outline-none"
							placeholder="Tell us about your coding journey..."
						></textarea>
					</div>
				</div>

				<div className="flex justify-end mt-6">
					<PopButton
						onClick={handleSaveChanges}
						variant="primary"
						disabled={saving}
					>
						{saving ? "Saving Changes..." : "Save Changes"}
					</PopButton>
				</div>
			</Card>

			{/* ==============================
          CARD 2: DEVELOPER ZONE (API KEY)
      ============================== */}
			<Card className="bg-surface-container-lowest border-error">
				<div className="flex justify-between items-center border-b border-error/20 pb-2 mb-4">
					<h2 className="font-headline font-black text-xl text-error uppercase">
						Developer Zone
					</h2>
					<div className="badge badge-error border-error text-error font-label font-bold text-xs uppercase px-2 py-1 rounded">
						Sensitive Data
					</div>
				</div>

				<p className="text-sm font-body text-base-content/70 mb-4">
					Use this API key to authenticate requests from your
					external scripts or CLI tools.
					<span className="font-bold text-error">
						{" "}
						Do not share this key.
					</span>
				</p>

				{/* API Key Terminal Box */}
				<div className="bg-inverse-surface text-on-primary-container rounded-lg p-2 border-2 border-primary flex flex-col md:flex-row items-center justify-between gap-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
					{/* The Key Display */}
					<div className="flex-1 p-3 font-mono text-sm break-all text-center md:text-left text-white">
						{apiKey ? (
							<span>
								{apiKey.slice(0, 12)}
								<span className="opacity-50 tracking-widest">
									•••••••••••••
								</span>
								{apiKey.slice(-6)}
							</span>
						) : (
							<span className="italic opacity-50">
								No API key generated yet
							</span>
						)}
					</div>

					{/* Actions */}
					<div className="flex gap-2 p-1 w-full md:w-auto">
						<PopButton
							className="py-2 px-3 text-xs flex-1"
							onClick={copyToClipboard}
							title="Copy to clipboard"
						>
							{copied ? (
								<span className="text-success font-bold">
									Copied!
								</span>
							) : (
								<div className="flex items-center gap-1">
									<CopyIcon />
									<span>Copy</span>
								</div>
							)}
						</PopButton>

						{apiKey ? (
							<PopButton
								variant="danger"
								className="py-2 px-3 text-xs flex-1"
								onClick={handleRegenerateApiKey}
								disabled={generating}
								title="Regenerate Key"
							>
								{generating ? "..." : (
									<div className="flex items-center gap-1">
										<RegenerateIcon />
										<span>Regen</span>
									</div>
								)}
							</PopButton>
						) : (
							<PopButton
								variant="primary"
								className="py-2 px-3 text-xs flex-1"
								onClick={handleRegenerateApiKey}
								disabled={generating}
								title="Generate Key"
							>
								{generating ? "..." : "Generate Key"}
							</PopButton>
						)}
					</div>
				</div>
			</Card>
		</div>
	);
};

export default ProfileSettings;
