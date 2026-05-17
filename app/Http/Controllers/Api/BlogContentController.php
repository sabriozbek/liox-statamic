<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Statamic\Facades\Asset;
use Statamic\Facades\Entry;
use Statamic\Facades\Term;
use Statamic\Facades\Taxonomy;
use Illuminate\Http\JsonResponse;

class BlogContentController extends Controller
{
    /**
     * Get all blog posts
     */
    public function index(): JsonResponse
    {
        $posts = Entry::query()
            ->where('collection', 'blog')
            ->where('status', 'published')
            ->orderBy('publish_date', 'desc')
            ->get()
            ->map(function ($post) {
                return $this->formatPost($post);
            });

        return response()->json([
            'data' => $posts,
            'total' => $posts->count(),
        ]);
    }

    /**
     * Get a single blog post by slug
     */
    public function show(string $slug): JsonResponse
    {
        $post = Entry::query()
            ->where('collection', 'blog')
            ->where('slug', $slug)
            ->where('status', 'published')
            ->first();

        if (!$post) {
            return response()->json([
                'error' => 'Blog post not found',
            ], 404);
        }

        return response()->json([
            'data' => $this->formatPost($post),
        ]);
    }

    /**
     * Increment blog post view count
     */
    public function incrementView(string $slug): JsonResponse
    {
        $post = Entry::query()
            ->where('collection', 'blog')
            ->where('slug', $slug)
            ->where('status', 'published')
            ->first();

        if (! $post) {
            return response()->json([
                'error' => 'Blog post not found',
            ], 404);
        }

        $currentViews = (int) $post->get('views', 0);
        $post->set('views', $currentViews + 1);
        $post->save();

        return response()->json([
            'success' => true,
            'views' => $currentViews + 1,
        ]);
    }

    /**
     * Get featured blog posts
     */
    public function featured(): JsonResponse
    {
        $posts = Entry::query()
            ->where('collection', 'blog')
            ->where('status', 'published')
            ->where('is_featured', true)
            ->orderBy('publish_date', 'desc')
            ->limit(6)
            ->get()
            ->map(function ($post) {
                return $this->formatPost($post);
            });

        return response()->json([
            'data' => $posts,
        ]);
    }

    /**
     * Get pinned blog posts
     */
    public function pinned(): JsonResponse
    {
        $posts = Entry::query()
            ->where('collection', 'blog')
            ->where('status', 'published')
            ->where('is_pinned', true)
            ->orderBy('publish_date', 'desc')
            ->get()
            ->map(function ($post) {
                return $this->formatPost($post);
            });

        return response()->json([
            'data' => $posts,
        ]);
    }

    /**
     * Get blog posts by category
     */
    public function byCategory(string $categorySlug): JsonResponse
    {
        $posts = Entry::query()
            ->where('collection', 'blog')
            ->where('status', 'published')
            ->orderBy('publish_date', 'desc')
            ->get()
            ->filter(function ($post) use ($categorySlug) {
                $value = $post->get('category');

                if (is_array($value)) {
                    $value = $value[0] ?? null;
                }

                if (is_string($value) && str_contains($value, '::')) {
                    $value = explode('::', $value)[1] ?? $value;
                }

                return $value === $categorySlug;
            })
            ->map(function ($post) {
                return $this->formatPost($post);
            });

        return response()->json([
            'data' => $posts,
            'total' => $posts->count(),
        ]);
    }

    /**
     * Get related blog posts
     */
    public function related(string $slug, int $limit = 3): JsonResponse
    {
        $post = Entry::query()
            ->where('collection', 'blog')
            ->where('slug', $slug)
            ->first();

        if (!$post) {
            return response()->json([
                'error' => 'Blog post not found',
            ], 404);
        }

        $posts = Entry::query()
            ->where('collection', 'blog')
            ->where('status', 'published')
            ->where('id', '!=', $post->id())
            ->orderBy('publish_date', 'desc')
            ->limit($limit)
            ->get()
            ->map(function ($p) {
                return $this->formatPost($p);
            });

        return response()->json([
            'data' => $posts,
        ]);
    }

    /**
     * Get popular blog posts (by views)
     */
    public function popular(int $limit = 5): JsonResponse
    {
        $posts = Entry::query()
            ->where('collection', 'blog')
            ->where('status', 'published')
            ->orderBy('views', 'desc')
            ->limit($limit)
            ->get()
            ->map(function ($post) {
                return $this->formatPost($post);
            });

        return response()->json([
            'data' => $posts,
        ]);
    }

    /**
     * Get all blog categories with post counts
     */
    public function categories(): JsonResponse
    {
        $categories = [];
        
        $categoryTaxonomy = Taxonomy::find('blog_categories');
        
        if ($categoryTaxonomy) {
            $terms = $categoryTaxonomy->queryTerms()->get();
            
            foreach ($terms as $term) {
                $postCount = Entry::query()
                    ->where('collection', 'blog')
                    ->where('status', 'published')
                    ->get()
                    ->filter(function ($post) use ($term) {
                        $value = $post->get('category');

                        if (is_array($value)) {
                            $value = $value[0] ?? null;
                        }

                        if (is_string($value) && str_contains($value, '::')) {
                            $value = explode('::', $value)[1] ?? $value;
                        }

                        return $value === $term->slug();
                    })
                    ->count();
                
                $categories[] = [
                    'id' => $term->id(),
                    'title' => $term->get('title'),
                    'slug' => $term->slug(),
                    'description' => $term->get('description') ?? '',
                    'post_count' => $postCount,
                ];
            }
        }
        
        return response()->json([
            'data' => $categories,
        ]);
    }

    /**
     * Get all blog tags
     */
    public function tags(): JsonResponse
    {
        $tags = [];
        
        $tagTaxonomy = Taxonomy::find('tags');
        
        if ($tagTaxonomy) {
            $terms = $tagTaxonomy->queryTerms()->get();
            
            foreach ($terms as $term) {
                $usageCount = Entry::query()
                    ->where('collection', 'blog')
                    ->where('status', 'published')
                    ->get()
                    ->filter(function ($post) use ($term) {
                        $values = $post->get('tags', []);

                        if (is_string($values)) {
                            $values = [$values];
                        }

                        foreach ($values as $value) {
                            if (is_array($value)) {
                                $value = $value['slug'] ?? $value['value'] ?? $value[0] ?? null;
                            }

                            if (is_string($value) && str_contains($value, '::')) {
                                $value = explode('::', $value)[1] ?? $value;
                            }

                            if ($value === $term->slug()) {
                                return true;
                            }
                        }

                        return false;
                    })
                    ->count();

                $tags[] = [
                    'id' => $term->id(),
                    'title' => $term->get('title'),
                    'slug' => $term->slug(),
                    'count' => $usageCount,
                ];
            }
        }
        
        return response()->json([
            'data' => $tags,
        ]);
    }

    /**
     * Format a blog post for API response
     */
    private function formatPost($post)
    {
        // Get category data
        $categoryData = null;
        $categorySlug = $post->get('category');
        if (is_array($categorySlug)) {
            $categorySlug = $categorySlug[0] ?? null;
        }

        if (is_string($categorySlug) && str_contains($categorySlug, '::')) {
            $categorySlug = explode('::', $categorySlug)[1] ?? $categorySlug;
        }

        if ($categorySlug) {
            $categoryTerm = Term::find("blog_categories::$categorySlug");
            if ($categoryTerm) {
                $categoryData = [
                    'title' => $categoryTerm->get('title'),
                    'slug' => $categorySlug,
                    'color' => $categoryTerm->get('color') ?? 'blue',
                ];
            } else {
                // Fallback if term not found
                $categoryData = [
                    'title' => ucfirst(str_replace('-', ' ', $categorySlug)),
                    'slug' => $categorySlug,
                    'color' => 'blue',
                ];
            }
        }

        // Get tags data
        $tagsData = [];
        $tagSlugs = $post->get('tags', []);
        if (is_string($tagSlugs)) {
            $tagSlugs = [$tagSlugs];
        }
        if (!empty($tagSlugs)) {
            foreach ($tagSlugs as $tagSlug) {
                if (is_array($tagSlug)) {
                    $tagSlug = $tagSlug['slug'] ?? $tagSlug['value'] ?? $tagSlug[0] ?? null;
                }

                if (is_string($tagSlug) && str_contains($tagSlug, '::')) {
                    $tagSlug = explode('::', $tagSlug)[1] ?? $tagSlug;
                }

                if (!$tagSlug) {
                    continue;
                }

                $tagTerm = Term::find("tags::$tagSlug");
                if ($tagTerm) {
                    $tagsData[] = [
                        'title' => $tagTerm->get('title'),
                        'slug' => $tagSlug,
                    ];
                } else {
                    $tagsData[] = [
                        'title' => ucfirst(str_replace('-', ' ', $tagSlug)),
                        'slug' => $tagSlug,
                    ];
                }
            }
        }

        return [
            'id' => $post->id(),
            'title' => $post->get('title'),
            'slug' => $post->slug(),
            'excerpt' => $post->get('excerpt') ?? '',
            'content' => $post->get('content'),
            'featured_image' => $this->normalizeAssetUrl($post->get('featured_image')),
            'featured_image_alt' => $post->get('featured_image_alt') ?? '',
            'author' => $post->get('author') ?? '',
            'author_role' => $post->get('author_role') ?? '',
            'author_avatar' => $this->normalizeAssetUrl($post->get('author_avatar')),
            'author_bio' => $post->get('author_bio') ?? '',
            'publish_date' => $post->get('publish_date') ?? '',
            'reading_time' => (int) $post->get('reading_time', 0),
            'category' => $categoryData,
            'tags' => $tagsData,
            'is_featured' => (bool) $post->get('is_featured', false),
            'is_pinned' => (bool) $post->get('is_pinned', false),
            'show_in_intro' => (bool) $post->get('show_in_intro', false),
            'show_in_intro_right' => (bool) $post->get('show_in_intro_right', false),
            'custom_badge' => $post->get('custom_badge') ?? '',
            'badge_color' => $post->get('badge_color', 'red'),
            'views' => (int) $post->get('views', 0),
            'template' => $post->get('template', 'standard'),
            'form_title' => $post->get('form_title') ?? '',
            'form_description' => $post->get('form_description') ?? '',
            'form_button_text' => $post->get('form_button_text') ?? '',
            'form_button_link' => $post->get('form_button_link') ?? '',
            'show_share_buttons' => (bool) $post->get('show_share_buttons', true),
            'enable_reading_progress' => (bool) $post->get('enable_reading_progress', true),
            'show_author_box' => (bool) $post->get('show_author_box', true),
            'show_related_posts' => (bool) $post->get('show_related_posts', true),
            'url' => '/blog/' . $post->slug(),
        ];
    }

    private function normalizeAssetUrl($value): string
    {
        if (empty($value)) {
            return '';
        }

        if (is_string($value)) {
            if (str_starts_with($value, 'http://') || str_starts_with($value, 'https://') || str_starts_with($value, '/')) {
                return $value;
            }

            if (str_contains($value, '::')) {
                return Asset::find($value)?->url() ?? '';
            }

            return url('/assets/' . ltrim($value, '/'));
        }

        if (is_array($value)) {
            $first = $value[0] ?? null;

            if (is_string($first)) {
                return $this->normalizeAssetUrl($first);
            }

            if (is_array($first)) {
                $candidate = $first['id'] ?? $first['path'] ?? $first['url'] ?? null;

                if ($candidate) {
                    return $this->normalizeAssetUrl($candidate);
                }
            }
        }

        return '';
    }
}
