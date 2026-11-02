from PIL import Image, ImageDraw
import math, sys, os
def coracao(d, cx, cy, s, cor):
    pts=[]
    for i in range(360):
        t=math.radians(i)
        x=16*math.sin(t)**3
        y=13*math.cos(t)-5*math.cos(2*t)-2*math.cos(3*t)-math.cos(4*t)
        pts.append((cx+x*s, cy-y*s))
    d.polygon(pts, fill=cor)
def icone(n, fundo=True, branco=False):
    S=n*4
    im=Image.new('RGBA',(S,S),(0,0,0,0)); d=ImageDraw.Draw(im)
    if fundo:
        for y in range(S):
            k=y/S; c=(int(242-20*k),int(178-40*k),int(166-40*k),255)
            d.line([(0,y),(S,y)],fill=c)
    cor=(255,255,255,255)
    # lua
    r=S*0.30; cx,cy=S*0.47,S*0.5
    d.ellipse([cx-r,cy-r,cx+r,cy+r],fill=cor)
    off=S*0.12
    d.ellipse([cx-r+off,cy-r-off*0.6,cx+r+off,cy+r-off*0.6],fill=(0,0,0,0) if not fundo else None)
    if fundo:
        # recorta a lua redesenhando o fundo
        m=Image.new('L',(S,S),0); md=ImageDraw.Draw(m); md.ellipse([cx-r+off,cy-r-off*0.6,cx+r+off,cy+r-off*0.6],fill=255)
        bg=Image.new('RGBA',(S,S)); bd=ImageDraw.Draw(bg)
        for y in range(S):
            k=y/S; bd.line([(0,y),(S,y)],fill=(int(242-20*k),int(178-40*k),int(166-40*k),255))
        im.paste(bg,(0,0),m); d=ImageDraw.Draw(im)
    coracao(d, S*0.66, S*0.58, S*0.0085, (255,255,255,255) if branco or not fundo else (255,236,214,255))
    return im.resize((n,n),Image.LANCZOS)
out=sys.argv[1]
icone(192).save(f'{out}/icon-192.png'); icone(512).save(f'{out}/icon-512.png'); icone(1024).save(f'{out}/icon-1024.png')
