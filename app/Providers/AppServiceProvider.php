<?php

namespace App\Providers;

use App\Actions\ResendLeadSubmissionToCrm;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Event;
use App\Services\CrmService;
use App\Services\SeoService;
use App\Services\MailService;
use App\Integrations\StatamicForms\FormSubmissionHandler;
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
    }
}
