<?php

namespace App\Providers;

use App\Actions\ResendLeadSubmissionToCrm;
use App\Services\StatamicGitSyncService;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Log;
use App\Services\CrmService;
use App\Services\SeoService;
use App\Services\MailService;
use App\Integrations\StatamicForms\FormSubmissionHandler;
use Statamic\Events\EntryDeleted;
use Statamic\Events\EntrySaved;
use Statamic\Events\SubmissionCreated;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(CrmService::class, function ($app) {
            return new CrmService(
                config('services.crm.login_url'),
                config('services.crm.save_url'),
                config('services.crm.username'),
                config('services.crm.password')
            );
        });

        $this->app->singleton(SeoService::class);
        $this->app->singleton(MailService::class);
        $this->app->singleton(FormSubmissionHandler::class);
        $this->app->singleton(StatamicGitSyncService::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        ResendLeadSubmissionToCrm::register();

        // Statamic Form submission event listener
        Event::listen(SubmissionCreated::class, function (SubmissionCreated $event) {
            $handler = app(FormSubmissionHandler::class);
            
            $form = $event->submission->form();
            $formHandle = $form ? $form->handle() : 'unknown';
            
            $handler->handle(
                $formHandle,
                $event->submission->data(),
                [
                    'id' => $event->submission->id(),
                    'ip_address' => request()->ip(),
                    'user_agent' => request()->userAgent(),
                    'created_at' => $event->submission->created_at()?->toIso8601String(),
                ]
            );
        });

        Event::listen(EntrySaved::class, function (EntrySaved $event) {
            try {
                app(StatamicGitSyncService::class)->sync('Statamic entry saved: '.$event->entry->id(), [
                    'entry' => $event->entry->id(),
                    'collection' => $event->entry->collectionHandle(),
                    'slug' => $event->entry->slug(),
                    'uri' => $event->entry->uri(),
                ]);
            } catch (\Throwable $e) {
                Log::error('Statamic git sync failed after entry save.', [
                    'entry' => $event->entry->id(),
                    'message' => $e->getMessage(),
                ]);
            }
        });

        Event::listen(EntryDeleted::class, function (EntryDeleted $event) {
            try {
                app(StatamicGitSyncService::class)->sync('Statamic entry deleted: '.$event->entry->id(), [
                    'entry' => $event->entry->id(),
                    'collection' => $event->entry->collectionHandle(),
                    'slug' => $event->entry->slug(),
                    'uri' => $event->entry->uri(),
                ]);
            } catch (\Throwable $e) {
                Log::error('Statamic git sync failed after entry delete.', [
                    'entry' => $event->entry->id(),
                    'message' => $e->getMessage(),
                ]);
            }
        });
    }
}
