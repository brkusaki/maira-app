import sys, os, glob
sys.path.insert(0, os.path.dirname(__file__))
from PIL import Image, ImageDraw
import importlib.util
spec = importlib.util.spec_from_file_location('ic', os.path.join(os.path.dirname(__file__), 'icones.py'))
R = 'android/app/src/main/res'
src = 'www/icons/icon-1024.png'
base = Image.open(src).convert('RGBA')
dens = {'mdpi':1,'hdpi':1.5,'xhdpi':2,'xxhdpi':3,'xxxhdpi':4}
# máscara redonda
def redondo(im):
    m = Image.new('L', im.size, 0); ImageDraw.Draw(m).ellipse([0,0,*im.size], fill=255)
    o = im.copy(); o.putalpha(m); return o
# silhueta branca (lua+coração) extraída: pixels claros do ícone
px = base.load(); W,H = base.size
sil = Image.new('RGBA', base.size, (0,0,0,0)); sp = sil.load()
for y in range(H):
    for x in range(W):
        r,g,b,a = px[x,y]
        if r > 245 and g > 225 and b > 205: sp[x,y] = (255,255,255,255)
bbox = sil.getbbox(); sil_c = sil.crop(bbox)
for d,k in dens.items():
    n = int(48*k)
    ic = base.resize((n,n), Image.LANCZOS)
    ic.save(f'{R}/mipmap-{d}/ic_launcher.png'); redondo(ic).save(f'{R}/mipmap-{d}/ic_launcher_round.png')
    # foreground adaptativo 108dp, conteúdo em ~60%
    f = int(108*k); fg = Image.new('RGBA',(f,f),(0,0,0,0))
    s = int(f*0.55); w = int(sil_c.width*s/max(sil_c.size)); h = int(sil_c.height*s/max(sil_c.size))
    fg.paste(sil_c.resize((w,h), Image.LANCZOS), ((f-w)//2,(f-h)//2), sil_c.resize((w,h), Image.LANCZOS))
    fg.save(f'{R}/mipmap-{d}/ic_launcher_foreground.png')
    # ícone de notificação 24dp branco
    os.makedirs(f'{R}/drawable-{d}', exist_ok=True)
    t = int(24*k); s2 = int(t*0.9); w = int(sil_c.width*s2/max(sil_c.size)); h = int(sil_c.height*s2/max(sil_c.size))
    st = Image.new('RGBA',(t,t),(0,0,0,0)); st.paste(sil_c.resize((w,h), Image.LANCZOS), ((t-w)//2,(t-h)//2)); st.save(f'{R}/drawable-{d}/ic_stat_icon.png')
# splash: fundo creme + ícone central
for p in glob.glob(f'{R}/drawable*/splash.png'):
    im = Image.open(p); W,H = im.size
    sp = Image.new('RGBA',(W,H),(246,237,230,255)); n = int(min(W,H)*0.28)
    sp.paste(redondo(base.resize((n,n), Image.LANCZOS)), ((W-n)//2,(H-n)//2), redondo(base.resize((n,n), Image.LANCZOS)))
    sp.convert('RGB').save(p)
open(f'{R}/values/ic_launcher_background.xml','w').write('<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">#E89F92</color>\n</resources>\n')
print('ok')
