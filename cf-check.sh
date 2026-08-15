#!/bin/bash
for h in yingqiu.me blog.yingqiu.me www.yingqiu.me; do
  echo "--- $h ---"
  curl -sI -m 15 "https://$h" | head -8
done
