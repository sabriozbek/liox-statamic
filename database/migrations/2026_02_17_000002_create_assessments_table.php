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
        Schema::create('assessments', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('company')->nullable();
            $table->string('email');
            $table->string('tel')->nullable();
            $table->string('employee_count')->nullable();
            $table->string('sector')->nullable();
            $table->string('current_erp')->nullable();
            $table->text('current_challenges')->nullable();
            $table->text('goals')->nullable();
            $table->string('budget_range')->nullable();
            $table->string('timeline')->nullable();
            $table->json('meta')->nullable();
            $table->json('utm')->nullable();
            $table->string('path')->nullable();
            $table->string('variant_id')->nullable();
            $table->enum('crm_status', ['pending', 'synced', 'error'])->default('pending');
            $table->text('crm_message')->nullable();
            $table->timestamps();
            $table->softDeletes();

            // Indexes
            $table->index(['email', 'deleted_at']);
            $table->index(['crm_status']);
            $table->index(['created_at']);
            $table->index(['sector']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assessments');
    }
};
