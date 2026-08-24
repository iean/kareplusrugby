/**
 * Candidate-facing area pages. SEO-SPEC.md Phase 3.
 *
 * WHY FOUR PAGES AND NOT TWELVE. The spec's examples suggest one page per
 * role-and-area combination, and explicitly warns: "Do not generate twelve
 * near-identical pages by swapping the town name. Doorway pages are a Google
 * violation and they will not rank." It then says to build fewer pages and
 * report which combinations were skipped.
 *
 * I can write genuinely distinct content for the four AREAS, because they
 * really do differ for a carer: where our office is, which council covers
 * safeguarding, how far apart the calls are, and whether driving matters. I
 * cannot write genuinely distinct content for "healthcare assistant in
 * Coventry" versus "care assistant in Coventry" — the roles overlap heavily
 * and the honest text would be the same page with the job title swapped, which
 * is the exact thing the spec forbids. So: four area pages, each covering the
 * roles we recruit for. Skipped combinations are listed in OVERNIGHT-NOTES.md.
 *
 * EVERY FACT BELOW IS SOURCED:
 *  - place lists and the local description come from config/site.json's
 *    verified `areas` block
 *  - the safeguarding authority for each area is from app/safeguarding, each
 *    checked against that council's own website
 *  - training, on-call, DBS and NVQ come from what Alif has confirmed
 *
 * Nothing here claims anything about the local job market, competitor pay, or
 * how many care homes we staff in a given town. None of that is known.
 */

export const AREAS = [
  {
    slug: "care-jobs-rugby",
    id: "rugby",
    name: "Rugby",
    county: "Warwickshire",
    title: "Care Jobs in Rugby",
    metaDescription:
      "Care assistant and support worker jobs in Rugby with Kare Plus Rugby. Our office is on Central Park, so shifts are close to home. No experience needed — we train you.",
    intro:
      "Rugby is our home town. Our office is at Davy Court on Central Park, which makes this the one area where you can walk in and talk to us face to face.",
    localAngle: [
      {
        heading: "The office is on your doorstep",
        body: "Everywhere else we cover, you deal with us by phone. In Rugby you can come in. If something goes wrong on a shift, or you want to talk about hours, there is a person here rather than a voice on the end of a line.",
      },
      {
        heading: "Short journeys between calls",
        body: "Rugby is compact, and the villages around it are close together. That matters more than it sounds: less of your day is spent driving between visits, and more of it is spent actually with the person you are supporting.",
      },
      {
        heading: "Where the work is",
        body: "Home visits across the town and the surrounding villages, and shifts in care homes locally.",
      },
    ],
    places: [
      "Rugby town centre",
      "Hillmorton",
      "Bilton",
      "Brownsover",
      "Newbold-on-Avon",
      "Dunchurch",
      "Long Lawford",
      "Clifton-upon-Dunsmore",
    ],
    authority: "Warwickshire County Council",
    authorityNote:
      "Safeguarding concerns in Rugby go to Warwickshire County Council. The numbers are on our safeguarding page.",
    driving:
      "Driving helps here, particularly for the villages, but the town itself is manageable without a car and we will match you to work you can actually get to.",
  },
  {
    slug: "care-jobs-coventry",
    id: "coventry",
    name: "Coventry",
    county: "West Midlands",
    title: "Care Jobs in Coventry",
    metaDescription:
      "Care assistant, support worker and agency care home shifts in Coventry with Kare Plus Rugby. Flexible hours across the city. No experience needed — we train you.",
    intro:
      "Coventry is a short drive from our Rugby office, and it is the largest urban area we recruit in. Work here ranges from home visits in the suburbs to shifts in care homes across the city.",
    localAngle: [
      {
        heading: "A city, not a patch of villages",
        body: "Coventry is dense, which changes the shape of the work. Calls are closer together, more of the housing is flats and terraces, and getting between visits on public transport is realistic in a way it is not in the rural areas we cover.",
      },
      {
        heading: "Coventry is its own council",
        body: "Coventry City Council is a separate unitary authority from Warwickshire, with its own adult social care and safeguarding team. If you have worked in Warwickshire before, the processes and the numbers you ring are different here.",
      },
      {
        heading: "Where the work is",
        body: "Home visits across the city and its suburbs, and agency shifts in care homes.",
      },
    ],
    places: [
      "Coventry city centre",
      "Earlsdon",
      "Cheylesmore",
      "Longford",
      "Binley",
      "Walsgrave",
      "Tile Hill",
      "Foleshill",
    ],
    authority: "Coventry City Council",
    authorityNote:
      "Safeguarding concerns in Coventry go to Coventry City Council, not Warwickshire. Both sets of numbers are on our safeguarding page.",
    driving:
      "A car is useful but not essential in Coventry. The city is well served by buses and a lot of the work is reachable without driving.",
  },
  {
    slug: "care-jobs-leicester",
    id: "leicester",
    name: "Leicester",
    county: "Leicestershire",
    title: "Care Jobs in Leicester and Leicestershire",
    metaDescription:
      "Care assistant and support worker jobs in Leicester and across Leicestershire with Kare Plus Rugby. City and market-town work, flexible shifts, full training.",
    intro:
      "We recruit across Leicester itself and out into the county — the market towns and villages south and west of the city.",
    localAngle: [
      {
        heading: "The city and the county are two different jobs",
        body: "Work in Leicester itself looks like Coventry: close-together calls, mostly urban housing. Out in the county it looks quite different — Lutterworth, Market Harborough and the villages around them mean longer drives and fewer, longer visits. Tell us which you would rather do; they suit different people.",
      },
      {
        heading: "Two separate councils, which catches people out",
        body: "Leicester City Council and Leicestershire County Council are separate authorities with separate adult social care teams and separate safeguarding numbers. Carers who have worked one side of the boundary often assume the other is the same. It is not, and knowing which applies to an address matters if you ever need to raise a concern.",
      },
      {
        heading: "Where the work is",
        body: "Home visits in the city and across the county, and shifts in care homes in both.",
      },
    ],
    places: [
      "Leicester city",
      "Lutterworth",
      "Hinckley",
      "Market Harborough",
      "Broughton Astley",
      "Blaby",
      "Wigston",
      "Countesthorpe",
    ],
    authority: "Leicester City Council and Leicestershire County Council",
    authorityNote:
      "Which council covers a safeguarding concern depends on the address — the city and the county are separate. Both numbers are on our safeguarding page.",
    driving:
      "For work in the city you can manage without a car. For the county — the villages and market towns — driving makes a real difference to how much work we can offer you.",
  },
  {
    slug: "care-jobs-northampton",
    id: "northampton",
    name: "Northampton",
    county: "Northamptonshire",
    title: "Care Jobs in Northampton and Northamptonshire",
    metaDescription:
      "Care assistant and support worker jobs in Northampton and across Northamptonshire with Kare Plus Rugby. Flexible shifts, full training, no experience needed.",
    intro:
      "Northamptonshire sits just over the border from Rugby. We recruit across the county, from Northampton itself out to the smaller towns and villages.",
    localAngle: [
      {
        heading: "The distances are real",
        body: "This is the most spread-out area we cover. Between Daventry, Towcester, Brackley and the villages, journeys are longer than anywhere else on our patch. We build realistic travel time into rotas rather than pretending it does not exist, and we would rather tell you honestly what we can offer near you than promise hours you would spend in the car.",
      },
      {
        heading: "Two unitary councils, not one county council",
        body: "Northamptonshire was split into West Northamptonshire and North Northamptonshire. They are separate authorities with separate adult social care teams. Which one covers an address decides who you contact about a safeguarding concern.",
      },
      {
        heading: "Where the work is",
        body: "Home visits across the county, and shifts in care homes in the towns.",
      },
    ],
    places: [
      "Northampton",
      "Daventry",
      "Towcester",
      "Brackley",
      "Long Buckby",
      "Weedon",
      "surrounding villages",
    ],
    authority: "West Northamptonshire Council and North Northamptonshire Council",
    authorityNote:
      "Northamptonshire is two unitary councils, and the safeguarding number differs between them. Both are on our safeguarding page.",
    driving:
      "Driving matters most here. Without a car we can still offer work in Northampton itself, but the county roles realistically need one.",
  },
];

export const getArea = (slug) => AREAS.find((a) => a.slug === slug) || null;
