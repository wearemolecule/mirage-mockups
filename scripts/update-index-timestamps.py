#!/usr/bin/env python3
"""Refresh static Updated timestamps in index.html from local file save times (run before push)."""
import re
import sys
from datetime import datetime
from pathlib import Path
from typing import Optional, Tuple

ROOT = Path(__file__).resolve().parent.parent
INDEX = ROOT / "index.html"


def file_last_saved(path: str) -> Optional[datetime]:
    file_path = ROOT / path
    if not file_path.is_file():
        return None
    return datetime.fromtimestamp(file_path.stat().st_mtime)


def format_saved(dt: datetime) -> Tuple[str, str]:
    iso = dt.isoformat(timespec="seconds")
    hour = dt.hour % 12 or 12
    am_pm = "AM" if dt.hour < 12 else "PM"
    display = f"{dt.strftime('%b')} {dt.day}, {dt.year}, {hour}:{dt.minute:02d} {am_pm}"
    return iso, display


def main() -> int:
    if not INDEX.is_file():
        print(f"error: missing {INDEX}", file=sys.stderr)
        return 1

    text = INDEX.read_text(encoding="utf-8")
    updated = 0

    def replace_row(match):
        nonlocal updated
        link = match.group(1)
        href = match.group(2)
        saved = file_last_saved(href)
        if not saved:
            return match.group(0)
        iso, display = format_saved(saved)
        updated += 1
        return (
            f"{link}"
            f'<time class="mockup-home__updated" datetime="{iso}">{display}</time>'
        )

    pattern = re.compile(
        r'(<a href="([^"]+\.html)">[^<]+</a>\s*)'
        r'<time class="mockup-home__updated"(?: datetime="[^"]*")?>[^<]*</time>'
    )
    new_text, count = pattern.subn(replace_row, text)
    if count == 0:
        print("error: no mockup-home__updated entries found in index.html", file=sys.stderr)
        return 1

    INDEX.write_text(new_text, encoding="utf-8")
    print(f"Updated {updated} timestamp(s) in {INDEX.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
