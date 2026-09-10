<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProjectPageController;

Route::inertia('/', 'welcome')->name('home');

Route::get('/', [
    ProjectPageController::class,
    'index',
])->name('projects.page');


Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

require __DIR__.'/settings.php';
