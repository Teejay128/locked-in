import React from "react";
import { Link, Outlet, Navigate } from "react-router-dom";
import { auth } from "../firebase"; // Import auth for the logout function

const ProtectedLayout = ({ user }) => {
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

	// Helper to get initials for the avatar placeholder
	const userInitials = user.displayName
		? user.displayName.charAt(0).toUpperCase()
		: user.email.charAt(0).toUpperCase();

	return (
		<div className="drawer lg:drawer-open">
			<input id="main-drawer" type="checkbox" className="drawer-toggle" />

			{/* CONTENT AREA */}
			<div className="drawer-content flex flex-col">
				{/* STICKY NAVBAR 
            - sticky top-0: Keeps it pinned to the top
            - z-30: Ensures it floats above content
            - backdrop-blur-md: The "frosted glass" effect
            - bg-base-100/80: Slight transparency to show colors behind it
        */}
				<div className="navbar sticky top-0 z-30 w-full bg-base-100/80 backdrop-blur-md border-b border-base-200 transition-all duration-300">
					{/* LEFT SIDE: Hamburger (Mobile Only) */}
					<div className="flex-none lg:hidden">
						<label
							htmlFor="main-drawer"
							className="btn btn-square btn-ghost"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								className="inline-block w-6 h-6 stroke-current"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M4 6h16M4 12h16M4 18h16"
								></path>
							</svg>
						</label>
					</div>

					{/* MIDDLE: Page Title (Mobile Only) or Breadcrumbs */}
					<div className="flex-1 px-2 mx-2">
						<Link
							to="/app/dashboard"
							className="text-xl font-bold text-primary lg:hidden"
						>
							Locked In 🔒
						</Link>
					</div>

					{/* RIGHT SIDE: User Menu Dropdown */}
					<div className="flex-none gap-2">
						<div className="dropdown dropdown-end">
							{/* The Avatar Trigger */}
							<label
								tabIndex={0}
								className="btn btn-ghost btn-circle avatar placeholder border border-base-300"
							>
								<div className="bg-neutral text-neutral-content rounded-full w-10">
									<span className="text-xl">
										{userInitials}
									</span>
								</div>
							</label>

							{/* The Dropdown Menu */}
							<ul
								tabIndex={0}
								className="mt-3 z-1 shadow-xl menu menu-sm dropdown-content bg-base-100 rounded-box w-52 border border-base-200"
							>
								<li className="menu-title px-4 py-2 text-xs text-base-content/50 uppercase font-bold border-b border-base-200 mb-2">
									{user.email}
								</li>

								<li>
									<Link
										to="/app/profile"
										className="justify-between"
									>
										Profile Settings
										<span className="badge badge-primary badge-xs">
											New
										</span>
									</Link>
								</li>
								<li>
									<button
										onClick={() =>
											alert(
												"Switch Profile feature coming soon!",
											)
										}
									>
										Switch Profile
									</button>
								</li>

								<div className="divider my-0"></div>

								<li>
									<button
										onClick={handleLogout}
										className="text-error hover:bg-error/10"
									>
										Logout
									</button>
								</li>
							</ul>
						</div>
					</div>
				</div>

				{/* MAIN PAGE CONTENT */}
				<main className="p-6 bg-base-200 min-h-screen">
					<Outlet />
				</main>
			</div>

			{/* SIDEBAR (Unchanged) */}
			<div className="drawer-side z-40">
				<label
					htmlFor="main-drawer"
					aria-label="close sidebar"
					className="drawer-overlay"
				></label>
				<ul className="menu p-4 w-80 min-h-full bg-base-100 text-base-content border-r border-base-300">
					{/* Logo / Brand */}
					<div className="hidden lg:block mb-8 px-4 text-2xl font-black text-primary italic">
						<Link to="/app/dashboard">LOCKED IN 🔒</Link>
					</div>

					{/* Navigation Links */}
					<li className="menu-title text-gray-500 uppercase text-xs font-bold mb-2">
						Main Menu
					</li>
					<li>
						<Link to="/app/dashboard">Dashboard</Link>
					</li>
					<li>
						<Link to="/app/journal">Journal Entries</Link>
					</li>
					<li>
						<Link to="/app/tools">Quick Tools</Link>
					</li>

					<div className="mt-auto">
						<li className="menu-title text-gray-500 uppercase text-xs font-bold mb-2">
							Account
						</li>
						<li>
							<Link to="/app/profile">Profile Settings</Link>
						</li>
						<li>
							<button
								onClick={handleLogout}
								className="text-error hover:bg-error/10"
							>
								Logout
							</button>
						</li>
					</div>
				</ul>
			</div>
		</div>
	);
};

export default ProtectedLayout;
