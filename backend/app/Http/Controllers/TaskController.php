<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TaskController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum'); 
    }

    public function index()
    {
        
        $user = Auth::user();
        $tasks = Task::where('user_id', $user->id)
            ->orderBy('deadline', 'asc')
            ->get();

        return response()->json($tasks);
    }

    public function store(Request $request)
{
    $validatedData = $request->validate([
        'title' => 'required|string',
        'description' => 'required|string',
        'category' => 'required|string',
        'priority' => 'required|string',
        'deadline' => 'required|date',
        'status' => 'required|string',
    ]);

    $task = Task::create([
        'title' => $validatedData['title'],
        'description' => $validatedData['description'],
        'category' => $validatedData['category'],
        'priority' => $validatedData['priority'],
        'deadline' => $validatedData['deadline'],
        'status' => $validatedData['status'],
        'user_id' => auth()->id(),  
    ]);

    return response()->json($task, 201);
}


    public function update(Request $request, $id)
    {
        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'category' => 'sometimes|required|string',
            'priority' => 'sometimes|required|string|in:Haute,Moyenne,Basse',
            'deadline' => 'sometimes|required|date',
            'status' => 'sometimes|required|string|in:À faire,En cours,Terminé,Annulé',
        ]);

        $user = Auth::user();

        $task = Task::where('id', $id)->where('user_id', $user->id)->firstOrFail();
        $task->update($request->all());

        return response()->json($task);
    }

    public function destroy($id)
    {
        $user = Auth::user();
        $task = Task::where('id', $id)->where('user_id', $user->id)->firstOrFail();
        $task->delete();

        return response()->json(['message' => 'Task deleted']);
    }
}

