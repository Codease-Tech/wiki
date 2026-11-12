#!/bin/zsh
# Kullanım: gorsel.sh <video> <dk:sn> <cikti.jpg> <w:h:x:y> [bulanik w:h:x:y ...]
# Uygulama alanı (Fatih kayıtları: 905x443, sol üst 13,150) içinden w:h:x:y keser.
# Bulanık bölgeler kesilmiş görselin koordinatlarıyla verilir (kişi/müşteri adları).
v="$1"; t="$2"; o="$3"; c="$4"; shift 4
s=$(( ${t%%:*} * 60 + 10#${t##*:} ))
w=${c%%:*}; r=${c#*:}; h=${r%%:*}; r=${r#*:}; x=${r%%:*}; y=${r##*:}
f="crop=$w:$h:$((x+13)):$((y+150))"
i=0; last="base"; chain="[0:v]$f"
for b in "$@"; do
  bw=${b%%:*}; r=${b#*:}; bh=${r%%:*}; r=${r#*:}; bx=${r%%:*}; by=${r##*:}
  chain="$chain,split[m$i][n$i];[n$i]crop=$bw:$bh:$bx:$by,gblur=sigma=5[q$i];[m$i][q$i]overlay=$bx:$by"
  i=$((i+1))
done
ffmpeg -v error -y -ss $s -i "$v" -frames:v 1 -filter_complex "$chain,scale=iw*1.5:-1:flags=lanczos" -q:v 2 "$o"
