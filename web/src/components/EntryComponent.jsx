import React, { useState, useEffect } from "react";
import Card from "./stitch/Card";
import PopButton from "./stitch/PopButton";

const EntryComponent = ({
	entry,
	isLoading,
	isError,
	errorMessage,
	onSubmit,
	content: externalContent,
	setContent: externalSetContent,
}) => {
	const [localContent, localSetContent] = useState("");
	const content = externalContent !== undefined ? externalContent : localContent;
	const setContent = externalSetContent !== undefined ? externalSetContent : localSetContent;
	const [liveDate, setLiveDate] = useState(new Date());

	useEffect(() => {
		if (entry || isLoading) return;
		const interval = setInterval(() => setLiveDate(new Date()), 60000);
		return () => clearInterval(interval);
	}, [entry, isLoading]);

	// 1. Clearly define our 4 possible states
	const isViewing = !!entry && !isLoading && !isError;
	const isErrorState = isError && !isLoading;
	const isCreating = !entry && !isLoading && !isErrorState;

	// Format the date
	const displayDate =
		isViewing && entry.createdAt
			? new Date(entry.createdAt).toLocaleString(undefined, {
					month: "short",
					day: "numeric",
					year: "numeric",
					hour: "numeric",
					minute: "2-digit",
				})
			: liveDate.toLocaleString(undefined, {
					month: "short",
					day: "numeric",
					year: "numeric",
					hour: "numeric",
					minute: "2-digit",
				});

	const previewTwitter = content
		? `${content.slice(0, 150)}${content.length > 150 ? "..." : ""} ✨\n\n#Developer #Update`
		: "Start typing to see a live preview of your AI-generated X post...";

	const previewLinkedIn = content
		? `Today's update:\n\n${content.slice(0, 200)}${content.length > 200 ? "..." : ""}\n\n#SoftwareEngineering #BuildInPublic`
		: "Start typing to see a live preview of your AI-generated LinkedIn post...";

	// 2. Dynamic border styling based on state
	const borderStyles = isErrorState
		? "border-error ring-1 ring-error/30"
		: isCreating
			? "border-primary/50 ring-1 ring-primary/20"
			: "border-base-200";

	return (
		<div className="w-full flex flex-col gap-4 mt-2">
			{/* ==============================
            CONTENT AREA
        ============================== */}
				{isCreating || isErrorState ? (
					<div className="mb-4">
						<textarea
							className={`neo-input w-full text-base min-h-[120px] resize-none ${isErrorState ? "!border-error focus:!border-error" : ""}`}
							placeholder="What are you working on today? Be as raw or detailed as you want..."
							value={content}
							onChange={(e) => setContent(e.target.value)}
							disabled={isLoading}
						/>
						{/* Replace your current <div className="flex justify-end mt-3">...</div> with this: */}
						<div className="flex justify-between items-center mt-3 h-10">
							{/* Left Side: Inline Error Message */}
							<div className="flex-1">
								{isErrorState && (
									<div className="text-error text-sm font-medium flex items-center gap-1.5 animate-fade-in-up">
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
										<span>
											{errorMessage ||
												"Save failed. Please try again."}
										</span>
									</div>
								)}
							</div>

							{/* Right Side: The Button */}
							<button
								className={`${isErrorState ? "btn-danger" : "btn-dark"} neo-btn text-xs py-2 px-4`}
								disabled={!content.trim() || isLoading}
								onClick={() => onSubmit(content)}
							>
								{isLoading && (
									<span className="loading loading-spinner loading-xs"></span>
								)}
								{isErrorState ? "Try Again" : "Create Entry"}
							</button>
						</div>
					</div>
				) : (
					<Card
						variant="naked"
						padding="small"
						className={`min-h-[100px] mb-8 bg-surface-container-low/30 border-primary/20 ${isLoading ? "animate-pulse" : ""}`}
					>
						<p className="whitespace-pre-wrap text-on-surface/90 font-body">
							{isViewing ? entry.content : content}
						</p>
					</Card>
				)}

				{/* ==============================
            SOCIAL MEDIA PACKAGES
        ============================== */}
				<div className="space-y-4">
					<div className="flex items-center gap-2 mb-2">
						<span className="text-xl">✨</span>
						<h3 className="text-md font-bold text-secondary">
							{isViewing
								? "AI Generated Social Posts"
								: "Live AI Preview"}
						</h3>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{/* --- Twitter / X Card --- */}
						<Card
							variant="naked"
							padding="small"
							className={`flex flex-col h-full ${isErrorState ? "opacity-70" : ""}`}
						>
							<h4 className="font-headline font-bold text-sm opacity-70 flex items-center gap-2 border-b border-primary/20 pb-2 text-primary uppercase">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="14"
									height="14"
									fill="currentColor"
									viewBox="0 0 16 16"
								>
									<path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z" />
								</svg>
								X (Twitter)
							</h4>

							<div className="my-3 flex-grow text-sm text-on-surface/80">
								{isLoading ? (
									<div className="space-y-2 mt-2">
										<div className="skeleton h-4 w-full"></div>
										<div className="skeleton h-4 w-5/6"></div>
										<div className="skeleton h-4 w-4/6"></div>
									</div>
								) : (
									<p
										className={`whitespace-pre-wrap ${(isCreating || isErrorState) && !content ? "italic opacity-50" : ""}`}
									>
										{isViewing
											? entry.social.twitter.text
											: previewTwitter}
									</p>
								)}
							</div>

							<div className="justify-end mt-auto pt-2 flex">
								{isViewing ? (
									<a
										href={entry.social.twitter.link}
										target="_blank"
										rel="noopener noreferrer"
										className="w-full sm:w-auto"
									>
										<PopButton className="text-xs w-full sm:w-auto" shadow="sm">
											Post to X
										</PopButton>
									</a>
								) : (
									<PopButton className="text-xs opacity-50 cursor-not-allowed w-full sm:w-auto" disabled shadow="sm">
										{isLoading && (
											<span className="loading loading-spinner loading-xs"></span>
										)}
										{isLoading
											? "Generating..."
											: "Post to X"}
									</PopButton>
								)}
							</div>
						</Card>

						{/* --- LinkedIn Card --- */}
						<Card
							variant="naked"
							padding="small"
							className={`flex flex-col h-full ${isErrorState ? "opacity-70" : ""}`}
						>
							<h4 className="font-headline font-bold text-sm opacity-70 flex items-center gap-2 border-b border-primary/20 pb-2 text-primary uppercase">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="14"
									height="14"
									fill="currentColor"
									viewBox="0 0 16 16"
								>
									<path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z" />
								</svg>
								LinkedIn
							</h4>

							<div className="my-3 flex-grow text-sm text-on-surface/80">
								{isLoading ? (
									<div className="space-y-2 mt-2">
										<div className="skeleton h-4 w-full"></div>
										<div className="skeleton h-4 w-11/12"></div>
										<div className="skeleton h-4 w-4/6"></div>
									</div>
								) : (
									<p
										className={`whitespace-pre-wrap ${(isCreating || isErrorState) && !content ? "italic opacity-50" : ""}`}
									>
										{isViewing
											? entry.social.linkedin.text
											: previewLinkedIn}
									</p>
								)}
							</div>

							<div className="justify-end mt-auto pt-2 flex">
								{isViewing ? (
									<a
										href={entry.social.linkedin.link}
										target="_blank"
										rel="noopener noreferrer"
										className="w-full sm:w-auto"
									>
										<PopButton className="text-xs w-full sm:w-auto" shadow="sm">
											Post to LinkedIn
										</PopButton>
									</a>
								) : (
									<PopButton className="text-xs opacity-50 cursor-not-allowed w-full sm:w-auto" disabled shadow="sm">
										{isLoading && (
											<span className="loading loading-spinner loading-xs"></span>
										)}
										{isLoading
											? "Generating..."
											: "Post to LinkedIn"}
									</PopButton>
								)}
							</div>
						</Card>
					</div>
				</div>
			</div>
		);
};

export default EntryComponent;
