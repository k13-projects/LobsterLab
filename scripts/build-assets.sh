#!/usr/bin/env bash
# Build web assets from the client-supplied brand library into public/.
#
# Source:  docs/LOBSTER LAB Assets/   (gitignored, ~101MB, client design source)
# Output:  public/photos, public/brand, public/order, public/menus  (committed)
#
# Idempotent, safe to re-run. Requires macOS `sips` and `cwebp` (brew install webp).
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
# The client library has lived at both docs/ and the repo root, so both are
# accepted. docs/ is checked FIRST and deliberately: it is the path CLAUDE.md
# documents and the one the client drops new material into.
#
# The order used to be the other way round, and both copies existed on this
# machine. The root copy was three weeks stale, so it silently won and the
# client's 3 Aug drop (SVG icons, web-optimised menu PDFs) was invisible to the
# build even though the files were sitting right there. Nothing errored, the
# build just kept rebuilding old assets. If you swap this order back, that
# returns.
SRC=""
for cand in "$ROOT/docs/LOBSTER LAB Assets" "$ROOT/LOBSTER LAB Assets"; do
  [ -d "$cand" ] && { SRC="$cand"; break; }
done
[ -z "$SRC" ] && SRC="$ROOT/docs/LOBSTER LAB Assets"

# Say which copy is in use, and complain if a second one exists, because a
# stale duplicate reads as "my new files did nothing".
if [ -d "$ROOT/docs/LOBSTER LAB Assets" ] && [ -d "$ROOT/LOBSTER LAB Assets" ]; then
  echo "WARNING: two asset libraries exist. Using:"
  echo "  $SRC"
  echo "  ignoring: $ROOT/LOBSTER LAB Assets"
  echo "  Delete the unused one so new client drops cannot land in the wrong place."
  echo
fi
PUB="$ROOT/public"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

if [ ! -d "$SRC" ]; then
  echo "ERROR: brand asset library not found at:"
  echo "  $SRC"
  echo "It is gitignored by design, ask the owner for it."
  exit 1
fi
command -v cwebp >/dev/null || { echo "ERROR: cwebp not found. brew install webp"; exit 1; }

mkdir -p "$PUB/photos" "$PUB/brand" "$PUB/order" "$PUB/menus" "$PUB/icons"

# jpeg -> webp at a capped width. usage: photo <src-jpg> <out-name> <max-width> <quality>
photo() {
  local src="$SRC/PHOTOS/$1" out="$2" w="$3" q="${4:-82}"
  [ -f "$src" ] || { echo "  MISSING: $1"; return 0; }
  cp "$src" "$TMP/w.jpg"
  sips -Z "$w" "$TMP/w.jpg" >/dev/null
  cwebp -q "$q" -m 6 -quiet "$TMP/w.jpg" -o "$PUB/photos/$out.webp"
  echo "  photos/$out.webp"
}

# Same as photo(), but for sources the client dropped at the library root rather
# than inside PHOTOS/. Kept separate so the PHOTOS/ contract stays obvious.
loose_photo() {
  local src="$SRC/$1" out="$2" w="$3" q="${4:-82}"
  [ -f "$src" ] || { echo "  MISSING: $1"; return 0; }
  cp "$src" "$TMP/w.jpg"
  sips -Z "$w" "$TMP/w.jpg" >/dev/null
  cwebp -q "$q" -m 6 -quiet "$TMP/w.jpg" -o "$PUB/photos/$out.webp"
  echo "  photos/$out.webp"
}

echo "==> photos"
# Hero, the exact top-down tray spread used in LOBSTER LAB WEBSITE.pdf
photo "Lobster Lab 3 - 5.25.23-85.jpg"  hero              2048 84
# Menu strip, the four shots in the mockup, in order
photo "Lobster Lab 2 - 5.25.23-13.jpg"  menu-lobster-roll 1200
photo "Lobster Lab 3 - 5.25.23-51.jpg"  menu-bisque       1200
photo "Lobster Lab 2 - 5.25.23-01.jpg"  menu-shrimp-roll  1200
photo "Lobster Lab 2 - 5.25.23-02.jpg"  menu-grilled-cheese 1200
# Catering. The chefs-plating shot, on Kazim's call (14 Aug 2026), matching the photo Tiger
# Hospitality Group already runs in the "A Dynamic Collective of Industry Innovators" band on
# tigerhospitalitygroup.com. Copied in from THG-Website/assets/; it was never part of the
# Lobster Lab library even though it is from the same 25 May 2023 shoot.
#
# This one is PORTRAIT 1366x2048, which is the opposite of what this slot wanted before. That
# is deliberate and CateringSection was changed to suit it, not the other way round: the frame
# is composed vertically, chefs at the top and the trays at the bottom, and a landscape crop
# keeps only 50% of the height. Every horizontal position was tried and all of them fail,
# centre cuts the top of his head off, top loses the food entirely. THG hit the same wall and
# solved it with a near-square 560x600 box; the catering section now does the same.
# If you swap a landscape photo back in here, widen the aspect in CateringSection to match.
photo "Lobster Lab 3 - 5.25.23-79.jpg"  catering          1600
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

echo "==> value icons"
# The client's own icons, finally supplied as vectors (Lorena, 3 Aug 2026). These
# replace the SVGs K13 redrew by eye from a raster inside a PDF, and close finding
# F-D in docs/reports/LobsterLab_UIUX_Audit_2026-07-29.md.
#
# Three things have to be fixed on the way in, none of them cosmetic:
#
#  1. Each file carries TWO full-canvas white rects. Dropped straight in, they
#     paint a white box over the sand-coloured Values band.
#  2. The artwork is filled #f26822, but Lobster Lab's orange is #fe6700
#     (PMS 1505C, per IDENTITY/LOBLAB GUIDE.pdf) and that is what every button on
#     the site uses. Left alone the icons read as a slightly-wrong orange sitting
#     next to the right one. Normalised to the brand token.
#  3. The canvas is portrait 810x1012 with the artwork floating in the middle,
#     so in a square slot it would shrink to fit the height and look undersized.
#     Cropped to a square viewBox centred on the artwork.
#
# The viewBox numbers below are the alpha bounding box of the matching PNG mapped
# into user units (PNG 3105x3881 maps to the viewBox at exactly 3.8333x). A single
# common side of 655 is used for all three so the client's relative sizing between
# the icons is preserved. To recompute after a re-supply:
#   python3 -c "from PIL import Image;im=Image.open('ICONS/PNG/2.png').convert('RGBA');print(im.getchannel('A').getbbox())"
icon() {
  local src="$SRC/ICONS/VECTORS/$1" out="$2" vb="$3"
  if [ ! -f "$src" ]; then
    echo "  ERROR: icon source not found: ICONS/VECTORS/$1" >&2
    exit 1
  fi
  sed -E \
    -e 's|<path fill="#ffffff"[^>]*/>||g' \
    -e 's|#f26822|#fe6700|g' \
    -e 's|viewBox="[^"]*"|viewBox="'"$vb"'"|' \
    -e 's| width="[0-9]+"||' \
    -e 's| height="[0-9]+"||' \
    "$src" > "$PUB/icons/$out.svg"
  # A white rect surviving here means the client changed their export settings.
  if grep -q '#ffffff' "$PUB/icons/$out.svg"; then
    echo "  ERROR: $out.svg still contains white after cleaning, check the source" >&2
    exit 1
  fi
  echo "  icons/$out.svg  ($(wc -c < "$PUB/icons/$out.svg" | tr -d ' ')B)"
}
icon 2.svg citrus "77.4 161.6 655 655"
icon 3.svg season "89.8 154.4 655 655"
icon 4.svg seal   "77.5 178.8 655 655"

echo "==> menu PDFs"
# These are the client's web-optimised exports (Lorena, 3 Aug 2026), not the
# print masters that sit beside them in MENU/. Verified same content: pdftotext
# output is byte-identical for both pairs, and a 100dpi render diffs at
# 1.63/255 mean, invisible. They are ~18x smaller, 9.6MB -> 552K and
# 3.4MB -> 144K, which matters because these get opened on phones.
# The print masters stay in MENU/ as the archive; do not point the build at them.
#
# `menu` rather than a bare `cp`: the previous form was `cp A && echo B`, which
# puts cp inside an && list, and `set -e` deliberately ignores failures there.
# When the client re-uploaded MENU/ and renamed a file (a space appeared in
# "Global Fork , Station 8"), the copy failed, nothing exited non-zero, and the
# script still printed "Done". A fresh clone would have shipped without that
# menu. Fail loudly instead.
menu() {
  local src="$SRC/MENU/$1" out="$PUB/menus/$2"
  if [ ! -f "$src" ]; then
    echo "  ERROR: menu source not found: MENU/$1" >&2
    echo "         (the client renames these on re-upload, check MENU/ and update this script)" >&2
    exit 1
  fi
  cp "$src" "$out"
  echo "  menus/$2  ($(du -h "$out" | cut -f1))"
}
menu "LOBSTER  WEBSITE MENU_compressed.pdf"          lobster-lab-menu-food-halls.pdf
menu "2 MENU LOBSTER LAB SKY DECK (2)_compressed.pdf" lobster-lab-menu-sky-deck.pdf

echo
echo "Done. $(find "$PUB/photos" "$PUB/brand" "$PUB/order" "$PUB/menus" "$PUB/icons" -type f | wc -l | tr -d ' ') files in public/."
