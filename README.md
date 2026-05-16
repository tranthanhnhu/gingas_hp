# Gingas LLC – Website (HTML/CSS/JS)

Static website cho **合同会社ギンガス (Gingas LLC)** – domain mục tiêu: `https://gingas.co.jp/`.

Toàn bộ site được viết bằng HTML5 + CSS3 hiện đại + Vanilla JS, **không cần build tool**, không phụ thuộc framework. Có thể deploy thẳng lên Hostinger / Nginx / Apache / Netlify / Cloudflare Pages.

---

## 1. Cấu trúc thư mục

```
GingasNew/
├── index.html              # Trang chủ (hero, sản phẩm, CEO, trade, workflow, video, partners, news, company info, FAQ)
├── message.html            # 代表挨拶 – Lời chào Giám đốc (full)
├── services.html           # 事業内容 – OEM/ODM 3 division + 6-step workflow chi tiết
├── trade.html              # 輸出入 – Xuất nhập khẩu (4 section + ảnh + video)
├── news.html               # お知らせ – Danh sách bài viết (grid 9 + pagination)
├── news/
│   ├── vietnam-healthcare-event.html
│   └── company-overview-2026.html
├── products/
│   ├── tokyo-res-1000.html
│   └── bificure.html
├── privacy-policy.html
├── favicon.png
├── robots.txt
├── sitemap.xml
├── css/
│   ├── reset.css           # Modern CSS reset
│   ├── variables.css       # Design tokens (colors, fonts, spacing)
│   ├── base.css            # Typography, container, section primitives
│   ├── components.css      # Header, footer, buttons, cards, media-frame placeholder
│   ├── home.css            # Riêng cho index.html (hero, workflow grid, partners, ...)
│   └── pages.css           # Riêng cho các trang con (message, trade, services, news, contact)
├── js/
│   ├── main.js             # Mobile nav, scroll-reveal, FAQ accordion, lazy video, form validate
│   └── site-config.js      # 公式ストア（BASE）URL 等 — 購入リンクの変更はここを編集
├── docs/
│   └── pdfs/               # プライバシーポリシー関連 PDF（カスタマーハラスメント方針・マニュアル）
├── images/
│   ├── Takada.jpg          # Ảnh CEO (đã có)
│   ├── logo/
│   ├── hero/
│   ├── products/
│   ├── factory/
│   ├── trade/              # << CẦN BỔ SUNG ảnh cảng/tàu
│   ├── partners/           # << CẦN BỔ SUNG logo đối tác
│   ├── news/               # << CẦN BỔ SUNG thumbnail tin tức
│   ├── icons/
│   └── og/
└── videos/
    ├── factory-line.mp4    # Video nhà máy (đã có)
    ├── factory-team.mp4    # Video phụ (đã có)
    ├── port-export-01.mp4  # << CẦN BỔ SUNG video cảng
    └── port-export-02.mp4  # << CẦN BỔ SUNG video cảng
```

---

## 2. Cách thay placeholder

Mọi vị trí thiếu ảnh/video đều có một **khung placeholder** in rõ đường dẫn file cần đặt vào. Bạn chỉ cần copy file đúng tên vào đúng folder, refresh trang là sẽ hiển thị.

| Placeholder hiển thị trên trang                    | File cần đặt                          | Tỉ lệ gợi ý     |
| -------------------------------------------------- | ------------------------------------- | --------------- |
| `images/trade/port-hero.jpg`                       | Ảnh cảng/cont tàu (dọc)               | 4:5 hoặc 3:4    |
| `images/trade/port-01.jpg`                         | Ảnh cảng/cont (ngang)                 | 4:3             |
| `images/trade/port-02.jpg`                         | Ảnh ship/cont (ngang)                 | 4:3             |
| `images/trade/port-03.jpg`                         | Ảnh xuất cảng (ngang)                 | 4:3             |
| `images/trade/global-shipping.jpg`                 | Bản đồ thế giới / route logistics     | 4:3             |
| `images/trade/sourcing.jpg`                        | Ảnh nguyên liệu / kho hàng            | 4:3             |
| `images/trade/compliance.jpg`                      | Ảnh tài liệu / cont ship              | 4:3             |
| `images/trade/consulting.jpg`                      | Ảnh meeting / consulting              | 4:3             |
| `videos/port-export-01.mp4`                        | Video ngắn cảng / tàu xuất cảng       | 16:9 (~10–15s)  |
| `videos/port-export-02.mp4`                        | Video ngắn container / port           | 16:9 (~10–15s) |
| `images/partners/partner-01.png` … `partner-11.png` | Logo đối tác (nền trong suốt, đúng thứ tự trên trang chủ) | ~5:3            |
| `images/news/news-01.jpg` … `news-09.jpg`          | Thumbnail bài viết                    | 16:9            |

> Khi thay placeholder bằng `<img>` thực, mở file HTML tương ứng và thay khối:
> ```html
> <div class="media-frame ..."><div class="media-frame__label">...</div></div>
> ```
> bằng:
> ```html
> <img src="images/trade/port-01.jpg" alt="..." loading="lazy" />
> ```

---

## 3. Asset đã được tái sử dụng từ WordPress cũ

Các file sau được sao chép & rename từ `OldWebsite/wp-content/uploads/`:

| Source                                                  | Đích trong site mới                          |
| ------------------------------------------------------- | -------------------------------------------- |
| `2025/06/newweblogo512.png`                             | `images/logo/gingas-logo.png` & `favicon.png` |
| `2025/05/gingas_rogo_name2500.png`                      | `images/logo/gingas-logo-wide.png`           |
| `2025/06/wearegingas250626.png`                         | `images/hero/hero-factory.jpg`               |
| `2025/05/gingastop001.jpg`                              | `images/hero/hero-fallback.jpg`              |
| `2025/05/BIFICURE01.jpg`                                | `images/products/product-bificure-01.jpg`    |
| `2025/05/BIFICURE1900.png`                              | `images/products/product-bificure-banner.png` |
| `2025/06/RES001.jpg` … `RES004.jpg`                     | `images/products/product-res-01..04.jpg`     |
| `2025/07/HAI_6592.jpg` … `HAI_8101.jpg`, `NKQ_6433.jpg` | `images/factory/factory-01..05.jpg`          |
| `2025/05/241007-...press.mp4`                           | `videos/factory-line.mp4`                    |
| `2025/07/18-reactions-.mp4`                             | `videos/factory-team.mp4`                    |
| `2025/05/` 認証画像（RES-1000 等）                      | `images/products/certs/*.jpg`                |
| カスタマーハラスメント関連 PDF（サイト掲載用）          | `docs/pdfs/customer-harassment-*.pdf`        |

---

## 3a. 公式ストア（BASE / official.ec）の URL

自社ブランドの「購入」ボタンは **gingas.official.ec** の商品ページへリンクしています。URL を差し替える場合は **`js/site-config.js`** の `shopTokyoRes1000` と `shopBificure` を編集してください（`products/tokyo-res-1000.html` および `products/bificure.html` は読み込み後にこの値で `href` を上書きします）。

---

## 4. Tính năng & tối ưu

- **Mobile-first responsive** – breakpoints 540 / 768 / 880 / 1024 / 1280
- **Tốc độ:**
  - `preload` ảnh hero
  - `loading="lazy"` + `decoding="async"` cho mọi `<img>` không phải hero
  - `font-display: swap` cho Google Fonts
  - Không jQuery, JS thuần < 4KB
  - Video chỉ phát khi cuộn vào viewport (IntersectionObserver)
- **Hiệu ứng / micro-interactions:**
  - Scroll-reveal fade-up cho tất cả section
  - Header chuyển trạng thái khi scroll
  - Hover card lift + zoom
  - FAQ accordion smooth (single-open)
  - Pulse dot trên video nhà máy
  - Animated scroll cue ở hero
- **A11y:**
  - Skip-link "本文へスキップ"
  - `aria-*` cho nav, accordion, breadcrumb
  - `focus-visible` outline
  - `prefers-reduced-motion` được tôn trọng
- **SEO:**
  - Mỗi trang có `<title>`, meta description, canonical
  - OpenGraph + JSON-LD `Organization` schema trên trang chủ
  - `robots.txt` + `sitemap.xml`

---

## 5. Cách chạy & deploy

### Chạy local

Mở `index.html` trực tiếp bằng trình duyệt, **hoặc** chạy 1 web server tĩnh:

```bash
# Python 3
python -m http.server 5500

# Node (npx)
npx serve .
```

Sau đó truy cập `http://localhost:5500/`.

### Deploy

- Upload toàn bộ thư mục **trừ** `OldWebsite/`, `*.txt` (loichaogiamdoc, xuatnhapkhau, summary), `design.png` lên public_html của hosting.
- Đảm bảo file `index.html` ở root domain.
- Nếu dùng Apache/Hostinger: không cần `.htaccess` đặc biệt.

---

## 6. Bảng trang

| URL                                | File              | Mô tả                                |
| ---------------------------------- | ----------------- | ------------------------------------ |
| `/`                                | `index.html`      | Trang chủ (12 section)               |
| `/message.html`                    | `message.html`    | 代表挨拶                              |
| `/services.html`                   | `services.html`   | 事業内容 (OEM/ODM + 6-step workflow) |
| `/trade.html`                      | `trade.html`      | 輸出入・国際貿易                     |
| `/news.html`                       | `news.html`       | お知らせ (grid 9 + pagination)        |
| `/news/vietnam-healthcare-event.html` | `news/vietnam-healthcare-event.html` | お知らせ記事 |
| `/news/company-overview-2026.html`    | `news/company-overview-2026.html`    | お知らせ記事 |
| `/products/tokyo-res-1000.html`    | `products/tokyo-res-1000.html` | TOKYO RES-1000 製品詳細 |
| `/products/bificure.html`          | `products/bificure.html`     | BIFICURE 製品概要 |
| `/privacy-policy.html`             | `privacy-policy.html` | プライバシーポリシー |
| `/contact.html`                    | `contact.html`    | お問い合わせ + FAQ + Map             |
| `/contact.html#faq`                | (anchor)          | FAQ                                  |
| `/index.html#company`              | (anchor)          | 会社情報                              |

---

## 7. Brand tokens

| Token            | Giá trị     |
| ---------------- | ----------- |
| Primary navy     | `#1a365d`   |
| Deep navy        | `#0b1f3a`   |
| Emerald 500      | `#10b981`   |
| Emerald 600      | `#059669`   |
| Background       | `#ffffff`   |
| Surface alt      | `#f4f7fc`   |
| Text             | `#1f2937`   |
| Font (sans)      | Inter + Noto Sans JP |
| Heading scale    | `clamp()` responsive |
| Container width  | 1240px      |

---

## 8. Roadmap / TODO

- [ ] Bổ sung ảnh / video / logo theo bảng ở mục 2
- [ ] Tích hợp form gửi mail (Formspree / mailtrap / backend riêng)
- [x] Thêm trang chi tiết news (article template) — `news/*.html`
- [ ] Bản English / Tiếng Việt (đã có placeholder ở footer)
- [ ] Convert ảnh sang WebP/AVIF để tăng tốc thêm
