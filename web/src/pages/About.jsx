import React from "react";
import Card from "../components/stitch/Card";

const AboutPage = () => {
	return (
		<div className="flex flex-col w-full gap-8">
			<Card variant="primary" padding="large" shadow="xl" className="bg-primary text-white text-center">
				<h1 className="text-5xl md:text-8xl font-black font-headline uppercase leading-none tracking-tighter mb-8">
					About Locked-In
				</h1>
				<p className="text-xl md:text-2xl font-body max-w-3xl mx-auto opacity-90 leading-relaxed mb-12">
					Locked-In is a developer utility designed to encourage consistency and transparency in public building. We believe that documenting your journey daily is the single most powerful way to build momentum.
				</p>
			</Card>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				<Card variant="primary" className="bg-primary text-white" padding="large" shadow="md">
					<h2 className="text-3xl font-headline font-black uppercase mb-4">
						The Philosophy
					</h2>
					<p className="font-body text-lg opacity-90 leading-relaxed">
						We reject the complex, slow dashboards of legacy platforms. Consistency is the only algorithm that matters. By logging your daily wins and bugs, you keep yourself accountable and showcase your trajectory.
					</p>
				</Card>

				<Card variant="primary" className="bg-primary text-white" padding="large" shadow="primary-md">
					<h2 className="text-3xl font-headline font-black uppercase mb-4">
						Built For Developers
					</h2>
					<p className="font-body text-lg opacity-90 leading-relaxed">
						With integrated AI generation, you can easily draft status updates for Twitter, X, and LinkedIn directly from your daily notes. Keep your audience locked-in on your progress.
					</p>
				</Card>
			</div>
		</div>
	);
};

export default AboutPage;
