<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Task;
use App\Models\TaskList;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $tasks = Task::whereHas('list', function ($query) {
            $query->where('user_id', auth()->id());
        })
        ->with('list')
        ->get();

        $lists = TaskList::where('user_id', auth()->id())->get();

        return Inertia::render('Tasks/Index', [
            'tasks' => $tasks,
            'lists' => $lists,
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $lists = TaskList::where('user_id', auth()->id())->get();

        return Inertia::render('Tasks/Create', [
            'lists' => $lists,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_completed' => 'boolean',
            'due_date' => 'nullable|date',
            'list_id' => 'required|exists:lists,id',
        ]);

        // Make sure the list belongs to the logged-in user
        $list = TaskList::where('id', $validated['list_id'])
            ->where('user_id', auth()->id())
            ->firstOrFail();

        Task::create($validated);

        return redirect()
            ->route('tasks.index')
            ->with('success', 'Task created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(Task $task)
    {
        $task->load('list');

        return Inertia::render('Tasks/Show', [
            'task' => $task,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Task $task)
    {
        $lists = TaskList::where('user_id', auth()->id())->get();

        return Inertia::render('Tasks/Edit', [
            'task' => $task,
            'lists' => $lists,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Task $task)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_completed' => 'boolean',
            'due_date' => 'nullable|date',
            'list_id' => 'required|exists:lists,id',
        ]);

        // Make sure the new list belongs to the logged-in user
        TaskList::where('id', $validated['list_id'])
            ->where('user_id', auth()->id())
            ->firstOrFail();

        $task->update($validated);

        return redirect()
            ->route('tasks.index')
            ->with('success', 'Task updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
    {
        $task->delete();

        return redirect()
            ->route('tasks.index')
            ->with('success', 'Task deleted successfully');
    }
}
