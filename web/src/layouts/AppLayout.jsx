import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import Footer from "../components/Footer";

const AppLayout = ({ user }) => {
	const location = useLocation();
	const navigate = useNavigate();
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);

	// Sync sidebar state on mount based on viewport
	useEffect(() => {
		if (window.innerWidth < 1280) {
			setIsSidebarOpen(false);
		} else {
			setIsSidebarOpen(true);
		}
	}, []);

	// Auto-close sidebar on mobile when route changes
	useEffect(() => {
		if (window.innerWidth < 1280) {
			setIsSidebarOpen(false);
		}
		setDropdownOpen(false);
	}, [location.pathname]);

	const handleLogout = async () => {
		try {
			await auth.signOut();
			navigate("/");
		} catch (error) {
			console.error("Error signing out: ", error);
		}
	};

	const userInitials = user
		? user.displayName
			? user.displayName.charAt(0).toUpperCase()
			: user.email.charAt(0).toUpperCase()
		: "";

	// Define navigation links based on authentication state
	const publicLinks = [
		{ path: "/", icon: "home", label: "Home" },
		{ path: "/tools", icon: "extension", label: "Tools" },
		{ path: "/about", icon: "info", label: "About" },
	];

	const privateLinks = [
		{ path: "/dashboard", icon: "grid_view", label: "Dashboard" },
		{ path: "/profile", icon: "person", label: "Profile" },
		{ path: "/journal", icon: "edit_document", label: "Journal" },
		{ path: "/tools", icon: "extension", label: "Tools" },
		{ path: "/about", icon: "info", label: "About" },
	];

	const navLinks = user ? privateLinks : publicLinks;
	const isPublicRoute = ["/", "/tools", "/about"].includes(location.pathname);

	return (
		<div className="flex flex-col h-screen overflow-hidden bg-background font-body text-on-surface" data-sidebar-open={isSidebarOpen}>
			{/* ==============================
                TOP NAVBAR (FULL WIDTH)
            ============================== */}
			<header className="h-14 shrink-0 bg-surface-container-lowest text-primary flex items-center justify-between px-6 z-50 shadow-sm relative">
				<div className="flex items-center gap-6">
					{/* Sidebar Toggle Button */}
					<button
						onClick={() => setIsSidebarOpen(!isSidebarOpen)}
						className="material-symbols-outlined p-2 hover:bg-black/5 active:scale-95 transition-all rounded-lg cursor-pointer xl:hidden"
					>
						menu
					</button>

					{/* Logo */}
					<Link
						to="/"
						className="ml-3 text-xl md:text-2xl font-black italic tracking-tighter text-primary hover:scale-105 transition-transform"
					>
						LOCKED-IN
					</Link>
				</div>

				<div className="flex items-center gap-4">
					{user ? (
						<>
							{/* Quick Entry Button */}
							<Link
								to="/journal"
								className="material-symbols-outlined p-2 text-primary hover:bg-black/5 active:scale-95 transition-all rounded-lg"
							>
								edit_document
							</Link>

							{/* User Profile Dropdown */}
							<div className="relative">
								<button
									onClick={() => setDropdownOpen(!dropdownOpen)}
									className="w-9 h-9 border-2 border-primary overflow-hidden cursor-pointer flex hover:scale-105 transition-transform active:scale-95 bg-primary rounded-full"
								>
									{user.photoURL ? (
										<img
											src={user.photoURL}
											alt="Profile"
											className="w-full h-full object-cover"
										/>
									) : (
										<div className="bg-primary text-surface-container-lowest w-full h-full flex items-center justify-center font-headline font-bold text-sm">
											{userInitials}
										</div>
									)}
								</button>
								{dropdownOpen && (
									<ul className="absolute right-0 mt-2 z-50 shadow-lg bg-surface-container-lowest border-2 border-primary rounded-xl w-52 font-label font-bold flex flex-col p-2">
										<li className="px-4 py-2 text-xs text-primary/60 uppercase font-bold border-b border-primary/10 mb-1 truncate">
											{user.email}
										</li>
										<li>
											<Link
												to="/profile"
												className="block px-4 py-2 hover:bg-primary hover:text-surface-container-lowest active:scale-95 transition-all rounded-md"
												onClick={() => setDropdownOpen(false)}
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
						</>
					) : (
						<Link
							to="/login"
							className="btn-dark text-xs py-1.5 px-3.5"
						>
							Lock-in
						</Link>
					)}
				</div>
			</header>

			{/* ==============================
                MAIN WORKSPACE WRAPPER
            ============================== */}
			<div className="flex-1 flex overflow-hidden relative">
				{/* Mobile/Medium Sidebar Backdrop Overlay */}
				{isSidebarOpen && (
					<div
						className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm xl:hidden transition-opacity"
						onClick={() => setIsSidebarOpen(false)}
					/>
				)}

				{/* ==============================
                    THE SIDEBAR (DOCKED / FLAT)
                ============================== */}
				<aside
					className={`fixed top-14 bottom-0 left-0 z-40 h-auto bg-surface-container-lowest text-primary flex flex-col transition-all duration-300 ease-in-out shrink-0 select-none
						${isSidebarOpen ? "translate-x-0 w-64 p-6" : "-translate-x-full w-64 p-6"}
						xl:relative xl:top-0 xl:h-full xl:translate-x-0 xl:w-64 xl:p-6 xl:opacity-100 xl:overflow-visible`}
				>
					<nav className="flex flex-col gap-2 mt-4 grow">
						{navLinks.map((link) => {
							const isActive = location.pathname === link.path;
							return (
								<Link
									key={link.path}
									to={link.path}
									className={`py-3 px-4 flex items-center gap-3 transition-all rounded-lg font-headline font-bold text-base
										${isActive
											? "bg-primary text-surface-container-lowest"
											: "text-primary hover:bg-black/5"}`}
								>
									<span className="material-symbols-outlined">
										{link.icon}
									</span>
									{link.label}
								</Link>
							);
						})}
					</nav>

					{/* Bottom Actions inside Sidebar */}
					<div className="mt-auto border-t border-primary/10 pt-4 flex flex-col gap-2">
						{user ? (
							<button
								onClick={handleLogout}
								className="btn-danger w-full justify-start text-xs py-2 px-3.5"
							>
								<span className="material-symbols-outlined text-sm">
									logout
								</span>
								Logout
							</button>
						) : (
							<Link
								to="/login"
								className="btn-dark text-center text-xs py-2"
							>
								Lock-in
							</Link>
						)}
					</div>
				</aside>

				{/* ==============================
                    MAIN CONTENT PANELS
                ============================== */}
				<div className="flex-1 overflow-y-auto flex flex-col">
					<main className="flex-1 p-6 md:p-10 w-full max-w-7xl mx-auto flex flex-col">
						<Outlet />
						{isPublicRoute && <Footer hideCta={!!user} />}
					</main>
				</div>
			</div>
		</div>
	);
};

export default AppLayout;
