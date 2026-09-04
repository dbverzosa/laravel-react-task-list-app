<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\TaskList;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        // User's lists
        $lists = TaskList::where('user_id', $user->id)
            ->withCount('tasks')
            ->latest()
            ->take(10)
            ->get();

        // User's tasks
        $tasks = Task::whereHas('list', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->with('list:id,title')
            ->latest()
            ->take(10)
            ->get();

        // Total lists belonging to the user
        $totalLists = TaskList::where('user_id', $user->id)
            ->count();

        // Total tasks belonging to the user
        $totalTasks = Task::whereHas('list', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->count();

        // Completed tasks belonging to the user
        $completedTasks = Task::whereHas('list', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->where('is_completed', true)
            ->count();

        // Completion rate
        $completionRate = $totalTasks > 0
            ? round(($completedTasks / $totalTasks) * 100)
            : 0;

        return Inertia::render('dashboard', [
            'lists' => $lists,
            'tasks' => $tasks,

            'stats' => [
                'totalLists' => $totalLists,
                'totalTasks' => $totalTasks,
                'completedTasks' => $completedTasks,
                'completionRate' => $completionRate,
            ],
        ]);
    }
}