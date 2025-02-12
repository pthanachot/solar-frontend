const GuageContainer = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="border border-[#E5E5E5] rounded-[20px] py-3 px-6 flex flex-col gap-2">
			{children}
		</div>
	);
};

export default GuageContainer;
