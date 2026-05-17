<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('mail_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('automation_rule_id')->nullable()->constrained('automation_rules')->nullOnDelete();
            $table->foreignId('mail_template_id')->nullable()->constrained('mail_templates')->nullOnDelete();
            $table->string('channel')->default('email');
            $table->string('trigger')->nullable();
            $table->nullableMorphs('related');
            $table->string('form_handle')->nullable();
            $table->string('recipient_email');
            $table->string('recipient_name')->nullable();
            $table->string('subject')->nullable();
            $table->string('status')->default('pending');
            $table->string('provider')->nullable();
            $table->string('message_id')->nullable();
            $table->unsignedInteger('opens_count')->default(0);
            $table->unsignedInteger('clicks_count')->default(0);
            $table->timestamp('last_opened_at')->nullable();
            $table->timestamp('last_clicked_at')->nullable();
            $table->timestamp('sent_at')->nullable();
            $table->timestamp('failed_at')->nullable();
            $table->text('error_message')->nullable();
            $table->json('payload')->nullable();
            $table->json('meta')->nullable();
            $table->timestamps();

            $table->index(['status', 'created_at']);
            $table->index(['recipient_email']);
            $table->index(['trigger']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mail_logs');
    }
};
