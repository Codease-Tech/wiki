"""dokum.srt -> dokum-dk.txt: her 30 saniyeye bir satır, başında [dk:sn]."""
import re, sys
src, dst = sys.argv[1], sys.argv[2]
blocks = re.split(r"\n\s*\n", open(src, encoding="utf-8").read().strip())
out, cur, cur_key = [], [], None
for b in blocks:
    lines = b.splitlines()
    if len(lines) < 3: continue
    m = re.match(r"(\d+):(\d+):(\d+)", lines[1])
    if not m: continue
    t = int(m[1]) * 3600 + int(m[2]) * 60 + int(m[3])
    key = t // 30
    if key != cur_key:
        if cur: out.append(f"[{cur_key*30//60:02d}:{cur_key*30%60:02d}] " + " ".join(cur))
        cur, cur_key = [], key
    cur.append(" ".join(l.strip() for l in lines[2:]))
if cur: out.append(f"[{cur_key*30//60:02d}:{cur_key*30%60:02d}] " + " ".join(cur))
open(dst, "w", encoding="utf-8").write("\n".join(out) + "\n")
