import { useEffect, useState } from "react";
import type {
    Project,
    ProjectFormData,
    ProjectPriority,
    ProjectStatus,
} from "@/types/project";

interface Props {
    open: boolean;
    project: Project | null;
    onClose: () => void;
    onSaved: () => void;
}

const emptyForm: ProjectFormData = {
    client_name: "",
    project_name: "",
    description: "",
    status: "Planning",
    priority: "Medium",
    start_date: "",
    due_date: "",
};

const statuses: ProjectStatus[] = [
    "Planning",
    "In Progress",
    "On Hold",
    "Completed",
];

const priorities: ProjectPriority[] = [
    "Low",
    "Medium",
    "High",
];

export default function ProjectFormDialog({
    open,
    project,
    onClose,
    onSaved,
}: Props) {
    const [form, setForm] =
        useState<ProjectFormData>(emptyForm);

    const [errors, setErrors] =
        useState<Record<string, string[]>>({});

    const [processing, setProcessing] =
        useState(false);

    useEffect(() => {
        if (project) {
            setForm({
                client_name: project.client_name ?? "",
                project_name: project.project_name ?? "",
                description: project.description ?? "",
                status: project.status,
                priority: project.priority,
                start_date: project.start_date ?? "",
                due_date: project.due_date ?? "",
            });
        } else {
            setForm(emptyForm);
        }

        setErrors({});
    }, [project, open]);

    if (!open) {
        return null;
    }

    const updateField = (
        field: keyof ProjectFormData,
        value: string
    ) => {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));

        setErrors((current) => {
            const next = { ...current };
            delete next[field];
            return next;
        });
    };

    const submit = async (
        event: React.FormEvent
    ) => {
        event.preventDefault();

        setProcessing(true);
        setErrors({});

        const url = project
            ? `/projects/${project.id}`
            : "/projects";

        const method = project ? "PUT" : "POST";

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type":
                        "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(form),
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 422) {
                    setErrors(
                        data.errors ?? {}
                    );
                } else {
                    alert(
                        data.message ??
                            "Something went wrong."
                    );
                }

                return;
            }

            onSaved();
        } catch {
            alert(
                "Unable to connect to the server."
            );
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl">
                <div className="border-b px-6 py-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                        {project
                            ? "Edit Project"
                            : "Create Project"}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        {project
                            ? "Update the project information."
                            : "Add a new client project."}
                    </p>
                </div>

                <form onSubmit={submit}>
                    <div className="max-h-[70vh] overflow-y-auto px-6 py-5">
                        <div className="grid gap-5 sm:grid-cols-2">
                            <div>
                                <label className="mb-1.5 block text-sm font-medium">
                                    Client Name
                                </label>

                                <input
                                    type="text"
                                    value={form.client_name}
                                    onChange={(e) =>
                                        updateField(
                                            "client_name",
                                            e.target.value
                                        )
                                    }
                                    className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-gray-900"
                                    placeholder="Acme Corporation"
                                />

                                {errors.client_name && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.client_name[0]}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-medium">
                                    Project Name
                                </label>

                                <input
                                    type="text"
                                    value={form.project_name}
                                    onChange={(e) =>
                                        updateField(
                                            "project_name",
                                            e.target.value
                                        )
                                    }
                                    className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-gray-900"
                                    placeholder="Corporate Website"
                                />

                                {errors.project_name && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.project_name[0]}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-medium">
                                    Status
                                </label>

                                <select
                                    value={form.status}
                                    onChange={(e) =>
                                        updateField(
                                            "status",
                                            e.target.value
                                        )
                                    }
                                    className="w-full rounded-lg border px-3 py-2.5 text-sm"
                                >
                                    {statuses.map(
                                        (status) => (
                                            <option
                                                key={status}
                                                value={status}
                                            >
                                                {status}
                                            </option>
                                        )
                                    )}
                                </select>

                                {errors.status && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.status[0]}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-medium">
                                    Priority
                                </label>

                                <select
                                    value={form.priority}
                                    onChange={(e) =>
                                        updateField(
                                            "priority",
                                            e.target.value
                                        )
                                    }
                                    className="w-full rounded-lg border px-3 py-2.5 text-sm"
                                >
                                    {priorities.map(
                                        (priority) => (
                                            <option
                                                key={priority}
                                                value={priority}
                                            >
                                                {priority}
                                            </option>
                                        )
                                    )}
                                </select>

                                {errors.priority && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.priority[0]}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-medium">
                                    Start Date
                                </label>

                                <input
                                    type="date"
                                    value={form.start_date}
                                    onChange={(e) =>
                                        updateField(
                                            "start_date",
                                            e.target.value
                                        )
                                    }
                                    className="w-full rounded-lg border px-3 py-2.5 text-sm"
                                />
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-medium">
                                    Due Date
                                </label>

                                <input
                                    type="date"
                                    value={form.due_date}
                                    min={form.start_date || undefined}
                                    onChange={(e) =>
                                        updateField(
                                            "due_date",
                                            e.target.value
                                        )
                                    }
                                    className="w-full rounded-lg border px-3 py-2.5 text-sm"
                                />

                                {errors.due_date && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.due_date[0]}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="mt-5">
                            <label className="mb-1.5 block text-sm font-medium">
                                Description
                            </label>

                            <textarea
                                rows={4}
                                value={form.description}
                                onChange={(e) =>
                                    updateField(
                                        "description",
                                        e.target.value
                                    )
                                }
                                className="w-full resize-none rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-gray-900"
                                placeholder="Project description..."
                            />

                            {errors.description && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.description[0]}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 border-t bg-gray-50 px-6 py-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={processing}
                            className="rounded-lg border bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
                        >
                            {processing
                                ? "Saving..."
                                : project
                                    ? "Update Project"
                                    : "Create Project"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}