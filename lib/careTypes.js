/**
 * Condition and service pages. Built after reviewing Home Instead, Bluebird
 * Care, Right at Home and Helping Hands, all of which have a dozen of these
 * and we had none.
 *
 * TWO RULES THESE PAGES FOLLOW, because both were easy to get wrong:
 *
 * 1. NO TRACK RECORD IS CLAIMED. Alif said on 2026-08-26 that they do provide
 *    all of these but do not have many customers yet. So nothing here says
 *    "we have supported hundreds of families", "years of experience with
 *    dementia", or anything else implying volume. The pages describe the
 *    service and how it works. That is honest and it is still useful.
 *
 * 2. EVERY PAGE SAYS WHAT WE DO NOT DO. Kare Plus Rugby is registered for
 *    personal care, not nursing. A carer does not change a syringe driver, is
 *    not a physiotherapist, and live-in care is not 24-hour waking care. Being
 *    straight about the boundary is the single most useful thing on these
 *    pages and no competitor does it. It also protects the business: a family
 *    who expected clinical care and did not get it is a complaint.
 *
 * The "who else is involved" block is the same idea - the NHS and the
 * charities do things we cannot, and a family arranging care for the first
 * time usually does not know they exist.
 *
 * None of these is a specialist learning disability or autism service, which
 * matters because the CQC registration for this location carries a condition
 * prohibiting exactly that. See OVERNIGHT-NOTES.md section 14.
 */

export const CARE_TYPES = [
  {
    slug: "dementia-care-at-home",
    name: "Dementia care",
    title: "Dementia Care at Home in Rugby and Coventry",
    metaDescription:
      "Dementia care at home from Kare Plus Rugby: the same familiar carers, a steady routine, and support for the family doing most of it. Covering Rugby, Coventry, Leicester and Northampton.",
    intro:
      "Dementia care works best when it is boring, in the good sense — the same face, at the same time, doing things the same way. That is what we try to give you.",
    dayToDay: [
      {
        heading: "The same carer, as far as we can manage it",
        body: "With most kinds of care, a different carer is an inconvenience. With dementia it can undo a fortnight of progress. Someone who knows that your mum takes her tea before her tablets, and that she gets anxious around four o'clock, is worth more than any amount of training. We build rotas around continuity, and when a regular carer is off we tell you rather than sending a stranger unannounced.",
      },
      {
        heading: "Working with the routine, not against it",
        body: "We do not correct or argue. If someone believes it is 1974 and they are waiting for their husband to come home from work, telling them otherwise causes distress and changes nothing. Carers are trained to go with it and gently move things along. It sounds small and it is the difference between a calm morning and a terrible one.",
      },
      {
        heading: "Noticing the drift",
        body: "Dementia changes slowly enough that families living with it often cannot see it. A carer coming three times a week sees the difference — eating less, sleeping in the chair, the same story twice in one visit. We tell you what we notice, because it is usually the trigger for getting the GP or memory clinic to reassess.",
      },
      {
        heading: "Giving the family carer a real break",
        body: "In most of the homes we visit, the person doing the bulk of the care is a husband, wife or daughter who has been at it for years without a proper day off. Often the most valuable thing we do is make it possible for them to leave the house without worrying.",
      },
    ],
    weDo: [
      "Personal care — washing, dressing, continence support, getting up and settling at night",
      "Prompting and supporting with medication",
      "Meals, drinks and keeping an eye on whether food is actually being eaten",
      "Company, conversation and getting out of the house",
      "Telling you honestly what we are seeing change",
    ],
    weDoNot: [
      "We are not a secure or locked setting. If someone is at serious risk of leaving the house and coming to harm, home care alone may not be enough, and we will say so.",
      "We are not dementia nurses. We cannot diagnose, prescribe or change medication.",
      "We cannot restrain anyone, or keep someone somewhere against their will.",
    ],
    whoElse: [
      { name: "Your GP and the memory clinic", what: "Diagnosis, medication reviews, and referral onwards. Start here if there is no diagnosis yet." },
      { name: "Admiral Nurses (Dementia UK)", what: "Specialist dementia nurses who support families, including a free helpline.", href: "https://www.dementiauk.org" },
      { name: "Alzheimer's Society", what: "Local support groups, practical guides and a support line.", href: "https://www.alzheimers.org.uk" },
    ],
    starting:
      "Ring us and describe an ordinary day — what time they wake, what goes well, what goes badly. That tells us more than a list of diagnoses.",
  },

  {
    slug: "palliative-care-at-home",
    name: "Palliative and end of life care",
    title: "Palliative and End of Life Care at Home",
    metaDescription:
      "Personal care and presence at home in the last months and weeks, working alongside district nurses and hospice teams. Kare Plus Rugby, covering Rugby, Coventry, Leicester and Northampton.",
    intro:
      "Most people say they would rather be at home at the end. Whether that is possible usually comes down to whether the practical care is covered — and whether the family gets to sleep.",
    dayToDay: [
      {
        heading: "We do the personal care, the nurses do the clinical care",
        body: "This is the part families most often misunderstand, so we say it plainly. District nurses and the hospice team manage symptoms, pain relief and anything involving a syringe driver. We do the washing, dressing, mouth care, changing the bed, helping someone turn comfortably. Both are needed and they are not the same job.",
      },
      {
        heading: "Nights are usually the problem",
        body: "Families can often manage the days. What breaks them is three weeks of broken sleep. A carer overnight, even a couple of nights a week, is frequently what makes staying at home possible rather than a hospital admission that nobody wanted.",
      },
      {
        heading: "Being unhurried",
        body: "Visits at this stage are not about getting through a task list. Sometimes the useful thing is sitting with someone so their wife can have a bath without listening out. We would rather book a longer visit and do it properly than send someone for twenty minutes.",
      },
      {
        heading: "Looking after the people still standing",
        body: "The person who is dying is not our only concern. A husband who has not eaten a proper meal in a fortnight is part of what we are dealing with, and often we are the only outsider in the house who notices.",
      },
    ],
    weDo: [
      "Personal care, kept gentle and unhurried",
      "Mouth care, repositioning and pressure area awareness",
      "Being present overnight so the family can sleep",
      "Practical help — laundry, bedding, a meal for whoever else is in the house",
      "Ringing the district nurse or GP when something changes",
    ],
    weDoNot: [
      "We do not manage syringe drivers, give injections or administer controlled drugs. That is the district nursing team.",
      "We are not a hospice and we do not provide clinical symptom control.",
      "We cannot verify a death. If someone dies while we are there, we follow the plan agreed with the district nurses and call them.",
    ],
    whoElse: [
      { name: "District nurses", what: "The clinical lead for end of life care at home. Arranged through the GP." },
      { name: "Hospice at home services", what: "Specialist palliative nursing and support in the home, often overnight." },
      { name: "Marie Curie", what: "Nursing care and a free support line for anyone affected by dying and bereavement.", href: "https://www.mariecurie.org.uk" },
    ],
    starting:
      "If a district nurse or hospice team is already involved, tell us who they are and we will fit around what is already in place rather than duplicating it.",
  },

  {
    slug: "stroke-care-at-home",
    name: "Stroke recovery support",
    title: "Stroke Recovery Support at Home",
    metaDescription:
      "Support at home after a stroke: helping with the exercises the physio has set, and doing things with you rather than for you. Kare Plus Rugby, covering Rugby, Coventry, Leicester and Northampton.",
    intro:
      "After a stroke, the instinct of everyone around you is to do everything for you. That is kind, and it is the fastest way to lose the ground you have gained.",
    dayToDay: [
      {
        heading: "Doing things with you, not for you",
        body: "If the occupational therapist says someone should be washing their own left arm, then that is what happens — even when it takes fifteen minutes and would take us thirty seconds. Carers are briefed on what the person is supposed to be doing themselves. It is slower, it is occasionally frustrating for everyone, and it is the entire point.",
      },
      {
        heading: "Following the plan someone else wrote",
        body: "The physiotherapist and OT set the programme. We are the people in the house often enough to make sure it actually happens between their visits, which is where most rehab quietly falls apart.",
      },
      {
        heading: "The care package should shrink",
        body: "Recovery after a stroke can move fast, especially in the first months. A package that is right in March may be too much by June. We would rather review it and reduce it than keep billing for visits that are no longer needed — say so if you think that point has come.",
      },
      {
        heading: "Communication takes patience",
        body: "If speech has been affected, the temptation is to finish people's sentences. Carers are asked not to. Where a speech therapist has left strategies — a communication book, particular prompts — we use them.",
      },
    ],
    weDo: [
      "Personal care, pitched at what the person cannot yet manage rather than everything",
      "Support with the exercises and routines the physio or OT has set",
      "Help with meals, including modified diets where a speech therapist has advised one",
      "Prompting medication",
      "Flagging when someone seems ready for less support — or suddenly needs more",
    ],
    weDoNot: [
      "We are not physiotherapists or occupational therapists. We support their programme; we do not design it.",
      "We do not carry out swallowing assessments. If someone is coughing on food or drink, we stop and report it.",
      "We cannot provide the intensive daily rehab of a stroke unit.",
    ],
    whoElse: [
      { name: "The community stroke team", what: "Physiotherapy, occupational therapy and speech and language therapy after discharge. Arranged by the hospital or GP." },
      { name: "Stroke Association", what: "A support helpline, local support groups and practical guides for life after stroke. Their Stroke Support Coordinators are worth asking about.", href: "https://www.stroke.org.uk/stroke/support/helpline" },
    ],
    starting:
      "Tell us what the physio and OT have asked for. If you have a discharge summary or a therapy plan, that is the most useful thing you can show us.",
  },

  {
    slug: "respite-care",
    name: "Respite care",
    title: "Respite Care — Cover So You Can Have a Break",
    metaDescription:
      "Respite care at home from Kare Plus Rugby: planned breaks and emergency cover so the family carer can rest. Covering Rugby, Coventry, Leicester and Northampton.",
    intro:
      "Respite is the one service on this site that is not really for the person receiving care. It is for you.",
    dayToDay: [
      {
        heading: "You do not have to justify it",
        body: "Nearly every family carer who rings us about respite explains why they need it, as though we are going to assess whether they deserve a break. You do not need a reason. Wanting a week away, or an afternoon, or a full night's sleep is reason enough. People who look after someone continuously get ill, and then there are two people needing care instead of one.",
      },
      {
        heading: "Planned breaks",
        body: "A holiday, a hospital appointment of your own, a wedding, or simply a standing Tuesday afternoon that is yours. Booked in advance, with the same carers wherever we can, so the person you look after is not being introduced to a stranger the day you leave.",
      },
      {
        heading: "Emergency cover",
        body: "Sometimes the carer is the one who ends up in hospital. We cannot promise to cover every emergency at no notice — nobody honest can — but tell us the situation and we will tell you straight away what we can and cannot do, rather than leaving you hoping.",
      },
      {
        heading: "A handover that actually works",
        body: "Before a respite block starts we want the detail that lives in your head and nowhere else: which mug, which side they like to be helped from, what the shouting at bath time actually means. Write it down badly on the back of an envelope — that is genuinely fine and more useful than a care plan.",
      },
    ],
    weDo: [
      "Regular short breaks, from an hour to a full day",
      "Overnight and multi-night cover in the person's own home",
      "Cover while you are away, keeping the normal routine going",
      "Short-notice cover where we have the staff — we will tell you honestly if we do not",
    ],
    weDoNot: [
      "We do not run a residential respite unit. Our respite happens in the person's own home. If you need them to go somewhere, the council can advise on residential respite.",
      "We cannot guarantee emergency cover at no notice. Anyone who promises that is guessing.",
    ],
    whoElse: [
      { name: "Your council's carer's assessment", what: "You have a legal right to your own assessment as a carer, separate from the person you look after. It can lead to funded respite." },
      { name: "Carers UK", what: "Advice, a helpline and support for unpaid carers.", href: "https://www.carersuk.org" },
    ],
    starting:
      "Tell us the dates, even if they are months off. Planned respite is much easier to staff well than a last-minute request.",
  },

  {
    slug: "live-in-care",
    name: "Live-in care",
    title: "Live-in Care at Home — An Alternative to a Care Home",
    metaDescription:
      "Live-in care from Kare Plus Rugby: a carer living in the home so someone can stay where they are. What it involves, honestly, including what the household needs to provide.",
    intro:
      "Live-in care lets someone stay in their own home when the alternative would be moving into a care home. It works well, and it asks more of the household than most websites admit.",
    dayToDay: [
      {
        heading: "What live-in care actually is",
        body: "A carer lives in the home and is there through the day for personal care, meals, medication, company and keeping the house running. It suits someone who needs support present most of the time but does not need clinical nursing.",
      },
      {
        heading: "What the household has to provide",
        body: "This is the part that gets glossed over. The carer needs their own bedroom — a proper room with a door, not a sofa or a shared space — and somewhere to eat and store food. They also need genuine breaks during the day, usually around two hours, which means someone else being around or the person being safe alone for that time. If those things are not possible, live-in care is not the right answer and we would rather say so before you commit to it.",
      },
      {
        heading: "It is not 24-hour waking care",
        body: "A live-in carer sleeps at night. They can get up if they are needed occasionally, but if someone needs help several times every night, that is waking night care and it needs two people, not one. Sold as live-in, it burns the carer out in weeks and the care falls apart. If that is the level of need, we will tell you and price it properly.",
      },
      {
        heading: "Continuity and changeover",
        body: "Live-in carers work in blocks and then go home. We aim to rotate the same small number of people rather than send whoever is free, so the person is not starting again every fortnight, and we plan handovers so knowledge passes between them.",
      },
    ],
    weDo: [
      "Personal care throughout the day",
      "Cooking, shopping, laundry and keeping the house going",
      "Medication prompting and support",
      "Company — often the thing that changes most",
      "Support to get out: appointments, the shops, seeing people",
    ],
    weDoNot: [
      "Live-in care is not waking night care. A carer who is up repeatedly all night cannot then work the following day.",
      "We do not provide nursing. If someone needs clinical care, that comes from the district nursing team alongside us.",
      "One carer cannot cover a household 24 hours a day, seven days a week. Breaks and changeovers are not optional extras.",
    ],
    whoElse: [
      { name: "District nurses", what: "Any clinical care at home — wounds, injections, catheters — sits with them, not with a live-in carer." },
      { name: "Your council's adult social care team", what: "Can assess needs and may contribute to the cost. A financial assessment is separate from the needs assessment." },
    ],
    starting:
      "Ring us and be honest about the nights. It is the single biggest factor in whether live-in care will work, and it is the thing people most often play down.",
  },
];

export const getCareType = (slug) => CARE_TYPES.find((c) => c.slug === slug) || null;
