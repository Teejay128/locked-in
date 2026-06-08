import { useState, useEffect } from "react";
import {
	BrowserRouter as Router,
	Route,
	Routes,
	Navigate,
} from "react-router-dom";
import { auth } from "./firebase";

import "./App.css";
import AppLayout from "./layouts/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import LandingPage from "./pages/Landing";
import QuickTools from "./pages/QuickTools";
import LockInPage from "./pages/LockIn";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import Journal from "./pages/Journal";
import NotFoundPage from "./pages/NotFound";
import AboutPage from "./pages/About";

function App() {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((user) => {
			setUser(user);
			setLoading(false);
		});

		return () => unsubscribe();
	}, []);

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				Loading...
			</div>
		);
	}

	return (
		<Router>
			<Routes>
				{/* Standalone Auth Pages */}
				<Route path="/login" element={<LockInPage />} />
				<Route
					path="/register"
					element={<LockInPage defaultIsRegister={true} />}
				/>

				{/* Pages Wrapped in Unified AppLayout */}
				<Route element={<AppLayout user={user} />}>
					{/* Public Routes */}
					<Route path="/" element={<LandingPage />} />
					<Route path="/about" element={<AboutPage />} />
					<Route path="/tools" element={<QuickTools />} />

					{/* Protected Routes */}
					<Route element={<ProtectedRoute user={user} />}>
						<Route
							path="/dashboard"
							element={<Dashboard user={user} />}
						/>
						<Route path="/profile" element={<Profile />} />
						<Route path="/journal" element={<Journal user={user} />} />
					</Route>
				</Route>

				<Route path="*" element={<NotFoundPage />} />
			</Routes>
		</Router>
	);
}

export default App;

