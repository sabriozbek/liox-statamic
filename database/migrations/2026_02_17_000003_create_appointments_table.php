<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('appointments', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('company')->nullable();
            $table->string('email');
            $table->string('tel')->nullable();
            $table->date('preferred_date');
            $table->string('preferred_time')->nullable();
            $table->string('sector')->nullable();
            $table->text('notes')->nullable();
            $table->json('meta')->nullable();
            $table->json('utm')->nullable();
            $table->string('path')->nullable();
            $table->string('variant_id')->nullable();
            $table->enum('status', ['pending', 'confirmed', 'completed', 'cancelled'])->default('pending');
            $table->enum('crm_status', ['pending', 'synced', 'error'])->default('pending');
            $table->text('crm_message')->nullable();
            $table->timestamp('reminder_sent_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            // Indexes
            $table->index(['email', 'deleted_at']);
            $table->index(['status']);
            $table->index(['crm_status']);
            $table->index(['preferred_date']);
            $table->index(['created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};
