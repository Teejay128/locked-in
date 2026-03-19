import React from "react";
import { Link, Outlet } from "react-router-dom";

const OpenLayout = () => {
	return (
		<div className="flex flex-col min-h-screen bg-base-100 text-base-content">
			{/* 1. Public Navbar */}
			<nav className="navbar bg-base-100 shadow-sm px-4 lg:px-10">
				<div className="flex-1">
					<Link
						to="/"
						className="btn btn-ghost text-xl font-black text-primary"
					>
						LOCKED IN
					</Link>
				</div>
				<div className="flex-none gap-2">
					{/* Menu items for public visitors */}
					<Link to="/login" className="btn btn-ghost btn-sm">
						Sign In
					</Link>
					<Link
						to="/register"
						className="btn btn-primary btn-sm text-white"
					>
						Register
					</Link>
				</div>
			</nav>

			{/* 2. Page Content (Landing, Tools, etc.) */}
			<main className="grow">
				<Outlet />
			</main>

			{/* 3. Simple Footer */}
			<footer className="footer items-center p-4 bg-neutral text-neutral-content">
				<aside className="items-center grid-flow-col">
					<p>
						© {new Date().getFullYear()} Locked In - Build your
						streak.
					</p>
				</aside>
			</footer>
		</div>
	);
};

export default OpenLayout;
