from pathlib import Path

root = Path(r'c:\Users\Kate\Desktop\Projects\roadmap')
skip = {'.png', '.jpg', '.jpeg', '.gif', '.ico', '.bmp', '.exe', '.dll', '.wasm', '.bin', '.pdf', '.zip', '.tar', '.gz', '.7z', '.mp3', '.mp4', '.avi', '.mov', '.mpeg', '.ttf', '.woff', '.woff2', '.eot', '.otf'}
problems = []

for path in root.rglob('*'):
    if not path.is_file():
        continue
    if path.suffix.lower() in skip:
        continue
    data = path.read_bytes()
    try:
        text = data.decode('utf-8')
    except Exception as e:
        try:
            text = data.decode('utf-8', errors='surrogatepass')
        except Exception:
            problems.append((str(path.relative_to(root)), 'utf8-decode-fail', str(e)))
            continue
        surgs = [(i, hex(ord(ch)), text.count('\n', 0, i) + 1) for i, ch in enumerate(text) if 0xD800 <= ord(ch) <= 0xDFFF]
        problems.append((str(path.relative_to(root)), 'surrogates', surgs[:20]))
    else:
        surgs = [(i, hex(ord(ch)), text.count('\n', 0, i) + 1) for i, ch in enumerate(text) if 0xD800 <= ord(ch) <= 0xDFFF]
        if surgs:
            problems.append((str(path.relative_to(root)), 'surrogates', surgs[:20]))

for path, kind, detail in problems:
    print(f"{path}\t{kind}\t{detail}")
print('TOTAL', len(problems))
