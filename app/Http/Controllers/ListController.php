<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\TaskList;

class ListController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $lists = TaskList::where('user_id', auth()->id())
            ->withCount('tasks')
            ->with('tasks')
            ->get();

        return Inertia::render('Lists/Index', [
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
        return Inertia::render('Lists/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        TaskList::create([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'user_id' => auth()->id(),
        ]);

        return redirect()
            ->route('lists.index')
            ->with('success', 'List created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(TaskList $list)
    {
        // Make sure the list belongs to the logged-in user
        abort_unless($list->user_id === auth()->id(), 403);

        $list->load('tasks');

        return Inertia::render('Lists/Show', [
            'list' => $list,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(TaskList $list)
    {
        abort_unless($list->user_id === auth()->id(), 403);

        return Inertia::render('Lists/Edit', [
            'list' => $list,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, TaskList $list)
    {
        abort_unless($list->user_id === auth()->id(), 403);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $list->update($validated);

        return redirect()
            ->route('lists.index')
            ->with('success', 'List updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TaskList $list)
    {
        abort_unless($list->user_id === auth()->id(), 403);

        $list->delete();

        return redirect()
            ->route('lists.index')
            ->with('success', 'List deleted successfully');
    }
}