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
	const [userDocData, setUserDocData] = useState(null);
	const [fullName, setFullName] = useState("");
	const [username, setUsername] = useState("");
	const [bio, setBio] = useState("");
	const [location, setLocation] = useState("");
	const [company, setCompany] = useState("");
	const [skills, setSkills] = useState("");
	const [links, setLinks] = useState({
		github: "",
		linkedin: "",
		twitter: "",
		portfolio: "",
	});
	const [apiKey, setApiKey] = useState("");

	// States for UI feedback
	const [loading, setLoading] = useState(true); // Page load
	const [saving, setSaving] = useState(false); // Save button load
	const [generating, setGenerating] = useState(false); // API regen load
	const [error, setError] = useState(null);
	const [successMsg, setSuccessMsg] = useState(""); // Replaces alert()
	const [copied, setCopied] = useState(false);
	const [isEditingPublic, setIsEditingPublic] = useState(false);
	const [isEditingDev, setIsEditingDev] = useState(false);

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const currentUser = auth.currentUser;
				if (currentUser) {
					const userDocRef = doc(db, "users", currentUser.uid);
					const userDocSnap = await getDoc(userDocRef);

					if (userDocSnap.exists()) {
						const userData = userDocSnap.data();
						setUserDocData(userData);
						setUser({ email: currentUser.email });
						setFullName(userData.fullName || "");
						setUsername(userData.username || "");
						setBio(userData.bio || "");
						setLocation(userData.location || "");
						setCompany(userData.company || "");
						setSkills(Array.isArray(userData.skills) ? userData.skills.join(", ") : "");
						setLinks({
							github: userData.links?.github || "",
							linkedin: userData.links?.linkedin || "",
							twitter: userData.links?.twitter || "",
							portfolio: userData.links?.portfolio || "",
						});
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

	const handleCancelPublic = () => {
		if (userDocData) {
			setFullName(userDocData.fullName || "");
			setUsername(userDocData.username || "");
			setBio(userDocData.bio || "");
			setLocation(userDocData.location || "");
			setCompany(userDocData.company || "");
		}
		setIsEditingPublic(false);
	};

	const handleCancelDev = () => {
		if (userDocData) {
			setSkills(Array.isArray(userDocData.skills) ? userDocData.skills.join(", ") : "");
			setLinks({
				github: userDocData.links?.github || "",
				linkedin: userDocData.links?.linkedin || "",
				twitter: userDocData.links?.twitter || "",
				portfolio: userDocData.links?.portfolio || "",
			});
		}
		setIsEditingDev(false);
	};

	const handleSavePublic = async () => {
		setSaving(true);
		setSuccessMsg("");
		try {
			const currentUser = auth.currentUser;
			if (currentUser) {
				const userDocRef = doc(db, "users", currentUser.uid);
				const updatedProfile = {
					fullName,
					username,
					usernameIsDefault: false,
					bio,
					location,
					company,
				};

				await updateDoc(userDocRef, updatedProfile);
				
				// Update local original copy
				setUserDocData((prev) => ({
					...prev,
					...updatedProfile,
				}));

				setSuccessMsg("Public info updated successfully!");
				setIsEditingPublic(false);
				setTimeout(() => setSuccessMsg(""), 3000);
			}
		} catch (err) {
			console.log(err);
			setError("Failed to save public info.");
		} finally {
			setSaving(false);
		}
	};

	const handleSaveDev = async () => {
		setSaving(true);
		setSuccessMsg("");
		try {
			const currentUser = auth.currentUser;
			if (currentUser) {
				const userDocRef = doc(db, "users", currentUser.uid);
				const parsedSkills = skills
					.split(",")
					.map((s) => s.trim())
					.filter(Boolean);

				const updatedProfile = {
					skills: parsedSkills,
					links: {
						github: links.github.trim(),
						linkedin: links.linkedin.trim(),
						twitter: links.twitter.trim(),
						portfolio: links.portfolio.trim(),
					},
				};

				await updateDoc(userDocRef, updatedProfile);
				
				// Update local original copy
				setUserDocData((prev) => ({
					...prev,
					...updatedProfile,
				}));

				setSuccessMsg("Developer info updated successfully!");
				setIsEditingDev(false);
				setTimeout(() => setSuccessMsg(""), 3000);
			}
		} catch (err) {
			console.log(err);
			setError("Failed to save dev info.");
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
          CARD 1: PUBLIC INFO
      ============================== */}
			<Card variant="naked">
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
							className="neo-input-disabled text-on-surface/50 cursor-not-allowed font-label w-full"
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
							disabled={!isEditingPublic}
							onChange={(e) => setUsername(e.target.value)}
							className={`w-full ${!isEditingPublic ? "neo-input-disabled text-on-surface/50 cursor-not-allowed" : "neo-input"}`}
							placeholder="How should we call you?"
						/>
					</div>

					{/* Full Name */}
					<div className="form-control">
						<label className="label" htmlFor="fullName">
							<span className="label-text font-label font-bold text-xs uppercase tracking-wider text-base-content/50">Full Name</span>
						</label>
						<input
							type="text"
							id="fullName"
							value={fullName}
							disabled={!isEditingPublic}
							onChange={(e) => setFullName(e.target.value)}
							className={`w-full ${!isEditingPublic ? "neo-input-disabled text-on-surface/50 cursor-not-allowed" : "neo-input"}`}
							placeholder="John Doe"
						/>
					</div>

					{/* Location */}
					<div className="form-control">
						<label className="label" htmlFor="location">
							<span className="label-text font-label font-bold text-xs uppercase tracking-wider text-base-content/50">Location</span>
						</label>
						<input
							type="text"
							id="location"
							value={location}
							disabled={!isEditingPublic}
							onChange={(e) => setLocation(e.target.value)}
							className={`w-full ${!isEditingPublic ? "neo-input-disabled text-on-surface/50 cursor-not-allowed" : "neo-input"}`}
							placeholder="Lagos, Nigeria"
						/>
					</div>

					{/* Company */}
					<div className="form-control md:col-span-2">
						<label className="label" htmlFor="company">
							<span className="label-text font-label font-bold text-xs uppercase tracking-wider text-base-content/50">Company</span>
						</label>
						<input
							type="text"
							id="company"
							value={company}
							disabled={!isEditingPublic}
							onChange={(e) => setCompany(e.target.value)}
							className={`w-full ${!isEditingPublic ? "neo-input-disabled text-on-surface/50 cursor-not-allowed" : "neo-input"}`}
							placeholder="Google"
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
							disabled={!isEditingPublic}
							onChange={(e) => setBio(e.target.value)}
							className={`h-32 w-full resize-none font-body ${!isEditingPublic ? "neo-input-disabled text-on-surface/50 cursor-not-allowed" : "neo-input"}`}
							placeholder="Tell us about your coding journey..."
						></textarea>
					</div>
				</div>

				<div className="flex justify-end gap-3 mt-6">
					{!isEditingPublic ? (
						<PopButton
							onClick={() => setIsEditingPublic(true)}
							variant="default"
						>
							Edit Public Info
						</PopButton>
					) : (
						<>
							<PopButton
								onClick={handleCancelPublic}
								variant="default"
								disabled={saving}
							>
								Cancel
							</PopButton>
							<PopButton
								onClick={handleSavePublic}
								variant="primary"
								disabled={saving}
							>
								{saving ? "Saving..." : "Save Public Info"}
							</PopButton>
						</>
					)}
				</div>
			</Card>

			{/* ==============================
          CARD 2: DEV INFO
      ============================== */}
			<Card variant="naked">
				<h2 className="font-headline font-black text-xl border-b border-primary/20 pb-2 mb-4 uppercase">
					Dev Info
				</h2>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{/* Skills */}
					<div className="form-control md:col-span-2">
						<label className="label" htmlFor="skills">
							<span className="label-text font-label font-bold text-xs uppercase tracking-wider text-base-content/50">Skills (comma-separated)</span>
						</label>
						<input
							type="text"
							id="skills"
							value={skills}
							disabled={!isEditingDev}
							onChange={(e) => setSkills(e.target.value)}
							className={`w-full ${!isEditingDev ? "neo-input-disabled text-on-surface/50 cursor-not-allowed" : "neo-input"}`}
							placeholder="React, NodeJS, Firebase"
						/>
					</div>

					{/* GitHub */}
					<div className="form-control">
						<label className="label" htmlFor="github">
							<span className="label-text font-label font-bold text-xs uppercase tracking-wider text-base-content/50">GitHub URL</span>
						</label>
						<input
							type="url"
							id="github"
							value={links.github}
							disabled={!isEditingDev}
							onChange={(e) => setLinks({ ...links, github: e.target.value })}
							className={`w-full ${!isEditingDev ? "neo-input-disabled text-on-surface/50 cursor-not-allowed" : "neo-input"}`}
							placeholder="https://github.com/username"
						/>
					</div>

					{/* LinkedIn */}
					<div className="form-control">
						<label className="label" htmlFor="linkedin">
							<span className="label-text font-label font-bold text-xs uppercase tracking-wider text-base-content/50">LinkedIn URL</span>
						</label>
						<input
							type="url"
							id="linkedin"
							value={links.linkedin}
							disabled={!isEditingDev}
							onChange={(e) => setLinks({ ...links, linkedin: e.target.value })}
							className={`w-full ${!isEditingDev ? "neo-input-disabled text-on-surface/50 cursor-not-allowed" : "neo-input"}`}
							placeholder="https://linkedin.com/in/username"
						/>
					</div>

					{/* Twitter / X */}
					<div className="form-control">
						<label className="label" htmlFor="twitter">
							<span className="label-text font-label font-bold text-xs uppercase tracking-wider text-base-content/50">Twitter / X URL</span>
						</label>
						<input
							type="url"
							id="twitter"
							value={links.twitter}
							disabled={!isEditingDev}
							onChange={(e) => setLinks({ ...links, twitter: e.target.value })}
							className={`w-full ${!isEditingDev ? "neo-input-disabled text-on-surface/50 cursor-not-allowed" : "neo-input"}`}
							placeholder="https://x.com/username"
						/>
					</div>

					{/* Portfolio */}
					<div className="form-control">
						<label className="label" htmlFor="portfolio">
							<span className="label-text font-label font-bold text-xs uppercase tracking-wider text-base-content/50">Portfolio Website</span>
						</label>
						<input
							type="url"
							id="portfolio"
							value={links.portfolio}
							disabled={!isEditingDev}
							onChange={(e) => setLinks({ ...links, portfolio: e.target.value })}
							className={`w-full ${!isEditingDev ? "neo-input-disabled text-on-surface/50 cursor-not-allowed" : "neo-input"}`}
							placeholder="https://myportfolio.dev"
						/>
					</div>
				</div>

				<div className="flex justify-end gap-3 mt-6">
					{!isEditingDev ? (
						<PopButton
							onClick={() => setIsEditingDev(true)}
							variant="default"
						>
							Edit Dev Info
						</PopButton>
					) : (
						<>
							<PopButton
								onClick={handleCancelDev}
								variant="default"
								disabled={saving}
							>
								Cancel
							</PopButton>
							<PopButton
								onClick={handleSaveDev}
								variant="primary"
								disabled={saving}
							>
								{saving ? "Saving..." : "Save Dev Info"}
							</PopButton>
						</>
					)}
				</div>
			</Card>

			{/* ==============================
          CARD 2: DEVELOPER ZONE (API KEY)
      ============================== */}
			<Card variant="dark" padding="large">
				<div className="flex justify-between items-center border-b border-white/20 pb-2 mb-4">
					<h2 className="font-headline font-black text-xl text-error uppercase">
						Developer Zone
					</h2>
					<div className="badge badge-error border-error text-error bg-transparent font-label font-bold text-xs uppercase px-2 py-1 rounded">
						Sensitive Data
					</div>
				</div>

				<p className="text-sm font-body text-gray-300 mb-4">
					Use this API key to authenticate requests from your
					external scripts or CLI tools.
					<span className="font-bold text-error ml-1">
						Do not share this key.
					</span>
				</p>

				{/* API Key Terminal Box */}
				<Card
					variant="naked"
					padding="none"
					className="w-full flex flex-col md:flex-row justify-between items-center gap-2 border-white/20 bg-white/5"
				>
					{/* The Key Display */}
					<div className="flex-1 p-2 font-mono text-sm break-all text-center md:text-left text-white font-bold">
						{apiKey ? (
							<span>
								{apiKey.slice(0, 12)}
								<span className="opacity-40 tracking-widest text-white/60">
									•••••••••••••
								</span>
								{apiKey.slice(-6)}
							</span>
						) : (
							<span className="italic opacity-50 text-white/60">
								No API key generated yet
							</span>
						)}
					</div>

					{/* Actions */}
					<div className="flex gap-2 p-1 w-full md:w-auto">
						<PopButton
							className="py-2 px-3 text-xs flex-1 bg-surface-container-lowest"
							onClick={copyToClipboard}
							title="Copy to clipboard"
							shadow="xs"
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
								shadow="xs"
							>
								{generating ? "..." : "Generate Key"}
							</PopButton>
						)}
					</div>
				</Card>
			</Card>
		</div>
	);
};

export default ProfileSettings;
