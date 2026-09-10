<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Http\Resources\ProjectResource;
use App\Models\Project;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    /**
     * GET /projects
     */
    public function index(Request $request)
    {
        $query = Project::query();

        /*
        |--------------------------------------------------------------------------
        | Search
        |--------------------------------------------------------------------------
        */

        if ($request->filled('search')) {
            $search = trim($request->string('search')->toString());

            $query->where(function ($q) use ($search) {
                $q->where('client_name', 'like', "%{$search}%")
                    ->orWhere('project_name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        /*
        |--------------------------------------------------------------------------
        | Status filter
        |--------------------------------------------------------------------------
        */

        if (
            $request->filled('status') &&
            in_array($request->status, Project::STATUSES, true)
        ) {
            $query->where('status', $request->status);
        }

        /*
        |--------------------------------------------------------------------------
        | Priority filter
        |--------------------------------------------------------------------------
        */

        if (
            $request->filled('priority') &&
            in_array($request->priority, Project::PRIORITIES, true)
        ) {
            $query->where('priority', $request->priority);
        }

        /*
        |--------------------------------------------------------------------------
        | Sorting
        |--------------------------------------------------------------------------
        */

        $allowedSorts = [
            'id',
            'client_name',
            'project_name',
            'status',
            'priority',
            'start_date',
            'due_date',
            'created_at',
        ];

        $sort = $request->input('sort', 'created_at');

        if (! in_array($sort, $allowedSorts, true)) {
            $sort = 'created_at';
        }

        $direction = strtolower(
            $request->input('direction', 'desc')
        );

        if (! in_array($direction, ['asc', 'desc'], true)) {
            $direction = 'desc';
        }

        $query->orderBy($sort, $direction);

        /*
        |--------------------------------------------------------------------------
        | Pagination
        |--------------------------------------------------------------------------
        */

        $perPage = min(
            max((int) $request->input('per_page', 10), 1),
            100
        );

        $projects = $query
            ->paginate($perPage)
            ->withQueryString();

        return ProjectResource::collection($projects);
    }

    /**
     * GET /projects/{id}
     */
    public function show(Project $project): ProjectResource
    {
        return new ProjectResource($project);
    }

    /**
     * POST /projects
     */
    public function store(
        StoreProjectRequest $request
    ): JsonResponse {
        $project = Project::create(
            $request->validated()
        );

        return response()->json([
            'message' => 'Project created successfully.',
            'data' => new ProjectResource($project),
        ], 201);
    }

    /**
     * PUT /projects/{id}
     */
    public function update(
        UpdateProjectRequest $request,
        Project $project
    ): JsonResponse {
        $project->update(
            $request->validated()
        );

        return response()->json([
            'message' => 'Project updated successfully.',
            'data' => new ProjectResource(
                $project->fresh()
            ),
        ]);
    }

    /**
     * DELETE /projects/{id}
     */
    public function destroy(Project $project): JsonResponse
    {
        $project->delete();

        return response()->json([
            'message' => 'Project deleted successfully.',
        ]);
    }
}