import { useState, useEffect } from "react";
import {
	BrowserRouter as Router,
	Route,
	Routes,
	Navigate,
} from "react-router-dom";
import { auth } from "./firebase";

import "./App.css";
import OpenLayout from "./layouts/OpenLayout";
import ProtectedLayout from "./layouts/ProtectedLayout";

import LandingPage from "./pages/Landing";
import QuickTools from "./pages/QuickTools";
import LockInPage from "./pages/LockIn";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import Journal from "./pages/Journal";
import NotFoundPage from "./pages/NotFound";

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
		// You can replace this later with a nice <LoadingSpinner /> component
		return (
			<div className="min-h-screen flex items-center justify-center">
				Loading...
			</div>
		);
	}

	return (
		<Router>
			<Routes>
				<Route element={<OpenLayout />}>
					<Route path="/" element={<LandingPage />} />
					<Route path="/quick-tools" element={<QuickTools />} />
				</Route>

				<Route path="/login" element={<LockInPage />} />
				<Route
					path="/register"
					element={<LockInPage defaultIsRegister={true} />}
				/>

				<Route path="/app" element={<ProtectedLayout user={user} />}>
					<Route
						path="dashboard"
						element={<Dashboard user={user} />}
					/>
					<Route path="profile" element={<Profile />} />
					<Route path="journal" element={<Journal user={user} />} />
				</Route>

				<Route path="*" element={<NotFoundPage />} />
			</Routes>
		</Router>
	);
}

export default App;
