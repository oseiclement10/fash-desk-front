import { formatPrettyDate } from "@/utils/date-helper";

type TimestampsProps = {
    created_at: string;
    updated_at: string;
};

const Timestamps = ({ created_at, updated_at }: TimestampsProps) => {
    return (
        <div className="flex flex-col   text-xs text-slate-500">
            <span>Created: {formatPrettyDate(created_at)}</span>
            <span>Updated: {formatPrettyDate(updated_at)}</span>
        </div>
    );
};

export default Timestamps;
