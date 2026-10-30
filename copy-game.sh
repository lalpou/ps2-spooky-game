#!/usr/bin/env bash
# Copies only the files AthenaEnv needs to run the game into a destination
# folder, e.g. a FAT32 USB stick for the PS2.
#
# Usage: ./copy-game.sh /Volumes/PS2USB
#        ./copy-game.sh ~/ps2/games
#
# The game is placed in <destination>/spooky_time/. Existing files there are
# overwritten; files that no longer exist in the repo are removed.

set -euo pipefail

if [[ $# -ne 1 ]]; then
  echo "Usage: $0 <destination folder>" >&2
  exit 1
fi

repo="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
dest="$1/spooky_time"

# Everything the runtime needs: the ELF, its ini, the entry script, game code
# and assets. Docs, git metadata, AGENTS.md, this script and Finder junk are
# left out because they are not in this list.
include=(
  spooky_time.elf
  athena.ini
  main.js
  src
  assets
)

for item in "${include[@]}"; do
  if [[ ! -e "$repo/$item" ]]; then
    echo "Missing required file: $item" >&2
    exit 1
  fi
done

mkdir -p "$dest"

rsync -rt --delete \
  --exclude '.DS_Store' \
  --exclude '._*' \
  "${include[@]/#/$repo/}" \
  "$dest/"

# rsync's --delete only prunes inside the synced folders, so remove loose
# top-level files that are no longer in the include list (e.g. a renamed ini).
for f in "$dest"/*; do
  name="$(basename "$f")"
  keep=false
  for item in "${include[@]}"; do
    [[ "$name" == "$item" ]] && keep=true
  done
  if [[ "$keep" == false ]]; then
    echo "Removing stale: $name"
    rm -rf "$f"
  fi
done

# FAT32 cannot hold macOS extended attributes, so macOS writes them as
# "._name" sidecar files. They only clutter the PS2 file browser; drop them.
find "$dest" -name '._*' -delete
find "$dest" -name '.DS_Store' -delete

echo "Copied game to $dest:"
find "$dest" -type f | sed "s|$dest/|  |" | sort
