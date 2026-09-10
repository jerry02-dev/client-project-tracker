<?php

namespace App\Http\Requests;

use App\Models\Project;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'client_name' => [
                'required',
                'string',
                'max:255',
            ],

            'project_name' => [
                'required',
                'string',
                'max:255',
            ],

            'description' => [
                'nullable',
                'string',
            ],

            'status' => [
                'required',
                Rule::in(Project::STATUSES),
            ],

            'priority' => [
                'required',
                Rule::in(Project::PRIORITIES),
            ],

            'start_date' => [
                'nullable',
                'date',
            ],

            'due_date' => [
                'nullable',
                'date',
                'after_or_equal:start_date',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'client_name.required' => 'Client name is required.',

            'project_name.required' => 'Project name is required.',

            'status.in' => 'Please select a valid project status.',

            'priority.in' => 'Please select a valid project priority.',

            'due_date.after_or_equal' =>
                'Due date cannot be earlier than the start date.',
        ];
    }
}