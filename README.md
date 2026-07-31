# Krithiq AI

**Live app:** https://krithiq-ai.ai.studio

Krithiq AI is a civic platform built on top of Google Gemini that tries to fix something most civic apps never actually fix — the gap between a citizen reporting a problem and someone actually being accountable for solving it.

Most complaint apps stop at "your complaint has been submitted." That's it. No verification that the complaint is real, no priority based on how serious it actually is, no proof that it was fixed, and definitely no reason for a citizen to bother reporting the next one. Krithiq AI was built around a different question: what if the AI didn't just take the report, but actually understood it, verified it, routed it to the right people, and then checked whether it was really resolved?

That's the whole point of this project. It's not a complaint box. It's a trust system.

## Why this exists

There are two things broken in civic systems today, and they're rarely talked about together.

The first is that citizens don't trust government processes. Complaints get filed and disappear. There's no visibility into whether anything happened. People stop reporting because reporting feels pointless.

The second, less talked about problem, is that government and NGOs don't have a reliable way to trust what they're receiving either. Duplicate complaints pile up. Fake reports and misinformation spread just as easily as real ones. Counterfeit products, fraudulent scheme claims, manipulated images — there's no built-in way to separate what's real from what isn't, so everything has to be manually checked, which means almost nothing gets checked properly.

Krithiq AI treats both of these as one problem, not two. The same AI layer that helps a citizen file a report is the one that verifies it, prioritizes it, and later confirms whether it was actually fixed. Trust isn't a feature bolted on somewhere — it's the thing the entire product is built around.

## What it actually does

At its core, Krithiq AI lets a citizen report a civic issue using whatever's easiest for them — a photo, a voice note, plain text, their location. Gemini reads that input, figures out what category the issue falls under (roads, garbage, water, electricity, public safety, and so on), estimates how serious it is, checks whether it's a duplicate of something already reported, and writes up a properly formatted complaint on the citizen's behalf. No forms, no legal language the citizen has to figure out themselves.

From there it goes to a **Government Dashboard**, where officials see it already sorted by urgency instead of by whatever order it happened to arrive in. There's a live civic map showing everything happening across an area at once, so patterns are visible instead of buried in individual tickets.

Once something is marked resolved, the AI doesn't just take the government's word for it. It compares a before photo and an after photo and independently checks whether the issue actually looks fixed. That result feeds a public **Transparency Dashboard**, so resolution rates aren't self-reported numbers — they're something anyone can check.

Alongside all of this sits a **Verification Engine** for anything a citizen isn't sure about — fake news circulating on WhatsApp, a suspicious product, a document that might be forged. Same underlying AI, different use case, structured trust and confidence scores instead of a chatbot just giving an opinion.

There's also an **AI Assistant** that answers questions in ten Indian languages — Telugu, Hindi, Tamil, Kannada, Malayalam, Marathi, Gujarati, Bengali, Punjabi, and English — about government schemes, eligibility, and civic processes, with voice input and text-to-speech built in for people who aren't comfortable typing or reading long text. An **NGO Dashboard** and **Volunteers** section let NGOs pull from the same verified, categorized queue of issues that government sees, instead of running their own separate intake process. There's a **Community** feed and a short-form video layer called SYNKS for civic content, with the same AI running fact-checking and moderation underneath it so misinformation doesn't just get another platform to spread on.

And because none of this works if people stop participating, there's a **rewards system** — XP, streaks, redeemable rewards, shareable certificates — but it's tied strictly to verified, non-duplicate reports. Spamming the system doesn't earn anything. Only actual, checked-out civic contribution does.

## The strategy behind citizens, government, and NGOs

This only works if all three sides actually benefit, not just citizens.

**For citizens**, the pitch is simple: reporting stops being a dead end. You see your issue get categorized, prioritized, and — this is the part most apps never give you — proven fixed with actual before/after evidence. And you get something back for participating honestly, instead of civic duty being pure unpaid effort with no feedback loop.

**For government**, the pitch isn't "here's more work for you." It's the opposite. Right now, most municipal intake is manual — someone has to read every complaint, figure out what department it belongs to, decide how urgent it is, and check if it's a duplicate of five other tickets already sitting in the queue. Krithiq AI does all of that automatically before a human ever looks at it. What government gets is a pre-sorted, pre-verified, de-duplicated queue, plus a public transparency number that actually works in their favor when it's high, instead of a black box that only ever looks bad.

**For NGOs**, the value is access to verified need without having to build their own reporting infrastructure. NGOs are usually resource-constrained — they don't have the staff to run their own complaint intake and verification system. Here, they get the same categorized, location-tagged, verified issue queue government sees, and can direct volunteers to whatever needs the most help, based on real signal instead of guesswork or word of mouth.

The reason this is structured as a triangle instead of a straight line from citizen to government is that NGOs fill the gap government response time can't always cover, and citizens need to see that *someone* is acting even when the official process is slow. All three sides pull from the same verified data, so nobody's working off a different, incomplete picture of what's actually happening on the ground.

## The impact, honestly

If this works at any real scale, the effect isn't just "potholes get fixed faster." It's a shift in what civic participation feels like. Right now, reporting a problem in most cities is an act of faith — you do it and hope. Krithiq AI is trying to make it an act with a visible outcome, which is the only thing that actually gets people to keep doing it.

For government, a functioning verification and prioritization layer means limited staff time gets spent on what's actually urgent instead of whatever came in first or whoever complained loudest. For misinformation and fraud specifically — fake news, counterfeit medicine, fraudulent scheme documents — having an accessible verification tool means people have somewhere to check before they act on something, instead of only finding out it was fake after the damage is done.

And because the whole assistant works in ten Indian languages with voice support, it's not designed only for people who are comfortable typing formal English complaints — which is, in practice, most existing civic apps and portals.

None of this replaces government systems, and it isn't trying to. It's an intelligence layer that sits on top of the reporting, verification, and accountability parts of civic life that currently don't talk to each other.

## What's under the hood

Krithiq AI runs on Google Gemini through the `@google/genai` SDK, behind an Express backend so the API key never sits in the browser. There are eleven separate AI-backed endpoints handling everything from civic categorization and duplicate detection to fake news/deepfake verification, before-and-after resolution comparison, multilingual conversation with memory, audio transcription, and text-to-speech. Every AI response comes back as structured, schema-enforced JSON — trust scores, severity levels, SLA predictions — not loose chatbot text that has to be parsed and hoped for the best.

If there's no API key configured, the app still runs fully on realistic fallback responses, so the whole experience is demoable without setup, and switches over to live Gemini inference the moment a real key is added.

Frontend is React 19 with TypeScript, Vite, and Tailwind. Maps run on Leaflet and Google Maps. Right now the data layer is in-memory rather than a persistent database, and government/NGO role verification checks credential ID formatting rather than integrating with a real government identity system — both are the obvious next steps once this moves past prototype stage.

## Running it locally

```bash
git clone https://github.com/preetham-alr/appl3-hackathon.git
cd appl3-hackathon
npm install

cp .env.example .env.local
# add your GEMINI_API_KEY in .env.local

npm run dev
```

Don't commit a real API key to the repo. The app works fine in demo mode without one.

---

Krithiq AI exists because "we filed a complaint" shouldn't be where the story ends. It should be where someone can finally check whether anything actually happened.
