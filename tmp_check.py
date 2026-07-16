import pathlib
src = pathlib.Path('src/pages/Camera.jsx').read_text(encoding='utf-8')
stack = []
pairs = {')': '(', ']': '[', '}': '{'}
state = 'code'
quote = None
escape = False
i = 0
line = 1
while i < len(src):
    ch = src[i]
    nxt = src[i+1] if i + 1 < len(src) else ''
    if state == 'linecomment':
        if ch == '\n':
            state = 'code'
            line += 1
        i += 1
        continue
    if state == 'blockcomment':
        if ch == '*' and nxt == '/':
            state = 'code'
            i += 2
            continue
        if ch == '\n':
            line += 1
        i += 1
        continue
    if state == 'string':
        if escape:
            escape = False
        elif ch == '\\':
            escape = True
        elif ch == quote:
            state = 'code'
        if ch == '\n':
            line += 1
        i += 1
        continue
    if ch == '/' and nxt == '/':
        state = 'linecomment'; i += 2; continue
    if ch == '/' and nxt == '*':
        state = 'blockcomment'; i += 2; continue
    if ch in ('"', "'", '`'):
        quote = ch; state = 'string'; i += 1; continue
    if ch in '([{':
        stack.append((ch, line))
    elif ch in ')]}':
        if not stack or stack[-1][0] != pairs[ch]:
            print('mismatch', ch, 'at line', line, 'expected', pairs[ch], 'but saw', ch)
            break
        stack.pop()
    if ch == '\n':
        line += 1
    i += 1
else:
    if state != 'code':
        print('unterminated state', state)
    if stack:
        print('remaining', stack[-10:])
    else:
        print('balanced')
