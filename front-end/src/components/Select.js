import React from 'react';

export const Select = props => (
    <select value={props.value} onChange={e => props.onChange(e, props.stateName ? props.stateName : 'value', e.target.value)}>
        <option key={props.value} value={props.value}>{props.value}</option>
        {props.items && 
            renderItems(props.items)
        }
        {props.type &&
            renderItems(selectItems(props.type))
        }
    </select>
);

const renderItems = items => (
    items && items.map(item => (
        <option key={item} value={item}>{item}</option>
    ))
);

const selectItems = type => (
    type === 'songs'
        ? SelectSongs()
        : SelectArtists()
)

const SelectSongs = () => (
    [
        "All years",
        2010,
        2009,
        2008,
        2007,
        2006,
        2005,
        2004,
        2003,
        2002,
        2001,
        2000,
        1999,
        1998,
        1997,
        1996,
        1995,
        1994,
        1993,
        1992,
        1991,
        1990,
        1989,
        1988,
        1987,
        1986,
        1985,
        1984,
        1983,
        1982,
        1981,
        1980,
        1979,
        1978,
        1977,
        1976,
        1975,
        1974,
        1973,
        1972,
        1971,
        1970,
        1969,
        1968,
        1967,
        1966,
        1965,
        1964,
        1963,
        1962,
        1961,
        1960,
        1959,
        1958,
        1957,
        1956,
        1955,
        1954,
        1953,
        1950,
        1947,
        1940,
        1936,
        1935,
        1934,
        1930,
        1929,
        1927,
        1926
    ]
);

const SelectArtists = () => (
    [   
        "All genres",
        "acid jazz",
        "afrobeat",
        "all-female",
        "alternative",
        "alternative country",
        "alternative dance",
        "alternative hip hop",
        "alternative metal",
        "alternative pop rock",
        "alternative rap",
        "alternative rock",
        "ambient black metal",
        "americana",
        "arabesque",
        "argentine rock",
        "art rock",
        "avantgarde metal",
        "bachata",
        "ballad",
        "ballet",
        "banda",
        "bass music",
        "batucada",
        "beat",
        "bebop",
        "bel canto",
        "bhangra",
        "big band",
        "big beat",
        "black metal",
        "blackened death metal",
        "blue-eyed soul",
        "bluegrass",
        "blues",
        "blues-rock",
        "bolero",
        "boogaloo",
        "bossa nova",
        "boy band",
        "brazil",
        "brazilian jazz",
        "brazilian pop music",
        "breakbeat",
        "breakcore",
        "brill building pop",
        "british blues",
        "british invasion",
        "british pop",
        "broken beat",
        "brutal death metal",
        "bubblegum dance",
        "bubblegum pop",
        "bulerias",
        "cabaret",
        "california",
        "calypso",
        "canadian",
        "cantonese pop",
        "ccm",
        "celtic",
        "celtic fusion",
        "celtic punk",
        "celtic rock",
        "chalga",
        "chamber jazz",
        "chamber music",
        "chamber pop",
        "chanson",
        "chanson francaise",
        "chant",
        "charanga",
        "chicago blues",
        "chicago house",
        "chicago soul",
        "chill-out",
        "chinese music",
        "choro",
        "chorus",
        "christian hardcore",
        "christian metal",
        "christian music",
        "christian punk",
        "christian rock",
        "classic country",
        "classic female blues",
        "classic rock",
        "classical",
        "close harmony",
        "club",
        "comedy",
        "comedy rap",
        "comedy rock",
        "concerto",
        "congo",
        "contemporary classical music",
        "cool jazz",
        "country",
        "country blues",
        "country gospel",
        "country music",
        "country rock",
        "crunk",
        "cumbia",
        "dance music",
        "dance pop",
        "dance rock",
        "dance-punk",
        "dancehall",
        "dark ambient",
        "dark wave",
        "death core",
        "death metal",
        "deathrock",
        "deep house",
        "delta blues",
        "desi",
        "detroit techno",
        "digital hardcore",
        "dirty rap",
        "dirty south rap",
        "disco",
        "disco house",
        "dj",
        "doo-wop",
        "doom metal",
        "downtempo",
        "dream pop",
        "dub",
        "dubstep",
        "dubtronica",
        "early music",
        "east coast blues",
        "east coast hip hop",
        "easy listening",
        "electric blues",
        "electro",
        "electro hip hop",
        "electro rock",
        "electroclash",
        "electronic",
        "electronica",
        "electropop",
        "emo",
        "ethnic",
        "eurodance",
        "europop",
        "exotica",
        "experimental pop",
        "experimental rock",
        "female vocalist",
        "filk",
        "finish",
        "flamenco",
        "folk",
        "folk metal",
        "folk punk",
        "folk rock",
        "folk-pop",
        "folktronica",
        "freakbeat",
        "free improvisation",
        "free jazz",
        "free music",
        "freestyle",
        "french pop",
        "frevo",
        "funeral doom",
        "funk",
        "funk metal",
        "funk rock",
        "funky house",
        "funny",
        "fusion",
        "future jazz",
        "gabba",
        "gaita",
        "game",
        "gangster rap",
        "garage rock",
        "german",
        "german pop",
        "ghetto tech",
        "glam",
        "glam metal",
        "glam rock",
        "glitch",
        "goa",
        "goregrind",
        "gospel",
        "gothic metal",
        "gothic rock",
        "greek",
        "grime",
        "grindcore",
        "groove metal",
        "grunge",
        "guitar",
        "guitarist",
        "gypsy jazz",
        "happy hardcore",
        "hard bop",
        "hard house",
        "hard rock",
        "hard trance",
        "hardcore hip hop",
        "hardcore metal",
        "hardcore punk",
        "hardcore techno",
        "hardstyle",
        "harmonica blues",
        "heartland rock",
        "heavy metal",
        "highlife",
        "hip hop",
        "hip house",
        "hip pop",
        "honky tonk",
        "horror punk",
        "humppa",
        "hyphy",
        "illbient",
        "indie",
        "indie pop",
        "indie rock",
        "indietronica",
        "industrial dance",
        "industrial metal",
        "industrial rock",
        "instrumental pop",
        "instrumental rock",
        "irish",
        "irish folk",
        "island music",
        "italian disco",
        "j pop",
        "jam band",
        "jangle pop",
        "japanese",
        "jazz",
        "jazz blues",
        "jazz funk",
        "jazz fusion",
        "jazz rap",
        "jug band",
        "jump blues",
        "jungle music",
        "kirtan",
        "kizomba",
        "klezmer",
        "kraut rock",
        "latin",
        "latin jazz",
        "latin pop",
        "lo-fi",
        "los angeles",
        "louisiana blues",
        "lounge music",
        "lovers rock",
        "lullaby",
        "male vocalist",
        "mambo",
        "mandarin pop",
        "manouche",
        "mariachi",
        "marimba",
        "marrabenta",
        "massachusetts",
        "math rock",
        "math-core",
        "meditation",
        "melbourne",
        "melodic death metal",
        "melodic hardcore",
        "melodic metalcore",
        "melodic trance",
        "memphis blues",
        "merengue",
        "merseybeat",
        "mexico",
        "miami bass",
        "modern laika",
        "modern rock",
        "mondiovision",
        "motown",
        "musette",
        "musica",
        "neo soul",
        "neo-progressive",
        "neoclassical",
        "neofolk",
        "neue deutsche welle",
        "new age",
        "new beat",
        "new jack swing",
        "new orleans blues",
        "new orleans jazz",
        "new romantic",
        "new wave",
        "no wave",
        "noise pop",
        "noise rock",
        "northern soul",
        "nu jazz",
        "nu metal",
        "nu-soul",
        "oi",
        "old school hip hop",
        "oldies",
        "opera",
        "orchestra",
        "ost",
        "outlaw country",
        "parody",
        "patriotic",
        "peace punk",
        "piano blues",
        "piano rock",
        "piedmont blues",
        "pinoy rock",
        "polka",
        "pop",
        "pop folk",
        "pop punk",
        "pop rap",
        "pop rock",
        "post rock",
        "post-grunge",
        "post-hardcore",
        "power electronics",
        "power metal",
        "power pop",
        "power violence",
        "progressive bluegrass",
        "progressive house",
        "progressive metal",
        "progressive rock",
        "progressive trance",
        "protopunk",
        "psychedelic rock",
        "psychobilly",
        "punk",
        "punk blues",
        "qawwali",
        "queercore",
        "quiet storm",
        "r&b",
        "ragga jungle",
        "ragtime",
        "ranchera",
        "rap",
        "rap metal",
        "rap rock",
        "rapcore",
        "rare groove",
        "rebetika",
        "reggae",
        "reggaeton",
        "religious music",
        "requiem",
        "riot grrrl",
        "rock",
        "rock 'n roll",
        "rock steady",
        "rockabilly",
        "roots reggae",
        "roots rock",
        "rumba",
        "sadcore",
        "salsa",
        "samba",
        "san francisco bay area",
        "screamo",
        "serialism",
        "shock rock",
        "shoegaze",
        "show tunes",
        "singer-songwriter",
        "ska",
        "ska punk",
        "skate punk",
        "slack key guitar",
        "slow core",
        "sludge metal",
        "smooth jazz",
        "soft rock",
        "sonata",
        "soukous",
        "soul",
        "soul blues",
        "soul jazz",
        "soul music",
        "soundtrack",
        "southern gospel",
        "southern rock",
        "southern soul",
        "space age pop",
        "space music",
        "space rock",
        "spanish",
        "speed garage",
        "speed metal",
        "speedcore",
        "stand-up comedy",
        "stoner metal",
        "stoner rock",
        "straight edge",
        "suomi rock",
        "surf music",
        "swamp blues",
        "swamp pop",
        "swamp rock",
        "swedish",
        "swiss",
        "sxsw 2007",
        "sympho black metal",
        "symphonic metal",
        "symphonic rock",
        "symphony",
        "synth punk",
        "synthpop",
        "tango",
        "tech house",
        "technical death metal",
        "techno",
        "teen pop",
        "tejano",
        "texas blues",
        "thrash core",
        "trance",
        "tribal house",
        "trip hop",
        "trip rock",
        "turnablism",
        "twee pop",
        "uk garage",
        "underground rap",
        "united states",
        "urban",
        "urban folk",
        "vallenato",
        "vaudeville",
        "video game music",
        "viking metal",
        "visual kei",
        "vocal",
        "vocal house",
        "vocal jazz",
        "vocal trance",
        "western swing",
        "world",
        "world beat",
        "world fusion",
        "world music",
        "zouk",
        "zouklove",
        "zydeco"
    ]
);
