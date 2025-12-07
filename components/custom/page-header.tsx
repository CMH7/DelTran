import { BaseProp } from "../props/base-prop";

interface PageHeaderProps extends BaseProp {
	title: string;
	icon?: React.ReactNode;
	end?: React.ReactNode;
}
export default function PageHeader({ title, icon, end }: PageHeaderProps) {
	return (
		<div className="flex justify-between">
			<div className="flex items-center gap-1">
				{icon}
				<p className="font-bold text-lg">{title}</p>
			</div>
			{end}
		</div>
	);
}
