/**
 * Suburb content update script
 * Adds unique intro paragraphs and Local Knowledge sections to all suburb pages.
 * Run: node suburb-content-update.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const suburbData = {
  'ashfield': {
    displayName: 'Ashfield',
    intro: `Ashfield is a well-established Inner West suburb just 3km west of Croydon Park — a mix of Victorian terraces, 1970s brick apartment blocks and Federation bungalows clustered around Ashfield Park and the town centre. Many homes here were built before Sydney's water infrastructure was fully modernised, meaning older copper pipes are common throughout the suburb. Those pipes can affect the taste and quality of drinking water over time. Jean-Paul Barbar from Filters For You serves Ashfield residents with professional, fixed-price water filter installation. Whether you live in a heritage terrace on Liverpool Road or an apartment block near the station, a quality filtration system makes a genuine difference to the water your family drinks daily.`,
    bullets: [
      `Many Ashfield homes date to the early 1900s and retain original copper pipework, which can contribute a metallic taste to tap water — an under-sink or RO filter removes this effectively at the point of use.`,
      `Ashfield has a high proportion of apartment buildings, making under-sink and reverse osmosis systems the most practical choice — they install under the kitchen sink without requiring access to shared building infrastructure or strata approval.`,
      `Jean-Paul travels 3km from Croydon Park to Ashfield — most bookings are confirmed within 3 business days.`
    ]
  },
  'annandale': {
    displayName: 'Annandale',
    intro: `Annandale is one of Sydney's most picturesque Inner West suburbs — approximately 6km north-east of Croydon Park, defined by beautiful heritage Victorian homes, wide tree-lined streets and a genuine village atmosphere around Johnston Street and the suburb's leafy pocket parks. The suburb has a strong owner-occupier community of young families and professionals who have invested significantly in renovating their Victorian terrace and Federation homes. Despite modern interior fitouts, many Annandale properties retain original pipe infrastructure, and ageing copper service lines can affect the taste and clarity of tap water. Jean-Paul Barbar from Filters For You installs water filtration systems in Annandale with care and attention to detail befitting these heritage properties.`,
    bullets: [
      `Annandale's Victorian and Federation homes — predominantly built between 1880 and 1920 — often retain original copper and in some cases lead service lines. Even in fully renovated properties, the mains service connection can be original, making under-sink filtration at the kitchen tap an important consideration.`,
      `The suburb's affluent and health-conscious owner-occupiers have strong demand for premium reverse osmosis systems, particularly those with alkaline remineralisation cartridges that improve pH and mineral balance in drinking water.`,
      `Jean-Paul is 6km away in Croydon Park and serves Annandale regularly — most bookings are confirmed within 3 to 4 business days.`
    ]
  },
  'arncliffe': {
    displayName: 'Arncliffe',
    intro: `Arncliffe is a quiet, residential suburb approximately 10km south of Croydon Park, sitting beneath the flight path of Sydney Airport's southern runway. The suburb is primarily composed of older brick homes on established residential streets — many built in the 1940s and 1950s — occupied by long-term families who value the area's relative calm and community character. Arncliffe's older housing stock means plumbing infrastructure from the same era is common throughout the suburb. Jean-Paul Barbar from Filters For You installs water filtration systems in Arncliffe with the same fixed-price, fully licensed approach that families across Sydney's south have come to trust — under-sink, reverse osmosis and whole house options available.`,
    bullets: [
      `Arncliffe's 1940s and 1950s homes commonly have original copper or galvanised steel pipes — as these age over decades, sediment and metallic taste in tap water becomes more noticeable. A whole house or under-sink filter addresses this at the source.`,
      `The suburb's proximity to Sydney Airport means some residents are conscious of air and environmental quality — this awareness extends to water quality, making filtration systems increasingly popular with Arncliffe families.`,
      `Jean-Paul is 10km from Croydon Park and schedules Arncliffe installations within 4 to 6 business days.`
    ]
  },
  'auburn': {
    displayName: 'Auburn',
    intro: `Auburn is a vibrant, densely multicultural suburb approximately 10km west of Croydon Park — a community with deep Middle Eastern, Turkish and other cultural roots, anchored by a busy commercial strip and surrounded by a mix of older residential homes and growing apartment development. Water quality and home filtration are priorities for many Auburn families, particularly those from cultural backgrounds where filtered or boiled water is the household norm. Jean-Paul Barbar from Filters For You installs water filtration systems throughout Auburn — under-sink, reverse osmosis and whole house options — with fixed pricing and a fully licensed, professional service on every job.`,
    bullets: [
      `Auburn's older homes, built predominantly from the 1930s to 1960s, retain original copper and some galvanised steel pipes — these age over time and can contribute metallic taste and sediment to tap water, making a whole house or under-sink filter a worthwhile investment.`,
      `The suburb's multicultural community — including many families from backgrounds with a strong tradition of filtered or boiled water — has driven consistent demand for reverse osmosis systems that remove fluoride, heavy metals and chloramines.`,
      `Jean-Paul is 10km from Croydon Park and schedules Auburn installations within 4 to 6 business days.`
    ]
  },
  'balmain': {
    displayName: 'Balmain',
    intro: `Balmain is one of Sydney's most characterful harbourside suburbs, sitting on a peninsula approximately 9km north-east of Croydon Park. Its tight streets are lined with Victorian terrace homes, sandstone cottages and heritage warehouses converted into residences — many well over a century old. Older properties like these often have ageing pipe infrastructure that affects water taste and clarity. Jean-Paul Barbar from Filters For You regularly installs water filtration systems in Balmain homes, offering under-sink, reverse osmosis and whole house options suited to the suburb's mix of heritage properties and recently renovated homes. Fixed price, no hidden fees, a licensed plumber on every job.`,
    bullets: [
      `Balmain's Victorian and Edwardian homes frequently retain original cast iron and copper pipework, contributing to sediment and metallic taste in tap water — a whole house or under-sink filter addresses this effectively at the point of use.`,
      `The suburb's peninsular location means homes are tightly packed with limited external space — under-sink and reverse osmosis systems are ideal as they require no outdoor installation and fit entirely beneath the kitchen sink.`,
      `Jean-Paul is based 9km away in Croydon Park and serves Balmain regularly — most installations are scheduled within 5 to 7 business days.`
    ]
  },
  'bankstown': {
    displayName: 'Bankstown',
    intro: `Bankstown is one of Western Sydney's major urban centres, approximately 13km south-west of Croydon Park — a vibrant multicultural hub with a busy commercial strip, major transport connections and a broad mix of older residential homes and apartment buildings. The suburb has a long history of residential development, with much of its housing stock dating from the 1940s to 1970s, when copper and galvanised iron piping was standard. Many Bankstown families, particularly those from cultural backgrounds where water quality is a household priority, have turned to Jean-Paul Barbar from Filters For You for professional water filter installation at a fixed, competitive price.`,
    bullets: [
      `Bankstown's older residential homes — commonly built between 1940 and 1970 — frequently have original copper or galvanised steel pipes that can contribute to sediment and metallic taste in drinking water as they age. A whole house or under-sink filter addresses this directly.`,
      `The suburb's multicultural character means strong demand for reverse osmosis systems, which remove fluoride, heavy metals and chloramines — trusted by families from backgrounds where filtered water is standard practice at home.`,
      `Jean-Paul is 13km from Croydon Park and schedules Bankstown installations within 5 to 7 business days.`
    ]
  },
  'beaconsfield': {
    displayName: 'Beaconsfield',
    intro: `Beaconsfield is a small, under-the-radar suburb approximately 7km east of Croydon Park, nestled between Surry Hills to the north and Botany to the south. It's a mixed-character suburb of older terrace homes, some newer residential developments and light commercial activity — a community that doesn't attract the same attention as its better-known neighbours but has a loyal resident population. Many of Beaconsfield's older properties have the same plumbing infrastructure challenges common to other Inner South Sydney suburbs — ageing copper and lead service lines in Victorian-era terrace homes. Jean-Paul Barbar from Filters For You serves Beaconsfield with professional water filter installation tailored to each property type.`,
    bullets: [
      `Beaconsfield's older terrace homes and Victorian workers' cottages frequently retain original copper and in some cases lead service lines — an under-sink filter at the kitchen tap provides the most practical and direct improvement to drinking water quality.`,
      `The suburb's quieter residential character and growing owner-occupier base has seen increasing demand for reverse osmosis systems — particularly from families with young children who want to remove fluoride, heavy metals and chloramines from drinking water.`,
      `Jean-Paul is 7km from Croydon Park and schedules Beaconsfield installations within 3 to 5 business days.`
    ]
  },
  'bondi': {
    displayName: 'Bondi',
    intro: `Bondi is Sydney's most iconic suburb — approximately 13km east of Croydon Park on the Eastern Beaches, where the famous beach, buzzing Campbell Parade and a cosmopolitan community of residents from around the world create one of Australia's most recognisable postcodes. The suburb is predominantly apartment-based, with high-rise and mid-rise buildings lining the beachfront and surrounding streets. Living so close to the ocean means salt air is a constant presence, which over time can affect external plumbing fittings. Jean-Paul Barbar from Filters For You installs under-sink, reverse osmosis and whole house water filtration systems throughout Bondi with fixed pricing and fully licensed expertise.`,
    bullets: [
      `Bondi's coastal environment and constant salt air can accelerate corrosion of external plumbing fittings — a quality under-sink or whole house filter ensures drinking and cooking water quality is protected regardless of what happens to external infrastructure.`,
      `The suburb's apartment-heavy character means under-sink and reverse osmosis systems are the most practical option — installed under the kitchen sink without requiring strata or building management approval in most cases.`,
      `Jean-Paul travels 13km from Croydon Park to Bondi — most bookings are confirmed within 5 to 7 business days.`
    ]
  },
  'botany': {
    displayName: 'Botany',
    intro: `Botany is a working-class suburb approximately 9km south-east of Croydon Park, situated between the industrial port precinct of Port Botany and the residential streets of older homes close to Sydney Airport. The suburb has maintained much of its original character — streets of 1940s and 1950s brick homes interspersed with industrial and commercial properties — while new residential development has been slower here than in neighbouring suburbs. Many Botany families are long-term residents who have noticed that tap water in this part of Sydney can taste heavily treated. Jean-Paul Barbar from Filters For You installs water filtration systems in Botany homes with fixed pricing and a fully licensed service.`,
    bullets: [
      `Botany's 1940s and 1950s homes have original pipe infrastructure that has often not been upgraded — galvanised and copper pipes of this age can contribute metallic taste, sediment and reduced water clarity at the tap.`,
      `The suburb's proximity to the Port Botany industrial precinct and Sydney Airport has made many residents particularly attentive to water quality — reverse osmosis systems that remove dissolved contaminants are popular here for complete peace of mind.`,
      `Jean-Paul is 9km from Croydon Park and schedules Botany installations within 3 to 5 business days.`
    ]
  },
  'brighton-le-sands': {
    displayName: 'Brighton-le-Sands',
    intro: `Brighton-le-Sands is a vibrant beachside suburb approximately 14km south of Croydon Park, stretching along the shores of Botany Bay with a distinctive Mediterranean atmosphere shaped by its large Greek and Italian community. The suburb is a mix of older homes and newer apartment buildings close to the waterfront, with a relaxed beach lifestyle that has made it increasingly popular with young families. Being a coastal suburb, homes here are exposed to salt air that can affect external plumbing over time, and many residents notice that tap water tastes better from a quality filter. Jean-Paul Barbar from Filters For You provides professional water filter installation throughout Brighton-le-Sands.`,
    bullets: [
      `Brighton-le-Sands' coastal exposure to Botany Bay means external plumbing fittings are susceptible to salt air corrosion — a quality under-sink or whole house filter ensures drinking and cooking water quality is unaffected by this.`,
      `The suburb's Mediterranean community has a strong cultural tradition of filtered and boiled water for drinking and cooking — demand for reverse osmosis and multi-stage under-sink systems is consistently high in Brighton-le-Sands households.`,
      `Jean-Paul is 14km from Croydon Park and schedules Brighton-le-Sands installations within 5 to 7 business days.`
    ]
  },
  'burwood': {
    displayName: 'Burwood',
    intro: `Burwood has transformed dramatically in recent years — from a quiet Inner West suburb to one of Sydney's fastest-growing apartment corridors, just 4km west of Croydon Park. The suburb is now a mix of older brick homes along quieter streets and new high-rise towers clustered around Burwood Station. Residents in both older properties and new apartment buildings value clean filtered water, and Jean-Paul Barbar from Filters For You installs water filtration systems across the full range of Burwood property types. Under-sink systems suit apartment dwellers; families in houses can also consider whole-of-home filtration at the mains.`,
    bullets: [
      `Burwood's newer high-rise buildings have shared water infrastructure that can affect taste and smell — under-sink and reverse osmosis systems filter at the point of use, bypassing shared pipes to deliver clean water directly at the kitchen tap.`,
      `Older Burwood homes on streets like Belmore Road often have original copper and galvanised iron pipework — a whole house HPF-3 system installed at the mains filters all incoming water before it reaches any tap or appliance in the home.`,
      `Jean-Paul is 4km from Croydon Park and can reach most Burwood addresses quickly — bookings typically land within 3 to 4 business days.`
    ]
  },
  'campsie': {
    displayName: 'Campsie',
    intro: `Campsie is a densely populated, vibrantly multicultural suburb 6km south-west of Croydon Park, built up over many decades with a mix of older brick apartment blocks, shops and residential streets. The building stock here skews older — many apartment buildings date to the 1960s and 1970s — and shared water infrastructure in these buildings can contribute to lower water quality at the tap. Jean-Paul Barbar from Filters For You provides professional water filter installation throughout Campsie, with under-sink and reverse osmosis systems being particularly popular among apartment residents looking for cleaner, better-tasting water without major building modifications.`,
    bullets: [
      `Campsie's 1960s and 1970s apartment buildings often have shared hot and cold water systems with ageing pipes — an under-sink filter installed at the kitchen tap gives residents control over their own drinking water quality, regardless of the building's infrastructure.`,
      `The suburb's high rental population means renters frequently choose under-sink systems — they can be installed without permanent modifications and moved to the next property if needed.`,
      `Jean-Paul is 6km from Croydon Park and regularly services the Campsie area — most jobs are booked within 3 to 5 business days.`
    ]
  },
  'canterbury': {
    displayName: 'Canterbury',
    intro: `Canterbury is a residential suburb roughly 7km south of Croydon Park, sitting along the Cooks River and known for its mix of older family homes, Federation cottages and mid-century apartment blocks. The suburb has a long history of residential development, meaning the pipe infrastructure across Canterbury varies considerably from street to street. Jean-Paul Barbar from Filters For You installs water filtration systems throughout Canterbury — under-sink systems for apartment dwellers and reverse osmosis or whole house options for families in freestanding homes who want filtered water at every tap and appliance throughout their property.`,
    bullets: [
      `Canterbury's older residential streets include many pre-war homes with legacy copper and iron pipework — a whole house HPF-3 system installed at the mains ensures clean water throughout the property, including to showers, baths and appliances.`,
      `The area's growing apartment stock means many residents are looking for under-sink or reverse osmosis options that do not require council or strata approval for installation.`,
      `Jean-Paul travels from Croydon Park, just 7km away, and schedules most Canterbury installations within 3 to 5 business days.`
    ]
  },
  'chatswood': {
    displayName: 'Chatswood',
    intro: `Chatswood is the major commercial hub of Sydney's Lower North Shore, located approximately 16km north of Croydon Park via the Pacific Highway. The suburb has seen significant high-rise development over the past decade, and its population is now predominantly apartment-based — a cosmopolitan community of young professionals and families drawn to its train connections and retail amenities. Many Chatswood apartment buildings rely on shared water infrastructure routed through building storage tanks and pumps, and Jean-Paul Barbar from Filters For You installs under-sink, reverse osmosis and whole house water filtration systems throughout the suburb to help residents access consistently clean, great-tasting water.`,
    bullets: [
      `Chatswood's high-rise apartment towers have shared water systems routed through building storage tanks and pump systems — an under-sink or reverse osmosis filter installed at the kitchen provides superior final-stage filtration regardless of what happens upstream in the building.`,
      `The suburb's affluent and health-conscious population has driven strong demand for premium reverse osmosis systems, particularly the smart-monitoring 7-stage options that provide live water quality tracking.`,
      `Jean-Paul is based 16km south in Croydon Park and serves Chatswood regularly — most installations are bookable within 5 to 7 business days.`
    ]
  },
  'chippendale': {
    displayName: 'Chippendale',
    intro: `Chippendale sits just 7km north-east of Croydon Park, wedged between Central Station and Broadway — a compact, creative suburb that has evolved from a working-class and light industrial area into a trendy residential precinct of heritage terrace homes, new apartment towers and commercial loft conversions. The mix of very old and very new buildings in Chippendale means water infrastructure varies significantly from one property to the next. Jean-Paul Barbar from Filters For You installs water filtration systems across Chippendale's diverse property types, from narrow terrace houses on Abercrombie Street to apartments in newer residential towers near the Broadway shopping precinct.`,
    bullets: [
      `Heritage terrace homes in Chippendale frequently retain original lead and copper pipework installed over a century ago — an under-sink system at the kitchen tap removes metals and sediment effectively at the point of use.`,
      `New apartment buildings and mixed-use developments often have centralised building water systems — a reverse osmosis system still provides superior final-stage filtration for drinking and cooking water regardless of building age.`,
      `Jean-Paul is 7km away in Croydon Park and schedules Chippendale installations efficiently — most bookings are confirmed within 3 to 5 business days.`
    ]
  },
  'concord': {
    displayName: 'Concord',
    intro: `Concord is a well-regarded family suburb in Sydney's Inner West, approximately 6km west of Croydon Park along the Parramatta River corridor. The suburb has a proud residential character with a strong mix of post-war brick homes, newer townhouses and some apartment development close to the river foreshore. Many of Concord's established homes were built in the 1950s and 1960s when copper piping was standard — and while durable, ageing copper and galvanised fittings can affect water taste over time. Jean-Paul Barbar from Filters For You provides professional water filter installation to Concord families looking for cleaner, better-tasting water at a fixed, transparent price.`,
    bullets: [
      `Concord's predominantly freestanding home stock makes whole house HPF-3 filtration a practical option — installed at the mains, it delivers clean filtered water to every tap, shower and appliance throughout the home.`,
      `Post-war brick homes in Concord often have original copper or galvanised steel pipes in the walls — an under-sink system provides an immediate improvement at the kitchen tap while a broader whole house upgrade is considered.`,
      `Jean-Paul is based 6km east in Croydon Park and serves Concord families regularly — typical booking lead time is 3 to 5 business days.`
    ]
  },
  'coogee': {
    displayName: 'Coogee',
    intro: `Coogee is a popular coastal suburb 14km south-east of Croydon Park, known for its beach, seaside cafes and relaxed lifestyle. The suburb offers a broad mix of housing — from older brick apartment buildings on the clifftops to freestanding homes on quieter streets behind the beach. Being close to the ocean, salt-laden air over time can affect outdoor plumbing fittings, and many Coogee residents notice that treated Sydney water tastes flat compared to properly filtered water. Jean-Paul Barbar from Filters For You installs water filtration systems throughout Coogee — improving water quality and taste for households and families with a fully fixed-price, licensed service.`,
    bullets: [
      `Coogee's coastal location means homes are more exposed to salt air corrosion on external fittings — under-sink systems protect the most important water point, drinking and cooking, against any taste impact from ageing external infrastructure.`,
      `The suburb's mix of apartment buildings and freestanding homes means both under-sink and RO options (for apartments) and whole house systems (for houses) are commonly installed by Jean-Paul.`,
      `Jean-Paul travels from Croydon Park, approximately 14km north-west, and schedules Coogee bookings within 5 to 7 business days.`
    ]
  },
  'croydon-park': {
    displayName: 'Croydon Park',
    intro: `Croydon Park is the home base of Filters For You — Jean-Paul Barbar's licensed plumbing and water filtration business operates directly from this quiet Inner West suburb. The suburb itself is a peaceful, predominantly residential area of Federation cottages, 1920s brick bungalows and older family homes set on generous blocks. Being such an established neighbourhood, many Croydon Park homes retain their original copper and iron pipework — which is one reason why local residents are among the first to notice the benefits of a quality water filtration system installed at the kitchen or at the mains. Jean-Paul knows Croydon Park better than any suburb he serves.`,
    bullets: [
      `Croydon Park homes were largely built between 1910 and 1940 — many still have original copper and galvanised iron pipes that can contribute metallic taste and sediment to drinking water as they age.`,
      `The suburb's predominantly freestanding home stock makes it ideal for whole house HPF-3 filtration, which treats all water at the mains before it reaches any tap, shower or appliance.`,
      `Jean-Paul lives and works in Croydon Park — local residents get same-week bookings and the fastest possible response time of any suburb Filters For You serves.`
    ]
  },
  'drummoyne': {
    displayName: 'Drummoyne',
    intro: `Drummoyne sits on a peninsula approximately 9km north of Croydon Park, overlooking the Parramatta River. It's a sought-after waterfront suburb with a mix of older brick homes, converted heritage buildings and newer apartment developments close to the water's edge. Many of Drummoyne's freestanding homes predate the 1970s, and like many established Sydney suburbs, the water infrastructure in older properties can show its age. Jean-Paul Barbar from Filters For You serves Drummoyne residents with professional water filter installation, tailoring the system choice to each property type — from waterfront apartments to renovated family homes on quieter residential streets.`,
    bullets: [
      `Drummoyne's older residential homes — many built before 1970 — frequently have copper or galvanised pipework that can contribute to sediment and metallic taste, particularly where pipes have not been updated during renovation.`,
      `The suburb's waterfront location and proximity to salt air means external fittings can corrode faster over time — investing in a quality under-sink system protects your drinking and cooking water quality.`,
      `Jean-Paul is based 9km south in Croydon Park and schedules Drummoyne installations within 5 to 7 business days.`
    ]
  },
  'eastern-suburbs-sydney': {
    displayName: "Sydney's Eastern Suburbs",
    intro: `Sydney's Eastern Suburbs stretch from Surry Hills and Paddington in the inner ring through to the beachside communities of Bondi, Coogee and Maroubra — a diverse mix of Victorian terrace homes, upscale renovated houses and high-density apartment buildings spread across one of Australia's most desirable coastal strips. Water quality and filtration needs vary across the Eastern Suburbs: older heritage properties often have ageing pipe infrastructure, while modern apartment towers have shared building water systems. Jean-Paul Barbar from Filters For You covers the full Eastern Suburbs area from his Croydon Park base, installing under-sink, reverse osmosis and whole house water filtration systems with fixed pricing and no surprises on the day.`,
    bullets: [
      `Properties across the Eastern Suburbs range from Victorian terraces built in the 1880s to new-build apartments completed in the last few years — filtration needs differ significantly, and Jean-Paul recommends the right system for each property type after a quick consultation.`,
      `Beachside suburbs in the Eastern Suburbs (Bondi, Coogee, Maroubra) have elevated salt air exposure, which can affect external plumbing fixtures — a quality under-sink or whole house filter protects the water you drink and cook with regardless of external conditions.`,
      `Jean-Paul travels from Croydon Park and covers all Eastern Suburbs postcodes — travel times range from 7km (Surry Hills) to 16km (Maroubra and Coogee), with most bookings scheduled within 5 business days.`
    ]
  },
  'enmore': {
    displayName: 'Enmore',
    intro: `Enmore is a lively, creative suburb 5km east of Croydon Park, best known for its music scene, the Enmore Theatre and an eclectic mix of cafes and independent shops along Enmore Road. The housing stock is almost exclusively Victorian and Edwardian terrace homes — many of which are rentals shared between young professionals, students and creatives. Water filtration is particularly relevant here because older terrace homes can have ageing pipes, and renters often want to improve their water quality without making permanent property modifications. Jean-Paul Barbar from Filters For You installs under-sink systems in Enmore that are fully reversible — ideal for renters who want clean water wherever they live.`,
    bullets: [
      `Enmore's Victorian terrace homes — predominantly built between the 1880s and 1910s — often retain original lead and copper service pipes, which can leach trace metals into tap water over time, particularly in properties that have not been fully re-piped.`,
      `The suburb has one of Sydney's highest rental densities — under-sink and RO systems are the best fit because they can be installed under the sink and removed when moving, then reinstalled in the next property.`,
      `Jean-Paul is 5km from Croydon Park and services Enmore regularly — most jobs are booked within 3 to 5 business days.`
    ]
  },
  'erskineville': {
    displayName: 'Erskineville',
    intro: `Erskineville is a small but highly sought-after suburb 6km east of Croydon Park — a tight-knit community of young families and professionals drawn to its beautifully renovated Victorian terrace homes and village-like atmosphere around Erskineville Oval and St Peters station. While the suburb has been substantially gentrified, its housing stock remains predominantly Victorian-era terrace homes, many of which have updated interiors but retain original external pipework. Jean-Paul Barbar from Filters For You installs water filtration systems in Erskineville homes, ensuring residents enjoy clean, great-tasting water regardless of the age of the pipes running behind the walls.`,
    bullets: [
      `Erskineville's Victorian terrace homes frequently have updated kitchens and bathrooms but retain original copper or lead main service lines — an under-sink system at the kitchen tap provides immediate improvement in water taste and quality without requiring a full re-pipe.`,
      `The suburb's strong owner-occupier and young family profile makes reverse osmosis popular — families with young children particularly value the removal of fluoride, chloramines and heavy metals from drinking water.`,
      `Jean-Paul is based 6km west in Croydon Park and serves Erskineville regularly — bookings typically confirmed within 3 to 4 business days.`
    ]
  },
  'fairfield': {
    displayName: 'Fairfield',
    intro: `Fairfield is a large, culturally diverse suburb approximately 22km west of Croydon Park — a major hub for Western Sydney's multicultural communities with a busy commercial centre and wide residential streets. The suburb's housing stock is predominantly post-war and 1960s-era homes, with many properties on large blocks that have not had significant plumbing upgrades since they were built. Residents here often notice that tap water tastes heavily treated — Sydney's chlorination can be more noticeable in some Western Sydney areas. Jean-Paul Barbar from Filters For You installs water filtration systems in Fairfield, providing families with filtered water that is genuinely cleaner and better tasting from the kitchen tap.`,
    bullets: [
      `Many Fairfield homes were built in the 1950s to 1970s and have original copper or galvanised steel pipes — older pipework can contribute to sediment, metallic taste and reduced water clarity at the tap, which a whole house or under-sink filter addresses directly.`,
      `Fairfield's predominantly freestanding home stock on large blocks makes it well suited to whole house HPF-3 filtration, treating all incoming water at the mains before it enters any tap or appliance in the home.`,
      `Jean-Paul travels approximately 22km from Croydon Park to Fairfield — bookings are typically scheduled within 5 to 7 business days.`
    ]
  },
  'five-dock': {
    displayName: 'Five Dock',
    intro: `Five Dock is a quiet, family-oriented suburb 7km north-west of Croydon Park, with a proud Italian heritage and a strong sense of community along its main shopping strip and surrounding parklands. The suburb is characterised by generous 1950s and 1960s brick homes on large blocks — many owned by the same families for generations. Like most established Inner West suburbs, Five Dock homes were built when copper piping was standard, and while these homes are well-maintained, older plumbing infrastructure can still affect the taste and quality of tap water over time. Jean-Paul Barbar from Filters For You provides water filter installation services to Five Dock families with fixed pricing and a personal, trusted service.`,
    bullets: [
      `Five Dock's predominantly 1950s to 1960s brick homes retain copper and some galvanised steel pipework — as these age, trace metals and sediment can affect drinking water taste, which a whole house filter or under-sink system addresses directly.`,
      `The suburb's large block sizes and detached homes make whole house HPF-3 filtration highly practical — systems are installed at the mains in the front garden or meter box area, treating all incoming water for the entire household.`,
      `Jean-Paul is 7km away in Croydon Park and serves Five Dock regularly — most bookings are confirmed within 3 to 5 business days.`
    ]
  },
  'glebe': {
    displayName: 'Glebe',
    intro: `Glebe is a beautiful and historic suburb 7km north-east of Croydon Park, nestled between the Sydney CBD and Rozelle along the foreshore of Blackwattle Bay. It's one of Sydney's oldest residential areas — a heritage conservation precinct of Victorian terrace homes, sandstone churches and tree-lined streets that have changed little in form despite dramatic changes in population. With high rental density and many share houses among students and young professionals from nearby universities, water filtration is especially valued here. Jean-Paul Barbar from Filters For You installs water filtration systems throughout Glebe, tailored to the suburb's predominantly terrace and heritage property profile.`,
    bullets: [
      `Glebe is one of Sydney's oldest residential suburbs — many homes were built in the 1870s to 1890s and retain original lead or copper service pipes, making point-of-use filtration at the kitchen tap important for drinking water safety.`,
      `The suburb's high proportion of rental properties and share houses makes under-sink systems popular — they are installed under the kitchen tap without modifying the property's main plumbing and can be removed when moving.`,
      `Jean-Paul is 7km south-west of Glebe in Croydon Park and schedules most Glebe installations within 3 to 5 business days.`
    ]
  },
  'granville': {
    displayName: 'Granville',
    intro: `Granville is an established residential suburb approximately 13km west of Croydon Park, known for its post-war brick homes and proximity to the Granville and South Granville train stations. The suburb developed rapidly in the 1940s and 1950s to house Sydney's growing working population, and while many homes have been maintained and updated externally, original pipe infrastructure is common in properties that have not undergone full renovation. Residents in Granville frequently notice that Sydney tap water tastes heavily chlorinated, and a quality under-sink or whole house filter is an effective solution. Jean-Paul Barbar from Filters For You serves Granville with fixed-price water filter installation.`,
    bullets: [
      `Granville's post-war homes — built predominantly between 1940 and 1960 — commonly have galvanised or copper pipework that may not have been replaced since construction, which can contribute to sediment and metallic notes in drinking water over time.`,
      `The suburb's predominantly freestanding home stock means whole house HPF-3 filtration is a practical upgrade — treating all incoming water at the mains, so every tap and appliance receives clean filtered water.`,
      `Jean-Paul travels 13km from Croydon Park to Granville — most installations are booked within 5 to 7 business days.`
    ]
  },
  'homebush': {
    displayName: 'Homebush',
    intro: `Homebush has grown into one of Sydney's most dynamic Inner West suburbs — a compelling mix of post-war brick homes on established residential streets and modern high-rise apartments clustered near Sydney Olympic Park. The area is approximately 5km north-west of Croydon Park, and its dual character means water filtration needs vary widely: apartment residents deal with shared building water systems, while owners of older homes may find their copper and galvanised pipes are starting to show their age. Jean-Paul Barbar from Filters For You installs water filtration systems across all Homebush property types, recommending the right system for each based on property age and layout.`,
    bullets: [
      `Homebush's post-war homes built in the 1950s and 1960s commonly retain original copper pipework — an under-sink or whole house filter addresses metallic taste and sediment that can develop as pipes age over decades.`,
      `The suburb's growing apartment towers near Olympic Park use shared building water infrastructure that passes through storage tanks and pump systems — an under-sink or RO filter provides final-stage filtration at the kitchen tap, removing any residual taste or contamination.`,
      `Jean-Paul is based 5km south-east in Croydon Park and serves Homebush regularly — most bookings are confirmed within 3 to 4 business days.`
    ]
  },
  'homebush-west': {
    displayName: 'Homebush West',
    intro: `Homebush West sits approximately 6km north-west of Croydon Park — a quieter, more residential suburb than its eastern neighbour, with a predominantly freestanding home character that retains much of Sydney's post-war suburban feel. The suburb is defined by 1950s and 1960s brick homes on tree-lined streets, many still occupied by long-term residents or families who have lived here for generations. Like many of Sydney's established western suburbs, older plumbing infrastructure is common in Homebush West properties, and residents regularly notice that Sydney's chlorinated tap water can taste and smell heavily treated. Jean-Paul Barbar from Filters For You installs water filtration systems for Homebush West households with his signature fixed-price approach.`,
    bullets: [
      `Homebush West's 1950s to 1960s brick homes commonly have original copper or galvanised steel pipes — as these age, sediment and metallic taste become more noticeable, and a whole house or under-sink filter resolves this effectively.`,
      `The suburb's predominantly detached home character makes it well suited to whole house HPF-3 filtration at the mains — a popular choice for families with young children wanting clean water from every tap, shower and appliance.`,
      `Jean-Paul is 6km from Croydon Park and can typically schedule Homebush West installations within 3 to 5 business days.`
    ]
  },
  'hurstville': {
    displayName: 'Hurstville',
    intro: `Hurstville is the major commercial and residential hub of Sydney's South, approximately 13km south of Croydon Park. It's a vibrant and densely populated suburb anchored by a busy retail precinct and surrounded by a rapidly growing cluster of high-rise apartment buildings. Hurstville's population is highly multicultural, with a strong East and South-East Asian community, and many residents here place great importance on water quality for drinking, cooking and overall health. Jean-Paul Barbar from Filters For You installs under-sink, reverse osmosis and whole house water filtration systems throughout Hurstville and the surrounding St George area at fixed, competitive pricing.`,
    bullets: [
      `Hurstville's newer high-rise apartment towers have modern shared water infrastructure, but water quality at the tap can still be affected by building storage tanks and distribution pipes — an under-sink or RO filter gives residents full control at the point of use.`,
      `Many older Hurstville homes along the quieter streets away from the commercial centre have original post-war pipework that benefits from whole house filtration at the mains, treating all incoming water before it reaches any tap or appliance.`,
      `Jean-Paul travels 13km from Croydon Park to Hurstville — bookings are typically scheduled within 5 to 7 business days.`
    ]
  },
  'kensington': {
    displayName: 'Kensington',
    intro: `Kensington is a medium-density suburb approximately 11km south-east of Croydon Park, anchored by the University of New South Wales (UNSW) campus and surrounded by residential streets of older brick apartment buildings and some freestanding homes. The suburb has a predominantly rental population — students, young professionals and families who value convenience over ownership — and renters here are often pleasantly surprised by how much a quality under-sink filter improves their daily water experience. Jean-Paul Barbar from Filters For You provides water filter installation throughout Kensington, with a focus on systems that suit rental properties and do not require permanent modifications.`,
    bullets: [
      `Kensington's older brick apartment buildings — many built in the 1960s and 1970s — have shared water distribution systems with ageing pipes, meaning tap water quality can vary noticeably between different properties and floors.`,
      `Renters in Kensington apartments can install under-sink or reverse osmosis systems without strata approval in most cases — these systems install under the kitchen sink and do not modify the building's main plumbing.`,
      `Jean-Paul is 11km from Croydon Park and schedules Kensington installations within 4 to 6 business days.`
    ]
  },
  'kogarah': {
    displayName: 'Kogarah',
    intro: `Kogarah is a well-connected residential suburb approximately 12km south of Croydon Park, best known as the location of St George Hospital and a hub for the broader St George area. The suburb has a blend of older residential homes on established streets and newer apartment buildings clustered around the town centre and train station. Many Kogarah households — particularly those near the hospital precinct — have a heightened awareness of water quality and health, and Jean-Paul Barbar from Filters For You installs water filtration systems throughout Kogarah to help families access consistently clean, great-tasting water from their kitchen tap.`,
    bullets: [
      `Kogarah's mix of older homes and 1970s-era apartment buildings means water infrastructure varies significantly across the suburb — under-sink and RO systems are popular for apartment residents, while freestanding home owners often opt for whole house filtration at the mains.`,
      `The suburb's proximity to St George Hospital means many residents, including healthcare workers, are particularly motivated to reduce chloramines, heavy metals and contaminants in their home drinking water.`,
      `Jean-Paul travels 12km from Croydon Park to Kogarah — most bookings are confirmed within 5 to 7 business days.`
    ]
  },
  'leichhardt': {
    displayName: 'Leichhardt',
    intro: `Leichhardt is a lively and characterful Inner West suburb 5km north-east of Croydon Park, long celebrated as Sydney's "Little Italy" and home to a thriving cafe culture along Norton Street. The suburb is predominantly composed of Victorian and Federation terrace homes — many beautifully renovated by the young families and professionals who have made Leichhardt their long-term home. As attractive as these properties are, their age means ageing copper pipes are common, and many residents notice that Sydney tap water can taste flat or treated. Jean-Paul Barbar from Filters For You provides professional water filter installation in Leichhardt, serving terrace owners and apartment residents alike with fixed-price, expert installation.`,
    bullets: [
      `Leichhardt's Victorian and Federation terrace homes — most built between 1880 and 1920 — often retain original copper or lead service lines even after interior renovation. Point-of-use filtration at the kitchen tap is the most direct improvement for drinking water quality.`,
      `The suburb's strong community of young families with children has driven demand for reverse osmosis systems, which remove fluoride, chloramines and heavy metals to provide the purest possible drinking water for the household.`,
      `Jean-Paul is 5km away in Croydon Park and serves Leichhardt regularly — most bookings are confirmed within 3 to 4 business days.`
    ]
  },
  'lidcombe': {
    displayName: 'Lidcombe',
    intro: `Lidcombe is a suburb in transition approximately 8km west of Croydon Park, where a mix of post-war brick homes and a growing number of new apartment buildings reflect the broader development pressure spreading west from Homebush and Olympic Park. The suburb is conveniently positioned near major transport links, and its population is becoming increasingly diverse. Older homes in Lidcombe often have original plumbing infrastructure, while new apartment towers deal with shared building water systems. Jean-Paul Barbar from Filters For You installs water filtration systems for both property types, ensuring Lidcombe residents get clean, great-tasting water from their kitchen tap.`,
    bullets: [
      `Lidcombe's older residential homes, many built in the 1940s and 1950s, still have original copper or galvanised steel pipes in many cases — a whole house HPF-3 system at the mains treats all incoming water effectively.`,
      `Newer apartment buildings in the area around Lidcombe station use shared building water infrastructure — an under-sink or reverse osmosis system provides clean, filtered water at the kitchen tap independently of the building's pipes.`,
      `Jean-Paul is 8km from Croydon Park and typically schedules Lidcombe installations within 3 to 5 business days.`
    ]
  },
  'liverpool': {
    displayName: 'Liverpool',
    intro: `Liverpool is the major commercial and residential centre of South-Western Sydney, approximately 30km south-west of Croydon Park. It's a high-growth area with a large and diverse population, extensive retail and commercial infrastructure, and a broad mix of housing from older established homes to newer developments on the fringe. Many families in Liverpool have noticed that tap water quality and taste can be inconsistent — chlorination levels in Western Sydney water can be more pronounced in some areas, and older pipes contribute to sediment and metallic notes. Jean-Paul Barbar from Filters For You provides professional water filter installation throughout Liverpool and the surrounding area.`,
    bullets: [
      `Liverpool has a significant proportion of older residential homes built in the 1960s through 1980s with original pipe infrastructure — under-sink and whole house filters are both popular and effective for different property types across the suburb.`,
      `The area's large families and community focus on health mean reverse osmosis systems — which remove fluoride, heavy metals and chloramines — are frequently requested by Liverpool residents who want the purest possible drinking water.`,
      `Jean-Paul travels approximately 30km from Croydon Park to Liverpool — bookings are scheduled within 5 to 7 business days, with priority given to jobs in concentrated booking areas.`
    ]
  },
  'manly': {
    displayName: 'Manly',
    intro: `Manly is one of Sydney's most iconic suburbs, approximately 25km north-east of Croydon Park on the Northern Beaches peninsula. Known worldwide for its beach, the Corso and the Manly Ferry, it's a sought-after place to live with a strong community of permanent residents behind the tourist precinct. Manly's proximity to the ocean means homes are exposed to salt air, which over time affects external plumbing fittings. The suburb also has a mix of older homes, heritage buildings and apartment towers, each with different water infrastructure considerations. Jean-Paul Barbar from Filters For You serves Manly and the Northern Beaches with professional, fixed-price water filter installation.`,
    bullets: [
      `Manly's coastal environment accelerates corrosion of external plumbing fittings — an under-sink or whole house filter ensures that any taste impact from corroded fittings or older pipes is removed before the water reaches your glass or cooking pot.`,
      `Apartment buildings along the Manly beachfront and town centre have shared building water systems — under-sink or RO systems installed at the kitchen tap give residents complete control over their drinking water quality.`,
      `Jean-Paul travels approximately 25km from Croydon Park to Manly — bookings are typically scheduled within 5 to 7 business days and planned to coincide with other Northern Beaches jobs when possible.`
    ]
  },
  'maroubra': {
    displayName: 'Maroubra',
    intro: `Maroubra is a well-established coastal suburb 14km south-east of Croydon Park, built around one of Sydney's best surf beaches and known for its strong, close-knit local community. The suburb offers a genuine mix of housing — older brick homes on generous blocks, mid-century apartment buildings on the clifftops and newer residential developments further inland. Maroubra's beach-going culture and health-conscious residents mean demand for quality home filtration is strong. Jean-Paul Barbar from Filters For You installs water filtration systems throughout Maroubra — under-sink, reverse osmosis and whole house — with fixed pricing and a licensed plumber attending every job.`,
    bullets: [
      `Maroubra's coastal exposure means external plumbing fittings are more susceptible to salt air corrosion — a quality under-sink or whole house filter ensures drinking water quality is not affected by what happens to ageing external infrastructure.`,
      `The suburb's older brick homes, many dating from the 1950s and 1960s, retain original copper pipework that can affect water taste as it ages — particularly relevant in homes that have not been fully re-piped during renovation.`,
      `Jean-Paul is based 14km north-west in Croydon Park and schedules Maroubra installations within 5 to 7 business days.`
    ]
  },
  'marrickville': {
    displayName: 'Marrickville',
    intro: `Marrickville is a fast-changing Inner West suburb just 4km east of Croydon Park — a former industrial and working-class hub that has transformed into one of Sydney's most creatively vibrant communities. Terrace homes on tree-lined streets, warehouse conversions and growing cafe culture coexist with remnants of the suburb's manufacturing past. The diversity of property types here — from 1890s terrace rows to repurposed industrial buildings — means water infrastructure varies considerably. Jean-Paul Barbar from Filters For You installs water filtration systems across Marrickville's full mix of property types, with under-sink, reverse osmosis and whole house options available at fixed pricing.`,
    bullets: [
      `Marrickville's older terrace homes and Victorian workers' cottages frequently have original copper and sometimes lead pipework — an under-sink or point-of-use filter is the most direct way to improve drinking water quality in these properties.`,
      `The suburb's high proportion of renters and share houses means portable, reversible under-sink systems are popular — installed under the kitchen sink without modifying the property's main plumbing, and removable when the lease ends.`,
      `Jean-Paul is just 4km from Croydon Park and serves Marrickville regularly — most bookings land within 2 to 4 business days.`
    ]
  },
  'mascot': {
    displayName: 'Mascot',
    intro: `Mascot is a densely developed suburb approximately 8km south-east of Croydon Park, immediately adjacent to Sydney Airport. The suburb has undergone dramatic residential transformation in recent years, with numerous high-rise apartment towers replacing older industrial and commercial sites. Mascot's apartment residents benefit from the suburb's walkability and train connections, but living so close to a major airport has made many residents increasingly conscious of environmental factors — including what goes into their water. Jean-Paul Barbar from Filters For You installs water filtration systems in Mascot apartments with fixed pricing, a licensed service and a thorough walkthrough after every installation.`,
    bullets: [
      `Mascot's apartment buildings use shared water storage and distribution systems — an under-sink or reverse osmosis filter installed at the kitchen tap provides clean, filtered drinking water regardless of what passes through the building's shared infrastructure.`,
      `The suburb's proximity to Sydney Airport and its associated industrial activity has made many Mascot residents particularly focused on removing contaminants from drinking water — reverse osmosis systems are popular for complete peace of mind.`,
      `Jean-Paul is 8km away in Croydon Park and typically schedules Mascot installations within 3 to 5 business days.`
    ]
  },
  'miranda': {
    displayName: 'Miranda',
    intro: `Miranda is a large, family-focused suburb approximately 22km south of Croydon Park in Sydney's Sutherland Shire — a community built around the iconic Westfield Miranda and extensive residential streets. The suburb has a predominantly freestanding home character, with generous block sizes and a strong tradition of family ownership. Many Miranda homes were built in the 1960s and 1970s, and while well-maintained, original plumbing infrastructure is common throughout the suburb. Families here value clean water for drinking, cooking and children's health, and Jean-Paul Barbar from Filters For You provides professional water filter installation throughout Miranda with his signature fixed-price approach.`,
    bullets: [
      `Miranda's 1960s and 1970s freestanding homes often have original copper or galvanised steel pipes — whole house HPF-3 filtration at the mains is a popular upgrade for families wanting clean water at every tap, shower and appliance throughout the home.`,
      `The suburb's strong family demographic drives demand for reverse osmosis systems, which provide the purest drinking water and are particularly valued by households with young children and babies.`,
      `Jean-Paul travels approximately 22km from Croydon Park to Miranda — bookings are typically scheduled within 5 to 7 business days.`
    ]
  },
  'newtown': {
    displayName: 'Newtown',
    intro: `Newtown is one of Sydney's most distinctive suburbs — a creative, bohemian community 5km east of Croydon Park, anchored by King Street and a dense, walkable character that sets it apart from surrounding areas. The suburb is almost entirely composed of Victorian terrace homes, most over 100 years old, and has one of the highest rental densities in Sydney. For renters in Newtown who may not be able to modify their property, under-sink and reverse osmosis water filtration systems are ideal — they install completely under the kitchen sink and can be moved when you leave. Jean-Paul Barbar from Filters For You installs these systems throughout Newtown with expertise and care.`,
    bullets: [
      `Newtown's Victorian terrace homes, built predominantly between the 1870s and 1910s, commonly have original lead and copper service lines that were installed over a century ago — these can leach trace metals into drinking water, making point-of-use filtration important.`,
      `With one of Sydney's highest rental densities, renters make up a large share of Newtown's population — under-sink systems are particularly popular because they are reversible and can be removed and reinstalled in a new property when leases end.`,
      `Jean-Paul is 5km away in Croydon Park and serves Newtown very regularly — typical booking lead time is 2 to 4 business days.`
    ]
  },
  'north-richmond': {
    displayName: 'North Richmond',
    intro: `North Richmond is a semi-rural community approximately 55km north-west of Croydon Park in the Hawkesbury district, beyond the fringes of metropolitan Sydney. Unlike urban suburbs, many North Richmond homes rely on tank water collected from roofs — a water source that can carry sediment, bird contamination and organic matter if not properly filtered. Properties here also include rural lots where bore water or shared service mains may not have the same treatment standards as metropolitan Sydney's water supply. Jean-Paul Barbar from Filters For You travels to North Richmond to install water filtration systems suited to the water challenges of rural properties.`,
    bullets: [
      `North Richmond properties frequently rely on rainwater tanks — unfiltered tank water can carry sediment, bacteria, bird and animal waste, and organic material from rooftop collection. A whole house or under-sink filter with appropriate pre-filtration is essential for safe drinking and cooking water.`,
      `Rural homes in North Richmond are beyond Sydney Water's standard metropolitan treatment network — bore water and tank water both benefit significantly from a multi-stage filtration system that removes biological and chemical contaminants.`,
      `Jean-Paul travels approximately 55km from Croydon Park to North Richmond — bookings are planned in advance and often combined with nearby Hawkesbury area installations for efficiency.`
    ]
  },
  'paddington': {
    displayName: 'Paddington',
    intro: `Paddington is one of Sydney's most prestigious inner-city suburbs, 9km east of Croydon Park — a heritage conservation precinct of beautifully maintained Victorian terrace homes set on the gentle hills between Oxford Street and Centennial Park. The suburb's heritage character means most homes are over 100 years old, with carefully preserved facades but interiors that range from fully renovated to largely original. Many Paddington terrace homes retain copper or lead service lines that predate modern plumbing standards. Jean-Paul Barbar from Filters For You installs water filtration systems in Paddington with minimal disruption and the care these heritage properties deserve.`,
    bullets: [
      `Paddington is a heritage conservation area — many homes have original 1880s and 1890s copper or lead service pipes, and while surface renovation is common, the main water service lines are frequently original. An under-sink filter at the kitchen tap addresses drinking water quality directly.`,
      `The suburb's affluent and health-conscious owner-occupiers have strong demand for premium reverse osmosis systems, particularly 7-stage and smart-monitoring options that provide real-time water quality tracking.`,
      `Jean-Paul is 9km away in Croydon Park and schedules Paddington installations within 4 to 6 business days.`
    ]
  },
  'parramatta': {
    displayName: 'Parramatta',
    intro: `Parramatta is the CBD of Western Sydney — a rapidly growing commercial and residential hub approximately 18km west of Croydon Park with some of the most significant urban development in the Greater Sydney region. Dozens of new residential towers have been completed in Parramatta in recent years, joining the suburb's older commercial buildings and established residential streets. Whether you're in a brand-new apartment off Church Street or an older terrace home near Parramatta Park, Jean-Paul Barbar from Filters For You installs water filtration systems throughout Parramatta with fixed pricing and no day-of surprises.`,
    bullets: [
      `Parramatta's high-rise residential towers use shared building water infrastructure — under-sink and reverse osmosis systems installed at the kitchen tap provide final-stage filtration, independent of what happens in the building's shared pipes and storage tanks.`,
      `Older residential streets in Parramatta, particularly near Parramatta Park and the river, have homes built in the 1940s to 1960s with original copper and galvanised pipework that benefits from filtration at the kitchen tap.`,
      `Jean-Paul travels approximately 18km from Croydon Park to Parramatta — most bookings are scheduled within 5 to 7 business days.`
    ]
  },
  'petersham': {
    displayName: 'Petersham',
    intro: `Petersham is a compact, family-oriented suburb 4km east of Croydon Park, well known for its distinctive Portuguese community and the cluster of Portuguese bakeries and restaurants along New Canterbury Road. The suburb is residential in character — predominantly Victorian and Edwardian terrace homes on narrow streets, with some apartment buildings closer to Petersham Station. Like many of Sydney's older Inner West suburbs, Petersham's terrace homes often have ageing copper service lines that affect water taste over time. Jean-Paul Barbar from Filters For You serves Petersham residents with professional water filter installation, matching the right system to each property type.`,
    bullets: [
      `Petersham's Victorian and Edwardian terrace homes — most built between 1890 and 1920 — frequently have original copper service lines that have not been replaced during interior renovations. An under-sink filter provides an immediate, practical improvement in drinking water quality.`,
      `The suburb's strong family and community character means whole house filtration is popular among home owners — the HPF-3 system installs at the mains and delivers clean water to every tap, shower and appliance throughout the home.`,
      `Jean-Paul is just 4km away in Croydon Park and serves Petersham regularly — most bookings are confirmed within 2 to 4 business days.`
    ]
  },
  'pyrmont': {
    displayName: 'Pyrmont',
    intro: `Pyrmont is a striking waterfront suburb 8km north of Croydon Park — once one of Sydney's most industrial precincts, it has been transformed into a residential and entertainment hub of apartment towers overlooking Darling Harbour and the CBD, with the Star Casino complex on its western edge. The suburb is almost entirely apartment-based, with a population of young professionals and city workers. Water filtration in Pyrmont is almost always about the apartment context — shared building systems, storage tanks and building-age infrastructure that can affect taste. Jean-Paul Barbar from Filters For You installs under-sink and reverse osmosis systems throughout Pyrmont with a clean, efficient service.`,
    bullets: [
      `Pyrmont's residential apartment towers have shared water infrastructure that routes through building storage tanks and pump systems — an under-sink or RO system at the kitchen tap provides clean, filtered drinking water at the point of use, bypassing building-level variables entirely.`,
      `The suburb's young professional population has high demand for compact, premium under-sink and reverse osmosis systems — particularly systems with a dedicated filtered tap that integrates neatly with high-end kitchen designs.`,
      `Jean-Paul is 8km south in Croydon Park and schedules Pyrmont installations within 3 to 5 business days.`
    ]
  },
  'ramsgate': {
    displayName: 'Ramsgate',
    intro: `Ramsgate is a quiet, beachside residential suburb approximately 16km south of Croydon Park, tucked between Rockdale and the shores of Botany Bay. It's a pleasant, low-density suburb of primarily freestanding homes, with some apartment buildings closer to the foreshore — and a strong community of long-term residents who value the area's relative calm compared to busier parts of Sydney's south. Many Ramsgate homes date from the 1950s and 1960s, with plumbing infrastructure from the same era. Jean-Paul Barbar from Filters For You provides water filter installation services throughout Ramsgate, helping families access clean, great-tasting water from their kitchen tap.`,
    bullets: [
      `Ramsgate's 1950s and 1960s homes commonly have original copper or galvanised steel pipes — these age over decades and can contribute metallic taste and sediment to drinking water, which a whole house or under-sink filter addresses directly.`,
      `The suburb's coastal proximity to Botany Bay means salt air can affect external plumbing fittings over time — protecting drinking water quality at the tap with a quality filter is especially worthwhile in coastal suburban homes.`,
      `Jean-Paul is 16km from Croydon Park and schedules Ramsgate installations within 5 to 7 business days.`
    ]
  },
  'randwick': {
    displayName: 'Randwick',
    intro: `Randwick is a well-established residential suburb approximately 12km south-east of Croydon Park, home to a mix of families, healthcare workers from Prince of Wales Hospital and students from UNSW and the surrounding university precinct. The suburb offers a range of housing — older brick apartment buildings on many streets, alongside larger freestanding homes. Many of Randwick's apartment buildings date from the 1960s and 1970s with shared water infrastructure that can affect water taste and quality at the tap. Jean-Paul Barbar from Filters For You provides professional water filter installation throughout Randwick, servicing both apartments and freestanding homes with fixed pricing.`,
    bullets: [
      `Randwick's 1960s and 1970s apartment buildings have shared water distribution systems with ageing pipes — an under-sink or reverse osmosis system gives residents clean, filtered water at the kitchen tap, independent of building-level infrastructure.`,
      `The suburb's proximity to Prince of Wales Hospital means many residents — particularly healthcare workers — are motivated to reduce chloramines, fluoride and heavy metals in their home drinking water.`,
      `Jean-Paul is 12km from Croydon Park and typically schedules Randwick installations within 5 to 7 business days.`
    ]
  },
  'redfern': {
    displayName: 'Redfern',
    intro: `Redfern is one of Sydney's most rapidly changing suburbs — located 6km north-east of Croydon Park, it sits at the intersection of inner-city gentrification and communities with deep historical roots, including the Aboriginal community centred around the suburb. Redfern has seen extraordinary transformation over the past decade, with new apartment buildings and renovated terrace homes entering the market alongside long-established social housing. This diverse mix means water infrastructure varies significantly across the suburb, from ageing pipes in heritage properties and older buildings to brand-new systems in recently completed developments. Jean-Paul Barbar from Filters For You installs water filtration systems throughout Redfern for all property types.`,
    bullets: [
      `Redfern's Victorian and Federation terrace homes, many dating from the 1880s to 1910s, often retain original copper and sometimes lead service lines — point-of-use filtration at the kitchen tap is important for drinking water quality in these properties.`,
      `Older apartment buildings and social housing in Redfern frequently have shared water infrastructure that has not been significantly upgraded — an under-sink filter provides residents with direct control over their own drinking water quality.`,
      `Jean-Paul is 6km away in Croydon Park and schedules Redfern installations within 3 to 5 business days.`
    ]
  },
  'richmond': {
    displayName: 'Richmond',
    intro: `Richmond is a regional town approximately 55km north-west of Croydon Park in the Hawkesbury district — one of Sydney's oldest European settlements, with a historic town centre and a mix of urban homes, rural properties and farmland. Many Richmond properties outside the town centre rely on tank water collected from roofs or bore water accessed via private wells, both of which require appropriate filtration for safe drinking and cooking use. Even town-connected homes in Richmond may notice that water tastes and smells different from metropolitan Sydney. Jean-Paul Barbar from Filters For You travels to Richmond to install water filtration systems suited to the area's diverse water supply situations.`,
    bullets: [
      `Richmond properties on rural lots frequently use rainwater tanks or bore water — unfiltered, these sources can carry sediment, organic material, bacteria and contaminants not present in treated metropolitan water. Multi-stage whole house filtration is strongly recommended.`,
      `Older Richmond town centre homes were built when lead and copper pipework was standard — an under-sink system at the kitchen tap provides an immediate improvement in drinking water quality for households connected to the town supply.`,
      `Jean-Paul travels approximately 55km from Croydon Park to Richmond — bookings are planned carefully in advance and often grouped with other Hawkesbury area jobs.`
    ]
  },
  'rockdale': {
    displayName: 'Rockdale',
    intro: `Rockdale is a multicultural suburb approximately 11km south of Croydon Park, historically a residential and light industrial area that has seen significant apartment development in recent years. The suburb sits between Arncliffe and Brighton-le-Sands and has a diverse mix of housing — older brick homes on established residential streets alongside newer mid-rise apartment buildings. Rockdale's multicultural community includes many families who place particular importance on water quality and the health of their children, making quality water filtration a genuine household priority. Jean-Paul Barbar from Filters For You installs water filtration systems throughout Rockdale with fixed pricing and a fully licensed service.`,
    bullets: [
      `Rockdale's older residential homes, many built in the 1940s to 1960s, have original copper or galvanised steel pipework that can contribute to metallic taste and sediment in tap water as it ages over decades.`,
      `Newer apartment buildings in Rockdale use shared building water systems — under-sink and reverse osmosis systems installed at the kitchen tap provide filtered water at the point of use, independent of the building's shared infrastructure.`,
      `Jean-Paul is 11km from Croydon Park and schedules Rockdale installations within 4 to 6 business days.`
    ]
  },
  'rozelle': {
    displayName: 'Rozelle',
    intro: `Rozelle sits approximately 8km north-east of Croydon Park on the Balmain peninsula — a suburb in ongoing transformation from light industrial and working-class residential to a sought-after inner-city neighbourhood of terrace homes, waterfront apartments and creative studios. The suburb borders Darling Harbour to the east and has been reshaped significantly by the Rozelle Interchange project. Like nearby Balmain and Glebe, Rozelle's older terrace homes have been renovated extensively, but original pipe infrastructure often remains beneath the updated interiors. Jean-Paul Barbar from Filters For You installs water filtration systems throughout Rozelle with care for these heritage properties.`,
    bullets: [
      `Rozelle's Victorian and Federation terrace homes frequently retain original lead and copper service lines despite interior renovations — an under-sink system at the kitchen tap is the most practical and immediate improvement for drinking water quality.`,
      `The suburb's transition from industrial to residential means some properties may have legacy soil and environmental considerations nearby — reverse osmosis systems, which remove a broad range of dissolved contaminants, are particularly valued by Rozelle residents.`,
      `Jean-Paul is 8km away in Croydon Park and schedules Rozelle installations within 3 to 5 business days.`
    ]
  },
  'st-george': {
    displayName: 'St George',
    intro: `The St George area covers the established residential suburbs approximately 12km south of Croydon Park, anchored around Kogarah and encompassing the broader south-Sydney neighbourhood known for its strong community roots, heritage homes and family character. The area is defined by post-war brick homes on generous blocks, quality schools and a loyal long-term residential population that has lived here across generations. Many St George homes retain the plumbing infrastructure from when they were originally built in the 1940s to 1960s, and ageing copper or galvanised pipes can affect the taste and clarity of tap water. Jean-Paul Barbar from Filters For You serves the full St George area with professional water filter installation.`,
    bullets: [
      `Homes across the St George area were predominantly built between 1940 and 1970 — original copper and galvanised steel pipe infrastructure is common and can contribute to sediment and metallic taste in drinking water as it ages.`,
      `The area's predominantly freestanding home stock on larger blocks makes whole house HPF-3 filtration a practical and popular option — water is treated at the mains before reaching any tap or appliance throughout the entire home.`,
      `Jean-Paul travels from Croydon Park, approximately 12km north, and schedules St George area installations within 4 to 6 business days.`
    ]
  },
  'stanmore': {
    displayName: 'Stanmore',
    intro: `Stanmore is a quiet, largely residential suburb 4km east of Croydon Park — a leafy, low-key community sitting between Newtown and Petersham in Sydney's Inner West. The suburb is made up almost entirely of Victorian and Edwardian terrace homes and semi-detached houses on tree-lined streets, with a significant proportion of owner-occupiers compared to its more rental-heavy neighbours. Stanmore's older housing stock means ageing plumbing infrastructure is common — copper service lines from the early 1900s remain in many properties that have not been fully re-piped. Jean-Paul Barbar from Filters For You installs water filtration systems in Stanmore homes, providing residents with clean, great-tasting water without any major plumbing overhaul.`,
    bullets: [
      `Stanmore's Victorian and Edwardian terrace homes — most built between 1895 and 1920 — frequently have original copper service lines that have not been replaced. An under-sink filter at the kitchen tap provides an immediate, practical improvement in drinking water quality.`,
      `The suburb's quieter residential character and high rate of owner-occupancy mean demand for premium whole house filtration is strong — many Stanmore home owners choose the HPF-3 system for clean water from every tap and appliance.`,
      `Jean-Paul is 4km from Croydon Park and serves Stanmore regularly — most bookings are confirmed within 2 to 4 business days.`
    ]
  },
  'strathfield': {
    displayName: 'Strathfield',
    intro: `Strathfield is a well-regarded family suburb approximately 5km west of Croydon Park, known for its quality schools, large homes and a thriving Korean community that has transformed the suburb's shopping and dining scene. The suburb has a mix of impressive freestanding homes on wide streets and growing apartment development near the train station. Strathfield's Korean community in particular places strong cultural emphasis on water quality — filtered water is standard in many Korean-Australian households — and demand for quality filtration systems here is consistently high. Jean-Paul Barbar from Filters For You installs water filtration systems throughout Strathfield with fixed pricing and a personal, attentive service.`,
    bullets: [
      `Strathfield's larger freestanding homes, many built between the 1920s and 1960s, have original copper plumbing infrastructure that can affect drinking water taste — whole house HPF-3 filtration at the mains is a popular upgrade for these properties.`,
      `The suburb's multicultural community, particularly Korean-Australian households, has a strong cultural tradition of drinking filtered or boiled water — reverse osmosis systems with alkaline remineralisation are frequently requested by Strathfield residents.`,
      `Jean-Paul is 5km from Croydon Park and serves Strathfield regularly — most bookings are confirmed within 3 to 4 business days.`
    ]
  },
  'surry-hills': {
    displayName: 'Surry Hills',
    intro: `Surry Hills is a vibrant, densely populated inner-city suburb 7km east of Croydon Park — a neighbourhood of Victorian terrace homes, creative studios and some of Sydney's best restaurants and cafes. It's one of Sydney's most rapidly gentrifying suburbs, with a high rental population of young professionals and creatives who value the area's walkability and culture. Most homes in Surry Hills are 100-plus years old, and while interiors have been renovated extensively, original copper and lead service pipes remain in many properties beneath the surface. Jean-Paul Barbar from Filters For You installs under-sink and reverse osmosis systems in Surry Hills homes and apartments with minimal disruption to daily life.`,
    bullets: [
      `Surry Hills terrace homes were built predominantly between the 1870s and 1910s — original lead and copper service lines are common even in fully renovated properties, and trace metal contamination in drinking water is a genuine concern that an under-sink system resolves.`,
      `The suburb's high rental density and share-house population means portable, reversible under-sink systems are the most requested type — installed under the kitchen sink without modifying the property, and removable when moving out.`,
      `Jean-Paul is 7km from Croydon Park and services Surry Hills regularly — most bookings are confirmed within 3 to 5 business days.`
    ]
  },
  'sydney-cbd': {
    displayName: 'Sydney CBD',
    intro: `The Sydney CBD sits approximately 9km north-east of Croydon Park — a dense urban core of commercial towers, residential apartment buildings and heritage precincts that is home to a growing permanent resident population alongside its daytime workforce. CBD apartment living comes with the reality of shared high-rise building water systems — water is pumped to storage tanks at height and distributed through shared infrastructure before it reaches any individual apartment. Jean-Paul Barbar from Filters For You installs under-sink and reverse osmosis water filtration systems in Sydney CBD apartments, giving residents clean, great-tasting water at the kitchen tap independent of building-level variables.`,
    bullets: [
      `Sydney CBD apartments rely on high-rise building water systems with rooftop storage tanks — water stored in tanks can develop subtle taste and odour differences, which an under-sink or reverse osmosis system at the kitchen tap eliminates entirely.`,
      `CBD apartments often have premium kitchen fitouts — Jean-Paul installs compact, aesthetically clean under-sink systems with a dedicated filtered tap that integrates neatly with high-end kitchen designs common in city apartments.`,
      `Jean-Paul travels from Croydon Park, 9km south-west, and schedules CBD appointments within 4 to 6 business days — typically on days when he has multiple city-area jobs.`
    ]
  },
  'tempe': {
    displayName: 'Tempe',
    intro: `Tempe is a small, rapidly gentrifying suburb approximately 5km south of Croydon Park, tucked between the Cooks River, Marrickville and the Western Distributor motorway. It's a suburb with a working-class history and an increasing number of renovated terrace homes and new townhouse developments attracting young families. Tempe's industrial past — with light manufacturing and storage facilities along its southern and western edges — and proximity to Sydney Airport flight paths have made many residents particularly conscious of environmental and water quality factors. Jean-Paul Barbar from Filters For You provides water filter installation in Tempe with the same care and professionalism he brings to every suburb he serves.`,
    bullets: [
      `Tempe's older working-class homes frequently retain original galvanised or copper pipes — as these age, sediment and metallic taste become more noticeable in tap water, which a whole house or under-sink filter addresses directly.`,
      `The suburb's proximity to industrial areas and flight paths from Sydney Airport has increased resident awareness of air and water quality — reverse osmosis systems, which remove dissolved contaminants including chemicals, are frequently chosen for maximum peace of mind.`,
      `Jean-Paul is 5km from Croydon Park and serves Tempe regularly — most bookings are confirmed within 3 to 4 business days.`
    ]
  },
  'ultimo': {
    displayName: 'Ultimo',
    intro: `Ultimo is a compact, high-density suburb approximately 8km north of Croydon Park, dominated by the University of Technology Sydney (UTS) campus and surrounded by student apartments, purpose-built residential towers and creative studios. The suburb borders Pyrmont and is within walking distance of the CBD, making it one of Sydney's most transient residential communities, with students and young professionals cycling through regularly. Despite this turnover, many Ultimo residents find that a quality under-sink water filter dramatically improves their daily experience, and Jean-Paul Barbar from Filters For You installs systems in Ultimo apartments efficiently and with minimal disruption to tenants.`,
    bullets: [
      `Ultimo's student apartment buildings and purpose-built residential towers rely on shared building water infrastructure — under-sink or reverse osmosis systems installed at the kitchen tap give residents filtered drinking water independent of the building's shared pipes and storage tanks.`,
      `The suburb's high student population means affordable but high-quality under-sink systems are the most popular choice — providing a significant improvement in water taste and quality from a single professional installation.`,
      `Jean-Paul is 8km south in Croydon Park and schedules Ultimo installations within 3 to 5 business days.`
    ]
  },
  'waterloo': {
    displayName: 'Waterloo',
    intro: `Waterloo is a suburb in transition approximately 8km south-east of Croydon Park — home to one of Sydney's largest social housing precincts, which is currently the subject of a major urban renewal project that will see thousands of new apartments built over the coming decade. The suburb already has a significant population of apartment residents across both existing social housing towers and newer private developments, with a broad and diverse community. Water quality and filtration access is a genuine priority for Waterloo residents, and Jean-Paul Barbar from Filters For You installs practical under-sink and reverse osmosis systems throughout the suburb with affordable fixed pricing.`,
    bullets: [
      `Waterloo's existing social housing towers have shared water infrastructure that may include ageing pipes and building storage tanks — an under-sink filter installed at the kitchen tap gives residents direct control over their drinking water quality.`,
      `Newer apartment developments in the Waterloo urban renewal precinct have modern shared water systems, but reverse osmosis and under-sink systems still provide superior final-stage filtration for drinking and cooking water in any building type.`,
      `Jean-Paul is 8km from Croydon Park and typically schedules Waterloo installations within 3 to 5 business days.`
    ]
  },
  'zetland': {
    displayName: 'Zetland',
    intro: `Zetland is one of Sydney's newest and fastest-growing suburbs — approximately 9km south-east of Croydon Park, it has been transformed in the past decade from a former industrial area into a dense residential precinct of modern apartment towers. The suburb is popular with young families, first-home buyers and investors drawn to its proximity to the CBD, Green Square station and nearby retail amenities. All of Zetland's residential stock is relatively new — apartment buildings constructed in the past 10 to 15 years — yet shared building water infrastructure can still affect taste and quality at the tap. Jean-Paul Barbar from Filters For You installs under-sink and reverse osmosis systems in Zetland apartments with clean, professional results.`,
    bullets: [
      `Zetland's newer apartment buildings have modern shared water infrastructure, but water stored in building tanks and distributed through shared pipes can still develop subtle taste differences — an under-sink or RO system at the kitchen provides superior final-stage filtration.`,
      `As a predominantly young-family and investor-driven suburb, Zetland has strong demand for reverse osmosis systems — young parents in particular value the removal of fluoride, chloramines and contaminants for their children's drinking water.`,
      `Jean-Paul is 9km from Croydon Park and schedules Zetland installations within 3 to 5 business days.`
    ]
  },
  'alexandria': {
    displayName: 'Alexandria',
    intro: `Alexandria is a suburb in transformation approximately 6km east of Croydon Park — once one of Sydney's most significant light industrial precincts, it has seen a wave of residential development as former warehouses and factory sites have been converted into apartments and new residential towers. The suburb now attracts a young, professional population drawn to its walkability, airport proximity and design-forward apartment stock. All of Alexandria's residential development is relatively recent, but shared building water systems in apartment complexes still benefit from final-stage filtration at the kitchen tap. Jean-Paul Barbar from Filters For You regularly installs under-sink and reverse osmosis systems in Alexandria apartments with minimal disruption.`,
    bullets: [
      `Alexandria's converted warehouse apartments and new residential towers use shared building water infrastructure — under-sink and reverse osmosis systems installed at the kitchen give residents filtered water at the point of use, independent of what happens in the building's shared pipes.`,
      `The suburb's proximity to former industrial sites means some residents are conscious of potential environmental contaminants in the area — reverse osmosis systems that remove a broad spectrum of dissolved contaminants are popular among Alexandria residents.`,
      `Jean-Paul is 6km from Croydon Park and schedules Alexandria installations within 3 to 5 business days.`
    ]
  },
  'arncliffe': {
    displayName: 'Arncliffe',
    intro: `Arncliffe is a quiet, residential suburb approximately 10km south of Croydon Park, sitting beneath the flight path of Sydney Airport's southern runway. The suburb is primarily composed of older brick homes on established residential streets — many built in the 1940s and 1950s — occupied by long-term families who value the area's relative calm and community character. Arncliffe's older housing stock means plumbing infrastructure from the same era is common throughout the suburb. Jean-Paul Barbar from Filters For You installs water filtration systems in Arncliffe with the same fixed-price, fully licensed approach that families across Sydney's south have come to trust — under-sink, reverse osmosis and whole house options available.`,
    bullets: [
      `Arncliffe's 1940s and 1950s homes commonly have original copper or galvanised steel pipes — as these age over decades, sediment and metallic taste in tap water becomes more noticeable. A whole house or under-sink filter addresses this at the source.`,
      `The suburb's proximity to Sydney Airport means some residents are conscious of air and environmental quality considerations in the area — this awareness extends to water quality, making filtration systems increasingly popular with Arncliffe families.`,
      `Jean-Paul is 10km from Croydon Park and schedules Arncliffe installations within 4 to 6 business days.`
    ]
  }
};

// List all suburb files to process (exclude price-sydney and same-day-sydney)
const suburFiles = [
  'water-filter-installation-alexandria.html',
  'water-filter-installation-annandale.html',
  'water-filter-installation-arncliffe.html',
  'water-filter-installation-ashfield.html',
  'water-filter-installation-auburn.html',
  'water-filter-installation-balmain.html',
  'water-filter-installation-bankstown.html',
  'water-filter-installation-beaconsfield.html',
  'water-filter-installation-bondi.html',
  'water-filter-installation-botany.html',
  'water-filter-installation-brighton-le-sands.html',
  'water-filter-installation-burwood.html',
  'water-filter-installation-campsie.html',
  'water-filter-installation-canterbury.html',
  'water-filter-installation-chatswood.html',
  'water-filter-installation-chippendale.html',
  'water-filter-installation-concord.html',
  'water-filter-installation-coogee.html',
  'water-filter-installation-croydon-park.html',
  'water-filter-installation-drummoyne.html',
  'water-filter-installation-eastern-suburbs-sydney.html',
  'water-filter-installation-enmore.html',
  'water-filter-installation-erskineville.html',
  'water-filter-installation-fairfield.html',
  'water-filter-installation-five-dock.html',
  'water-filter-installation-glebe.html',
  'water-filter-installation-granville.html',
  'water-filter-installation-homebush-west.html',
  'water-filter-installation-homebush.html',
  'water-filter-installation-hurstville.html',
  'water-filter-installation-kensington.html',
  'water-filter-installation-kogarah.html',
  'water-filter-installation-leichhardt.html',
  'water-filter-installation-lidcombe.html',
  'water-filter-installation-liverpool.html',
  'water-filter-installation-manly.html',
  'water-filter-installation-maroubra.html',
  'water-filter-installation-marrickville.html',
  'water-filter-installation-mascot.html',
  'water-filter-installation-miranda.html',
  'water-filter-installation-newtown.html',
  'water-filter-installation-north-richmond.html',
  'water-filter-installation-paddington.html',
  'water-filter-installation-parramatta.html',
  'water-filter-installation-petersham.html',
  'water-filter-installation-pyrmont.html',
  'water-filter-installation-ramsgate.html',
  'water-filter-installation-randwick.html',
  'water-filter-installation-redfern.html',
  'water-filter-installation-richmond.html',
  'water-filter-installation-rockdale.html',
  'water-filter-installation-rozelle.html',
  'water-filter-installation-st-george.html',
  'water-filter-installation-stanmore.html',
  'water-filter-installation-strathfield.html',
  'water-filter-installation-surry-hills.html',
  'water-filter-installation-sydney-cbd.html',
  'water-filter-installation-tempe.html',
  'water-filter-installation-ultimo.html',
  'water-filter-installation-waterloo.html',
  'water-filter-installation-zetland.html',
];

function buildLocalKnowledgeSection(displayName, bullets) {
  return `<section class="local-knowledge-section" style="background:#f8faff;padding:24px 20px;border-radius:12px;margin:24px 0;border-left:4px solid #0b61f4;">
  <h3 style="color:#0b61f4;margin:0 0 12px;font-size:1.05rem;">Water Filtration in ${displayName}</h3>
  <ul style="margin:0;padding-left:20px;color:#444;line-height:1.7;">
    <li>${bullets[0]}</li>
    <li>${bullets[1]}</li>
    <li>${bullets[2]}</li>
  </ul>
</section>`;
}

let updated = 0;
let skipped = 0;
let failed = 0;

for (const file of suburFiles) {
  const filePath = path.join(__dirname, file);

  if (!fs.existsSync(filePath)) {
    console.warn(`MISSING: ${file}`);
    failed++;
    continue;
  }

  let content = fs.readFileSync(filePath, 'utf8');

  // Skip if already has local knowledge section
  if (content.includes('local-knowledge-section')) {
    console.log(`SKIP (already done): ${file}`);
    skipped++;
    continue;
  }

  // Extract suburb key from filename
  const suburbKey = file
    .replace('water-filter-installation-', '')
    .replace('.html', '');

  const data = suburbData[suburbKey];
  if (!data) {
    console.warn(`NO DATA for key: ${suburbKey} (file: ${file})`);
    failed++;
    continue;
  }

  // 1. Replace the first <p> inside <div class="intro-text">
  const introTextMarker = '<div class="intro-text">';
  const introTextIdx = content.indexOf(introTextMarker);
  if (introTextIdx === -1) {
    console.warn(`NO intro-text found in: ${file}`);
    failed++;
    continue;
  }

  const firstPStart = content.indexOf('<p>', introTextIdx);
  if (firstPStart === -1) {
    console.warn(`NO <p> found after intro-text in: ${file}`);
    failed++;
    continue;
  }

  const firstPEnd = content.indexOf('</p>', firstPStart);
  if (firstPEnd === -1) {
    console.warn(`NO </p> found in: ${file}`);
    failed++;
    continue;
  }

  const newIntroP = `<p>${data.intro}</p>`;
  content = content.slice(0, firstPStart) + newIntroP + content.slice(firstPEnd + 4);

  // 2. Insert Local Knowledge section before "Systems Available" services section
  const systemsMarker = 'eyebrow">Systems Available<';
  const systemsIdx = content.indexOf(systemsMarker);
  if (systemsIdx === -1) {
    console.warn(`NO "Systems Available" found in: ${file}`);
    failed++;
    continue;
  }

  const sectionBeforeIdx = content.lastIndexOf('<section', systemsIdx);
  if (sectionBeforeIdx === -1) {
    console.warn(`Could not find <section before Systems Available in: ${file}`);
    failed++;
    continue;
  }

  const localKnowledgeHtml = buildLocalKnowledgeSection(data.displayName, data.bullets);
  content = content.slice(0, sectionBeforeIdx) + localKnowledgeHtml + '\n\n' + content.slice(sectionBeforeIdx);

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`UPDATED: ${file}`);
  updated++;
}

console.log(`\nDone. Updated: ${updated} | Skipped: ${skipped} | Failed: ${failed}`);
