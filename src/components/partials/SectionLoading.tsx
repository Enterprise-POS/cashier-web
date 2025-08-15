export default function SectionLoading({ caption }: { caption?: string }) {
	return (
		<>
			<div id="section-loader">
				<div className="whirly-loader"></div>
			</div>
			{caption && <p className="text-center">{caption}</p>}
		</>
	);
}
