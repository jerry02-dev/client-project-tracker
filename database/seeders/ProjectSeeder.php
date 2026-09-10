<?php

namespace Database\Seeders;

use App\Models\Project;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    public function run(): void
    {
        $projects = [
            [
                'client_name' => 'Acme Corporation',
                'project_name' => 'Corporate Website',
                'description' => 'Company website redesign and development.',
                'status' => 'In Progress',
                'priority' => 'High',
                'start_date' => '2026-08-01',
                'due_date' => '2026-10-15',
            ],

            [
                'client_name' => 'Bright Media',
                'project_name' => 'Marketing Landing Page',
                'description' => 'Landing page for the upcoming marketing campaign.',
                'status' => 'Planning',
                'priority' => 'Medium',
                'start_date' => '2026-09-10',
                'due_date' => '2026-09-30',
            ],

            [
                'client_name' => 'Northstar Solutions',
                'project_name' => 'Internal Dashboard',
                'description' => 'Business intelligence and reporting dashboard.',
                'status' => 'On Hold',
                'priority' => 'Low',
                'start_date' => '2026-07-01',
                'due_date' => '2026-11-01',
            ],

            [
                'client_name' => 'Greenline Retail',
                'project_name' => 'E-Commerce Platform',
                'description' => 'Online store with product catalog and checkout.',
                'status' => 'Completed',
                'priority' => 'High',
                'start_date' => '2026-05-01',
                'due_date' => '2026-08-30',
            ],
        ];

        foreach ($projects as $project) {
            Project::create($project);
        }
    }
}