import type { ProjectStatus, ProjectPriority } from "@/types/project";

interface Props {
    type: "status" | "priority";
    value: ProjectStatus | ProjectPriority;
}

export default function ProjectStatusBadge({
    type,
    value,
}: Props) {
    const statusClasses: Record<string, string> = {
        Planning:
            "bg-blue-50 text-blue-700 ring-blue-600/20",

        "In Progress":
            "bg-amber-50 text-amber-700 ring-amber-600/20",

        "On Hold":
            "bg-gray-50 text-gray-700 ring-gray-600/20",

        Completed:
            "bg-green-50 text-green-700 ring-green-600/20",

        Low:
            "bg-gray-50 text-gray-700 ring-gray-600/20",

        Medium:
            "bg-blue-50 text-blue-700 ring-blue-600/20",

        High:
            "bg-red-50 text-red-700 ring-red-600/20",
    };

    return (
        <span
            className={`
                inline-flex items-center rounded-full
                px-2.5 py-1 text-xs font-medium
                ring-1 ring-inset
                ${statusClasses[value]}
            `}
        >
            {value}
        </span>
    );
}