/* ============================================================
   PDF RENDERER
   BP0122.pdf の各ページをcanvas経由でimg/backgroundに描画する

   ページ割り当て:
     4ページ目 → ヘッダーロゴ + ヒーロー背景（ページトップ）
     5ページ目 → ギャラリー 1枚目
     6ページ目 → ギャラリー 2枚目
     7ページ目 → ギャラリー 3枚目
   ============================================================ */

(function () {
  'use strict';

  const PDF_PATH = 'images/BP0122.pdf';

  // PDF.js のワーカーURLを設定
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

  /**
   * 指定ページをCanvasに描画し、PNG のデータURLを返す
   * @param {PDFDocumentProxy} pdf
   * @param {number} pageNum   1始まり
   * @param {number} scale     描画倍率（大きいほど高解像度）
   */
  async function pageToDataURL(pdf, pageNum, scale) {
    const page     = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale });
    const canvas   = document.createElement('canvas');
    canvas.width   = viewport.width;
    canvas.height  = viewport.height;
    await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
    return canvas.toDataURL('image/png');
  }

  async function init() {
    let pdf;
    try {
      pdf = await pdfjsLib.getDocument(PDF_PATH).promise;
    } catch (err) {
      console.warn('[pdf-render] PDFの読み込みに失敗しました:', err.message);
      showFallbacks();
      return;
    }

    const totalPages = pdf.numPages;

    // ── 4ページ目: ロゴ & ヒーロー背景 ──────────────────────────
    if (totalPages >= 4) {
      try {
        // ロゴ用（小さいサイズ: scale 0.3）
        const logoURL = await pageToDataURL(pdf, 4, 0.3);
        setImgSrc('logo-img', logoURL);
        setImgSrc('footer-logo-img', logoURL);

        // ヒーロー背景用（大きいサイズ: scale 2.0）
        const heroURL = await pageToDataURL(pdf, 4, 2.0);
        applyHeroCanvas(heroURL);
      } catch (e) {
        console.warn('[pdf-render] 4ページ目の描画に失敗:', e.message);
      }
    }

    // ── 5・6・7ページ目: ギャラリー ─────────────────────────────
    const galleryPages = [5, 6, 7];
    for (const pageNum of galleryPages) {
      if (totalPages < pageNum) continue;
      try {
        const url = await pageToDataURL(pdf, pageNum, 1.5);
        setImgSrc(`gallery-img-${pageNum}`, url);
        hidePlaceholder(`gallery-ph-${pageNum}`);
      } catch (e) {
        console.warn(`[pdf-render] ${pageNum}ページ目の描画に失敗:`, e.message);
      }
    }
  }

  /** img要素のsrcをセット */
  function setImgSrc(id, url) {
    const el = document.getElementById(id);
    if (el) el.src = url;
  }

  /** ヒーロースライド1にPDFページを背景canvasとして描画 */
  function applyHeroCanvas(dataURL) {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    const img = new Image();
    img.onload = () => {
      // CSSでcanvasをスライドいっぱいに拡げているため、
      // canvas解像度をウィンドウサイズに合わせる
      const slide = document.getElementById('hero-slide-0');
      const w = slide ? slide.offsetWidth  : window.innerWidth;
      const h = slide ? slide.offsetHeight : window.innerHeight;
      canvas.width  = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      // アスペクト比を保ちながら中央にcover表示
      const scale  = Math.max(w / img.width, h / img.height);
      const dx     = (w - img.width  * scale) / 2;
      const dy     = (h - img.height * scale) / 2;
      ctx.drawImage(img, dx, dy, img.width * scale, img.height * scale);
    };
    img.src = dataURL;
  }

  /** ギャラリーのローディングプレースホルダーを非表示 */
  function hidePlaceholder(id) {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  }

  /** PDF読み込み失敗時にプレースホルダーのテキストを差し替える */
  function showFallbacks() {
    [5, 6, 7].forEach(n => {
      const ph = document.getElementById(`gallery-ph-${n}`);
      if (ph) ph.textContent = '画像を準備中';
    });
  }

  // DOM構築後に実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
