---
id: popup-form-001
blueprint: popup
title: 'İş süreçlerinizi tek ekranda yönetin.'
slug: form-popup
is_active: true
popup_type: form_popup
trigger_type: time_on_site
description: 'Daha fazla bilgi almak için formu doldurun. Finans, üretim, satış ve insan kaynakları verilerinizi tek sistemde birleştirerek verimliliğinizi artırın.'
cta_enabled: true
cta_label: 'Bilgi Al'
cta_url: /iletisim
frequency: always
delay_seconds: 3
show_again_after: 7
position: bottomRight
embed_mode: modal
design: light
size: small
pages:
  - /
updated_by: 1
updated_at: 1778540375
form_layout: content_left_form_right
embed_enabled: false
embed_position: bottomRight
embed_theme: light
embed_script_url: 'http://127.0.0.1:8000/api/popups/script/form-popup.js'
embed_script_code: '<script src="http://127.0.0.1:8000/api/popups/script/form-popup.js" data-position="bottomRight"></script>'
embed_script_hint: '/api/popups/script/{slug}.js'
---
