#!/bin/bash
echo "=== headers (cf-ray) ==="
curl -sI -m 15 https://yingqiu.me | grep -iE '^(HTTP|cf-ray|server|cf-cache)'
echo "=== blog headers ==="
curl -sI -m 15 https://blog.yingqiu.me | grep -iE '^(HTTP|cf-ray|server|cf-cache)'
echo "=== blog static asset via CF ==="
ASSET=$(curl -s -m 15 https://blog.yingqiu.me/ | grep -oE '/_next/static/chunks/[^"]+\.css' | head -1)
echo "asset: $ASSET"
curl -sI -m 15 "https://blog.yingqiu.me$ASSET" | grep -iE '^(HTTP|cf-ray|cf-cache|content-type)'
echo "=== content sanity ==="
curl -s -m 15 https://blog.yingqiu.me/ | grep -oE '(秋水有信|Qiushui Youxin)' | sort -u
curl -s -m 15 https://yingqiu.me/ | grep -oE '<title>[^<]*</title>' | head -1
