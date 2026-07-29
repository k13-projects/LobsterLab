#!/usr/bin/env bash
# Lobster Lab — asset downloader
# Run this on YOUR OWN machine BEFORE Aug 1 to save every image/video the site references,
# while the SpotHopper CDN (static.spotapps.co / cdn.spotapps.co) is still serving them.
#
# Usage:
#   chmod +x download_images.sh
#   ./download_images.sh
#
# Files land in ./downloaded_assets/ . Requires curl (preinstalled on macOS/Linux).

set -euo pipefail
OUT="downloaded_assets"
mkdir -p "$OUT"

dl () { # dl <filename> <url>
  echo "Downloading $1 ..."
  curl -L --fail --retry 3 -o "$OUT/$1" "$2" || echo "  !! FAILED: $2"
}

dl "logo.png"                      "https://static.spotapps.co/website_images/ab_websites/244728_website_v1/logo.png"
dl "social.jpg"                    "https://static.spotapps.co/website_images/ab_websites/244728_website_v1/social.jpg"
dl "hero_gallery_01.jpg"           "https://static.spotapps.co/spots/89/7954b7888344d29b73ec50f02919ac/:original"
dl "hero_gallery_02.jpg"           "https://cdn.spotapps.co/spothopper/image/fetch/f_auto,q_auto:best,c_fit,h_1200/http://static.spotapps.co/spots/d9/c138d1d8db49a4b05d4015726a8e0b/:original"
dl "hero_gallery_03.jpg"           "https://cdn.spotapps.co/spothopper/image/fetch/f_auto,q_auto:best,c_fit,h_1200/http://static.spotapps.co/spots/48/eb947fc9e946ab91951330f46b65aa/:original"
dl "hero_gallery_04.jpg"           "https://cdn.spotapps.co/spothopper/image/fetch/f_auto,q_auto:best,c_fit,h_1200/http://static.spotapps.co/spots/af/5add0011d84bfb93ac7ece4d9f9d93/:original"
dl "hero_gallery_05.jpg"           "https://cdn.spotapps.co/spothopper/image/fetch/f_auto,q_auto:best,c_fit,h_1200/http://static.spotapps.co/spots/d7/2388d1916a401787ab8b6f2238319c/:original"
dl "hero_gallery_06.jpg"           "https://cdn.spotapps.co/spothopper/image/fetch/f_auto,q_auto:best,c_fit,h_1200/http://static.spotapps.co/spots/eb/8837dfbc1847568028ec2996499b5d/:original"
dl "food_shrimp_roll.jpg"          "https://static.spotapps.co/spots/9c/ca112efdc74cd59c6bb1518484e36d/full"
dl "food_lobster_salad.jpg"        "https://static.spotapps.co/spots/8f/2e5e3e68c54ceba7a9aa7d0025df4d/full"
dl "food_crab_roll.jpg"            "https://static.spotapps.co/spots/dc/b37a7b4dae494fa55b577b8415e4d0/full"
dl "food_california_roll.jpg"      "https://static.spotapps.co/spots/9f/db00098d4f4d08b723c462990cd5e3/full"
dl "food_lobster_roll.jpg"         "https://static.spotapps.co/spots/48/eb947fc9e946ab91951330f46b65aa/full"
dl "food_smoked_salmon_salad.jpg"  "https://static.spotapps.co/spots/71/19121763d9487487be31018d99dac9/full"
dl "food_lobster_bisque.jpg"       "https://static.spotapps.co/spots/f0/5405e919ff4e1d9b980cadd79c06f7/full"
dl "food_lobster_roll_2.jpg"       "https://static.spotapps.co/spots/32/41f76064f9448bba3f7c30c86993fd/full"
dl "food_shrimp_roll_2.jpg"        "https://static.spotapps.co/spots/23/e710e597dc41c498fa7b105eaf209f/full"
dl "food_crab_salad_roll.jpg"      "https://static.spotapps.co/spots/7e/9b8b1e73f044aeb2dc5b803b0e7544/full"
dl "food_crab_roll_2.jpg"          "https://static.spotapps.co/spots/52/09c561a22f4329b0088874a8c2bf35/full"
dl "food_smoked_salmon_sandwich.jpg" "https://static.spotapps.co/spots/2b/5879235a0d475ab44ea568e6687f2d/full"
dl "video_lobster_lab.mp4"         "https://static.spotapps.co/website_videos/Lobster%20Lab%20Video_Vimeo720p30.mp4"

echo ""
echo "Done. Assets saved in: $OUT"
echo "TIP: also right-click > Save on any images in the SpotHopper dashboard that aren't listed here,"
echo "     and export your full-resolution originals from the SpotHopper media library before Aug 1."
