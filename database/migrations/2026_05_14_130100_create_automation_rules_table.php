<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('automation_rules', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('trigger');
            $table->string('form_handle')->nullable();
            $table->foreignId('template_id')->nullable()->constrained('mail_templates')->nullOnDelete();
            $table->boolean('is_active')->default(true);
            $table->string('send_to')->default('submitter');
            $table->string('recipient_field')->default('email');
            $table->string('cc')->nullable();
            $table->string('bcc')->nullable();
            $table->json('conditions')->nullable();
            $table->unsignedInteger('delay_minutes')->default(0);
            $table->unsignedInteger('priority')->default(100);
            $table->boolean('stop_on_match')->default(false);
            $table->json('settings')->nullable();
            $table->timestamps();

            $table->index(['trigger', 'is_active']);
            $table->index(['form_handle']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('automation_rules');
    }
};
