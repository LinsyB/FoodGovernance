

/* =========================
   TEGELTYPES
========================= */

const TILES = {
    KANTINE: "Kantine",
    WEG: "Weg",
    VOLLE_WEG: "Volleweg",

    BOOM: "Boom",
    BOS: "Bos",

    WATER: "Water",

    LANDBOUW: "Land",

    BOERDERIJ: "Boerderij",
    SLACHTERIJ: "Slachterij",

    VISSERIJ: "Visserij",

    FABRIEK: "Fabriek",
    INDUSTRIETERREIN: "Industrie",

    DORP: "Dorp",
    STAD: "Stad",

    AEC: "AEC"
};

/* =========================
   AFBEELDINGEN
========================= */

const tileImages = {
    Kantine: "images/Kantine.png",

    Weg: "images/Weg.png",
    Volleweg: "images/Volleweg.png",

    Boom: "images/Boom.png",
    Bos: "images/Bos.png",

    Water: "images/Water.png",

    Land: "images/Land.png",

    Boerderij: "images/Boerderij.png",
    Slachterij: "images/Slachterij.png",

    Visserij: "images/Visserij.png",

    Fabriek: "images/Fabriek.png",
    Industrie: "images/Industrieterrein.png",

    Dorp: "images/Dorp.png",
    Stad: "images/Stad.png",

    AEC: "images/AEC.png"
};

/* =========================
   STATISTIEKEN
========================= */

const stats = {
    biodiversiteit: 20,
    gezondheid: 20,
    inclusiviteit: 20,
    emissies: 0,
    eerlijkeKeten: 20,
    betaalbaarheid: 20,
    productie: 20
};

/* =========================
   HEX INSTELLINGEN
========================= */

const HEX_RADIUS = 4;

const HEX_WIDTH = 84;
const HEX_HEIGHT = 96;

const boardElement = document.getElementById("hexBoard");

/* =========================
   SPELDATA
========================= */

const board = new Map();

/*
key:
"q,r"

value:
{
    q,
    r,
    tile
}
*/

/* =========================
   HEX HELPERS
========================= */

function key(q, r)
{
    return `${q},${r}`;
}

function getHex(q, r)
{
    return board.get(key(q, r));
}

function setHex(q, r, data)
{
    board.set(key(q, r), data);
}

/* =========================
   AXIALE BUREN
========================= */

const DIRECTIONS = [
    [1, 0],
    [1, -1],
    [0, -1],
    [-1, 0],
    [-1, 1],
    [0, 1]
];

function getNeighbours(q, r)
{
    return DIRECTIONS.map(([dq, dr]) =>
        getHex(q + dq, r + dr)
    ).filter(Boolean);
}

/* =========================
   AXIAAL -> PIXEL
========================= */

function axialToPixel(q, r)
{
    const size = 48;

    return {
        x: size * Math.sqrt(3) * (q + r / 2),
        y: size * 1.5 * r
    };
}
/* =========================
   HEX AANMAKEN
========================= */

function createHexElement(hex)
{
    const div = document.createElement("div");

    div.classList.add("hex");
    div.classList.add("empty");

    const pos = axialToPixel(
        hex.q,
        hex.r
    );

    div.style.left =
    `${pos.x + 350}px`;

div.style.top =
    `${pos.y + 300}px`;
    div.dataset.q = hex.q;
    div.dataset.r = hex.r;

    hex.element = div;

    boardElement.appendChild(div);
}

/* =========================
   HEX KAART
========================= */

function generateBoard()
{
    for (
        let q = -HEX_RADIUS;
        q <= HEX_RADIUS;
        q++
    )
    {
        const rMin =
            Math.max(
                -HEX_RADIUS,
                -q - HEX_RADIUS
            );

        const rMax =
            Math.min(
                HEX_RADIUS,
                -q + HEX_RADIUS
            );

        for (
            let r = rMin;
            r <= rMax;
            r++
        )
        {
            const hex = {
                q,
                r,
                tile: null,
                element: null
            };

            setHex(q, r, hex);

            createHexElement(hex);
        }
    }
}

/* =========================
   TEGEL PLAATSEN
========================= */

function placeTile(q, r, tileType)
{
    const hex = getHex(q, r);

    if (!hex) return;

    hex.tile = tileType;

    hex.element.classList.remove(
        "empty"
    );

    hex.element.innerHTML = "";

    const img =
        document.createElement("img");

    img.src =
        tileImages[tileType];

    img.alt =
        tileType;

    hex.element.appendChild(img);
}

/* =========================
   START KANTINE
========================= */

function placeCanteen()
{
    placeTile(
        0,
        0,
        TILES.KANTINE
    );
}

/* =========================
   PROGRESSBARS
========================= */

function updateBars()
{
    document.getElementById(
        "bioBar"
    ).style.width =
        `${stats.biodiversiteit}%`;

    document.getElementById(
        "gezondheidBar"
    ).style.width =
        `${stats.gezondheid}%`;

    document.getElementById(
        "inclusiviteitBar"
    ).style.width =
        `${stats.inclusiviteit}%`;

    document.getElementById(
        "emissiesBar"
    ).style.width =
        `${stats.emissies}%`;

    document.getElementById(
        "ketenBar"
    ).style.width =
        `${stats.eerlijkeKeten}%`;

    document.getElementById(
        "betaalbaarheidBar"
    ).style.width =
        `${stats.betaalbaarheid}%`;

    document.getElementById(
        "productieBar"
    ).style.width =
        `${stats.productie}%`;

    document.getElementById(
        "bioValue"
    ).textContent =
        stats.biodiversiteit;

    document.getElementById(
        "gezondheidValue"
    ).textContent =
        stats.gezondheid;

    document.getElementById(
        "inclusiviteitValue"
    ).textContent =
        stats.inclusiviteit;

    document.getElementById(
        "emissiesValue"
    ).textContent =
        stats.emissies;

    document.getElementById(
        "ketenValue"
    ).textContent =
        stats.eerlijkeKeten;

    document.getElementById(
        "betaalbaarheidValue"
    ).textContent =
        stats.betaalbaarheid;

    document.getElementById(
        "productieValue"
    ).textContent =
        stats.productie;
}

/* =========================
   INIT
========================= */

function init()
{
    generateBoard();

    placeCanteen();

    updateBars();
}

init();


/* =========================
   GROEP TYPES
========================= */

const PLACEABLE_TILES = [
    TILES.WEG,
    TILES.BOOM,
    TILES.WATER,
    TILES.LANDBOUW,
    TILES.BOERDERIJ,
    TILES.FABRIEK,
    TILES.DORP,
    TILES.AEC
];

/* Visserij wordt later
   dynamisch toegevoegd
*/

const GROUP_SHAPES = [

    // 2 tegels

    [
        [0, 0],
        [1, 0]
    ],

    // 3 lijn

    [
        [0, 0],
        [1, 0],
        [2, 0]
    ],

    // driehoek links

    [
        [0, 0],
        [1, 0],
        [0, 1]
    ],

    // driehoek rechts

    [
        [0, 0],
        [1, 0],
        [1, -1]
    ]
];

/* =========================
   HUIDIGE GROEP
========================= */

let currentGroup = null;

let currentRotation = 0;

/* =========================
   ROTATIE HEX
========================= */

function rotateHex(q, r)
{
    return {
        q: -r,
        r: q + r
    };
}

function applyRotation(coords, steps)
{
    let q = coords[0];
    let r = coords[1];

    for(let i = 0; i < steps; i++)
    {
        const rotated =
            rotateHex(q, r);

        q = rotated.q;
        r = rotated.r;
    }

    return [q, r];
}

/* =========================
   VISSERIJ BESCHIKBAAR?
========================= */

function canFisheryAppear()
{
    for(const hex of board.values())
    {
        if(hex.tile !== TILES.WATER)
            continue;

        const neighbours =
            getNeighbours(
                hex.q,
                hex.r
            );

        const emptyFound =
            neighbours.some(
                n => n.tile === null
            );

        if(emptyFound)
            return true;
    }

    return false;
}

/* =========================
   AEC BESCHIKBAAR?
========================= */

function aecAlreadyExists()
{
    for(const hex of board.values())
    {
        if(hex.tile === TILES.AEC)
            return true;
    }

    return false;
}

/* =========================
   RANDOM TEGEL
========================= */

function getRandomTile()
{
    const pool = [
        TILES.WEG,
        TILES.WEG,
        TILES.WEG,

        TILES.BOOM,
        TILES.BOOM,

        TILES.WATER,
        TILES.WATER,

        TILES.LANDBOUW,
        TILES.LANDBOUW,

        TILES.BOERDERIJ,

        TILES.FABRIEK,

        TILES.DORP
    ];

    if(canFisheryAppear())
    {
        pool.push(TILES.VISSERIJ);
    }

    if(!aecAlreadyExists())
    {
        pool.push(TILES.AEC);
    }

    return pool[
        Math.floor(
            Math.random() * pool.length
        )
    ];
}

/* =========================
   NIEUWE GROEP
========================= */

function generateGroup()
{
    const tileCount =
        Math.random() < 0.5
            ? 2
            : 3;

    let shape;

    if(tileCount === 2)
    {
        shape = GROUP_SHAPES[0];
    }
    else
    {
        shape =
            GROUP_SHAPES[
                1 +
                Math.floor(
                    Math.random() * 3
                )
            ];
    }

    const tiles = [];

    for(let i = 0; i < tileCount; i++)
    {
        tiles.push(
            getRandomTile()
        );
    }

    currentGroup = {
        shape,
        tiles
    };

    currentRotation = 0;

    updateGroupPreview();
}

/* =========================
   OPHALEN ROTATIE
========================= */

function getRotatedShape()
{
    if(!currentGroup)
        return [];

    return currentGroup.shape.map(
        coord =>
            applyRotation(
                coord,
                currentRotation
            )
    );
}

/* =========================
   PREVIEW PANEL
========================= */

function updateGroupPreview()
{
    const preview =
        document.getElementById(
            "groepPreview"
        );

    preview.innerHTML = "";

    if(!currentGroup)
        return;

    const wrapper =
        document.createElement("div");

    wrapper.style.position =
        "relative";

    wrapper.style.width =
    "350px";

wrapper.style.height =
    "250px";

    const coords =
        getRotatedShape();

    coords.forEach(
        (coord, index) =>
        {
            const tile =
                document.createElement(
                    "img"
                );

            tile.src =
                tileImages[
                    currentGroup.tiles[index]
                ];

            tile.style.position =
                "absolute";

            tile.style.width =
    "80px";

tile.style.height =
    "92px";

                    const previewSize = 45;

                const pos = {
                  x:
                      previewSize *
                      Math.sqrt(3) *
                      (coord[0] + coord[1] / 2),

                  y:
                      previewSize *
                      1.5 *
                      coord[1]
              };

          const centerX = 40;
const centerY = 90;

tile.style.left =
    `${pos.x + centerX}px`;

tile.style.top =
    `${pos.y + centerY}px`;

            wrapper.appendChild(
                tile
            );
        }
    );

    preview.appendChild(wrapper);
}

/* =========================
   CURSOR PREVIEW
========================= */



/* =========================
   ROTEREN
========================= */

let hoveredHex = null;

document.addEventListener(
    "keydown",
    event =>
    {
        if(!currentGroup)
            return;

        if(event.key === "ArrowRight")
        {
            currentRotation =
                (currentRotation + 1) % 6;

            updateGroupPreview();

            if(hoveredHex)
            {
                showHoverPreview(
                    hoveredHex.q,
                    hoveredHex.r
                );
            }
        }

        if(event.key === "ArrowLeft")
        {
            currentRotation--;

            if(currentRotation < 0)
            {
                currentRotation = 5;
            }

            updateGroupPreview();

            if(hoveredHex)
            {
                showHoverPreview(
                    hoveredHex.q,
                    hoveredHex.r
                );
            }
        }
    }
);

/* =========================
   INIT UITBREIDING
========================= */

generateGroup();


/* =========================
   PLAATSING HELPERS
========================= */

function isInsideBoard(q, r)
{
    return getHex(q, r) !== undefined;
}

function isEmptyHex(q, r)
{
    const hex = getHex(q, r);

    if(!hex) return false;

    return hex.tile === null;
}

/* =========================
   VERBONDEN MET NETWERK?
========================= */

function touchesExistingNetwork(groupHexes)
{
    for(const pos of groupHexes)
    {
        const neighbours =
            getNeighbours(
                pos.q,
                pos.r
            );

        const connected =
            neighbours.some(
                n => n.tile !== null
            );

        if(connected)
        {
            return true;
        }
    }

    return false;
}

/* =========================
   VISSERIJ REGEL
========================= */

function fisheryValid(q, r)
{
    const neighbours =
        getNeighbours(q, r);

    return neighbours.some(
        n =>
            n.tile === TILES.WATER
    );
}

/* =========================
   PLAATSBAAR?
========================= */

function canPlaceGroup(originQ, originR)
{
    if(!currentGroup)
        return false;

    const rotatedShape =
        getRotatedShape();

    const placements = [];

    for(let i = 0; i < rotatedShape.length; i++)
    {
        const offset =
            rotatedShape[i];

        const q =
            originQ + offset[0];

        const r =
            originR + offset[1];

        const hex =
            getHex(q, r);

        if(!hex)
            return false;

        if(hex.tile !== null)
            return false;

        placements.push({
            q,
            r,
            tile:
                currentGroup.tiles[i]
        });
    }

    if(
        !touchesExistingNetwork(
            placements
        )
    )
    {
        return false;
    }

    for(const tile of placements)
    {
        if(
            tile.tile ===
            TILES.VISSERIJ
        )
        {
            if(
                !fisheryValid(
                    tile.q,
                    tile.r
                )
            )
            {
                return false;
            }
        }
    }

    return true;
}

/* =========================
   GROEP PLAATSEN
========================= */

function placeGroup(originQ, originR)
{
    if(
        !canPlaceGroup(
            originQ,
            originR
        )
    )
    {
        return;
    }

    const shape =
        getRotatedShape();

    for(let i = 0; i < shape.length; i++)
    {
        const offset =
            shape[i];

        const q =
            originQ + offset[0];

        const r =
            originR + offset[1];

        placeTile(
            q,
            r,
            currentGroup.tiles[i]
        );
    }

    generateGroup();


    recalculateAllStats?.();
    updateRoadNetwork?.();
    updateSpecialTiles?.();
    checkGameState?.();
}

/* =========================
   KLIK OP HEX
========================= */

function setupBoardClicks()
{
    for(const hex of board.values())
    {
        hex.element.addEventListener(
            "click",
            () =>
            {
                placeGroup(
                    hex.q,
                    hex.r
                );
            }
        );
    }
}

/* =========================
   VISUELE PREVIEW
========================= */

function clearHoverPreview()
{
    document
        .querySelectorAll(
            ".placement-preview"
        )
        .forEach(
            preview =>
            {
                preview.remove();
            }
        );
}

function showHoverPreview(
    originQ,
    originR
)
{
    clearHoverPreview();

    if(!currentGroup)
        return;

    const shape =
        getRotatedShape();

    const valid =
        canPlaceGroup(
            originQ,
            originR
        );

    shape.forEach(
        (offset, index) =>
        {
            const q =
                originQ +
                offset[0];

            const r =
                originR +
                offset[1];

            const hex =
                getHex(q, r);

            if(!hex)
                return;

            const img =
                document.createElement(
                    "img"
                );

            img.src =
                tileImages[
                    currentGroup.tiles[index]
                ];

            img.classList.add(
                "placement-preview"
            );

            img.style.position =
                "absolute";

            img.style.left =
                "0";

            img.style.top =
                "0";

            img.style.width =
                "100%";

            img.style.height =
                "100%";

            img.style.pointerEvents =
                "none";

            if(valid)
                {
                    img.style.opacity = "0.80";
                }
                else
                {
                    img.style.opacity = "0.70";
                    img.style.filter =
                        "sepia(0.3) saturate(1.5) hue-rotate(-20deg)";
                }

            hex.element.appendChild(
                img
            );
        }
    );
}

/* =========================
   HOVER EVENTS
========================= */

function setupHoverEvents()
{
    for(const hex of board.values())
    {
        hex.element.addEventListener(
            "mouseenter",
            () =>
            {
                hoveredHex = hex;

                showHoverPreview(
                    hex.q,
                    hex.r
                );
            }
        );

        hex.element.addEventListener(
            "mouseleave",
            () =>
            {
                hoveredHex = null;

                clearHoverPreview();
            }
        );
    }
}

/* =========================
   INIT UITBREIDING
========================= */

setupBoardClicks();
setupHoverEvents();


/* =========================
   TEGELWAARDEN
========================= */

const TILE_STATS = {

    Boom: {
    biodiversiteit: 3,
    gezondheid: 1,
    emissies: -1,
    productie: -2
},

    Bos: {
    biodiversiteit: 5,
    gezondheid: 2,
    emissies: -2,
    productie: -2
},

    Water: {
        biodiversiteit: 3,
        gezondheid: 2,
        productie: -2
    },

    Land: {
    biodiversiteit: -4,
    gezondheid: -2,
    emissies: 4,
    eerlijkeKeten: -1,
    betaalbaarheid: 2,
    productie: 2
},

    Boerderij: {
    biodiversiteit: 0,
    gezondheid: 1,
    inclusiviteit: 1,
    emissies: 2,
    eerlijkeKeten: 3,
    betaalbaarheid: -1,
    productie: 1
},

    Slachterij: {
    biodiversiteit: -6,
    gezondheid: -5,
    inclusiviteit: -2,
    emissies: 10,
    eerlijkeKeten: -4,
    betaalbaarheid: 4,
    productie: 4
},

    Visserij: {
    biodiversiteit: -2,
    gezondheid: 2,
    inclusiviteit: 1,
    emissies: 3,
    eerlijkeKeten: 2,
    betaalbaarheid: 1,
    productie: 2
},

    Fabriek: {
    biodiversiteit: -5,
    gezondheid: -4,
    inclusiviteit: -1,
    emissies: 8,
    eerlijkeKeten: -4,
    betaalbaarheid: 4,
    productie: 3
},

    Industrie: {
    biodiversiteit: -10,
    gezondheid: -6,
    inclusiviteit: -2,
    emissies: 14,
    eerlijkeKeten: -6,
    betaalbaarheid: 6,
    productie: 10
},

   Volleweg: {
    emissies: 3,
    eerlijkeKeten: -1,
    betaalbaarheid: 1,
    productie: 1
},

    AEC: {
        biodiversiteit: -2,
        gezondheid: -1,
        emissies: -3,
        betaalbaarheid: 2
    },

    Dorp: {
    biodiversiteit: 0,
    gezondheid: 1,
    inclusiviteit: 4,
    emissies: 2,
    eerlijkeKeten: 2,
    productie: 1
},

    Stad: {
    biodiversiteit: -4,
    gezondheid: -1,
    inclusiviteit: 7,
    emissies: 8,
    eerlijkeKeten: -3,
    betaalbaarheid: 4,
    productie: 4
},

    Kantine: {
        inclusiviteit: 2,
        eerlijkeKeten: 1
    }

};

/* =========================
   HELPERS
========================= */

function resetStats()
{
  stats.biodiversiteit = 20;
stats.gezondheid = 20;
stats.inclusiviteit = 20;
stats.emissies = 0;
stats.eerlijkeKeten = 20;
stats.betaalbaarheid = 20;
stats.productie = 20;
}

function clampStats()
{
    Object.keys(stats).forEach(
        key =>
        {
            stats[key] =
                Math.max(
                    0,
                    Math.min(
                        100,
                        Math.round(stats[key])
                    )
                );
        }
    );
}

function applyTileStats(tile)
{
    const values =
        TILE_STATS[tile];

    if(!values)
        return;

    Object.entries(values)
        .forEach(
            ([stat, value]) =>
            {
                stats[stat] += value;
            }
        );
}

/* =========================
   LANDBOUW BONUS
========================= */

function calculateAgricultureBonus()
{
    for(const hex of board.values())
    {
        if(hex.tile !== TILES.LANDBOUW)
            continue;

        const neighbours =
            getNeighbours(
                hex.q,
                hex.r
            );

        let agricultureCount = 0;
        let waterCount = 0;

        neighbours.forEach(
            n =>
            {
                if(
                    n.tile ===
                    TILES.LANDBOUW
                )
                {
                    agricultureCount++;
                }

                if(
                    n.tile ===
                    TILES.WATER
                )
                {
                    waterCount++;
                }
            }
        );

        stats.productie +=
            agricultureCount;

        stats.productie +=
            waterCount * 2;

        stats.biodiversiteit -=
            waterCount;
    }
}

/* =========================
   AEC EFFECTEN
========================= */

function calculateAECBonuses()
{
    for(const hex of board.values())
    {
        if(hex.tile !== TILES.AEC)
            continue;

        const neighbours =
            getNeighbours(
                hex.q,
                hex.r
            );

        neighbours.forEach(
            neighbour =>
            {
                if(
                    neighbour.tile ===
                        TILES.FABRIEK ||
                    neighbour.tile ===
                        TILES.INDUSTRIETERREIN
                )
                {
                    stats.emissies -= 2;
                }

                if(
                    neighbour.tile ===
                        TILES.BOOM ||
                    neighbour.tile ===
                        TILES.BOS ||
                    neighbour.tile ===
                        TILES.WATER ||
                    neighbour.tile ===
                        TILES.LANDBOUW ||
                    neighbour.tile ===
                        TILES.BOERDERIJ
                )
                {
                    stats.biodiversiteit -= 2;
                    stats.gezondheid -= 1;
                }
            }
        );
    }
}

/* =========================
   VOLLEDIGE BEREKENING
========================= */

function recalculateAllStats()
{
    resetStats();

    for(const hex of board.values())
    {
        if(!hex.tile)
            continue;

        applyTileStats(
            hex.tile
        );
    }

    calculateAgricultureBonus();

    calculateAECBonuses();

    clampStats();

    updateBars();
}

/* =========================
   GAME OVER
========================= */

let gameEnded = false;

function gameOver(reason)
{
    if(gameEnded)
        return;

    gameEnded = true;

    alert(
        "Verloren!\n\n" +
        reason
    );
}

function victory()
{
    if(gameEnded)
        return;

    gameEnded = true;

    alert(
        "Gewonnen!"
    );
}

/* =========================
   WEG NETWERK
========================= */

function isRoad(tile)
{
    return (
        tile === TILES.WEG ||
        tile === TILES.VOLLE_WEG
    );
}

/* =========================
   VOLLE WEGEN VANAF KANTINE
========================= */

function floodFillRoads()
{
    const start =
        getHex(0, 0);

    if(!start)
        return;

    const queue = [start];
    const visited = new Set();

    while(queue.length)
    {
        const current =
            queue.shift();

        const currentKey =
            key(
                current.q,
                current.r
            );

        if(
            visited.has(
                currentKey
            )
        )
        {
            continue;
        }

        visited.add(
            currentKey
        );

        const neighbours =
            getNeighbours(
                current.q,
                current.r
            );

        neighbours.forEach(
            neighbour =>
            {
                if(
                    neighbour.tile ===
                    TILES.WEG
                )
                {
                    neighbour.tile =
                        TILES.VOLLE_WEG;

                    placeTile(
                        neighbour.q,
                        neighbour.r,
                        TILES.VOLLE_WEG
                    );

                    queue.push(
                        neighbour
                    );
                }

                else if(
                    neighbour.tile ===
                    TILES.VOLLE_WEG
                )
                {
                    queue.push(
                        neighbour
                    );
                }
            }
        );
    }
}

/* =========================
   STAD NETWERKEN
========================= */

function findConnectedCity(
    startCity,
    targetCity
)
{
    const queue = [startCity];
    const visited = new Set();

    while(queue.length)
    {
        const current =
            queue.shift();

        const currentKey =
            key(
                current.q,
                current.r
            );

        if(
            visited.has(
                currentKey
            )
        )
        {
            continue;
        }

        visited.add(
            currentKey
        );

        if(
            current !== startCity &&
            current === targetCity
        )
        {
            return true;
        }

        const neighbours =
            getNeighbours(
                current.q,
                current.r
            );

        neighbours.forEach(
            neighbour =>
            {
                if(
                    isRoad(
                        neighbour.tile
                    )
                )
                {
                    queue.push(
                        neighbour
                    );
                }

                if(
                    neighbour.tile ===
                    TILES.STAD
                )
                {
                    queue.push(
                        neighbour
                    );
                }
            }
        );
    }

    return false;
}

/* =========================
   STAD -> WEG -> STAD
========================= */

function activateCityNetworks()
{
    const cities =
        [...board.values()]
        .filter(
            hex =>
                hex.tile ===
                TILES.STAD
        );

    for(let i = 0; i < cities.length; i++)
    {
        for(
            let j = i + 1;
            j < cities.length;
            j++
        )
        {
            const cityA =
                cities[i];

            const cityB =
                cities[j];

            const connected =
                findConnectedCity(
                    cityA,
                    cityB
                );

            if(!connected)
                continue;

            convertRoadsBetweenCities(
                cityA,
                cityB
            );
        }
    }
}

/* =========================
   ROADS TUSSEN STEDEN
========================= */

function convertRoadsBetweenCities(
    cityA,
    cityB
)
{
    const queue = [cityA];

    const visited =
        new Set();

    while(queue.length)
    {
        const current =
            queue.shift();

        const currentKey =
            key(
                current.q,
                current.r
            );

        if(
            visited.has(
                currentKey
            )
        )
        {
            continue;
        }

        visited.add(
            currentKey
        );

        const neighbours =
            getNeighbours(
                current.q,
                current.r
            );

        neighbours.forEach(
            neighbour =>
            {
                if(
                    neighbour.tile ===
                    TILES.WEG
                )
                {
                    neighbour.tile =
                        TILES.VOLLE_WEG;

                    placeTile(
                        neighbour.q,
                        neighbour.r,
                        TILES.VOLLE_WEG
                    );

                    queue.push(
                        neighbour
                    );
                }

                else if(
                    neighbour.tile ===
                    TILES.VOLLE_WEG
                )
                {
                    queue.push(
                        neighbour
                    );
                }

                else if(
                    neighbour.tile ===
                    TILES.STAD
                )
                {
                    queue.push(
                        neighbour
                    );
                }
            }
        );
    }
}

/* =========================
   BOERDERIJ -> SLACHTERIJ
========================= */

function farmConnectedToIndustry(
    farm
)
{
    const queue = [farm];

    const visited =
        new Set();

    while(queue.length)
    {
        const current =
            queue.shift();

        const currentKey =
            key(
                current.q,
                current.r
            );

        if(
            visited.has(
                currentKey
            )
        )
        {
            continue;
        }

        visited.add(
            currentKey
        );

        const neighbours =
            getNeighbours(
                current.q,
                current.r
            );

        for(
            const neighbour
            of neighbours
        )
        {
            if(
                neighbour.tile ===
                    TILES.FABRIEK ||
                neighbour.tile ===
                    TILES.INDUSTRIETERREIN
            )
            {
                return true;
            }

            if(
                neighbour.tile ===
                TILES.VOLLE_WEG
            )
            {
                queue.push(
                    neighbour
                );
            }
        }
    }

    return false;
}

function updateSlaughterhouses()
{
    for(
        const hex
        of board.values()
    )
    {
        if(
            hex.tile !==
            TILES.BOERDERIJ
        )
        {
            continue;
        }

        if(
            farmConnectedToIndustry(
                hex
            )
        )
        {
            hex.tile =
                TILES.SLACHTERIJ;

            placeTile(
                hex.q,
                hex.r,
                TILES.SLACHTERIJ
            );
        }
    }
}

/* =========================
   HOOFDFUNCTIE
========================= */

function updateRoadNetwork()
{
    floodFillRoads();

    activateCityNetworks();

    updateSlaughterhouses();

    recalculateAllStats();
}


/* =========================
   CLUSTER HULPFUNCTIES
========================= */

function findConnectedTiles(
    startHex,
    tileType,
    visited
)
{
    const cluster = [];
    const queue = [startHex];

    while(queue.length)
    {
        const current =
            queue.shift();

        const currentKey =
            key(
                current.q,
                current.r
            );

        if(
            visited.has(
                currentKey
            )
        )
        {
            continue;
        }

        visited.add(
            currentKey
        );

        if(
            current.tile !==
            tileType
        )
        {
            continue;
        }

        cluster.push(
            current
        );

        const neighbours =
            getNeighbours(
                current.q,
                current.r
            );

        neighbours.forEach(
            neighbour =>
            {
                if(
                    neighbour.tile ===
                    tileType
                )
                {
                    queue.push(
                        neighbour
                    );
                }
            }
        );
    }

    return cluster;
}

/* =========================
   TRANSFORMATIE
========================= */

function transformCluster(
    sourceTile,
    targetTile
)
{
    const visited =
        new Set();

    for(
        const hex
        of board.values()
    )
    {
        if(
            hex.tile !==
            sourceTile
        )
        {
            continue;
        }

        const cluster =
            findConnectedTiles(
                hex,
                sourceTile,
                visited
            );

        if(
            cluster.length < 3
        )
        {
            continue;
        }

        const amount =
            Math.floor(
                cluster.length / 3
            );

        let converted = 0;

        for(
            let i = 0;
            i < cluster.length;
            i++
        )
        {
            if(
                converted >=
                amount * 3
            )
            {
                break;
            }

            const tile =
                cluster[i];

            tile.tile =
                targetTile;

            placeTile(
                tile.q,
                tile.r,
                targetTile
            );

            converted++;
        }
    }
}

/* =========================
   BOOM -> BOS
========================= */

function updateForests()
{
    transformCluster(
        TILES.BOOM,
        TILES.BOS
    );
}

/* =========================
   DORP -> STAD
========================= */

function updateCities()
{
    transformCluster(
        TILES.DORP,
        TILES.STAD
    );
}

/* =========================
   FABRIEK -> INDUSTRIE
========================= */

function updateIndustry()
{
    transformCluster(
        TILES.FABRIEK,
        TILES.INDUSTRIETERREIN
    );
}

/* =========================
   ALLE SPECIALE TEGELS
========================= */

function updateSpecialTiles()
{
    updateForests();

    updateCities();

    updateIndustry();

    updateRoadNetwork();

    recalculateAllStats();
}

/* =========================
   ACHTERGRONDEN
========================= */

const backgrounds = {
    normaal: "images/Normaal.png",
    bio1: "images/Bio1.png",
    bio2: "images/Bio2.png",

    emissies1: "images/Emissies1.png",
    emissies2: "images/Emissies2.png",
    emissies3: "images/Emissies3.png"
};

let currentBackground =
    backgrounds.normaal;

function updateBackground()
{
    let target =
        backgrounds.normaal;

    /* emissies hebben prioriteit */

    if(stats.emissies >= 90)
    {
        target =
            backgrounds.emissies3;
    }
    else if(stats.emissies >= 75)
    {
        target =
            backgrounds.emissies2;
    }
    else if(stats.emissies >= 60)
    {
        target =
            backgrounds.emissies1;
    }
    else if(stats.biodiversiteit >= 80)
    {
        target =
            backgrounds.bio2;
    }
    else if(stats.biodiversiteit >= 60)
    {
        target =
            backgrounds.bio1;
    }

    if(target === currentBackground)
    {
        return;
    }

    currentBackground =
        target;

    document
        .getElementById(
            "backgroundLayer"
        )
        .style.backgroundImage =
        `url("${target}")`;
}

/* =========================
   OVERRIDE
========================= */

const originalRecalculate =
    recalculateAllStats;

recalculateAllStats =
function()
{
    originalRecalculate();

    updateBackground();
};

/* =========================
   KAN GROEP HIER?
========================= */

function canPlaceAnywhere()
{
    if(!currentGroup)
    {
        return false;
    }

    for(
        const hex
        of board.values()
    )
    {
        if(
            canPlaceGroup(
                hex.q,
                hex.r
            )
        )
        {
            return true;
        }
    }

    return false;
}

/* =========================
   WINCONTROLE
========================= */

function checkVictory()
{
    if(
        stats.biodiversiteit < 50 ||
        stats.gezondheid < 50 ||
        stats.inclusiviteit < 50 ||
        stats.eerlijkeKeten < 50 ||
        stats.betaalbaarheid < 50 ||
        stats.productie < 50
    )
    {
        return;
    }

    if(stats.emissies > 50)
    {
        return;
    }

    alert(
        "Gewonnen!"
    );

    gameEnded = true;
}

/* =========================
   BORD VOL
========================= */

const originalCheckGameState =
    checkGameState;

checkGameState =
function()
{
    originalCheckGameState();

    if(gameEnded)
    {
        return;
    }

    if(
        canPlaceAnywhere()
    )
    {
        return;
    }

    checkVictory();

    if(gameEnded)
    {
        return;
    }

   generateGroup();

if(canPlaceAnywhere())
{
    return;
}

alert(
    "Geen geldige zetten meer."
);

gameEnded = true;
};

/* =========================
   DEV MODE
========================= */

function createDevPanel()
{
    if(!devMode)
    {
        document
            .getElementById(
                "devPanel"
            )
            .style.display =
            "none";

        return;
    }

    const panel =
        document
        .getElementById(
            "devContent"
        );

    panel.innerHTML = "";

    const title =
        document.createElement(
            "h3"
        );

    title.textContent =
        "Developer";

    panel.appendChild(
        title
    );

    /* =====================
       TEGEL KIEZER
    ===================== */

    const tileSelect =
        document.createElement(
            "select"
        );

    [
        TILES.WEG,
        TILES.BOOM,
        TILES.WATER,
        TILES.LANDBOUW,
        TILES.BOERDERIJ,
        TILES.VISSERIJ,
        TILES.FABRIEK,
        TILES.DORP,
        TILES.AEC
    ]
    .forEach(
        tile =>
        {
            const option =
                document.createElement(
                    "option"
                );

            option.value =
                tile;

            option.textContent =
                tile;

            tileSelect.appendChild(
                option
            );
        }
    );

    panel.appendChild(
        tileSelect
    );

    const forceBtn =
        document.createElement(
            "button"
        );

    forceBtn.textContent =
        "Forceer tegel";

    forceBtn.onclick =
        () =>
        {
            currentGroup = {
                shape:
                [
                    [0,0]
                ],

                tiles:
                [
                    tileSelect.value
                ]
            };

            currentRotation = 0;

            updateGroupPreview();
        };

    panel.appendChild(
        forceBtn
    );

    panel.appendChild(
        document.createElement(
            "hr"
        )
    );

    /* =====================
       STATS
    ===================== */

    Object.keys(stats)
    .forEach(
        stat =>
        {
            const wrapper =
                document
                .createElement(
                    "div"
                );

            const label =
                document
                .createElement(
                    "label"
                );

            label.textContent =
                stat;

            const input =
                document
                .createElement(
                    "input"
                );

            input.type =
                "number";

            input.value =
                stats[stat];

            input.onchange =
                () =>
                {
                    stats[stat] =
                        Number(
                            input.value
                        );

                    clampStats();

                    updateBars();

                    updateBackground();
                };

            wrapper.appendChild(
                label
            );

            wrapper.appendChild(
                input
            );

            panel.appendChild(
                wrapper
            );
        }
    );
}

/* =========================
   INIT DEV
========================= */

createDevPanel();