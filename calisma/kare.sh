#!/bin/zsh
# Kullanım: kare.sh <video> <calisma-klasoru> <crop> <dk:sn> [<dk:sn> ...]
# Verilen dakikalardan kırpılmış kare alır: <klasor>/kirpik/t_DK-SN.jpg
v="$1"; d="$2"; c="$3"; shift 3
mkdir -p "$d/kirpik"
for t in "$@"; do
  s=$(( ${t%%:*} * 60 + 10#${t##*:} ))
  ffmpeg -v error -y -ss $s -i "$v" -frames:v 1 -vf "crop=$c" -q:v 3 "$d/kirpik/t_${t/:/-}.jpg"
done
