#!/usr/bin/env bash
# Build web assets from the client-supplied brand library into public/.
#
# Source:  docs/LOBSTER LAB Assets/   (gitignored, ~101MB, client design source)
# Output:  public/photos, public/brand, public/order, public/menus  (committed)
#
# Idempotent — safe to re-run. Requires macOS `sips` and `cwebp` (brew install webp).
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
# The client library has lived at both docs/ and the repo root — accept either.
SRC=""
for cand in "$ROOT/LOBSTER LAB Assets" "$ROOT/docs/LOBSTER LAB Assets"; do
  [ -d "$cand" ] && { SRC="$cand"; break; }
done
[ -z "$SRC" ] && SRC="$ROOT/LOBSTER LAB Assets"
PUB="$ROOT/public"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

if [ ! -d "$SRC" ]; then
  echo "ERROR: brand asset library not found at:"
  echo "  $SRC"
  echo "It is gitignored by design — ask the owner for it."
  exit 1
fi
command -v cwebp >/dev/null || { echo "ERROR: cwebp not found. brew install webp"; exit 1; }

mkdir -p "$PUB/photos" "$PUB/brand" "$PUB/order" "$PUB/menus"

# jpeg -> webp at a capped width. usage: photo <src-jpg> <out-name> <max-width> <quality>
photo() {
  local src="$SRC/PHOTOS/$1" out="$2" w="$3" q="${4:-82}"
  [ -f "$src" ] || { echo "  MISSING: $1"; return 0; }
  cp "$src" "$TMP/w.jpg"
  sips -Z "$w" "$TMP/w.jpg" >/dev/null
  cwebp -q "$q" -m 6 -quiet "$TMP/w.jpg" -o "$PUB/photos/$out.webp"
  echo "  photos/$out.webp"
}

echo "==> photos"
# Hero — the exact top-down tray spread used in LOBSTER LAB WEBSITE.pdf
photo "Lobster Lab 3 - 5.25.23-85.jpg"  hero              2048 84
# Menu strip — the four shots in the mockup, in order
photo "Lobster Lab 2 - 5.25.23-13.jpg"  menu-lobster-roll 1200
photo "Lobster Lab 3 - 5.25.23-51.jpg"  menu-bisque       1200
photo "Lobster Lab 2 - 5.25.23-01.jpg"  menu-shrimp-roll  1200
photo "Lobster Lab 2 - 5.25.23-02.jpg"  menu-grilled-cheese 1200
# Catering — hands/craft shot
photo "Lobster Lab 3 - 5.25.23-44.jpg"  catering          1600
# Full-bleed roll strip above the reviews band
photo "Lobster Lab 2 - 5.25.23-20.jpg"  roll-strip        2048 84
# Secondary / social + OG
photo "Lobster Lab - 5.25.23-06.jpg"    lobster-roll      1200
photo "Lobster Lab 3 - 5.25.23-72.jpg"  caviar            1200
photo "Lobster Lab 3 - 5.25.23-30.jpg"  salad             1200

echo "==> brand marks"
for pair in \
  "LOBLAB Wordmark Horizontal Color.png:wordmark-horizontal" \
  "LOBLAB Wordmark Horizontal white.png:wordmark-horizontal-white" \
  "LOBLAB Wordmark Stacked Color.png:wordmark-stacked" \
  "LOBLAB Wordmark Stacked white.png:wordmark-stacked-white" \
  "LOBLAB WordMark Patters.png:pattern"
do
  f="${pair%%:*}"; out="${pair##*:}"
  if [ -f "$SRC/IDENTITY/$f" ]; then
    cp "$SRC/IDENTITY/$f" "$PUB/brand/$out.png"
    echo "  brand/$out.png"
  else
    echo "  MISSING: $f"
  fi
done

echo "==> order platform logos"
# 4500px square sources -> 512px webp with alpha preserved
for pair in \
  "Copy of TOAST LOGO-03.png:toast" \
  "Copy of Doordash logo.png:doordash" \
  "Copy of Grunhub logo-02.png:grubhub"
do
  f="${pair%%:*}"; out="${pair##*:}"
  if [ -f "$SRC/ORDER LOGOS/$f" ]; then
    cp "$SRC/ORDER LOGOS/$f" "$TMP/o.png"
    sips -Z 512 "$TMP/o.png" >/dev/null
    cwebp -q 90 -m 6 -quiet -alpha_q 100 "$TMP/o.png" -o "$PUB/order/$out.webp"
    echo "  order/$out.webp"
  else
    echo "  MISSING: $f"
  fi
done

echo "==> menu PDFs"
cp "$SRC/MENU/Menu_Miramar, Windmill, Global Fork , Station 8.pdf" \
   "$PUB/menus/lobster-lab-menu-food-halls.pdf" && echo "  menus/lobster-lab-menu-food-halls.pdf"
cp "$SRC/MENU/Menu Sky Deck at Del Mar Highlands Town Center_.pdf" \
   "$PUB/menus/lobster-lab-menu-sky-deck.pdf" && echo "  menus/lobster-lab-menu-sky-deck.pdf"

echo
echo "Done. $(find "$PUB/photos" "$PUB/brand" "$PUB/order" "$PUB/menus" -type f | wc -l | tr -d ' ') files in public/."
