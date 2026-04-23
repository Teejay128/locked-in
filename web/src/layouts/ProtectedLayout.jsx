import React, { useState, useEffect } from "react";
import { Link, Outlet, Navigate, useLocation } from "react-router-dom";
import { auth } from "../firebase";

const ProtectedLayout = ({ user }) => {
	const location = useLocation();
	const [dropdownOpen, setDropdownOpen] = useState(false);
	// 1. The "Brain": State lifted to the layout component
	const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

	// Auto-close sidebar when route changes on mobile
	useEffect(() => {
		setIsMobileSidebarOpen(false);
	}, [location.pathname]);

	if (!user) {
		return <Navigate to="/login" replace />;
	}

	const handleLogout = async () => {
		try {
			await auth.signOut();
		} catch (error) {
			console.error("Error signing out: ", error);
		}
	};

	const userInitials = user.displayName
		? user.displayName.charAt(0).toUpperCase()
		: user.email.charAt(0).toUpperCase();

	const navLinks = [
		{ path: "/app/dashboard", icon: "grid_view", label: "Overview" },
		{ path: "/app/profile", icon: "person", label: "Profile" },
		{ path: "/app/journal", icon: "edit_document", label: "Journal" },
		{ path: "/app/tools", icon: "extension", label: "Quick Tools" },
	];

	return (
		// 2. The "Shell": Full height, flexbox row
		<div className="flex h-screen overflow-hidden bg-surface font-body text-on-surface selection:bg-primary selection:text-surface-container-lowest">
			{/* ==============================
                MOBILE BACKDROP OVERLAY
            ============================== */}
			{/* 3. The "Polish": Click-outside to close with blur effect. Only visible on mobile when open. */}
			<div
				className={`fixed inset-0 z-40 bg-surface/50 backdrop-blur-sm transition-opacity lg:hidden ${
					isMobileSidebarOpen
						? "opacity-75"
						: "opacity-0 pointer-events-none"
				}`}
				onClick={() => setIsMobileSidebarOpen(false)}
			/>

			{/* ==============================
                THE SIDEBAR
            ============================== */}
			{/* 4. The "Muscle": Fixed on mobile (slides in/out), static flex-item on desktop (always visible) */}
			<aside
				className={`fixed inset-y-0 left-0 z-50 w-72 bg-surface text-primary font-headline font-extrabold text-lg uppercase border-r-2 border-primary flex flex-col gap-2 p-4 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:block shrink-0 ${
					isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
				}`}
			>
				{/* Mobile Close Button (Inside Sidebar) */}
				<div className="flex justify-between items-center lg:hidden mb-2">
					<Link
						to="/app/dashboard"
						className="text-xl md:text-2xl font-black italic tracking-tighter text-primary hover:scale-105 transition-transform"
					>
						LOCKED-IN
					</Link>

					<button
						onClick={() => setIsMobileSidebarOpen(false)}
						className="material-symbols-outlined p-1 hover:scale-110 active:scale-95 transition-transform"
					>
						close
					</button>
				</div>

				<nav className="grow flex flex-col mt-4 md:mt-16 gap-2">
					{navLinks.map((link) => {
						const isActive = location.pathname.includes(link.path);
						return (
							<Link
								key={link.path}
								to={link.path}
								className={`py-3 px-4 flex items-center gap-3 transition-all rounded-md border-2 border-primary shadow-[4px_4px_0px_0px_#000000] hover:shadow-[8px_8px_0px_0px_#000000] hover:-translate-y-1 hover:-translate-x-1 active:shadow-[0px_0px_0px_0px_#000000] active:translate-y-1 active:translate-x-1 ${
									isActive
										? "bg-primary text-surface-container-lowest"
										: "bg-surface text-primary"
								}`}
							>
								<span className="material-symbols-outlined">
									{link.icon}
								</span>
								{link.label}
							</Link>
						);
					})}
				</nav>

				<div className="mt-auto border-t-2 border-primary pt-4 flex flex-col gap-2">
					<button
						onClick={handleLogout}
						className="text-error py-2 px-4 border-2 border-error bg-surface shadow-[4px_4px_0px_0px_#ba1a1a] hover:shadow-[8px_8px_0px_0px_#ba1a1a] hover:-translate-y-1 hover:-translate-x-1 active:shadow-[0px_0px_0px_0px_#ba1a1a] active:translate-y-1 active:translate-x-1 flex items-center gap-3 text-sm transition-all text-left font-bold rounded-md"
					>
						<span className="material-symbols-outlined text-sm">
							logout
						</span>
						Logout
					</button>
				</div>
			</aside>

			{/* ==============================
                MAIN CONTENT WRAPPER
            ============================== */}
			{/* Takes up remaining space. Handles its own vertical scrolling. */}
			<div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
				{/* --- NAVBAR --- */}
				<header className="bg-surface/90 backdrop-blur-md text-primary font-headline font-bold uppercase tracking-tighter flex justify-between items-center w-full px-4 md:px-6 py-2 sticky top-0 z-30">
					<div className="flex-none w-1/3 flex justify-start">
						{/* Hamburger Menu - ONLY visible on mobile (< lg) */}
						<button
							onClick={() => setIsMobileSidebarOpen(true)}
							className="material-symbols-outlined p-2 neo- hover:skew-x-2 transition-transform active:scale-95 cursor-pointer lg:hidden"
						>
							menu
						</button>
					</div>

					<div className="flex-1 flex justify-center w-1/3">
						<Link
							to="/app/dashboard"
							className="text-xl md:text-2xl font-black italic tracking-tighter text-primary hover:scale-105 transition-transform"
						>
							LOCKED-IN
						</Link>
					</div>

					<div className="flex-none w-1/3 flex justify-end items-center gap-2 md:gap-4">
						<Link
							to="/app/journal"
							className="material-symbols-outlined p-2 hover:scale-110 transition-transform active:scale-95 border-2 border-transparent hover:border-primary rounded-md"
						>
							edit_document
						</Link>

						<div className="relative">
							<button
								onClick={() => setDropdownOpen(!dropdownOpen)}
								className="w-8 h-8 md:w-10 md:h-10 border-2 border-primary overflow-hidden cursor-pointer flex hover:scale-105 transition-transform active:scale-95 bg-primary rounded-full shadow-[2px_2px_0px_0px_#000000]"
							>
								{user.photoURL ? (
									<img
										src={user.photoURL}
										alt="Profile"
										className="w-full h-full object-cover"
									/>
								) : (
									<div className="bg-primary text-surface-container-lowest w-full h-full flex items-center justify-center font-headline font-bold text-sm md:text-base">
										{userInitials}
									</div>
								)}
							</button>
							{dropdownOpen && (
								<ul className="absolute right-0 mt-4 z-50 shadow-[4px_4px_0px_0px_#000000] bg-surface border-4 border-primary rounded-xl w-52 font-label font-bold flex flex-col p-2">
									<li className="px-4 py-2 text-xs text-primary/60 uppercase font-bold border-b-2 border-primary/20 mb-2 truncate">
										{user.email}
									</li>
									<li>
										<Link
											to="/app/profile"
											className="block px-4 py-2 hover:bg-primary hover:text-surface-container-lowest active:scale-95 transition-all rounded-md"
											onClick={() =>
												setDropdownOpen(false)
											}
										>
											Profile Settings
										</Link>
									</li>
									<li>
										<button
											onClick={() => {
												setDropdownOpen(false);
												handleLogout();
											}}
											className="block w-full text-left px-4 py-2 text-error hover:bg-error hover:text-white active:scale-95 transition-all mt-1 rounded-md"
										>
											Logout
										</button>
									</li>
								</ul>
							)}
						</div>
					</div>
				</header>

				{/* --- PAGE CONTENT --- */}
				<main className="grow p-4 md:p-8 lg:p-12 w-full max-w-7xl mx-auto">
					<Outlet />
				</main>
			</div>
		</div>
	);
};

export default ProtectedLayout;
