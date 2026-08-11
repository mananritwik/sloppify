// Client-side rules engine — also imported by golden-eval-rules.mjs (no API key needed).

export const BANNED = [
  ["use","utilize"],["uses","utilizes"],["using","leveraging"],["used","leveraged"],
  ["help","empower"],["helps","empowers"],["helped","empowered"],
  ["make","craft"],["makes","crafts"],["made","crafted"],["making","crafting"],
  ["build","architect"],["built","architected"],["building","architecting"],
  ["good","game-changing"],["great","transformative"],["big","robust"],["small","lean"],
  ["change","transform"],["changed","transformed"],["improve","optimize"],["improved","optimized"],["better","more robust"],
  ["idea","insight"],["ideas","insights"],["think","ideate"],["thought","strategic insight"],
  ["start","spearhead"],["started","spearheaded"],["team","cross-functional stakeholders"],
  ["problem","pain point"],["problems","pain points"],["customer","end user"],["customers","end users"],
  ["plan","strategic roadmap"],["goal","north star"],["meeting","alignment sync"],["learn","upskill"],
  ["show","showcase"],["money","capital"],["fast","velocity-driven"],["work","execution"],
  ["new","next-generation"],["easy","frictionless"],["hard","non-trivial"],["talk","align"],["users","end users"],
  ["volunteer","spearhead"],["volunteered","spearheaded"],["volunteering","spearheading"],
  ["festival","large-scale cultural activation"],["booth","experiential brand touchpoint"],["event","high-impact convening"],
  ["class","immersive learning environment"],["club","member-driven ecosystem"],["studied","conducted deep research into"],
  ["internship","formative leadership crucible"],["organized","orchestrated"],["organize","orchestrate"],
  ["joined","onboarded into"],["won","secured a competitive outcome in"],["practiced","iterated on"],
  ["coffee","a hand-crafted beverage experience"],["friends","my personal board of advisors"],["party","a curated networking experience"],
  ["game","a high-stakes competitive engagement"],["cleaned","optimized the operational footprint of"],["cooked","engineered a culinary solution"],["sold","drove revenue through"],
  ["microwave","engineered a rapid-heat culinary solution for"],["microwaved","engineered a rapid-heat culinary solution for"],
  ["plant","living organism under my stewardship"],["email","high-signal stakeholder communication"],["typo","alignment discrepancy"],
  ["lunch","midday fueling ritual"],["walk","deliberate recovery protocol"],["inbox","attention operating system"]
];

const OPENERS = {1:["Let me be clear.","A quick reflection.","Worth stating plainly."],2:["Here's the thing.","Unpopular opinion:","Nobody tells you this."],3:["I wasn't going to post this, but here goes.","Grab a coffee. This one's a ride.","A mentor once told me something I'll never forget."]};
const INSIGHTS = ["Most people miss this.","Read that again.","Let that sink in.","This changed everything.","And that's the part nobody talks about."];
const STATS = ["Studies show 87% of top performers agree.","9 out of 10 leaders won't admit this.","The data doesn't lie: engagement is up 3x.","Fun fact: that's a 40% efficiency unlock."];
const KICKERS = ["Because at the end of the day, people don't buy products. They buy belief.","The future belongs to the ones who show up.","Stay hungry. Stay humble. Stay building.","Small steps. Big vision. Zero excuses.","Comfort is the enemy of the next level.","Your network is your net worth."];
const STORY = ["Three years ago I was broke, doubted, and running on instinct.","I almost quit that week.","Everyone said it couldn't be done."];
const HASHES = ["#Leadership","#Growth","#Mindset","#Innovation","#AI","#ThoughtLeadership","#GameChanger","#Hustle","#Grateful"];
const CTAS = ["Agree? ♻️ Repost to share the wisdom.","Save this post. 📌 Thank me later.","Follow for more takes like this. 🚀","Who needs to hear this today? 👇","Drop a 💯 if this resonates."];
const EMO = {1:["📈","🔑"],2:["🚀","✨","💡"],3:["🚀","🔥","📈","✨","💡","🙌","💯"]};
const ANNOUNCE = {1:["I'm pleased to share a brief reflection.","Reflecting on a recent milestone."],2:["Thrilled to share this. 🙌","Humbled and honored to announce something.","Excited to share a quick win. 🚀"],3:["Beyond thrilled to FINALLY share this. 🚀","Humbled. Honored. Grateful. And a little emotional.","I've been sitting on this one for weeks. Here goes. 🙏"]};
const OVEREXPLAIN = ["Let me break that down.","In plain English? The same thing — but with more conviction.","What does that actually mean? Everything. It means everything.","To put it simply: we did the thing, and the thing was transformative."];
const GRATITUDE = {2:["Grateful for the journey. 🙏","Onwards and upwards. 🙌"],3:["Grateful. Humbled. Still processing. 🙏","This is what the grind is all about. 🫡"]};
const NEGPARALLEL = ["This isn't just {t}. It's a movement.","This isn't just {t}. It's a mindset.","This isn't just {t}. It's a lifestyle.","This isn't just {t}. It's everything.","We didn't just do {t}. We redefined it."];
const RHETORICAL = ["Can we talk about {t} for a second?","Ever feel like {t} is criminally underrated?","What if I told you {t} could change everything?"];
const HOTTAKE = ["Unpopular opinion:","Hot take:","Controversial, but here goes:"];
const ONEWORD = ["Growth.","Relentless.","Vision.","Grit.","Momentum.","Alone.","Unstoppable."];
const LESSONS = ["Vision beats comfort.","Execution beats ideas.","Consistency is the real hack.","Your network is your net worth.","Discomfort is just growth in a trench coat."];

export const LABELS = {
  buzzword: "buzzword swap",
  "em-dash": "em-dash",
  "it's-not-X-it's-Y": "“it's not X, it's Y”",
  "throat-clearing": "throat-clearing",
  "humblebrag-announcement": "humblebrag opener",
  "rhetorical-opener": "rhetorical opener",
  "one-word-drama": "one-word drama",
  "faux-insight": "faux-insight",
  "over-explanation": "over-explaining",
  "define-own-jargon": "defines own jargon",
  "passion-cliche": "“I'm passionate about”",
  "fake-stat": "fake stat",
  "performative-gratitude": "performative gratitude",
  "profound-kicker": "profound kicker",
  "engagement-bait": "engagement bait",
  emoji: "emoji",
  "hashtag-stuffing": "hashtags",
  "fake-origin-story": "fake origin story",
  listicle: "listicle",
  "clap-emphasis": "👏 clap 👏",
  hashtags: "hashtags",
  ai: "generated by AI",
  rules: "rules engine"
};

const SLOP_WORDS = /\b(utilize|leverag\w*|empower\w*|craft\w*|architect\w*|game-changing|transformative|robust|optimize\w*|synerg\w*|spearhead\w*|frictionless|next-generation|north star|thought leadership|pain point|end users?|stakeholders|upskill|velocity|showcase|thrilled|humbled|honored|grateful|passionate|movement|milestone|journey|stewardship|culinary|high-signal)\b/gi;

function sentences(t) { return t.replace(/\s+/g, " ").trim().match(/[^.!?]+[.!?]*/g) || []; }
function cap(s) { s = s.trim(); return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }
function lower(s) { return s ? s.charAt(0).toLowerCase() + s.slice(1) : s; }
function stripEnd(s) { return s.replace(/[.!?]+$/, ""); }
function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
function chance(p) { return Math.random() < p; }
function shuffleTake(a, n) {
  var c = a.slice();
  for (var i = c.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var t = c[i]; c[i] = c[j]; c[j] = t;
  }
  return c.slice(0, n);
}
function fill(s, topic) { return s.replace(/\{t\}/g, topic).replace(/\{T\}/g, cap(topic)); }
function shout(s) {
  var m = s.match(/\b[a-z]{4,10}\b/gi);
  if (!m || !m.length) return s;
  var w = m[Math.floor(Math.random() * m.length)];
  return s.replace(new RegExp("\\b" + w + "\\b"), w.toUpperCase());
}
function matchCase(src, rep) { return /^[A-Z]/.test(src) ? cap(rep) : rep; }

export function keyword(t) {
  var stop = { the:1,a:1,an:1,we:1,to:1,and:1,of:1,in:1,on:1,at:1,for:1,is:1,it:1,our:1,your:1,just:1,so:1,my:1,this:1,that:1,with:1,you:1,today:1,are:1,was:1,were:1,about:1,really:1,still:1,alive:1,from:1,into:1,have:1,had:1,been:1 };
  var w = (t.toLowerCase().match(/[a-z][a-z\-]{3,}/g) || []).filter(function (x) { return !stop[x]; });
  var nouny = w.filter(function (x) { return !/(ed|ing|ly)$/.test(x); });
  return nouny[0] || w[0] || "this";
}

export function scoreText(t) {
  if (!t.trim()) return 0;
  var emc = (t.match(/[\u{1F300}-\u{1FAFF}\u2600-\u27BF]/gu) || []).length;
  var em = (t.match(/\u2014/g) || []).length;
  var bw = (t.match(SLOP_WORDS) || []).length;
  var tags = (t.match(/#\w+/g) || []).length;
  var lines = t.split(/\n\s*\n/).length;
  var negp = /isn't just|not just|it's a movement/i.test(t) ? 12 : 0;
  var s = Math.round(emc * 3 + em * 5 + bw * 4 + tags * 2 + Math.min(lines, 8) * 2 + negp);
  return Math.max(0, Math.min(99, s));
}

/** Heuristic tell chips from any slop text (rules or AI). */
export function detectTells(t) {
  var tells = {};
  function log(k, n) { tells[k] = (tells[k] || 0) + (n || 1); }
  if (/thrilled|humbled|honored|excited to share|pleased to share|beyond thrilled|sitting on this one/i.test(t)) log("humblebrag-announcement");
  if (/unpopular opinion|hot take|controversial,? but/i.test(t)) log("throat-clearing");
  if (/can we talk about|criminally underrated|what if i told you/i.test(t)) log("rhetorical-opener");
  if (/isn'?t just|not just|it'?s a movement|redefined it/i.test(t)) log("it's-not-X-it's-Y");
  var bw = (t.match(SLOP_WORDS) || []).length; if (bw) log("buzzword", bw);
  var dashes = (t.match(/\u2014/g) || []).length; if (dashes) log("em-dash", dashes);
  if (/let me break that down|what does that actually mean|in plain english|to put it simply/i.test(t)) log("over-explanation");
  if (/most people miss|read that again|let that sink in|changed everything|nobody talks about/i.test(t)) log("faux-insight");
  if (/and yes\s*[—\-].*just means/i.test(t)) log("define-own-jargon");
  if (/deeply passionate about/i.test(t)) log("passion-cliche");
  if (/studies show|\d+\s*out of\s*\d+|the data doesn'?t lie|fun fact:/i.test(t)) log("fake-stat");
  if (/^(Growth|Relentless|Vision|Grit|Momentum|Alone|Unstoppable)\.\s*$/m.test(t)) log("one-word-drama");
  if (/three years ago|almost quit|everyone said it couldn'?t/i.test(t)) log("fake-origin-story");
  if (/what did this teach me|^\d+\.\s/m.test(t)) log("listicle");
  if (/👏/.test(t)) log("clap-emphasis");
  if (/grateful|onwards and upwards|still processing|what the grind/i.test(t)) log("performative-gratitude");
  if (/agree\?|repost|save this|follow for more|who needs to hear|drop a/i.test(t)) log("engagement-bait");
  if (/end of the day|future belongs|stay hungry|small steps|comfort is the enemy|network is your net worth/i.test(t)) log("profound-kicker");
  var tags = (t.match(/#\w+/g) || []).length; if (tags) log("hashtag-stuffing", tags);
  var emc = (t.match(/[\u{1F300}-\u{1FAFF}\u2600-\u27BF]/gu) || []).length; if (emc) log("emoji", emc);
  return tells;
}

export function slopify(text, tone, chaos) {
  var tells = {};
  function log(k, n) { tells[k] = (tells[k] || 0) + (n || 1); }
  var sents = sentences(text);
  if (!sents.length) return { text: "", tells: tells };

  var swaps = 0, firstSwap = null;
  var body = sents.map(function (s) {
    BANNED.forEach(function (p) {
      var re = new RegExp("\\b" + p[0] + "\\b", "gi");
      s = s.replace(re, function (m) {
        swaps++;
        if (!firstSwap) firstSwap = [m, p[1]];
        return matchCase(m, p[1]);
      });
    });
    return s.trim();
  });
  if (swaps) log("buzzword", swaps);

  var dashes = 0;
  for (var i = 0; i < body.length - 1; i++) {
    if (body[i].length < 90 && (tone >= 2 || chance(0.5))) {
      body[i] = stripEnd(body[i]) + " — " + lower(stripEnd(body[i + 1])) + ".";
      body.splice(i + 1, 1);
      dashes++;
    }
  }
  if (dashes) log("em-dash", dashes);

  var topic = keyword(text), lines = [], emoPool = EMO[tone];

  if (chaos) {
    lines.push("🧵 " + pick(ANNOUNCE[3]));
    log("humblebrag-announcement", 1);
  } else {
    var r = Math.random();
    if (r < 0.45) { lines.push(pick(ANNOUNCE[tone])); log("humblebrag-announcement", 1); }
    else if (r < 0.75) { lines.push(pick(HOTTAKE)); log("throat-clearing", 1); }
    else { lines.push(fill(pick(RHETORICAL), topic)); log("rhetorical-opener", 1); }
  }
  if ((chaos || tone >= 3) && chance(0.7)) { lines.push(pick(STORY)); log("fake-origin-story", 1); }
  if (chance(0.8)) { lines.push(fill(pick(NEGPARALLEL), topic)); log("it's-not-X-it's-Y", 1); }

  body.forEach(function (s, idx) {
    var line = cap(s);
    if (tone >= 2 || idx === 0) line = pick(emoPool) + " " + line;
    if (chaos) line = shout(line);
    lines.push(line);
    if (idx === 0) {
      if (chance(0.7)) { lines.push(pick(INSIGHTS)); log("faux-insight", 1); }
      if (chance(0.7)) { lines.push(pick(OVEREXPLAIN)); log("over-explanation", 1); }
    }
  });

  if (tone >= 2 && chance(0.6)) { lines.push("I'm deeply passionate about " + topic + "."); log("passion-cliche", 1); }
  if (tone >= 2 && chance(0.5)) { lines.push(pick(ONEWORD)); log("one-word-drama", 1); }
  if (tone >= 2 && chance(0.6)) { lines.push(pick(STATS)); log("fake-stat", 1); }
  if (firstSwap && chance(0.7)) {
    lines.push('(And yes — "' + String(firstSwap[1]).toLowerCase() + '" just means "' + String(firstSwap[0]).toLowerCase() + '." But it sounds better.)');
    log("define-own-jargon", 1);
  }
  if (chaos || (tone >= 3 && chance(0.4))) {
    lines.push("What did this teach me? A few things:");
    shuffleTake(LESSONS, chaos ? 4 : 3).forEach(function (l, ix) { lines.push((ix + 1) + ". " + l); });
    if (chaos) { lines.push("This. 👏 Is. 👏 The. 👏 Way."); log("clap-emphasis", 1); }
    log("listicle", 1);
  }
  lines.push(pick(KICKERS)); log("profound-kicker", 1);
  if (tone >= 2 && chance(0.6)) { lines.push(pick(GRATITUDE[tone >= 3 ? 3 : 2])); log("performative-gratitude", 1); }
  lines.push(pick(CTAS)); log("engagement-bait", 1);
  if (chaos) { lines.push("Save this. Follow for more. Repost if it hit. 🔁"); log("engagement-bait", 1); }

  var tagCount = Math.min(HASHES.length, tone + 2 + (chaos ? 2 : 0) + (chance(0.5) ? 1 : 0));
  var tags = shuffleTake(HASHES, tagCount).join(" ");
  log("hashtag-stuffing", tagCount);

  var out = lines.join("\n\n") + "\n\n" + tags;
  var emc = (out.match(/[\u{1F300}-\u{1FAFF}\u2600-\u27BF]/gu) || []).length;
  if (emc) log("emoji", emc);
  return { text: out, tells: tells };
}
