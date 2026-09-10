<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class ProjectPageController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Projects/Index');
    }
}