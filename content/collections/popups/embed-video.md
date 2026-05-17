---
id: popup-embed-video-001
published: true
blueprint: popup
title: 'LIOX ERP Tanıtım Videosu'
slug: embed-video
is_active: true
popup_type: embed_video
trigger_type: manual
description: 'Dış sayfalarda veya özel kampanya sayfalarında kullanılabilecek embed video popup.'
iframe_src: 'https://www.youtube.com/embed/HYpLnoV7ZmA'
cta_enabled: true
cta_label: 'Demo Talep Et'
cta_url: /iletisim
frequency: always
show_again_after: 1
position: bottomRight
embed_mode: inline
design: dark
size: medium
pages:
  - /modul/finans
  - /modul/uretim-yonetimi
---

embed_script_url: 'http://127.0.0.1:8000/api/popups/script/embed-video.js'
embed_script_code: '<script src="http://127.0.0.1:8000/api/popups/script/embed-video.js" data-position="bottomRight"></script>'
