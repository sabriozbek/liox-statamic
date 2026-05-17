<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\LeadController;
use App\Http\Controllers\Api\AssessmentController;
use App\Http\Controllers\Api\AppointmentController;
use App\Http\Controllers\Api\MailController;
use App\Http\Controllers\Api\SitemapController;
use App\Http\Controllers\Api\SeoController;
use App\Http\Controllers\Api\FormWebhookController;
use App\Http\Controllers\Api\FormController;
use App\Http\Controllers\Api\PageContentController;
use App\Http\Controllers\Api\SectorContentController;
use App\Http\Controllers\Api\ModuleContentController;
use App\Http\Controllers\Api\TestimonialContentController;
use App\Http\Controllers\Api\PopupContentController;
use App\Http\Controllers\Api\BlogContentController;
use App\Http\Controllers\Api\EventContentController;
use App\Http\Controllers\Api\NewsContentController;
use App\Http\Controllers\Api\NotificationContentController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Statamic Forms - Submit forms to Statamic
Route::post('/forms/{handle}', [FormController::class, 'submit'])->middleware('throttle:10,1');
Route::get('/forms/{handle}/submissions', [FormController::class, 'submissions']);

// Statamic Forms Webhook - handles all form submissions
Route::post('/forms/webhook', [FormWebhookController::class, 'handle'])->middleware('throttle:20,1');

// Public API Routes - Lead, Assessment, Appointment
Route::prefix('crm')->group(function () {
    Route::post('/lead', [LeadController::class, 'store'])->middleware('throttle:10,1');
});

Route::post('/assessment', [AssessmentController::class, 'store'])->middleware('throttle:10,1');
Route::post('/appointment', [AppointmentController::class, 'store'])->middleware('throttle:10,1');

// Mail Tracking
Route::prefix('mail-tracker')->group(function () {
    Route::get('/open/{id}', [MailController::class, 'trackOpen']);
    Route::get('/click/{id}', [MailController::class, 'trackClick']);
});

// Sitemap
Route::get('/sitemap.xml', [SitemapController::class, 'index'])->name('sitemap.xml');

// SEO
Route::get('/seo/og-image/{page}', [SeoController::class, 'ogImage']);

// Admin API Routes
Route::prefix('admin')->middleware(['auth:sanctum'])->group(function () {
    // Leads
    Route::get('/leads', [LeadController::class, 'index']);
    Route::get('/leads/{id}', [LeadController::class, 'show']);
    Route::post('/leads/{id}/resync', [LeadController::class, 'resync']);

    // Assessments
    Route::get('/assessments', [AssessmentController::class, 'index']);
    Route::get('/assessments/{id}', [AssessmentController::class, 'show']);

    // Appointments
    Route::get('/appointments', [AppointmentController::class, 'index']);
    Route::get('/appointments/{id}', [AppointmentController::class, 'show']);
    Route::patch('/appointments/{id}/status', [AppointmentController::class, 'updateStatus']);
});

// Page Content API
Route::prefix('page')->group(function () {
    Route::get('/', [PageContentController::class, 'index']);
    Route::get('/home/content', [PageContentController::class, 'home']);
    Route::get('/{slug}', [PageContentController::class, 'show']);
});

// Global Content API
Route::prefix('global')->group(function () {
    Route::get('/announcement', [PageContentController::class, 'announcement']);
    Route::get('/settings', [PageContentController::class, 'settings']);
});

// Sector Content API
Route::prefix('sectors')->group(function () {
    Route::get('/', [SectorContentController::class, 'index']);
    Route::get('/{slug}', [SectorContentController::class, 'show']);
});

Route::prefix('modules')->group(function () {
    Route::get('/', [ModuleContentController::class, 'index']);
    Route::get('/{slug}', [ModuleContentController::class, 'show']);
});

Route::prefix('testimonials')->group(function () {
    Route::get('/', [TestimonialContentController::class, 'index']);
});

Route::prefix('events')->group(function () {
    Route::get('/', [EventContentController::class, 'index']);
    Route::get('/{slug}', [EventContentController::class, 'show']);
});

Route::prefix('news')->group(function () {
    Route::get('/', [NewsContentController::class, 'index']);
    Route::get('/{slug}', [NewsContentController::class, 'show']);
});

Route::prefix('notifications')->group(function () {
    Route::get('/', [NotificationContentController::class, 'index']);
});

Route::prefix('popups')->group(function () {
    Route::get('/', [PopupContentController::class, 'index']);
    Route::get('/script/{slug}.js', [PopupContentController::class, 'script']);
});

// Blog Content API
Route::prefix('blog')->group(function () {
    Route::get('/', [BlogContentController::class, 'index']);
    Route::get('/featured', [BlogContentController::class, 'featured']);
    Route::get('/pinned', [BlogContentController::class, 'pinned']);
    Route::get('/popular', [BlogContentController::class, 'popular']);
    Route::get('/categories', [BlogContentController::class, 'categories']);
    Route::get('/tags', [BlogContentController::class, 'tags']);
    Route::get('/category/{slug}', [BlogContentController::class, 'byCategory']);
    Route::get('/related/{slug}', [BlogContentController::class, 'related']);
    Route::post('/{slug}/view', [BlogContentController::class, 'incrementView']);
    Route::get('/{slug}', [BlogContentController::class, 'show']);
});
