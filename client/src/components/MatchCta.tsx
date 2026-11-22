import { ArrowRight, MessageCircle } from "lucide-react";
import { MATCH_ENTRY } from "../lib/match";
import { trackClick } from "../lib/track";

// 採用マッチング診断（外部アプリ）と公式LINEへの、目立たせた入口。診断を一番目立たせ、LINEを次に目立たせる。
// 文言は診断アプリ自身の言い回し（「7問で、あなたの大切にしたいことを見つけよう」「適性診断」）に合わせ、所要時間・無料などアプリが言っていないことは書かない。
// 飾りはCSS（グラデーション・影・動き）とインラインSVGだけ。画像を読み込まないので、表示速度（LCP）には影響しない。
// 例外：TypeHeroCard（美容師タイプ診断）だけは小さなキャラクター画像（約58KB）を1枚読む。公開後に PageSpeed（スマホ）で LCP を確認すること。

/** 診断のイラスト：2つの円が重なる「マッチ」とハート・きらめき（飾りなので読み上げない） */
export function MatchArt({ className = "" }: { className?: string }) {
  return (
    <svg className={`match-art ${className}`} viewBox="0 0 168 124" aria-hidden="true" focusable="false">
      <circle cx="62" cy="66" r="40" fill="#ffe8a3" stroke="#173c3e" strokeWidth="3" />
      <circle cx="106" cy="66" r="40" fill="#f4a3b8" stroke="#173c3e" strokeWidth="3" />
      <path d="M84 32.6A40 40 0 0 1 84 99.4A40 40 0 0 1 84 32.6Z" fill="#fff" stroke="#173c3e" strokeWidth="3" strokeLinejoin="round" />
      <path d="M84 83C70 73 71 60 78 60C81.5 60 84 63 84 65C84 63 86.5 60 90 60C97 60 98 73 84 83Z" fill="#d6336c" stroke="#173c3e" strokeWidth="2.5" strokeLinejoin="round" />
      <path className="match-art-spark s1" d="M146 14Q148 22 156 24Q148 26 146 34Q144 26 136 24Q144 22 146 14Z" fill="#fff" stroke="#173c3e" strokeWidth="2.2" strokeLinejoin="round" />
      <path className="match-art-spark s2" d="M22 16Q23.5 21 29 22.5Q23.5 24 22 29Q20.5 24 15 22.5Q20.5 21 22 16Z" fill="#ffe8a3" stroke="#173c3e" strokeWidth="2" strokeLinejoin="round" />
      <path className="match-art-spark s3" d="M150 96Q151.5 101 157 102.5Q151.5 104 150 109Q148.5 104 143 102.5Q148.5 101 150 96Z" fill="#fff" stroke="#173c3e" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="34" cy="106" r="3.5" fill="#fff" stroke="#173c3e" strokeWidth="2" />
    </svg>
  );
}

type Variant = "card" | "banner";

/** 採用マッチング診断（一番目立たせる大きなカード）。リンク先は自社ドメインの入口 /match/（新しいタブ） */
export function MatchCta({ placement, variant = "card" }: { placement: string; variant?: Variant }) {
  return (
    <a className={`match-cta match-cta-${variant}`} href={MATCH_ENTRY} target="_blank" rel="noopener noreferrer" data-track="match" data-placement={placement}>
      <span className="match-cta-shine" aria-hidden="true" />
      <span className="match-cta-sticker" aria-hidden="true"><b>7</b><i>問</i></span>
      <span className="match-cta-body">
        <span className="match-cta-kicker">採用マッチング診断</span>
        <strong className="match-cta-title"><span className="nb">7問で、</span><span className="nb">あなたの大切に</span><span className="nb">したいことを</span><span className="nb">見つけよう</span></strong>
        <span className="match-cta-go">適性診断をはじめる <ArrowRight size={18} aria-hidden="true" /></span>
      </span>
      <MatchArt className="match-cta-art" />
      <small className="match-cta-note">新しいタブで開きます</small>
    </a>
  );
}

/** 公式LINEへ直接つながる、緑の目立つボタン（診断の次に目立たせる） */
export function LineCta({ href, placement }: { href: string; placement: string }) {
  return (
    <a className="line-cta" href={href} target="_blank" rel="noopener noreferrer" data-track="line" data-placement={placement}>
      <span className="line-cta-icon" aria-hidden="true"><MessageCircle size={24} /></span>
      <span className="line-cta-text"><b>公式LINEで直接相談</b><small>気になることを、LINEで気軽に聞く</small></span>
      <ArrowRight className="line-cta-arrow" size={20} aria-hidden="true" />
    </a>
  );
}

/** 美容師タイプ診断（/type-shindan/・自社の静的ページ）への入口。採用の入口を広げるための気軽な診断（2026-11-20 藤津さん）。同じタブで開く */
export function TypeCta({ placement }: { placement: string }) {
  return (
    <a className="type-cta" href="/type-shindan/" data-track="type_shindan" data-placement={placement}>
      <span className="type-cta-text"><b>美容師タイプ診断</b><small>18問・約2分。あなたはどのジョブ？</small></span>
      <ArrowRight className="type-cta-arrow" size={20} aria-hidden="true" />
    </a>
  );
}

/** 美容師タイプ診断（/type-shindan/）の、キャラクター入りの大きな入口。トップの最初の画面用（2026-11-22 藤津さん「トップに画像を出して、興味がわくように」）。
 *  キャラクター8体を1枚の小さな画像（types-strip.webp・約58KB）にして並べ、スマホでは横にゆっくり流す（動きが苦手な設定では止める）。
 *  画像は飾りなので alt は空、意味は文字（題名・説明・ボタン）で伝える。同じタブで開く。 */
export function TypeHeroCard({ placement }: { placement: string }) {
  return (
    <a className="type-hero" href="/type-shindan/" data-track="type_shindan" data-placement={placement}>
      <span className="match-cta-shine" aria-hidden="true" />
      <span className="type-hero-kicker">8タイプ・18問・約2分</span>
      <strong className="type-hero-title">美容師タイプ診断</strong>
      <span className="type-hero-sub">あなたはどのジョブ？ キャラクターで見つけよう</span>
      <span className="type-hero-chars" aria-hidden="true">
        <span className="type-hero-track">
          <img src="/images/type-shindan/types-strip.webp" width={1233} height={200} alt="" decoding="async" />
          <img className="type-hero-dup" src="/images/type-shindan/types-strip.webp" width={1233} height={200} alt="" decoding="async" />
        </span>
      </span>
      <span className="type-hero-go">診断をはじめる <ArrowRight size={18} aria-hidden="true" /></span>
    </a>
  );
}

/** 診断（大）＋LINE（中）＋タイプ診断（小）をまとめた帯。サブページの下・トップの途中に置く。selfTrack は、計測の受け皿（onClick={trackClick}）がまわりに無い場所用 */
export function MatchStrip({ lineHref, placement, selfTrack = false }: { lineHref: string; placement: string; selfTrack?: boolean }) {
  return (
    <section className="match-strip" aria-label="採用マッチング診断と公式LINE" {...(selfTrack ? { onClick: trackClick } : {})}>
      <div className="match-strip-inner">
        <MatchCta placement={placement} variant="banner" />
        <LineCta href={lineHref} placement={placement} />
        <TypeCta placement={placement} />
      </div>
    </section>
  );
}
