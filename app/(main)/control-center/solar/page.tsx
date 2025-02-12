import GuageGroup from "./components/GuageGroup";

const SolarPage = () => {
	return (
		<div>
			<GuageGroup url="http://localhost:8777/api/control/solar-detail" />
			{/* <GuageGroup url="http://localhost:8777/api/control/solar-detail-2" /> */}
		</div>
	);
};

export default SolarPage;
