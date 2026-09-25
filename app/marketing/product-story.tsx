import Image from 'next/image';
type ProductStoryProps={number:string;verb:string;title:string;copy:string;image:'home'|'experiences'|'application';alt:string;caption:string;wide?:boolean;reverse?:boolean};
const sizes={home:[1440,1060],experiences:[536,301],application:[1089,783]};
export default function ProductStory({number,verb,title,copy,image,alt,caption,wide=false,reverse=false}:ProductStoryProps){
 const [width,height]=sizes[image];
 return <section className={'editorial-section story-chapter'+(wide?' chapter-wide':'')+(reverse?' chapter-reverse':'')}>
  <div className="chapter-heading editorial-reveal"><span className="chapter-number">{number}</span><span className="eyebrow">{verb} / YOUR JOURNEY, IN VIEW</span></div>
  <div className="chapter-composition">
   <div className="chapter-copy editorial-reveal"><h2>{title}</h2><p>{copy}</p></div>
   <figure className="product-capture editorial-reveal"><div className="capture-surface"><Image unoptimized src={'/marketing/'+image+'.webp'} alt={alt} width={width} height={height} loading="lazy"/></div><figcaption><span>{caption}</span><span>Real Pathly interface · Illustrative records</span></figcaption></figure>
  </div>
 </section>
}
