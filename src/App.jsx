import { useEffect, useState } from 'react';
import { ArrowRight, ArrowUpRight, Bot, Check, ChevronDown, Play, Sparkles, Star, Users, Zap, ShieldCheck, Search, IndianRupee, Menu, X } from 'lucide-react';
import './styles.css';

const creators = [
  { name:'Aarohi', niche:'Beauty • UGC', rate:'₹4,500', img:'/founder.jpg', color:'cyan' },
  { name:'Riya', niche:'Fashion • Reels', rate:'₹6,000', img:'/founder.jpg', color:'violet' },
  { name:'Kabir', niche:'Tech • Shorts', rate:'₹8,500', img:'/founder.jpg', color:'blue' },
];

function Logo(){ return <a className="logo" href="#top"><span className="logoMark">C</span><span>Collancer</span></a> }

function GlassButton({children, href='#join', secondary=false}){ return <a className={`btn ${secondary?'btnSecondary':''}`} href={href}>{children}<ArrowRight size={17}/></a> }

function App(){
  const [menu,setMenu]=useState(false);
  const [active,setActive]=useState('Creators');
  const [faq,setFaq]=useState(0);
  useEffect(()=>{ document.title='Collancer — Where Indian brands meet verified creators'; },[]);
  const faqs=[
    ['Do creators need a minimum following?','No. Collancer is built around creator quality, content and fit — not just follower count.'],
    ['How do collaborations work?','Creators discover relevant opportunities, review deliverables and apply. Brands can discover creators and launch campaigns from the same ecosystem.'],
    ['What makes Collancer different?','Instead of another directory, Collancer is designed as a collaboration layer: discovery, matching, campaign workflows and transparent opportunities in one place.'],
  ];
  return <div className="site" id="top">
    <div className="ambient ambientA"/><div className="ambient ambientB"/><div className="noise"/>
    <header className="navWrap"><nav className="nav container">
      <Logo/>
      <div className={`navLinks ${menu?'open':''}`}>
        <a href="#creators" onClick={()=>setMenu(false)}>For Creators</a><a href="#brands" onClick={()=>setMenu(false)}>For Brands</a><a href="#how" onClick={()=>setMenu(false)}>How it works</a><a href="#cleo" onClick={()=>setMenu(false)}>CLEO AI</a><a href="#about" onClick={()=>setMenu(false)}>About</a>
        <GlassButton href="#join">Join Collancer</GlassButton>
      </div>
      <button className="menuBtn" onClick={()=>setMenu(!menu)} aria-label="Menu">{menu?<X/>:<Menu/>}</button>
    </nav></header>

    <main>
      <section className="hero container">
        <div className="heroCopy">
          <div className="eyebrow"><span className="pulseDot"/> India's creator collaboration network</div>
          <h1>Where Indian brands meet <em>verified creators.</em></h1>
          <p className="heroLead">Discover better collaborations. Build better content. Grow with brands that actually fit.</p>
          <div className="heroActions"><GlassButton href="#creators">I'm a Creator</GlassButton><GlassButton href="#brands" secondary>I'm a Brand</GlassButton></div>
          <div className="socialProof"><div className="avatarStack"><span>AK</span><span>SR</span><span>PM</span><span>+</span></div><div><b>10K+ creators</b><small>Already building with Collancer</small></div></div>
        </div>
        <div className="heroStage">
          <div className="stageGlow"/>
          <div className="orbit orbit1"/><div className="orbit orbit2"/>
          <div className="core"><div className="coreC">C</div><div className="coreLabel">COLLANCER</div></div>
          <div className="floatCard cardTop"><span className="miniIcon">✦</span><div><small>NEW CAMPAIGN</small><b>Beauty · Reel</b><strong>₹12,000</strong></div><span className="openDot"/></div>
          <div className="floatCard cardLeft"><div className="miniAvatar">A</div><div><small>CREATOR MATCH</small><b>Aarohi • 98%</b><span>Beauty / UGC</span></div></div>
          <div className="floatCard cardRight"><div><small>CAMPAIGN FIT</small><b>Perfect Match</b><span>4 deliverables · 2 stories</span></div><span className="checkCircle"><Check size={15}/></span></div>
          <div className="floatCard cardBottom"><IndianRupee size={16}/><div><small>CREATOR EARNINGS</small><b>₹48,500</b><span>+24% this month</span></div><ArrowUpRight size={17}/></div>
        </div>
      </section>

      <section className="ticker"><div className="tickerTrack"><span>CREATORS</span><i>✦</i><span>BRANDS</span><i>✦</i><span>PAID COLLABORATIONS</span><i>✦</i><span>UGC</span><i>✦</i><span>CREATOR GROWTH</span><i>✦</i><span>CREATORS</span><i>✦</i><span>BRANDS</span></div></section>

      <section className="stats container"><div><b>10K+</b><span>Creators</span></div><div><b>500+</b><span>Brands</span></div><div><b>25K+</b><span>Campaigns</span></div><div><b>98%</b><span>Successful matches</span></div></section>

      <section className="story section container" id="about">
        <div className="sectionLabel">01 — THE PROBLEM</div><div className="storyGrid"><div><h2>Creators shouldn't have to <span>hunt for opportunities.</span></h2></div><div><p>Great creators are everywhere. Great brands are everywhere. The problem is the space between them.</p><p className="muted">Too many scattered forms. Unclear deliverables. Missed opportunities. Collancer turns that chaos into one intelligent collaboration layer.</p></div></div>
        <div className="problemCards"><article><span>01</span><h3>Scattered opportunities</h3><p>Stop searching ten places for one relevant campaign.</p></article><article><span>02</span><h3>Weak creator-brand fit</h3><p>Follower count alone doesn't tell the whole story.</p></article><article><span>03</span><h3>Opaque collaboration</h3><p>Clear deliverables, expectations and value should be standard.</p></article></div>
      </section>

      <section className="cleo section" id="cleo"><div className="container cleoGrid"><div><div className="sectionLabel">02 — MEET CLEO AI</div><h2>Your next collaboration could start with <span>one sentence.</span></h2><p>Tell CLEO what you create, what you want and what fits. It turns the noise into a shortlist worth opening.</p><GlassButton href="#join">Explore CLEO AI</GlassButton></div><div className="aiWindow"><div className="aiHead"><div className="aiOrb"><Bot size={18}/></div><div><b>CLEO AI</b><span>Collancer intelligence</span></div><span className="live">LIVE</span></div><div className="prompt"><span>Find me skincare collaborations under ₹5,000</span><ArrowRight size={16}/></div><div className="aiResult"><div className="resultTitle"><span><Sparkles size={14}/> 12 matches found</span><small>Sorted by fit</small></div>{['Minimalist','Dot & Key','Mamaearth'].map((x,i)=><div className="match" key={x}><div className={`product p${i}`}/><div><b>{x}</b><span>{['UGC Reel • 2 Stories','Product Reel • 1 Story','Review • Short'][i]}</span></div><strong>₹{[3500,4000,4500][i].toLocaleString()}</strong><Check size={15}/></div>)}</div><div className="aiFoot">Ask CLEO anything <span>⌘ K</span></div></div></div></section>

      <section className="ecosystem section container" id="creators"><div className="sectionLabel">03 — ONE ECOSYSTEM</div><div className="ecosystemHead"><h2>Built for the people <span>doing the work.</span></h2><p>One experience for creators. One intelligent layer for brands.</p></div><div className="switcher"><button className={active==='Creators'?'active':''} onClick={()=>setActive('Creators')}>For Creators</button><button className={active==='Brands'?'active':''} onClick={()=>setActive('Brands')}>For Brands</button></div>{active==='Creators'?<div className="creatorShow"><div className="creatorText"><h3>Make your content <span>work harder.</span></h3><p>Find paid and barter opportunities that match your niche, style and audience. Keep your opportunities, proof and growth in one place.</p><ul><li><Check/> No minimum followers required</li><li><Check/> Relevant collaboration discovery</li><li><Check/> Creator-first opportunity feed</li><li><Check/> Portfolio and performance story</li></ul><a className="textLink" href="#join">Explore creator experience <ArrowRight size={16}/></a></div><div className="creatorVisual"><div className="profileCard"><div className="profileTop"><div className="profilePic">A</div><div><b>Aarohi Sharma</b><span>@aarohicreates</span></div><span className="verified">✓</span></div><div className="profileStats"><span><b>84K</b> followers</span><span><b>4.9</b> rating</span><span><b>96%</b> response</span></div><div className="profileTags"><i>Beauty</i><i>UGC</i><i>Fashion</i></div><div className="profileAction"><span>Open to collaborations</span><button>View profile <ArrowUpRight size={15}/></button></div></div><div className="miniFloat">+₹24,500<div>earned this month</div></div></div></div>:<div className="brandShow" id="brands"><div className="brandConsole"><div className="consoleHead"><span>Campaign command center</span><span className="status">● LIVE</span></div><div className="campaignLine"><div className="brandLogo">M</div><div><b>Monsoon Glow — UGC</b><span>Beauty · India · 4 deliverables</span></div><strong>₹75K</strong></div><div className="campaignMetrics"><div><b>1,284</b><span>creator matches</span></div><div><b>98</b><span>shortlisted</span></div><div><b>24</b><span>confirmed</span></div></div><div className="creatorRows">{creators.map(c=><div className="creatorRow" key={c.name}><div className="rowAvatar">{c.name[0]}</div><div><b>{c.name}</b><span>{c.niche}</span></div><span className="fit">{c.name==='Aarohi'?'98%':'94%'} fit</span><button>Review</button></div>)}</div></div><div className="creatorText"><h3>From brief to <span>right creator.</span></h3><p>Give brands a faster way to discover creators who can actually deliver the idea — not just match a follower bracket.</p><ul><li><Check/> Smart creator matching</li><li><Check/> Campaign management</li><li><Check/> Clear deliverables and budget</li><li><Check/> Results you can measure</li></ul></div></div>}</section>

      <section className="how section container" id="how"><div className="sectionLabel">04 — HOW IT WORKS</div><h2>Less friction. <span>More collaboration.</span></h2><div className="steps"><div className="step"><span>01</span><Zap/><h3>Discover</h3><p>Find creators or opportunities that actually fit.</p></div><div className="step"><span>02</span><ShieldCheck/><h3>Match</h3><p>Use context, content and campaign needs — not vanity metrics alone.</p></div><div className="step"><span>03</span><Sparkles/><h3>Collaborate</h3><p>Align on deliverables, create, publish and grow.</p></div></div></section>

      <section className="quote section"><div className="container quoteInner"><Star fill="currentColor" size={22}/><blockquote>“The next generation of creator marketing won't be another marketplace. It will be an <em>intelligent network.</em>”</blockquote><span>— The Collancer vision</span></div></section>

      <section className="faq section container"><div><div className="sectionLabel">05 — QUESTIONS</div><h2>Still curious?</h2><p>Good. You should be.</p></div><div className="faqList">{faqs.map(([q,a],i)=><div className={`faqItem ${faq===i?'open':''}`} key={q}><button onClick={()=>setFaq(faq===i?-1:i)}><span>{q}</span><ChevronDown size={19}/></button>{faq===i&&<p>{a}</p>}</div>)}</div></section>

      <section className="join section container" id="join"><div className="joinGlow"/><div className="sectionLabel">06 — YOUR MOVE</div><h2>Ready to build what comes <span>next?</span></h2><p>Creators, brands and ideas — bring them into the same room.</p><div className="heroActions"><GlassButton href="#top">Join Collancer</GlassButton><a className="btn btnSecondary" href="mailto:hello@collancer.in">Talk to us <ArrowUpRight size={17}/></a></div></section>
    </main>
    <footer className="footer container"><Logo/><span>© 2026 Collancer. Built for India's creator economy.</span><div><a href="#about">About</a><a href="#how">How it works</a><a href="#join">Contact</a></div></footer>
  </div>
}
export default App;
