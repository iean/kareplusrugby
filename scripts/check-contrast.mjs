// WCAG AA contrast gate for the palette in config/theme.json.
// Run: node scripts/check-contrast.mjs   (exits non-zero on any failure)
const t=JSON.parse(await (await import('fs/promises')).readFile(new URL('../config/theme.json', import.meta.url),'utf8'));
const L=h=>{const c=h.replace('#','').match(/../g).map(x=>parseInt(x,16)/255)
  .map(v=>v<=0.03928?v/12.92:((v+0.055)/1.055)**2.4);
  return 0.2126*c[0]+0.7152*c[1]+0.0722*c[2];};
const R=(a,b)=>{const[x,y]=[L(a),L(b)].sort((p,q)=>q-p);return (x+0.05)/(y+0.05);};
const W='#ffffff', S=t.colors.neutral.surface, B=t.colors.blue;
const rows=[
 ['body text on white',        t.colors.neutral.text, W, 4.5],
 ['body text on surface',      t.colors.neutral.text, S, 4.5],
 ['muted text on white',       t.colors.neutral.text_muted, W, 4.5],
 ['muted text on surface',     t.colors.neutral.text_muted, S, 4.5],
 ['primary link on white',     B['700'], W, 4.5],
 ['primary link on surface',   B['700'], S, 4.5],
 ['accent (green) on white',   t.colors.default.theme_color.primary, W, 4.5],
 // Brand green is a light fill: text ON it must be dark navy, never white.
 ['navy text on brand green', t.colors.blue['950'], t.colors.green.brand, 4.5],
 ['green text on green tint',  t.colors.default.theme_color.primary, t.colors.green['50'], 4.5],
 ['white on primary btn',      W, B['700'], 4.5],
 ['white on primary hover',    W, B['800'], 4.5],
 ['white on navy 900',         W, B['900'], 4.5],
 ['white on navy 950',         W, B['950'], 4.5],
 ['heading navy on white',     B['950'], W, 3.0],
 ['success text on successBg', t.colors.state.success, t.colors.state.success_bg, 4.5],
 ['danger text on dangerBg',   t.colors.state.danger, t.colors.state.danger_bg, 4.5],
 ['warning text on warningBg', t.colors.state.warning, t.colors.state.warning_bg, 4.5],
 ['border vs white (3:1 UI)',  t.colors.neutral.border_strong, W, 3.0],
];
let fail=0;
for(const [n,f,b,min] of rows){const r=R(f,b);const ok=r>=min;if(!ok)fail++;
 console.log(`${ok?'PASS':'FAIL'}  ${r.toFixed(2).padStart(6)}:1  (min ${min})  ${n}`);}
console.log(fail? `\n${fail} FAILURES`:'\nAll contrast checks pass');
if (fail) process.exit(1);
