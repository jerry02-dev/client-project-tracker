export type ProjectStatus =
    | "Planning"
    | "In Progress"
    | "On Hold"
    | "Completed";

export type ProjectPriority =
    | "Low"
    | "Medium"
    | "High";

export interface Project {
    id: number;
    client_name: string;
    project_name: string;
    description: string | null;
    status: ProjectStatus;
    priority: ProjectPriority;
    start_date: string | null;
    due_date: string | null;
    created_at: string | null;
    updated_at: string | null;
}

export interface ProjectFormData {
    client_name: string;
    project_name: string;
    description: string;
    status: ProjectStatus;
    priority: ProjectPriority;
    start_date: string;
    due_date: string;
}

export interface PaginatedProjects {
    data: Project[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}