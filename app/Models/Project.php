<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $fillable = [
        'client_name',
        'project_name',
        'description',
        'status',
        'priority',
        'start_date',
        'due_date',
    ];

    protected $casts = [
        'start_date' => 'date:Y-m-d',
        'due_date' => 'date:Y-m-d',
    ];

    public const STATUSES = [
        'Planning',
        'In Progress',
        'On Hold',
        'Completed',
    ];

    public const PRIORITIES = [
        'Low',
        'Medium',
        'High',
    ];
}