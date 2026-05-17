---
id: popup-exit-offer-001
blueprint: popup
title: 'Ayrılmadan Önce Demo Alın'
slug: exit-offer
is_active: true
popup_type: exit_intent
trigger_type: exit_intent
description: 'Ekibimiz size işletmenize uygun modül kurgusunu ücretsiz gösterebilir.'
cta_enabled: true
cta_label: 'Ücretsiz Demo Al'
cta_url: /iletisim
frequency: once_per_day
show_again_after: 3
position: center
embed_mode: modal
design: light
size: medium
exclude_pages:
  - /tesekkurler
delay_seconds: 5
updated_by: 1
updated_at: 1778617513
form_layout: content_left_form_right
embed_cta_url: 'https://liox.uyumsoft.com/iletisim'
embed_utm_source: liox_popup
embed_utm_medium: popup
embed_utm_campaign: exit_offer
embed_utm_content: cp_embed
embed_script_url: 'http://127.0.0.1:8000/api/popups/script/exit-offer.js'
embed_script_code: '<script src="http://127.0.0.1:8000/api/popups/script/exit-offer.js" data-position="bottomRight" data-mode="modal" data-cta-url="https://liox.uyumsoft.com/iletisim?utm_source=liox_popup&utm_medium=popup&utm_campaign=exit_offer&utm_content=cp_embed"></script>'
embed_enabled: true
embed_position: bottomRight
embed_theme: light
embed_script_hint: '/api/popups/script/{slug}.js'
---
