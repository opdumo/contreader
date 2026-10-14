(() => {
  const $ = (s) => document.querySelector(s);
  const content = $("#content"), toc = $("#toc"), search = $("#search");
  let originalHTML = "", titleText = "દુકાનને સમજવાની અને આગળ વધારવાની માર્ગદર્શિકા";
  let searchTimer;
  const slugify = (s) => s.toLowerCase().trim().replace(/[^\p{L}\p{N}\s-]/gu, "").replace(/\s+/g, "-").slice(0, 80);
  async function init() {
    try {
      const response = await fetch("content/shreeramtools.md");
      if (!response.ok) throw new Error("ફાઇલ મળી નથી");
      const raw = await response.text();
      if (!window.marked || !window.DOMPurify) throw new Error("Markdown renderer લોડ થયું નથી. ઇન્ટરનેટ જોડાણ તપાસો.");
      marked.setOptions({gfm:true, breaks:false, headerIds:false, mangle:false});
      // Render Markdown, then sanitize generated HTML to prevent unsafe uploaded HTML/scripts.
      content.innerHTML = DOMPurify.sanitize(marked.parse(raw), {USE_PROFILES:{html:true}});
      originalHTML = content.innerHTML;
      const firstH1 = content.querySelector("h1");
      if (firstH1) titleText = firstH1.textContent.trim();
      $("#bookTitle").textContent = titleText;
      $("#docTitle").textContent = titleText;
      buildToc();
      updateProgress();
    } catch (e) {
      content.innerHTML = `<div class="load-error"><h3>ફાઇલ ખોલી શકાઈ નથી</h3><p>${escapeHTML(e.message)}</p><p>મૂળ Markdown ફાઇલ <a href="content/shreeramtools.md">અહીંથી ડાઉનલોડ</a> કરો.</p></div>`;
    }
  }
  function escapeHTML(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function buildToc() {
    const headings = [...content.querySelectorAll("h1,h2,h3")];
    const seen = new Map();
    headings.forEach((h,i) => {
      let id = slugify(h.textContent) || `section-${i+1}`;
      const n = seen.get(id)||0; seen.set(id,n+1); if(n) id += `-${n+1}`;
      h.id = id;
    });
    toc.innerHTML = "";
    headings.forEach(h => {
      const a = document.createElement("a");
      a.href = `#${h.id}`; a.textContent = h.textContent;
      if(h.tagName==="H3") a.classList.add("sub");
      a.addEventListener("click", () => {
        toc.querySelectorAll("a").forEach(x=>x.classList.remove("active"));
        a.classList.add("active");
      });
      toc.appendChild(a);
    });
    $("#sectionCount").textContent = headings.length ? `${headings.length}` : "";
  }
  function updateProgress() {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const pct = scrollable > 0 ? Math.min(100, Math.max(0, window.scrollY / scrollable * 100)) : 100;
    $("#progress").style.width = `${pct}%`;
  }
  function notify(message) {
    const el=$("#searchStatus"); el.textContent=message; el.classList.add("show");
    clearTimeout(searchTimer); searchTimer=setTimeout(()=>el.classList.remove("show"),2200);
  }
  search.addEventListener("input", () => {
    const q=search.value.trim();
    content.innerHTML=originalHTML;
    buildToc();
    if(!q){notify("બધો લેખ બતાવવામાં આવે છે.");return;}
    const nodes=[...content.querySelectorAll("p,li,h1,h2,h3,td,th,blockquote")];
    let count=0;
    nodes.forEach(node=>{
      // Search by text first; rebuilding only matched nodes avoids editing table/layout structure.
      const text=node.textContent||"";
      if(text.toLocaleLowerCase("gu").includes(q.toLocaleLowerCase("gu"))){
        node.id = node.id || `match-${count+1}`;
        node.style.outline="1px solid var(--accent)";
        node.style.outlineOffset="4px";
        node.style.borderRadius="3px";
        if(count===0) node.scrollIntoView({behavior:"smooth",block:"center"});
        count++;
      }
    });
    notify(count ? `${count} મેળ ખાતા ભાગ મળ્યા.` : "કોઈ મેળ ખાતો ભાગ મળ્યો નથી.");
  });
  $("#larger").addEventListener("click",()=>{
    let size=parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--font-size"))||18;
    document.documentElement.style.setProperty("--font-size",`${Math.min(25,size+1)}px`);
  });
  $("#smaller").addEventListener("click",()=>{
    let size=parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--font-size"))||18;
    document.documentElement.style.setProperty("--font-size",`${Math.max(15,size-1)}px`);
  });
  $("#themeToggle").addEventListener("click",()=>document.body.classList.toggle("dark"));
  $("#backTop").addEventListener("click",e=>{e.preventDefault();window.scrollTo({top:0,behavior:"smooth"});});
  window.addEventListener("scroll",updateProgress,{passive:true});
  init();
})();