"""Pre-deploy check for this static site. Fails (exit 1) if index.html has a
missing image/file, a dead #anchor, a malformed tel/WhatsApp/mailto link, an
image without alt text, an unused file in images/, or a CNAME that doesn't
match the canonical URL.  Usage: python3 .github/check_site.py [site_root]"""
import pathlib
import re
import sys
from html.parser import HTMLParser


class Refs(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids, self.refs = set(), []

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if "id" in a:
            self.ids.add(a["id"])
        for k in ("href", "src"):
            if a.get(k):
                self.refs.append(a[k])
        if tag == "img" and not a.get("alt"):
            self.refs.append(("missing-alt", a.get("src")))


def check(root):
    root = pathlib.Path(root)
    html = (root / "index.html").read_text()
    p = Refs()
    p.feed(html)
    errs = []
    for v in p.refs:
        if isinstance(v, tuple):
            errs.append(f"image without alt text: {v[1]}")
        elif v.startswith("#"):
            # "#top" scrolls to the top of the page per the HTML spec, even with no such id.
            if v[1:].lower() != "top" and v[1:] not in p.ids:
                errs.append(f"link to missing section {v}")
        elif v.startswith("tel:"):
            if not re.fullmatch(r"tel:\+91\d{10}", v):
                errs.append(f"bad phone link {v}")
        elif v.startswith("https://wa.me/"):
            if not re.fullmatch(r"https://wa\.me/91\d{10}(\?text=\S+)?", v):
                errs.append(f"bad WhatsApp link {v}")
        elif v.startswith("mailto:"):
            if not re.fullmatch(r"mailto:[\w.+-]+@[\w-]+(\.[\w-]+)+(\?subject=\S+)?", v):
                errs.append(f"bad email link {v}")
        elif not re.match(r"https?://", v) and not (root / v).is_file():
            errs.append(f"missing file {v}")
    canon = re.search(r'rel="canonical" href="https://([^/"]+)/"', html)
    cname = (root / "CNAME").read_text().strip()
    if not canon or canon.group(1) != cname:
        errs.append(f"CNAME '{cname}' doesn't match the canonical URL")
    used = {v for v in p.refs if isinstance(v, str) and v.startswith("images/")}
    for img in sorted((root / "images").iterdir()):
        if f"images/{img.name}" not in used:
            errs.append(f"unused file images/{img.name}")
    return errs, len(p.refs)


if __name__ == "__main__":
    errs, n = check(sys.argv[1] if len(sys.argv) > 1 else ".")
    print(f"{n} links and files checked")
    for e in errs:
        print(f"::error::{e}")
    sys.exit(1 if errs else 0)
