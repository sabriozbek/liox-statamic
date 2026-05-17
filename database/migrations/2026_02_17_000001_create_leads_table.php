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
        Schema::create('leads', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('company')->nullable();
            $table->string('email');
            $table->string('tel')->nullable();
            $table->string('employee_count')->nullable();
            $table->json('meta')->nullable();
            $table->json('utm')->nullable();
            $table->string('path')->nullable();
            $table->string('variant_id')->nullable();
            $table->enum('crm_status', ['pending', 'synced', 'error', 'skipped'])->default('pending');
            $table->text('crm_message')->nullable();
            $table->timestamps();
            $table->softDeletes();

            // Indexes
            $table->index(['email', 'deleted_at']);
            $table->index(['crm_status']);
            $table->index(['created_at']);
            $table->index(['path']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('leads');
    }
};
