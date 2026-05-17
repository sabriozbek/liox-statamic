---
id: popup-notification-001
published: true
blueprint: popup
title: 'İstanbul''da üretim yapan bir firma LIOX ERP''ye geçti'
slug: notification-bar
is_active: true
popup_type: notification
trigger_type: time_on_site
badge_text: 'Sosyal Kanıt'
icon_class: 'fa-solid fa-industry'
description: 'Benzer üretim firmaları süreçlerini LIOX ERP ile dijitalleştiriyor. Siz de başarı hikayelerini inceleyin.'
cta_enabled: true
cta_label: 'Hikayeyi İncele'
cta_url: /basari-hikayeleri
frequency: once_per_session
delay_seconds: 10
show_again_after: 2
position: bottomLeft
embed_mode: corner
design: light
size: small
pages:
  - /
  - /modul/uretim-yonetimi
---

embed_script_url: 'http://127.0.0.1:8000/api/popups/script/notification-bar.js'
embed_script_code: '<script src="http://127.0.0.1:8000/api/popups/script/notification-bar.js" data-position="bottomRight"></script>'
