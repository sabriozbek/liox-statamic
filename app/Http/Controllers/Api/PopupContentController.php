<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Support\ResolvesStatamicAssets;
use Illuminate\Http\Response;
use Statamic\Facades\Entry;

class PopupContentController extends Controller
{
    use ResolvesStatamicAssets;

    public function index()
    {
        $entries = Entry::query()
            ->where('collection', 'popups')
            ->where('published', true)
            ->get()
            ->map(function ($entry) {
                return [
                    'id' => $entry->id(),
                    'slug' => $entry->slug(),
                    'title' => $entry->get('title'),
                    'is_active' => $entry->get('is_active', false),
                    'popup_type' => $entry->get('popup_type', 'modal_video'),
                    'trigger_type' => $entry->get('trigger_type', 'time_on_site'),
                    'description' => $entry->get('description'),
                    'iframe_src' => $entry->get('iframe_src'),
                    'image' => $this->resolveAssetUrl($entry->get('image')),
                    'cta_enabled' => $entry->get('cta_enabled', true),
                    'cta_label' => $entry->get('cta_label'),
                    'cta_url' => $entry->get('cta_url'),
                    'form_layout' => $entry->get('form_layout', 'content_left_form_right'),
                    'frequency' => $entry->get('frequency', 'once_per_session'),
                    'delay_seconds' => (int) ($entry->get('delay_seconds', 5)),
                    'scroll_percent' => $entry->get('scroll_percent'),
                    'show_again_after' => (int) ($entry->get('show_again_after', 7)),
                    'position' => $entry->get('position', 'bottomRight'),
                    'embed_mode' => $entry->get('embed_mode', 'corner'),
                    'pages' => $entry->get('pages') ?? [],
                    'exclude_pages' => $entry->get('exclude_pages') ?? [],
                    'design' => $entry->get('design', 'light'),
                    'size' => $entry->get('size', 'medium'),
                ];
            })->values();

        return response()->json($entries);
    }

    public function script(string $slug): Response
    {
        $entry = Entry::query()
            ->where('collection', 'popups')
            ->where('slug', $slug)
            ->first();

        if (! $entry) {
            return response('// popup not found', 404, ['Content-Type' => 'application/javascript']);
        }

        $config = [
            'title' => $entry->get('title'),
            'description' => $entry->get('description'),
            'iframe_src' => $entry->get('iframe_src'),
            'image' => $this->resolveAssetUrl($entry->get('image')),
            'cta_label' => $entry->get('cta_label'),
            'cta_url' => $entry->get('cta_url'),
            'position' => $entry->get('position', 'bottomRight'),
            'popup_type' => $entry->get('popup_type', 'mini_widget'),
            'design' => $entry->get('design', 'light'),
            'embed_mode' => $entry->get('embed_mode', 'corner'),
        ];

        $json = json_encode($config, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

        $script = <<<JS
(function(){
  var config = {$json};
  var d = document;
  var s = d.currentScript;
  var ds = s ? s.dataset : {};
  var pos = ds.position || config.position || 'bottomRight';
  var mode = ds.mode || config.embed_mode || 'corner';
  var ctaUrl = ds.ctaUrl || config.cta_url || '#';
  var title = config.title || 'LIOX ERP';
  var desc = config.description || '';
  var video = config.iframe_src || '';
  var root = d.createElement('div');
  root.style.position = 'fixed';
  root.style.zIndex = '2147483647';
  root.style.maxWidth = '420px';
  root.style.width = 'min(420px, calc(100vw - 24px))';
  root.style.boxSizing = 'border-box';
  root.style.fontFamily = 'system-ui,-apple-system,Segoe UI,sans-serif';

  var isMobile = false;
  try { isMobile = (window.innerWidth || 0) <= 640; } catch (e) {}

  if (mode === 'center') {
    root.style.inset = '0';
    root.style.display = 'flex';
    root.style.alignItems = 'center';
    root.style.justifyContent = 'center';
    root.style.padding = '12px';
    root.style.background = 'rgba(15,23,42,0.45)';
  } else if (isMobile) {
    var isTop = (pos === 'topLeft' || pos === 'topRight');
    if (isTop) root.style.top = '12px';
    else root.style.bottom = '12px';
    root.style.left = '50%';
    root.style.transform = 'translateX(-50%)';
  } else if (pos === 'topLeft') { root.style.top = '16px'; root.style.left = '16px'; }
  else if (pos === 'topRight') { root.style.top = '16px'; root.style.right = '16px'; }
  else if (pos === 'bottomLeft') { root.style.bottom = '16px'; root.style.left = '16px'; }
  else { root.style.bottom = '16px'; root.style.right = '16px'; }

  var card = d.createElement('div');
  card.style.background = '#ffffff';
  card.style.color = '#0f172a';
  card.style.borderRadius = '24px';
  card.style.boxShadow = '0 18px 45px rgba(15,23,42,0.35)';
  card.style.border = '1px solid rgba(148,163,184,0.6)';
  card.style.overflow = 'hidden';

  var header = d.createElement('div');
  header.style.display = 'flex';
  header.style.alignItems = 'center';
  header.style.justifyContent = 'space-between';
  header.style.padding = '12px 16px 6px 16px';
  card.appendChild(header);

  var headerLeft = d.createElement('div');
  headerLeft.style.display = 'flex';
  headerLeft.style.alignItems = 'center';
  headerLeft.style.gap = '8px';
  header.appendChild(headerLeft);

  var dot = d.createElement('span');
  dot.style.width = '8px';
  dot.style.height = '8px';
  dot.style.borderRadius = '999px';
  dot.style.background = '#ef4444';
  headerLeft.appendChild(dot);

  var titleEl = d.createElement('span');
  titleEl.style.fontSize = '11px';
  titleEl.style.fontWeight = '600';
  titleEl.style.letterSpacing = '0.22em';
  titleEl.style.textTransform = 'uppercase';
  titleEl.style.color = '#4b5563';
  titleEl.textContent = title;
  headerLeft.appendChild(titleEl);

  var closeBtn = d.createElement('button');
  closeBtn.type = 'button';
  closeBtn.setAttribute('aria-label', 'Kapat');
  closeBtn.style.width = '28px';
  closeBtn.style.height = '28px';
  closeBtn.style.borderRadius = '999px';
  closeBtn.style.border = '1px solid rgba(148,163,184,0.6)';
  closeBtn.style.background = '#ffffff';
  closeBtn.style.display = 'inline-flex';
  closeBtn.style.alignItems = 'center';
  closeBtn.style.justifyContent = 'center';
  closeBtn.style.cursor = 'pointer';
  closeBtn.onclick = function(){ try { root.remove(); } catch (e) {} };
  var x = d.createElement('span');
  x.textContent = '✕';
  x.style.fontSize = '12px';
  x.style.lineHeight = '1';
  x.style.color = '#475569';
  closeBtn.appendChild(x);
  header.appendChild(closeBtn);

  var body = d.createElement('div');
  body.style.padding = '0 16px 12px 16px';
  card.appendChild(body);

  if (video) {
    var mediaWrap = d.createElement('div');
    mediaWrap.style.position = 'relative';
    mediaWrap.style.width = '100%';
    mediaWrap.style.paddingTop = '56.25%';
    mediaWrap.style.borderRadius = '16px';
    mediaWrap.style.overflow = 'hidden';
    mediaWrap.style.background = '#000';
    body.appendChild(mediaWrap);

    var iframe = d.createElement('iframe');
    iframe.src = video;
    iframe.title = title;
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.allowFullscreen = true;
    iframe.style.position = 'absolute';
    iframe.style.inset = '0';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = '0';
    mediaWrap.appendChild(iframe);
  } else if (config.image) {
    var img = d.createElement('img');
    img.src = config.image;
    img.style.width = '100%';
    img.style.height = '220px';
    img.style.objectFit = 'cover';
    img.style.borderRadius = '16px';
    body.appendChild(img);
  }

  if (desc) {
    var p = d.createElement('p');
    p.textContent = desc;
    p.style.margin = '8px 0 0 0';
    p.style.fontSize = '11px';
    p.style.color = '#475569';
    body.appendChild(p);
  }

  var footer = d.createElement('div');
  footer.style.display = 'flex';
  footer.style.justifyContent = 'flex-end';
  footer.style.padding = '4px 16px 12px 16px';
  card.appendChild(footer);

  var cta = d.createElement('button');
  cta.type = 'button';
  cta.textContent = config.cta_label || 'Hemen Bilgi Al';
  cta.style.display = 'inline-flex';
  cta.style.alignItems = 'center';
  cta.style.gap = '8px';
  cta.style.padding = '6px 16px';
  cta.style.borderRadius = '999px';
  cta.style.border = '1px solid #1d4ed8';
  cta.style.background = '#1d4ed8';
  cta.style.color = '#ffffff';
  cta.style.fontSize = '11px';
  cta.style.fontWeight = '600';
  cta.style.cursor = 'pointer';
  cta.onclick = function(){ if (ctaUrl) window.open(ctaUrl, '_blank'); };
  footer.appendChild(cta);

  root.appendChild(card);
  d.body.appendChild(root);
})();
JS;

        return response($script, 200, ['Content-Type' => 'application/javascript']);
    }
}
