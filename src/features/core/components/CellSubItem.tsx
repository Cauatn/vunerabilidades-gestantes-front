export default function CellSubItem({
	label,
	value,
}: {
	label: string;
	value: string;
}) {
	return (
		<p className="text-xs text-n-800">
			<span className="font-semibold">{label}: </span>
			{value}
		</p>
	);
}
