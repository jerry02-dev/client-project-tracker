Client Project Tracker

A full-stack Client Project Tracker built with Laravel 13, React, Inertia.js, and TypeScript.

The application allows a digital agency to manage client projects, including project status, priority, descriptions, dates, and basic project lifecycle operations.

Tech Stack
Backend
Laravel 13
PHP 8.2+
MySQL / SQLite
Laravel REST API
Form Request validation
API Resources
Frontend
React
TypeScript
Inertia.js
Tailwind CSS
Vite
Lucide React
Features
Project Management
View all projects
Create projects
Edit projects
Delete projects
View project details
Project status management
Project priority management
Start and due date management
Project description
Validation

The application validates:

Client name is required
Project name is required
Status must be a valid project status
Priority must be a valid priority
Due date cannot be earlier than the start date
Appropriate validation messages are returned to the frontend
Project Statuses
Planning
In Progress
On Hold
Completed
Priorities
Low
Medium
High
Optional Features

The project also includes:

Project search
Status filtering
Priority filtering
Sorting
Pagination
REST API
Database seed data
Feature tests
Requirements

Before installing the project, make sure the following are installed:

PHP 8.2 or higher
Composer
Node.js 20 or higher
npm
MySQL or SQLite
Git

Verify your installation:

php -v
composer -V
node -v
npm -v
Installation
1. Clone the repository
git clone YOUR_REPOSITORY_URL
cd client-project-tracker
2. Install PHP dependencies
composer install
3. Install frontend dependencies
npm install
4. Create the environment file
cp .env.example .env

Generate the application key:

php artisan key:generate
Database Configuration
MySQL

Update the .env file:

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=client_project_tracker
DB_USERNAME=root
DB_PASSWORD=

Create the database:

CREATE DATABASE client_project_tracker;
SQLite

Alternatively, configure SQLite:

DB_CONNECTION=sqlite

Create the database file:

touch database/database.sqlite
Run Migrations

Run the database migrations:

php artisan migrate

To populate the database with sample projects:

php artisan db:seed

Or run both:

php artisan migrate --seed
Generate Frontend Routes

If the project uses Wayfinder-generated routes, run:

php artisan wayfinder:generate

Then clear Laravel caches:

php artisan optimize:clear
Running the Application

The application requires two development processes.

Terminal 1 — Laravel
php artisan serve

The Laravel application will be available at:

http://127.0.0.1:8000
Terminal 2 — Vite

In another terminal:

npm run dev

Keep the Vite development server running while using the application.

Then open:

http://127.0.0.1:8000
REST API

The project exposes a REST API for project management.

List Projects
GET /api/projects

Example:

http://127.0.0.1:8000/api/projects
Get a Project
GET /api/projects/{id}

Example:

GET /api/projects/1
Create a Project
POST /api/projects

Example request:

{
    "client_name": "Acme Corporation",
    "project_name": "Company Website",
    "description": "Corporate website redesign",
    "status": "Planning",
    "priority": "High",
    "start_date": "2026-09-10",
    "due_date": "2026-10-30"
}
Update a Project
PUT /api/projects/{id}

Example:

PUT /api/projects/1
Delete a Project
DELETE /api/projects/{id}

Example:

DELETE /api/projects/1
API Response Example

A successful project response:

{
    "data": {
        "id": 1,
        "client_name": "Acme Corporation",
        "project_name": "Company Website",
        "description": "Corporate website redesign",
        "status": "Planning",
        "priority": "High",
        "start_date": "2026-09-10",
        "due_date": "2026-10-30",
        "created_at": "2026-09-10T05:00:00.000000Z",
        "updated_at": "2026-09-10T05:00:00.000000Z"
    }
}
Filtering and Search

The project listing API supports optional filtering and sorting.

Search
GET /api/projects?search=website
Status Filter
GET /api/projects?status=In Progress
Priority Filter
GET /api/projects?priority=High
Sorting
GET /api/projects?sort_by=due_date&sort_direction=asc
Combined Filters
GET /api/projects?search=website&status=Planning&priority=High
Routes

View all registered Laravel routes:

php artisan route:list

View only project routes:

php artisan route:list --path=projects

Expected API routes:

GET|HEAD       api/projects
POST           api/projects
GET|HEAD       api/projects/{project}
PUT|PATCH      api/projects/{project}
DELETE         api/projects/{project}
Testing

Run the Laravel test suite:

php artisan test

You can also run:

./vendor/bin/phpunit

The tests cover project creation, validation, updating, retrieving, and deleting projects.

Production Build

Build the frontend assets:

npm run build

Then optimize Laravel:

php artisan optimize

For production, configure the web server to point to Laravel's:

/public

directory.

Project Structure

The main project structure is:

app/
├── Http/
│   ├── Controllers/
│   │   ├── ProjectController.php
│   │   └── ProjectPageController.php
│   ├── Requests/
│   │   ├── StoreProjectRequest.php
│   │   └── UpdateProjectRequest.php
│   └── Resources/
│       └── ProjectResource.php
│
├── Models/
│   └── Project.php
│
database/
├── migrations/
│   └── xxxx_xx_xx_create_projects_table.php
└── seeders/
    └── ProjectSeeder.php
│
resources/
└── js/
    ├── components/
    │   ├── ProjectFormDialog.tsx
    │   └── ProjectStatusBadge.tsx
    │
    ├── pages/
    │   └── Projects/
    │       └── Index.tsx
    │
    └── types/
        └── project.ts
│
routes/
├── api.php
└── web.php
Architecture

The application separates the frontend and API responsibilities.

Inertia Frontend
GET /

Loads the React/Inertia project management interface.

REST API
/api/projects

Handles project CRUD operations.

This separation allows the API to be reused later by:

Mobile applications
External clients
Third-party integrations
Other frontend applications
Error Handling

Validation errors are returned using Laravel's standard validation response format.

Example:

{
    "message": "The given data was invalid.",
    "errors": {
        "client_name": [
            "The client name field is required."
        ],
        "due_date": [
            "The due date must be a date after or equal to the start date."
        ]
    }
}

The React interface displays these validation messages next to the appropriate form fields.

Development Commands

Useful commands during development:

# Start Laravel
php artisan serve

# Start Vite
npm run dev

# Clear application caches
php artisan optimize:clear

# Run migrations
php artisan migrate

# Reset and seed database
php artisan migrate:fresh --seed

# Generate Wayfinder routes
php artisan wayfinder:generate

# View routes
php artisan route:list

# Run tests
php artisan test

# Build production assets
npm run build
Quick Start

For an already-configured project:

composer install
npm install

cp .env.example .env
php artisan key:generate

php artisan migrate --seed

php artisan wayfinder:generate
php artisan optimize:clear

Then use two terminals:

Terminal 1

php artisan serve

Terminal 2

npm run dev

Open:

http://127.0.0.1:8000
Notes

The project is structured with maintainability and future expansion in mind. Business logic is separated from request validation and API serialization, while the React frontend communicates with the Laravel REST API.

The application can be extended with authentication, role-based access control, project activity history, file attachments, comments, notifications, and dashboard reporting in future iterations.
