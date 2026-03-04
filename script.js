// Polyfill drag-and-drop for touch devices
(function(){
  let draggingEl=null, clone=null, dragId=null;
  function touchStart(e){
    const chip=e.target.closest('.chip');
    if(!chip)return;
    dragId=chip.dataset.id;
    draggingEl=chip;
    clone=chip.cloneNode(true);
    clone.style.cssText=`position:fixed;opacity:0.75;pointer-events:none;z-index:9999;width:${chip.offsetWidth}px;transform:scale(1.1);border:2px solid #e080a0;border-radius:10px;background:#fff;`;
    document.body.appendChild(clone);
    move(e.touches[0]);
  }
  function touchMove(e){
    if(!clone)return;
    e.preventDefault();
    move(e.touches[0]);
    const ov=document.getElementById('dropOverlay');
    const r=ov.getBoundingClientRect();
    const t=e.touches[0];
    if(t.clientX>=r.left&&t.clientX<=r.right&&t.clientY>=r.top&&t.clientY<=r.bottom)
      ov.classList.add('over');
    else ov.classList.remove('over');
  }
  function touchEnd(e){
    if(!clone)return;
    clone.remove();clone=null;
    document.getElementById('dropOverlay').classList.remove('over');
    const t=e.changedTouches[0];
    const ov=document.getElementById('dropOverlay');
    const r=ov.getBoundingClientRect();
    if(t.clientX>=r.left&&t.clientX<=r.right&&t.clientY>=r.top&&t.clientY<=r.bottom){
      // Simulate drop
      window._touchDrop(dragId);
    }
    dragId=null;
  }
  function move(t){
    clone.style.left=(t.clientX-30)+'px';
    clone.style.top=(t.clientY-30)+'px';
  }
  document.addEventListener('touchstart',touchStart,{passive:true});
  document.addEventListener('touchmove',touchMove,{passive:false});
  document.addEventListener('touchend',touchEnd);
})();
</script>

<script>
const NS='http://www.w3.org/2000/svg';
const TOP_Y=44,BOT_Y=300,CUP_H=BOT_Y-TOP_Y;
function cupEdges(y){const t=(y-TOP_Y)/CUP_H;return{left:22+(46-22)*t,right:218+(194-218)*t};}
function cupMid(y){const e=cupEdges(y);return(e.left+e.right)/2;}
function trapPoly(y1,y2,fill,parent){
  const e1=cupEdges(y1),e2=cupEdges(y2);
  const p=document.createElementNS(NS,'polygon');
  p.setAttribute('points',`${e1.left},${y1} ${e1.right},${y1} ${e2.right},${y2} ${e2.left},${y2}`);
  p.setAttribute('fill',fill);parent.appendChild(p);return p;
}
function svgText(x,y,str,size,fill,parent,weight='700'){
  const t=document.createElementNS(NS,'text');
  t.setAttribute('x',x);t.setAttribute('y',y);t.setAttribute('text-anchor','middle');
  t.setAttribute('font-family','Nunito,sans-serif');t.setAttribute('font-size',size);
  t.setAttribute('font-weight',weight);t.setAttribute('fill',fill);
  t.textContent=str;parent.appendChild(t);return t;
}
function isLight([r,g,b]){return r*.299+g*.587+b*.114>155;}

function toLinear(c){const s=c/255;return s<=.04045?s/12.92:Math.pow((s+.055)/1.055,2.4);}
function toGamma(c){return c<=.0031308?c*12.92:1.055*Math.pow(c,1/2.4)-.055;}
function rgbToLin([r,g,b]){return[toLinear(r),toLinear(g),toLinear(b)];}
function linToRgb([r,g,b]){return[Math.round(toGamma(r)*255),Math.round(toGamma(g)*255),Math.round(toGamma(b)*255)];}
function linToOKLab([r,g,b]){
  const l=.4122214708*r+.5363325363*g+.0514459929*b,m=.2119034982*r+.6806995451*g+.1073969566*b,s=.0883024619*r+.2817188376*g+.6299787005*b;
  const l_=Math.cbrt(l),m_=Math.cbrt(m),s_=Math.cbrt(s);
  return[.2104542553*l_+.7936177850*m_-.0040720468*s_,1.9779984951*l_-2.4285922050*m_+.4505937099*s_,.0259040371*l_+.7827717662*m_-.8086757660*s_];
}
function OKLabToLin([L,a,b]){
  const l_=L+.3963377774*a+.2158037573*b,m_=L-.1055613458*a-.0638541728*b,s_=L-.0894841775*a-1.2914855480*b;
  const l=l_*l_*l_,m=m_*m_*m_,s=s_*s_*s_;
  return[4.0767416621*l-3.3077115913*m+.2309699292*s,-1.2684380046*l+2.6097574011*m-.3413193965*s,-.0041960863*l-.7034186147*m+1.7076147010*s];
}
function rgbToOKLab(rgb){return linToOKLab(rgbToLin(rgb));}
function OKLabToRGB(lab){return linToRgb(OKLabToLin(lab)).map(c=>Math.max(0,Math.min(255,c)));}
const VOLUMES={base:120,milk:80,syrup:100,foam:0,topping:0,boba:0};

const INGREDIENTS=[
  {id:'espresso',   name:'Espresso',   emoji:'☕',cat:'ig-coffee', kind:'base',  rgb:[62,28,16]},
  {id:'matcha',     name:'Matcha',     emoji:'🍵',cat:'ig-coffee', kind:'base',  rgb:[100,172,58]},
  {id:'cold-brew',  name:'Cold Brew',  emoji:'🧊',cat:'ig-coffee', kind:'base',  rgb:[38,68,105]},
  {id:'black-tea',  name:'Black Tea',  emoji:'🫖',cat:'ig-tea',    kind:'base',  rgb:[130,82,44]},
  {id:'green-tea',  name:'Green Tea',  emoji:'🌿',cat:'ig-tea',    kind:'base',  rgb:[82,152,52]},
  {id:'chai',       name:'Chai',       emoji:'🍂',cat:'ig-tea',    kind:'base',  rgb:[185,105,45]},
  {id:'hibiscus',   name:'Hibiscus',   emoji:'🌺',cat:'ig-tea',    kind:'base',  rgb:[205,38,95]},
  {id:'milk',       name:'Milk',       emoji:'🥛',cat:'ig-milk',   kind:'milk',  rgb:[245,240,234]},
  {id:'oat-milk',   name:'Oat Milk',   emoji:'🌾',cat:'ig-milk',   kind:'milk',  rgb:[215,188,152]},
  {id:'coconut',    name:'Coconut',    emoji:'🥥',cat:'ig-milk',   kind:'milk',  rgb:[242,240,222]},
  {id:'cream',      name:'Cream',      emoji:'🍦',cat:'ig-milk',   kind:'milk',  rgb:[250,242,218]},
  {id:'vanilla',    name:'Vanilla',    emoji:'🌼',cat:'ig-syrup',  kind:'syrup', rgb:[242,210,78]},
  {id:'caramel',    name:'Caramel',    emoji:'🍯',cat:'ig-syrup',  kind:'syrup', rgb:[205,122,8]},
  {id:'lavender',   name:'Lavender',   emoji:'💜',cat:'ig-syrup',  kind:'syrup', rgb:[162,128,212]},
  {id:'strawberry', name:'Strawberry', emoji:'🍓',cat:'ig-syrup',  kind:'syrup', rgb:[222,48,78]},
  {id:'honey',      name:'Honey',      emoji:'🐝',cat:'ig-syrup',  kind:'syrup', rgb:[222,158,18]},
  {id:'brown-sugar',name:'Brown Sugar',emoji:'🟫',cat:'ig-syrup',  kind:'syrup', rgb:[142,88,40]},
  {id:'chocolate',  name:'Chocolate',  emoji:'🍫',cat:'ig-syrup',  kind:'syrup', rgb:[48,18,4]},
  {id:'white-choc', name:'White Choc', emoji:'🤍',cat:'ig-syrup',  kind:'syrup', rgb:[248,232,202]},
  {id:'foam',       name:'Foam',       emoji:'☁️',cat:'ig-topping',kind:'foam',  rgb:[255,252,246]},
  {id:'cinnamon',   name:'Cinnamon',   emoji:'🟤',cat:'ig-topping',kind:'topping',rgb:[162,88,48]},
  {id:'sprinkles',  name:'Sprinkles',  emoji:'🎊',cat:'ig-topping',kind:'topping',rgb:[240,200,0]},
  {id:'rose',       name:'Rose Petals',emoji:'🌹',cat:'ig-topping',kind:'topping',rgb:[222,88,118]},
  {id:'boba',       name:'Boba',       emoji:'⚫',cat:'ig-topping',kind:'boba',  rgb:[13,5,0]},
];

const RECIPES=[
  {name:'Classic Latte',     emoji:'☕',ings:['espresso','milk','foam']},
  {name:'Matcha Latte',      emoji:'🍵',ings:['matcha','oat-milk','foam']},
  {name:'Chai Latte',        emoji:'🍂',ings:['chai','milk','cinnamon']},
  {name:'Lavender Latte',    emoji:'💜',ings:['espresso','milk','lavender','foam']},
  {name:'Caramel Macchiato', emoji:'🍯',ings:['espresso','milk','caramel','foam']},
  {name:'Strawberry Matcha', emoji:'🍓',ings:['matcha','oat-milk','strawberry']},
  {name:'Honey Green Tea',   emoji:'🌿',ings:['green-tea','honey','milk']},
  {name:'Hibiscus Tea',      emoji:'🌺',ings:['hibiscus','honey','rose']},
  {name:'Boba Milk Tea',     emoji:'🧋',ings:['black-tea','milk','boba']},
  {name:'Vanilla Cold Brew', emoji:'🧊',ings:['cold-brew','cream','vanilla']},
  {name:'Coconut Matcha',    emoji:'🥥',ings:['matcha','coconut','honey']},
  {name:'Chai Boba',         emoji:'🫧',ings:['chai','oat-milk','boba','cinnamon']},
  {name:'Brown Sugar Latte', emoji:'🟫',ings:['espresso','milk','brown-sugar','foam']},
  {name:'Mocha',             emoji:'🍫',ings:['espresso','milk','chocolate','foam']},
  {name:'White Mocha',       emoji:'🤍',ings:['espresso','milk','white-choc','foam']},
];

let cup=[],mixedColor=null,mixTimer=null,servedCount=0,matchedCount=0;
const findIng=id=>INGREDIENTS.find(x=>x.id===id);

INGREDIENTS.forEach(ing=>{
  const el=document.createElement('div');
  el.className='chip';el.draggable=true;el.dataset.id=ing.id;
  el.innerHTML=`<span class="ce">${ing.emoji}</span><span class="cn">${ing.name}</span>`;
  el.addEventListener('dragstart',e=>{e.dataTransfer.setData('text/plain',ing.id);el.classList.add('dragging');});
  el.addEventListener('dragend',()=>el.classList.remove('dragging'));
  document.getElementById(ing.cat).appendChild(el);
});

RECIPES.forEach((r,i)=>{
  const c=document.createElement('div');c.className='rec-card';c.id='rc'+i;
  c.innerHTML=`<div class="rn">${r.emoji} ${r.name}</div><div class="ri">${r.ings.map(id=>{const g=findIng(id);return g?g.emoji+' '+g.name:id;}).join(', ')}</div>`;
  document.getElementById('recipeList').appendChild(c);
});

function handleDrop(id){
  if(!id)return;
  if(cup.includes(id)){showToast('Already in cup! 🙈');return;}
  cup.push(id);
  mixedColor=null;
  clearTimeout(mixTimer);
  drawCup(false);
  updateLabel();
  const ing=findIng(id);
  if(ing&&ing.kind==='topping'&&['cinnamon','rose','sprinkles'].includes(id)) shakeTopping(id);
  const liqCount=cup.filter(i=>['base','milk','syrup'].includes(findIng(i).kind)).length;
  if(liqCount>=2) mixTimer=setTimeout(()=>{mixedColor=computeMix();drawCup(true);updateLabel();},2000);
}

// Touch drop handler
window._touchDrop=handleDrop;

const ov=document.getElementById('dropOverlay');
ov.addEventListener('dragover',e=>{e.preventDefault();ov.classList.add('over');});
ov.addEventListener('dragleave',()=>ov.classList.remove('over'));
ov.addEventListener('drop',e=>{e.preventDefault();ov.classList.remove('over');handleDrop(e.dataTransfer.getData('text/plain'));});

function clearGroup(id){const g=document.getElementById(id);while(g.firstChild)g.removeChild(g.firstChild);}

function drawCup(mixed){
  ['bobaGroup','liquidGroup','foamGroup','toppingGroup'].forEach(clearGroup);
  document.getElementById('hint1').style.display=cup.length?'none':'';
  document.getElementById('hint2').style.display=cup.length?'none':'';

  const allIngs=cup.map(findIng);
  const bases=allIngs.filter(i=>i.kind==='base');
  const milks=allIngs.filter(i=>i.kind==='milk');
  const syrups=allIngs.filter(i=>i.kind==='syrup');
  const liquids=allIngs.filter(i=>['base','milk','syrup'].includes(i.kind));
  const hasFoam=allIngs.some(i=>i.kind==='foam');
  const hasBoba=allIngs.some(i=>i.kind==='boba');
  const tops=allIngs.filter(i=>i.kind==='topping');

  const BOBA_H=hasBoba?26:0;
  const FOAM_H=hasFoam?34:0;
  // Toppings do NOT get their own zone — they overlap the top of foam or liquid
  const LIQ_H=liquids.length?CUP_H-BOBA_H-FOAM_H:0;

  const yBot=BOT_Y,yBobaTop=yBot-BOBA_H,yLiqBot=yBobaTop;
  const yLiqTop=yLiqBot-LIQ_H,yFoamTop=yLiqTop-FOAM_H;
  // Toppings draw zone = top of foam if present, else top of liquid
  const yToppTop=yFoamTop;
  const yToppBot=hasFoam?yLiqTop:yLiqBot;
  const TOPP_H=yToppBot-yToppTop;

  const bobaG=document.getElementById('bobaGroup');
  const liqG=document.getElementById('liquidGroup');
  const foamG=document.getElementById('foamGroup');
  const topG=document.getElementById('toppingGroup');

  // BOBA
  if(hasBoba){
    trapPoly(yBobaTop,yBot,'rgba(5,2,0,0.15)',bobaG);
    const rowY=(yBobaTop+yBot)/2;
    const {left,right}=cupEdges(rowY);
    const cols=Math.min(9,Math.floor((right-left-16)/16));
    const spacing=(right-left-16)/(cols-1||1);
    for(let i=0;i<cols;i++){
      const ci=document.createElementNS(NS,'circle');
      ci.setAttribute('cx',left+8+i*spacing);ci.setAttribute('cy',rowY);ci.setAttribute('r','7');
      ci.setAttribute('fill','#0d0500');bobaG.appendChild(ci);
    }
  }

  // LIQUID
  if(liquids.length&&LIQ_H>0){
    if(!mixed){
      const ordered=[...bases,...milks,...syrups];
      const sh=LIQ_H/ordered.length;
      ordered.forEach((ing,i)=>{
        const y1=yLiqBot-(i+1)*sh,y2=yLiqBot-i*sh;
        trapPoly(y1,y2,`rgb(${ing.rgb.join(',')})`,liqG);
        if(sh>15){
          const my=(y1+y2)/2;
          svgText(cupMid(my),my+4,`${ing.emoji} ${ing.name}`,Math.min(11,sh*.6),isLight(ing.rgb)?'#4a2838':'#fff',liqG);
        }
      });
    } else {
      const [r,g,b]=mixedColor;
      const gradId='lg'+Math.random().toString(36).slice(2);
      const defs=document.getElementById('cupSvg').querySelector('defs');
      const grad=document.createElementNS(NS,'linearGradient');
      grad.setAttribute('id',gradId);grad.setAttribute('x1','0');grad.setAttribute('y1','0');grad.setAttribute('x2','0');grad.setAttribute('y2','1');
      [[0,1.1],[1,0.88]].forEach(([off,f])=>{
        const s=document.createElementNS(NS,'stop');
        s.setAttribute('offset',off*100+'%');
        s.setAttribute('stop-color',`rgb(${Math.min(255,Math.round(r*f))},${Math.min(255,Math.round(g*f))},${Math.min(255,Math.round(b*f))})`);
        grad.appendChild(s);
      });
      defs.appendChild(grad);
      const rect=trapPoly(yLiqTop,yLiqBot,`url(#${gradId})`,liqG);
      rect.classList.add('mixing');
    }
  }

  // FOAM
  if(hasFoam){
    trapPoly(yFoamTop,yLiqTop,'rgb(252,248,240)',foamG);
    const bubs=[[.15,.38,5],[.38,.22,4],[.60,.45,6],[.25,.68,3],[.52,.72,4],[.75,.30,3],[.88,.58,3],[.70,.15,4]];
    bubs.forEach(([rx,ry,r])=>{
      const {left:fl,right:fr}=cupEdges(yFoamTop+(yLiqTop-yFoamTop)*ry);
      const cx=fl+(fr-fl)*rx,cy=yFoamTop+(yLiqTop-yFoamTop)*ry;
      const ci=document.createElementNS(NS,'circle');
      ci.setAttribute('cx',cx);ci.setAttribute('cy',cy);ci.setAttribute('r',r);
      ci.setAttribute('fill','rgba(255,255,255,0.85)');foamG.appendChild(ci);
    });
  }

  // TOPPINGS
  if(tops.length){
    // No background band — toppings sit directly on whatever is below
    const {left:tl,right:tr}=cupEdges((yToppTop+yFoamTop)/2);
    const zW=tr-tl,zH=TOPP_H;
    tops.forEach(t=>{
      if(t.id==='cinnamon'){
        for(let i=0;i<28;i++){
          const ci=document.createElementNS(NS,'circle');
          ci.setAttribute('cx',tl+4+Math.random()*(zW-8));
          ci.setAttribute('cy',yToppTop+2+Math.random()*(zH-4));
          ci.setAttribute('r',1+Math.random()*2);
          ci.setAttribute('fill',`rgba(${120+Math.round(Math.random()*40)},${55+Math.round(Math.random()*30)},${20+Math.round(Math.random()*20)},${0.7+Math.random()*0.3})`);
          topG.appendChild(ci);
        }
      } else if(t.id==='rose'){
        const pc=['#e87090','#f090a8','#d05878','#f4a0b8','#e06888'];
        for(let i=0;i<35;i++){
          const rx=tl+6+Math.random()*(zW-12),ry=yToppTop+3+Math.random()*(zH-6);
          const el=document.createElementNS(NS,'ellipse');
          el.setAttribute('cx',rx);el.setAttribute('cy',ry);
          el.setAttribute('rx','4');el.setAttribute('ry','2.5');
          el.setAttribute('fill',pc[Math.floor(Math.random()*pc.length)]);
          el.setAttribute('opacity','0.85');
          el.setAttribute('transform',`rotate(${Math.random()*360},${rx},${ry})`);
          topG.appendChild(el);
        }
      } else if(t.id==='sprinkles'){
        const cc=['#f94040','#f9a020','#f9e020','#40c040','#4080f9','#c040f9','#f940c0','#40e0d0'];
        for(let i=0;i<30;i++){
          const rx=tl+4+Math.random()*(zW-8),ry=yToppTop+2+Math.random()*(zH-4);
          const rect=document.createElementNS(NS,'rect');
          rect.setAttribute('x',rx-5);rect.setAttribute('y',ry-1.5);
          rect.setAttribute('width','9');rect.setAttribute('height','3');
          rect.setAttribute('rx','1');
          rect.setAttribute('fill',cc[Math.floor(Math.random()*cc.length)]);
          rect.setAttribute('opacity','0.9');
          rect.setAttribute('transform',`rotate(${Math.random()*180},${rx},${ry})`);
          topG.appendChild(rect);
        }
      }
    });
  }
}

function computeMix(){
  const liq=cup.map(findIng).filter(i=>['base','milk','syrup'].includes(i.kind));
  if(!liq.length)return[200,180,160];
  let tot=0;
  const samples=liq.map(i=>{const v=VOLUMES[i.kind];tot+=v;return{lab:rgbToOKLab(i.rgb),vol:v};});
  let L=0,A=0,B=0;
  samples.forEach(({lab:[l,a,b],vol})=>{const w=vol/tot;L+=l*w;A+=a*w;B+=b*w;});
  const milkCount=liq.filter(i=>i.kind==='milk').length;
  if(milkCount>0){
    const mr=(milkCount*VOLUMES.milk)/tot;
    L=L+(0.93-L)*mr*0.2;
  }
  return OKLabToRGB([L,A,B]);
}

const SHAKER_CFG={cinnamon:{color:'#b85c28',label:'🧂',cap:'#8b3a10'},rose:{color:'#e06888',label:'🌹',cap:'#b83058'},sprinkles:{color:'#f0d040',label:'🎊',cap:'#c0a000'}};
function shakeTopping(id){
  const cfg=SHAKER_CFG[id];if(!cfg)return;
  const old=document.getElementById('shakerEl');if(old)old.remove();
  const svg=document.createElementNS(NS,'svg');
  svg.setAttribute('id','shakerEl');svg.setAttribute('viewBox','0 0 60 120');
  svg.setAttribute('width','60');svg.setAttribute('height','120');
  svg.style.cssText='position:absolute;top:-30px;left:50%;transform:translateX(-50%) rotate(-35deg);transform-origin:bottom center;z-index:100;pointer-events:none;filter:drop-shadow(2px 4px 6px rgba(0,0,0,0.25));';
  const body=document.createElementNS(NS,'rect');
  body.setAttribute('x','10');body.setAttribute('y','30');body.setAttribute('width','40');body.setAttribute('height','75');body.setAttribute('rx','10');body.setAttribute('fill',cfg.color);svg.appendChild(body);
  const cap=document.createElementNS(NS,'polygon');
  cap.setAttribute('points','10,35 50,35 45,8 15,8');cap.setAttribute('fill',cfg.cap);svg.appendChild(cap);
  [[25,18],[35,18],[30,25]].forEach(([x,y])=>{
    const h=document.createElementNS(NS,'circle');
    h.setAttribute('cx',x);h.setAttribute('cy',y);h.setAttribute('r','2.5');h.setAttribute('fill','rgba(0,0,0,0.3)');svg.appendChild(h);
  });
  const fo=document.createElementNS(NS,'foreignObject');
  fo.setAttribute('x','12');fo.setAttribute('y','55');fo.setAttribute('width','36');fo.setAttribute('height','36');
  fo.innerHTML=`<div xmlns="http://www.w3.org/1999/xhtml" style="font-size:20px;text-align:center;line-height:36px;">${cfg.label}</div>`;
  svg.appendChild(fo);
  document.querySelector('.cup-area').appendChild(svg);
  const styleId='shakerStyle';let st=document.getElementById(styleId);if(st)st.remove();
  st=document.createElement('style');st.id=styleId;
  st.textContent=`@keyframes shakerShake{0%{transform:translateX(-50%) rotate(-35deg) translateY(0);}15%{transform:translateX(-50%) rotate(-25deg) translateY(-8px);}30%{transform:translateX(-50%) rotate(-40deg) translateY(-4px);}45%{transform:translateX(-50%) rotate(-22deg) translateY(-10px);}60%{transform:translateX(-50%) rotate(-38deg) translateY(-3px);}75%{transform:translateX(-50%) rotate(-28deg) translateY(-7px);}90%{transform:translateX(-50%) rotate(-35deg) translateY(-2px);}100%{transform:translateX(-50%) rotate(-35deg) translateY(0);}}#shakerEl{animation:shakerShake 0.4s ease-in-out 7;}`;
  document.head.appendChild(st);
  setTimeout(()=>svg.remove(),3000);
}

function matchRecipe(){return RECIPES.find(r=>r.ings.length===cup.length&&r.ings.every(id=>cup.includes(id)));}
function updateLabel(){
  const el=document.getElementById('cupLabel');
  if(!cup.length){el.textContent='Empty cup';return;}
  const m=matchRecipe();
  el.textContent=m?`${m.emoji} ${m.name} ✨`:`${cup.length} ingredient${cup.length>1?'s':''}`;
}
function serve(){
  if(!cup.length){showToast('Add ingredients first! 🌸');return;}
  servedCount++;document.getElementById('served').textContent=servedCount;
  const m=matchRecipe();
  if(m){
    matchedCount++;document.getElementById('matched').textContent=matchedCount;
    showToast(`${m.emoji} Perfect ${m.name}! ✨`);
    const card=document.getElementById('rc'+RECIPES.indexOf(m));
    if(card){card.classList.add('matched');setTimeout(()=>card.classList.remove('matched'),2200);}
  } else {
    showToast(['Interesting combo! 🤔','Creative! 🎨','Off-menu special! 🌟'][Math.floor(Math.random()*3)]);
  }
  clearCup();
}
function clearCup(){
  clearTimeout(mixTimer);cup=[];mixedColor=null;
  ['bobaGroup','liquidGroup','foamGroup','toppingGroup'].forEach(clearGroup);
  document.getElementById('hint1').style.display='';document.getElementById('hint2').style.display='';
  updateLabel();
}
let toastTimer;
function showToast(msg){
  const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');
  clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('show'),2400);
}
