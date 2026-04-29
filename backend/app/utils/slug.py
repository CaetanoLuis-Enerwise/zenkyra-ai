"""URL-safe tenant slug generation."""

from __future__ import annotations

import re
import uuid


def slugify_company(name: str) -> str:
    s = name.strip().lower()
    s = re.sub(r"[^a-z0-9]+", "-", s).strip("-")
    return (s[:48] or "org") + "-" + uuid.uuid4().hex[:8]
