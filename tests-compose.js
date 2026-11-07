const assert=require('assert');const {compose,Composer}=require('./compose.js');
const c=(label,category)=>({label,category});
const show=(name,cards)=>{const r=compose(cards);console.log(name.padEnd(28),cards.map(x=>x.label).join('+').padEnd(22),'=>',r.ok?r.alternatives.join(' | '):'[提示] '+r.message+' ⟶ '+r.fallback);return r;};
let r;
r=show('food',[c('蘋果','水果')]);assert(r.ok&&r.alternatives.includes('我想吃蘋果。'));
r=show('food+drink',[c('蘋果','水果'),c('牛奶','飲料')]);assert(r.ok&&r.alternatives[0].includes('吃蘋果')&&r.alternatives[0].includes('喝牛奶'));
r=show('two foods',[c('蘋果','水果'),c('香蕉','水果')]);assert(r.alternatives.includes('我想吃蘋果和香蕉。'));
r=show('appliance tv',[c('電視','電器')]);assert(r.alternatives.includes('我想看電視。'));
r=show('appliance ac',[c('冷氣','電器')]);assert(r.alternatives.includes('我想開冷氣。'));assert(!r.alternatives.some(s=>s.includes('吃')));
r=show('location',[c('公園','地點')]);assert(r.alternatives.includes('我想去公園。'));
r=show('person+location',[c('媽媽','人物'),c('公園','地點')]);assert(r.alternatives.some(s=>s==='媽媽，我想去公園。')&&r.alternatives.some(s=>s.includes('跟媽媽一起去公園')));
r=show('person+food',[c('爸爸','人物'),c('蘋果','水果')]);assert(r.alternatives.every(s=>s.includes('爸爸')&&s.includes('蘋果')));
r=show('person only',[c('老師','人物')]);assert(r.alternatives.includes('我要找老師。'));
r=show('action',[c('看書','活動')]);assert(r.alternatives.includes('我想看書。'));
r=show('play+toy',[c('玩','活動'),c('球','玩具')]);assert(r.alternatives.includes('我想玩球。'));
r=show('play+food (bad)',[c('玩','活動'),c('蘋果','水果')]);assert(!r.ok&&r.fallback==='玩蘋果');
r=show('neg food',[c('不要','回應'),c('蘋果','水果')]);assert(r.ok&&r.alternatives.every(s=>/不(想|要)/.test(s)&&s.includes('蘋果')));
r=show('neg place',[c('不要','回應'),c('醫院','地點')]);assert(r.alternatives.includes('我不想去醫院。'));
r=show('neg alone',[c('不要','回應')]);assert(r.alternatives.includes('不要。'));
r=show('neg + two things',[c('不要','回應'),c('蘋果','水果'),c('公園','地點')]);assert(!r.ok);
r=show('neg+more',[c('不要','回應'),c('還要','回應'),c('蘋果','水果')]);assert(!r.ok);
r=show('more',[c('還要','回應'),c('餅乾','點心')]);assert(r.alternatives.includes('我還想吃餅乾。'));
r=show('please',[c('請','回應'),c('水','飲料')]);assert(r.alternatives.includes('請給我水。'));
r=show('not-food correction',[c('不是','回應'),c('香蕉','水果')]);assert(r.alternatives.includes('不是香蕉。'));
r=show('need',[c('上廁所','需求')]);assert(r.alternatives.includes('我想上廁所。'));
r=show('need+person',[c('媽媽','人物'),c('上廁所','需求')]);assert(r.alternatives.includes('媽媽，我想上廁所。'));
r=show('need neg',[c('不要','回應'),c('想睡覺','需求')]);assert(r.alternatives.includes('我不想睡覺。'));
r=show('state',[c('我餓了','需求')]);assert(r.alternatives.includes('我餓了。'));
r=show('mood',[c('開心','心情')]);assert(r.alternatives.includes('我覺得很開心。'));
r=show('like+food',[c('喜歡','心情'),c('草莓','水果')]);assert(r.alternatives.includes('我喜歡草莓。')&&r.alternatives.includes('我喜歡吃草莓。'));
r=show('neg like',[c('不要','回應'),c('喜歡','心情'),c('青椒','蔬菜')]);assert(r.alternatives.every(s=>s.startsWith('我不喜歡')));
r=show('color+toy',[c('紅色','顏色／形狀'),c('球','玩具')]);assert(r.alternatives.includes('我想玩紅色的球。'));
r=show('body (ambiguous)',[c('手','身體')]);assert(!r.ok);
r=show('pain',[c('肚子痛','身體')]);assert(r.alternatives.includes('我肚子痛。'));
r=show('weather',[c('下雨','天氣')]);assert(r.alternatives.includes('下雨了。'));
r=show('thanks after',[c('蘋果','水果'),c('謝謝','回應')]);assert(r.alternatives.includes('我想吃蘋果，謝謝。'));
r=show('custom card',[{label:'阿嬤家',category:'自訂'},c('去','x')]);assert(!r.ok&&r.fallback.startsWith('阿嬤家'));
r=show('clothes',[c('帽子','衣服')]);assert(r.alternatives.includes('我想戴帽子。'));
r=show('transport',[c('腳踏車','交通工具')]);assert(r.alternatives.includes('我想騎腳踏車。'));
// no eating appliances anywhere
for(const a of ['冰箱','電鍋','微波爐','手機']){const x=compose([c(a,'電器')]);assert(x.alternatives.every(s=>!s.includes('吃')))}
// 換一句 no immediate duplicates & cycles all
const k=new Composer();const cards=[c('蘋果','水果')];let seen=new Set(),prev=null;const n=compose(cards).alternatives.length;
for(let i=0;i<n;i++){const s=k.next(cards).sentence;assert(s!==prev);seen.add(s);prev=s}assert.equal(seen.size,n);
// original input unchanged
const orig=[c('蘋果','水果')];compose(orig);assert.deepEqual(orig,[c('蘋果','水果')]);
console.log('\nALL TESTS PASSED');
