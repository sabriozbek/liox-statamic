<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lead_entries', function (Blueprint $table) {
            $table->id();
            $table->string('site')->nullable();
            $table->string('collection');
            $table->uuid('uuid')->unique();
            $table->integer('status')->default(0);
            
            // Lead specific fields
            $table->string('name')->nullable();
            $table->string('email')->nullable();
            $table->string('tel')->nullable();
            $table->string('phone')->nullable();
            $table->string('company')->nullable();
            $table->string('sector')->nullable();
            $table->text('message')->nullable();
            $table->string('crm_status')->default('pending');
            $table->string('crm_lead_id')->nullable();
            $table->string('crm_message')->nullable();
            $table->string('ip_address')->nullable();
            $table->string('user_agent')->nullable();
            $table->string('priority')->default('normal');
            $table->integer('employee_count')->nullable();
            $table->json('meta')->nullable();
            $table->json('utm')->nullable();
            $table->string('path')->nullable();
            $table->unsignedBigInteger('variant_id')->nullable();
            
            // Statamic standard fields
            $table->string('slug')->nullable();
            $table->string('uri')->nullable();
            $table->string('title')->nullable();
            $table->text('excerpt')->nullable();
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            $table->index(['collection', 'status']);
            $table->index('crm_status');
            $table->index('email');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lead_entries');
    }
};