import { Head } from "@inertiajs/react";
import {
    ChevronDown,
    ChevronUp,
    Pencil,
    Plus,
    Search,
    Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";

import ProjectFormDialog from "@/components/projects/ProjectFormDialog";
import ProjectStatusBadge from "@/components/projects/ProjectStatusBadge";

import type {
    PaginatedProjects,
    Project,
    ProjectPriority,
    ProjectStatus,
} from "@/types/project";

interface ApiResponse {
    data: Project[];
    meta?: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

const statuses: Array<
    ProjectStatus | "All"
> = [
    "All",
    "Planning",
    "In Progress",
    "On Hold",
    "Completed",
];

const priorities: Array<
    ProjectPriority | "All"
> = [
    "All",
    "Low",
    "Medium",
    "High",
];

export default function Index() {
    const [projects, setProjects] =
        useState<Project[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [search, setSearch] =
        useState("");

    const [status, setStatus] =
        useState<ProjectStatus | "All">("All");

    const [priority, setPriority] =
        useState<ProjectPriority | "All">("All");

    const [page, setPage] =
        useState(1);

    const [pagination, setPagination] =
        useState({
            current_page: 1,
            last_page: 1,
            total: 0,
        });

    const [sort, setSort] =
        useState("created_at");

    const [direction, setDirection] =
        useState<"asc" | "desc">("desc");

    const [dialogOpen, setDialogOpen] =
        useState(false);

    const [editingProject, setEditingProject] =
        useState<Project | null>(null);

    const fetchProjects = async () => {
        setLoading(true);

        try {
            const params = new URLSearchParams();

            if (search.trim()) {
                params.set(
                    "search",
                    search.trim()
                );
            }

            if (status !== "All") {
                params.set(
                    "status",
                    status
                );
            }

            if (priority !== "All") {
                params.set(
                    "priority",
                    priority
                );
            }

            params.set(
                "page",
                String(page)
            );

            params.set(
                "per_page",
                "10"
            );

            params.set(
                "sort",
                sort
            );

            params.set(
                "direction",
                direction
            );

            const response =
                await fetch(
                    `/projects?${params.toString()}`,
                    {
                        headers: {
                            Accept:
                                "application/json",
                        },
                    }
                );

            if (!response.ok) {
                throw new Error(
                    "Failed to load projects."
                );
            }

            const result: ApiResponse =
                await response.json();

            setProjects(result.data);

            if (result.meta) {
                setPagination({
                    current_page:
                        result.meta.current_page,
                    last_page:
                        result.meta.last_page,
                    total:
                        result.meta.total,
                });
            }
        } catch (error) {
            console.error(error);
            alert(
                "Unable to load projects."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, [
        page,
        status,
        priority,
        sort,
        direction,
    ]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setPage(1);
            fetchProjects();
        }, 400);

        return () =>
            clearTimeout(timeout);
    }, [search]);

    const openCreate = () => {
        setEditingProject(null);
        setDialogOpen(true);
    };

    const openEdit = (
        project: Project
    ) => {
        setEditingProject(project);
        setDialogOpen(true);
    };

    const deleteProject = async (
        project: Project
    ) => {
        const confirmed =
            window.confirm(
                `Delete "${project.project_name}"?`
            );

        if (!confirmed) {
            return;
        }

        try {
            const response =
                await fetch(
                    `/projects/${project.id}`,
                    {
                        method: "DELETE",
                        headers: {
                            Accept:
                                "application/json",
                        },
                    }
                );

            if (!response.ok) {
                throw new Error();
            }

            await fetchProjects();
        } catch {
            alert(
                "Unable to delete project."
            );
        }
    };

    const saved = async () => {
        setDialogOpen(false);
        setEditingProject(null);
        await fetchProjects();
    };

    const changeSort = (
        field: string
    ) => {
        if (sort === field) {
            setDirection(
                direction === "asc"
                    ? "desc"
                    : "asc"
            );
        } else {
            setSort(field);
            setDirection("asc");
        }

        setPage(1);
    };

    const SortIcon = ({
        field,
    }: {
        field: string;
    }) => {
        if (sort !== field) {
            return null;
        }

        return direction === "asc" ? (
            <ChevronUp className="h-3.5 w-3.5" />
        ) : (
            <ChevronDown className="h-3.5 w-3.5" />
        );
    };

    return (
        <>
            <Head title="Client Projects" />

            <div className="min-h-screen bg-gray-50">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    {/* Header */}

                    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                                Client Projects
                            </h1>

                            <p className="mt-1 text-sm text-gray-500">
                                Track client projects,
                                priorities, and
                                progress.
                            </p>
                        </div>

                        <button
                            onClick={openCreate}
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-gray-800"
                        >
                            <Plus className="h-4 w-4" />
                            New Project
                        </button>
                    </div>

                    {/* Filters */}

                    <div className="mb-5 rounded-xl border bg-white p-4 shadow-sm">
                        <div className="grid gap-3 md:grid-cols-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                                <input
                                    type="search"
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Search projects..."
                                    className="w-full rounded-lg border py-2.5 pl-9 pr-3 text-sm outline-none focus:border-gray-900"
                                />
                            </div>

                            <select
                                value={status}
                                onChange={(e) => {
                                    setStatus(
                                        e.target.value as
                                            | ProjectStatus
                                            | "All"
                                    );
                                    setPage(1);
                                }}
                                className="rounded-lg border px-3 py-2.5 text-sm"
                            >
                                {statuses.map(
                                    (item) => (
                                        <option
                                            key={item}
                                            value={item}
                                        >
                                            {item ===
                                            "All"
                                                ? "All Statuses"
                                                : item}
                                        </option>
                                    )
                                )}
                            </select>

                            <select
                                value={priority}
                                onChange={(e) => {
                                    setPriority(
                                        e.target.value as
                                            | ProjectPriority
                                            | "All"
                                    );
                                    setPage(1);
                                }}
                                className="rounded-lg border px-3 py-2.5 text-sm"
                            >
                                {priorities.map(
                                    (item) => (
                                        <option
                                            key={item}
                                            value={item}
                                        >
                                            {item ===
                                            "All"
                                                ? "All Priorities"
                                                : item}
                                        </option>
                                    )
                                )}
                            </select>

                            <button
                                onClick={() => {
                                    setSearch("");
                                    setStatus("All");
                                    setPriority(
                                        "All"
                                    );
                                    setPage(1);
                                }}
                                className="rounded-lg border px-3 py-2.5 text-sm font-medium hover:bg-gray-50"
                            >
                                Clear Filters
                            </button>
                        </div>
                    </div>

                    {/* Summary */}

                    <div className="mb-4 text-sm text-gray-500">
                        {pagination.total}{" "}
                        {pagination.total === 1
                            ? "project"
                            : "projects"}
                    </div>

                    {/* Table */}

                    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[1000px] text-left">
                                <thead className="border-b bg-gray-50">
                                    <tr>
                                        <th
                                            onClick={() =>
                                                changeSort(
                                                    "client_name"
                                                )
                                            }
                                            className="cursor-pointer px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500"
                                        >
                                            <div className="flex items-center gap-1">
                                                Client
                                                <SortIcon field="client_name" />
                                            </div>
                                        </th>

                                        <th
                                            onClick={() =>
                                                changeSort(
                                                    "project_name"
                                                )
                                            }
                                            className="cursor-pointer px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500"
                                        >
                                            <div className="flex items-center gap-1">
                                                Project
                                                <SortIcon field="project_name" />
                                            </div>
                                        </th>

                                        <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                            Status
                                        </th>

                                        <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                            Priority
                                        </th>

                                        <th
                                            onClick={() =>
                                                changeSort(
                                                    "start_date"
                                                )
                                            }
                                            className="cursor-pointer px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500"
                                        >
                                            <div className="flex items-center gap-1">
                                                Start
                                                <SortIcon field="start_date" />
                                            </div>
                                        </th>

                                        <th
                                            onClick={() =>
                                                changeSort(
                                                    "due_date"
                                                )
                                            }
                                            className="cursor-pointer px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500"
                                        >
                                            <div className="flex items-center gap-1">
                                                Due
                                                <SortIcon field="due_date" />
                                            </div>
                                        </th>

                                        <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y">
                                    {loading ? (
                                        <tr>
                                            <td
                                                colSpan={7}
                                                className="px-5 py-16 text-center"
                                            >
                                                <div className="inline-flex items-center gap-2 text-sm text-gray-500">
                                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
                                                    Loading projects...
                                                </div>
                                            </td>
                                        </tr>
                                    ) : projects.length ===
                                      0 ? (
                                        <tr>
                                            <td
                                                colSpan={7}
                                                className="px-5 py-16 text-center"
                                            >
                                                <div className="text-sm font-medium text-gray-900">
                                                    No projects found
                                                </div>

                                                <p className="mt-1 text-sm text-gray-500">
                                                    Create a project
                                                    or change your
                                                    filters.
                                                </p>
                                            </td>
                                        </tr>
                                    ) : (
                                        projects.map(
                                            (
                                                project
                                            ) => (
                                                <tr
                                                    key={
                                                        project.id
                                                    }
                                                    className="hover:bg-gray-50"
                                                >
                                                    <td className="px-5 py-4">
                                                        <div className="font-medium text-gray-900">
                                                            {
                                                                project.client_name
                                                            }
                                                        </div>
                                                    </td>

                                                    <td className="max-w-xs px-5 py-4">
                                                        <div className="font-medium text-gray-900">
                                                            {
                                                                project.project_name
                                                            }
                                                        </div>

                                                        {project.description && (
                                                            <div className="mt-1 truncate text-xs text-gray-500">
                                                                {
                                                                    project.description
                                                                }
                                                            </div>
                                                        )}
                                                    </td>

                                                    <td className="px-5 py-4">
                                                        <ProjectStatusBadge
                                                            type="status"
                                                            value={
                                                                project.status
                                                            }
                                                        />
                                                    </td>

                                                    <td className="px-5 py-4">
                                                        <ProjectStatusBadge
                                                            type="priority"
                                                            value={
                                                                project.priority
                                                            }
                                                        />
                                                    </td>

                                                    <td className="px-5 py-4 text-sm text-gray-600">
                                                        {project.start_date ??
                                                            "—"}
                                                    </td>

                                                    <td className="px-5 py-4 text-sm text-gray-600">
                                                        {project.due_date ??
                                                            "—"}
                                                    </td>

                                                    <td className="px-5 py-4">
                                                        <div className="flex justify-end gap-2">
                                                            <button
                                                                onClick={() =>
                                                                    openEdit(
                                                                        project
                                                                    )
                                                                }
                                                                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                                                                title="Edit"
                                                            >
                                                                <Pencil className="h-4 w-4" />
                                                            </button>

                                                            <button
                                                                onClick={() =>
                                                                    deleteProject(
                                                                        project
                                                                    )
                                                                }
                                                                className="rounded-lg p-2 text-gray-500 hover:bg-red-50 hover:text-red-600"
                                                                title="Delete"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}

                        {!loading &&
                            pagination.last_page >
                                1 && (
                                <div className="flex items-center justify-between border-t px-5 py-4">
                                    <p className="text-sm text-gray-500">
                                        Page{" "}
                                        {
                                            pagination.current_page
                                        }{" "}
                                        of{" "}
                                        {
                                            pagination.last_page
                                        }
                                    </p>

                                    <div className="flex gap-2">
                                        <button
                                            disabled={
                                                page <=
                                                1
                                            }
                                            onClick={() =>
                                                setPage(
                                                    (p) =>
                                                        p -
                                                        1
                                                )
                                            }
                                            className="rounded-lg border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                                        >
                                            Previous
                                        </button>

                                        <button
                                            disabled={
                                                page >=
                                                pagination.last_page
                                            }
                                            onClick={() =>
                                                setPage(
                                                    (p) =>
                                                        p +
                                                        1
                                                )
                                            }
                                            className="rounded-lg border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            )}
                    </div>
                </div>
            </div>

            <ProjectFormDialog
                open={dialogOpen}
                project={editingProject}
                onClose={() => {
                    if (!loading) {
                        setDialogOpen(false);
                    }
                }}
                onSaved={saved}
            />
        </>
    );
}