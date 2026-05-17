<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;

class StatamicGitSyncService
{
    public function sync(string $message, array $context = []): void
    {
        if (!config('statamic.git.enabled') || !config('statamic.git.push')) {
            Log::info('Statamic git sync skipped: feature disabled.', $context);
            return;
        }

        $repoPath = base_path();
        $gitBinary = config('statamic.git.binary', 'git');
        $gitUserName = config('statamic.git.user.name', 'Liox Statamic Bot');
        $gitUserEmail = config('statamic.git.user.email', 'bot@liox.uyumsoft.com');

        $paths = [
            'content',
            'resources/users',
            'resources/forms',
        ];

        $quotedPaths = implode(' ', array_map('escapeshellarg', $paths));
        $base = 'cd '.escapeshellarg($repoPath).' && ';

        $commands = [
            $base.$gitBinary.' status --short -- '. $quotedPaths,
            $base.$gitBinary.' add -- '. $quotedPaths,
            $base.$gitBinary.' -c '.escapeshellarg('user.name='.$gitUserName).' -c '.escapeshellarg('user.email='.$gitUserEmail).' commit -m '.escapeshellarg($message),
            $base.$gitBinary.' push origin '.escapeshellarg(env('GITHUB_SYNC_BRANCH', 'main')),
        ];

        $statusOutput = $this->run($commands[0]);

        Log::info('Statamic git sync status checked.', array_merge($context, [
            'status' => $statusOutput['output'],
        ]));

        if (trim($statusOutput['output']) === '') {
            Log::info('Statamic git sync skipped: no tracked changes detected.', $context);
            return;
        }

        $this->runOrFail($commands[1], 'git add failed');

        $commit = $this->run($commands[2]);
        if ($commit['exitCode'] !== 0) {
            if (str_contains($commit['output'], 'nothing to commit')) {
                Log::info('Statamic git sync skipped: nothing to commit after add.', array_merge($context, [
                    'commit_output' => $commit['output'],
                ]));
                return;
            }

            throw new \RuntimeException('git commit failed: '.$commit['output']);
        }

        $this->runOrFail($commands[3], 'git push failed');

        Log::info('Statamic git sync completed.', [
            'message' => $message,
            ...$context,
        ]);
    }

    private function runOrFail(string $command, string $errorMessage): void
    {
        $result = $this->run($command);

        if ($result['exitCode'] !== 0) {
            throw new \RuntimeException($errorMessage.': '.$result['output']);
        }
    }

    private function run(string $command): array
    {
        $output = [];
        $exitCode = 0;

        exec($command.' 2>&1', $output, $exitCode);

        return [
            'exitCode' => $exitCode,
            'output' => trim(implode("\n", $output)),
        ];
    }
}
