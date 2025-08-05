<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    protected $fillable = [
        'title',
        'description',
        'category',
        'priority',
        'status',
        'deadline',
        'user_id',
    ];
}

