import { BaseProp } from "../props/base-prop";
import { Spinner } from "../ui/spinner";

interface LoaderProps extends BaseProp {
	text: string;
}

export default function Loader({ text }: LoaderProps) {
	return (
		<div className="flex justify-center items-center h-full">
			<Spinner />
			{text}
		</div>
	);
}
