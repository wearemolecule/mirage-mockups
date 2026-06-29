#!/usr/bin/env python3
"""Refresh static Updated timestamps in index.html from git history (run before push)."""
import re
import subprocess
import sys
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
INDEX = ROOT / "index.html"


from typing import Optional


def git_last_commit_iso(path: str) -> Optional[str]:
    result = subprocess.run(
        ["git", "log", "-1", "--format=%cI", "--", path],
        cwd=ROOT,
        capture_output=True,
        text=True,
        check=False,
    )
    iso = result.stdout.strip()
    return iso or None


def format_display(iso: str) -> str:
    dt = datetime.fromisoformat(iso)
    hour = dt.hour % 12 or 12
    am_pm = "AM" if dt.hour < 12 else "PM"
    return f"{dt.strftime('%b')} {dt.day}, {dt.year}, {hour}:{dt.minute:02d} {am_pm}"


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
        iso = git_last_commit_iso(href)
        if not iso:
            return match.group(0)
        display = format_display(iso)
        updated += 1
        return (
            f"{link}"
            f'<time class="mockup-home__updated" datetime="{iso}">{display}</time>'
        )

    pattern = re.compile(
        r'(<a href="([^"]+\.html)">[^<]+</a>\s*)'
        r'<time class="mockup-home__updated" datetime="[^"]*">[^<]*</time>'
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
