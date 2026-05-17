<?php

namespace App\Forms;

use Statamic\Forms\Submission as BaseSubmission;

class CustomFormSubmission extends BaseSubmission
{
    /**
     * Load from YAML file
     */
    public static function find($id): ?self
    {
        $parts = explode('.', $id);
        if (count($parts) < 2) {
            return null;
        }
        
        // Handle both old format (timestamp) and new format (timestamp.random)
        $timestamp = $parts[0];
        
        $formHandle = null;
        // Try to find the form from the stored files
        $formsPath = base_path('storage/forms');
        
        foreach (['lead', 'assessment', 'appointment'] as $handle) {
            $filePath = "{$formsPath}/{$handle}/{$id}.yaml";
            if (file_exists($filePath)) {
                $formHandle = $handle;
                break;
            }
        }
        
        if (!$formHandle) {
            return null;
        }
        
        $form = \Statamic\Facades\Form::find($formHandle);
        if (!$form) {
            return null;
        }
        
        $filePath = "{$formsPath}/{$formHandle}/{$id}.yaml";
        $data = \Symfony\Component\Yaml\Yaml::parseFile($filePath);
        
        $submission = new self();
        $submission->id($id);
        $submission->form($form);
        $submission->data($data['data'] ?? []);
        
        return $submission;
    }
    
    /**
     * Save submission to YAML
     */
    public function save()
    {
        $form = $this->form();
        if (!$form) {
            return false;
        }
        
        $storagePath = base_path("storage/forms/{$form->handle()}");
        if (!is_dir($storagePath)) {
            mkdir($storagePath, 0755, true);
        }
        
        $id = $this->id();
        $filePath = "{$storagePath}/{$id}.yaml";
        
        $yamlData = [
            'data' => $this->data(),
        ];
        
        file_put_contents($filePath, \Symfony\Component\Yaml\Yaml::dump($yamlData, 10));
        
        return true;
    }
    
    /**
     * Delete submission YAML file
     */
    public function delete()
    {
        $form = $this->form();
        if (!$form) {
            return false;
        }
        
        $filePath = base_path("storage/forms/{$form->handle()}/{$this->id()}.yaml");
        
        if (file_exists($filePath)) {
            unlink($filePath);
        }
        
        return true;
    }
}
