<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MorePagesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function dashboard(): Response
    {
        return Inertia::render('dashboard');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function laporan(): Response
    {
        return Inertia::render('reports/page');
    }
}
