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
    emissiereductie: 50,
    biodiversiteit: 50,
    gezondheid: 50,
    inclusiviteit: 50,
    eerlijkeKeten: 50,
    betaalbaarheid: 50,
    productie: 0
};

let previousStats = { ...stats };

let gameEnded = false;
let endCheckTimer = null;

/* =========================
   HEX INSTELLINGEN
========================= */

const HEX_RADIUS = 4;

const HEX_WIDTH = 84;
const HEX_HEIGHT = 96;

const boardElement =
    document.getElementById("hexBoard");

/* =========================
   SPELDATA
========================= */

const board = new Map();

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
    return DIRECTIONS
        .map(([dq, dr]) =>
            getHex(q + dq, r + dr)
        )
        .filter(Boolean);
}

/* =========================
   AXIAAL -> PIXEL
========================= */

function axialToPixel(q, r)
{
    const size = 48;

    return {
        x:
            size *
            Math.sqrt(3) *
            (q + r / 2),

        y:
            size * 1.5 * r
    };
}

/* =========================
   HEX AANMAKEN
========================= */

function createHexElement(hex)
{
    const div =
        document.createElement("div");

    div.classList.add("hex");
    div.classList.add("empty");

    const pos =
        axialToPixel(
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
    for(
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

        for(
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

    if(!hex)
        return;

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

function placeCanteen()
{
    placeTile(
        0,
        0,
        TILES.KANTINE
    );
}

/* =========================
   STAT HELPERS
========================= */

function resetStats()
{
    previousStats = { ...stats };
    stats.emissiereductie = 30;
    stats.biodiversiteit = 30;
    stats.gezondheid = 30;
    stats.inclusiviteit = 30;
    stats.eerlijkeKeten = 30;
    stats.betaalbaarheid = 30;
    stats.productie = 0;
}

function clampStats()
{
    Object.keys(stats).forEach(
        stat =>
        {
            const min =
                stat === "productie"
                    ? 0
                    : 0;

            const max =
                stat === "productie"
                    ? 999
                    : 100;

            stats[stat] =
                Math.max(
                    min,
                    Math.min(
                        max,
                        Math.round(stats[stat])
                    )
                );
        }
    );
}

function addStats(values)
{
    Object.entries(values)
        .forEach(
            ([stat, value]) =>
            {
                if(stats[stat] === undefined)
                    return;

                stats[stat] += value;
            }
        );
}

/* =========================
   PROGRESSBARS
========================= */

function updateBars()
{
    const emissiesLabel =
        document.querySelector(
            ".emissiesStat label"
        );

    if(emissiesLabel)
    {
        emissiesLabel.textContent =
            "Emissiereductie";
    }

    document.getElementById("emissiesBar").style.width =
        `${stats.emissiereductie}%`;

    document.getElementById("bioBar").style.width =
        `${stats.biodiversiteit}%`;

    document.getElementById("gezondheidBar").style.width =
        `${stats.gezondheid}%`;

    document.getElementById("inclusiviteitBar").style.width =
        `${stats.inclusiviteit}%`;

    document.getElementById("ketenBar").style.width =
        `${stats.eerlijkeKeten}%`;

    document.getElementById("betaalbaarheidBar").style.width =
        `${stats.betaalbaarheid}%`;

    document.getElementById("productieBar").style.width =
        `${Math.min(stats.productie, 100)}%`;


    document.getElementById("emissiesValue").textContent =
        stats.emissiereductie;

    document.getElementById("bioValue").textContent =
        stats.biodiversiteit;

    document.getElementById("gezondheidValue").textContent =
        stats.gezondheid;

    document.getElementById("inclusiviteitValue").textContent =
        stats.inclusiviteit;


    document.getElementById("ketenValue").textContent =
        stats.eerlijkeKeten;

    document.getElementById("betaalbaarheidValue").textContent =
        stats.betaalbaarheid;

    document.getElementById("productieValue").textContent =
        stats.productie;
}

/* =========================
   BASIS TEGELWAARDEN
========================= */

const BASE_TILE_STATS = {
    Kantine: {},

    Weg: {},

    Volleweg: {
        emissiereductie: -2,
        eerlijkeKeten: -1,
        betaalbaarheid: 1,
        productie: 1,
        inclusiviteit: 1
    },

    Boom: {
        biodiversiteit: 2,
        gezondheid: 1,
        emissiereductie: 1,
        betaalbaarheid: -1
    },

    Bos: {
        biodiversiteit: 6,
        gezondheid: 2,
        inclusiviteit: 1,
        emissiereductie: 3,
        productie: -1,
        betaalbaarheid: -2
    },

    Water: {
        biodiversiteit: 2,
        gezondheid: 1,
        eerlijkeKeten: -1,
        betaalbaarheid: -1
    },

    Land: {
        productie: 4,
        betaalbaarheid: 2,
        emissiereductie: -1,
        biodiversiteit: -1,
        inclusiviteit: 1,
        gezondheid: 1
    },

    Boerderij: {
        productie: 3,
        eerlijkeKeten: 2,
        gezondheid: 1,
        inclusiviteit: 2,
        emissiereductie: -1,
        betaalbaarheid: -1
    },

    Fabriek: {
        productie: 5,
        betaalbaarheid: 4,
        emissiereductie: -2,
        biodiversiteit: -2,
        gezondheid: -1,
        eerlijkeKeten: -2,
        inclusiviteit: -2
    },

    Industrie: {
        productie: 10,
        betaalbaarheid: 7,
        emissiereductie: -6,
        biodiversiteit: -5,
        gezondheid: -4,
        eerlijkeKeten: -4,
        inclusiviteit: -2
    },

    Slachterij: {
        productie: 6,
        betaalbaarheid: 4,
        emissiereductie: -6,
        biodiversiteit: -4,
        gezondheid: -3,
        eerlijkeKeten: -3,
        inclusiviteit: -1
    },

    AEC: {
        emissiereductie: 5,
        betaalbaarheid: 2,
        gezondheid: -1,
        biodiversiteit: -1
    },

    Dorp: {
        inclusiviteit: 3,
        gezondheid: 1,
        eerlijkeKeten: 1,
        productie: 1,
        emissiereductie: -1
    },

    Stad: {
        productie: 5,
        betaalbaarheid: 5,
        inclusiviteit: 5,
        emissiereductie: -5,
        biodiversiteit: -2,
        eerlijkeKeten: -1
    }
};


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

const GROUP_SHAPES = [
    [
        [0, 0],
        [1, 0]
    ],

    [
        [0, 0],
        [1, 0],
        [2, 0]
    ],

    [
        [0, 0],
        [1, 0],
        [0, 1]
    ],

    [
        [0, 0],
        [1, 0],
        [1, -1]
    ]
];

let currentGroup = null;
let currentRotation = 0;
let hoveredHex = null;
let lastGroupHadAEC = false;
let turnCount = 0;

/* =========================
   ROTATIE
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
   AEC REGEL
========================= */

function countTiles(tileType)
{
    let amount = 0;

    for(const hex of board.values())
    {
        if(hex.tile === tileType)
        {
            amount++;
        }
    }

    return amount;
}

function aecCanAppear()
{
    return countTiles(TILES.AEC) < 2;
}

function aecPlacementValid(q, r)
{
    const neighbours =
        getNeighbours(q, r);

    return !neighbours.some(
        n => n.tile === TILES.AEC
    );
}

/* =========================
   RANDOM TEGEL
========================= */

function getRandomTile(currentTiles = [])
{
    const pool = [
        TILES.WEG,
        TILES.WEG,

        TILES.BOOM,
        TILES.BOOM,

        TILES.WATER,

        TILES.LANDBOUW,
        TILES.LANDBOUW,

        TILES.BOERDERIJ,

        TILES.FABRIEK,

        TILES.DORP
    ];

    const aecCountOnBoard =
        countTiles(TILES.AEC);

    const groupAlreadyHasAEC =
        currentTiles.includes(TILES.AEC);

    const aecAllowed =
    turnCount >= 5 &&
    aecCountOnBoard < 2 &&
    !groupAlreadyHasAEC &&
    !lastGroupHadAEC;
        

    if(aecAllowed)
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
            getRandomTile(tiles)
        );
    }

    currentGroup = {
        shape,
        tiles
    };

    currentRotation = 0;

    updateGroupPreview();

    if(hoveredHex)
    {
        showHoverPreview(
            hoveredHex.q,
            hoveredHex.r
        );
    }
}

/* =========================
   PREVIEW LINKS
========================= */

function updateGroupPreview()
{
    const preview =
        document.getElementById(
            "groepPreview"
        );

    if(!preview)
        return;

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
                document.createElement("img");

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

            wrapper.appendChild(tile);
        }
    );

    preview.appendChild(wrapper);
}

/* =========================
   ROTEREN MET PIJLTJES
========================= */

document.addEventListener(
    "keydown",
    event =>
    {
        if(!currentGroup || gameEnded)
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
   PLAATSING HELPERS
========================= */

function isInsideBoard(q, r)
{
    return getHex(q, r) !== undefined;
}

function isEmptyHex(q, r)
{
    const hex = getHex(q, r);

    if(!hex)
        return false;

    return hex.tile === null;
}

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
            return true;
    }

    return false;
}

function canPlaceGroup(originQ, originR)
{
    if(!currentGroup || gameEnded)
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

    return touchesExistingNetwork(
        placements
    );
}

/* =========================
   PLAATSING INFO
========================= */

function getCurrentPlacements(originQ, originR)
{
    const shape =
        getRotatedShape();

    return shape.map(
        (offset, index) =>
        {
            return {
                q: originQ + offset[0],
                r: originR + offset[1],
                tile: currentGroup.tiles[index]
            };
        }
    );
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

    const placedTiles =
        getCurrentPlacements(
            originQ,
            originR
        );

    beginMessageBatch();

    for(const placed of placedTiles)
    {
        placeTile(
            placed.q,
            placed.r,
            placed.tile
        );
    }

    updateSpecialTiles();
    recalculateAllStats();
    showPlacementFeedback(placedTiles);

    endMessageBatch();

    turnCount++;

    generateGroup();

    scheduleEndCheck();
}

/* =========================
   VISUELE PREVIEW
========================= */

function clearHoverPreview()
{
    document
        .querySelectorAll(".placement-preview")
        .forEach(
            preview =>
            {
                preview.remove();
            }
        );
}

function showHoverPreview(originQ, originR)
{
    clearHoverPreview();

    if(!currentGroup || gameEnded)
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
                originQ + offset[0];

            const r =
                originR + offset[1];

            const pos =
                axialToPixel(q, r);

            const img =
                document.createElement("img");

            img.src =
                tileImages[
                    currentGroup.tiles[index]
                ];

            img.classList.add(
                "placement-preview"
            );

           img.style.left =
    `${pos.x + 350}px`;

img.style.top =
    `${pos.y + 300}px`;

            if(valid)
            {
                img.style.opacity = "0.80";
            }
            else
            {
                img.style.opacity = "0.55";
                img.style.filter =
                    "sepia(0.4) saturate(1.6) hue-rotate(-20deg)";
            }

            boardElement.appendChild(img);
        }
    );
}

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
   TEGEL TYPES HELPERS
========================= */

function isRoad(tile)
{
    return (
        tile === TILES.WEG ||
        tile === TILES.VOLLE_WEG
    );
}

function isNature(tile)
{
    return (
        tile === TILES.BOOM ||
        tile === TILES.BOS ||
        tile === TILES.WATER
    );
}

function isIndustry(tile)
{
    return (
        tile === TILES.FABRIEK ||
        tile === TILES.INDUSTRIETERREIN ||
        tile === TILES.SLACHTERIJ
    );
}

function isLogisticTile(tile)
{
    return (
        tile === TILES.KANTINE ||
        tile === TILES.WEG ||
        tile === TILES.VOLLE_WEG ||
        tile === TILES.BOERDERIJ ||
        tile === TILES.FABRIEK ||
        tile === TILES.INDUSTRIETERREIN ||
        tile === TILES.STAD ||
        tile === TILES.SLACHTERIJ
    );
}

function hasNeighbour(hex, tileType)
{
    return getNeighbours(
        hex.q,
        hex.r
    ).some(
        neighbour =>
            neighbour.tile === tileType
    );
}

function hasNeighbourIn(hex, tileTypes)
{
    return getNeighbours(
        hex.q,
        hex.r
    ).some(
        neighbour =>
            tileTypes.includes(
                neighbour.tile
            )
    );
}

function countNeighbours(hex, tileType)
{
    return getNeighbours(
        hex.q,
        hex.r
    ).filter(
        neighbour =>
            neighbour.tile === tileType
    ).length;
}

/* =========================
   AFSTAND TOT KANTINE
========================= */

function distanceToCanteen(startHex)
{
    const start =
        getHex(0, 0);

    if(!start || !startHex)
        return Infinity;

    const queue = [
        {
            hex: start,
            distance: 0
        }
    ];

    const visited =
        new Set();

    while(queue.length)
    {
        const current =
            queue.shift();

        const currentKey =
            key(
                current.hex.q,
                current.hex.r
            );

        if(visited.has(currentKey))
            continue;

        visited.add(currentKey);

        if(current.hex === startHex)
        {
            return current.distance;
        }

        const neighbours =
            getNeighbours(
                current.hex.q,
                current.hex.r
            );

        neighbours.forEach(
            neighbour =>
            {
                if(
                    neighbour.tile !== null &&
                    !visited.has(
                        key(
                            neighbour.q,
                            neighbour.r
                        )
                    )
                )
                {
                    queue.push({
                        hex: neighbour,
                        distance:
                            current.distance + 1
                    });
                }
            }
        );
    }

    return Infinity;
}

function distanceBetween(a, b)
{
    const dq = a.q - b.q;
    const dr = a.r - b.r;

    return (
        Math.abs(dq) +
        Math.abs(dr) +
        Math.abs(dq + dr)
    ) / 2;
}

/* =========================
   ROUTE VIA WEGEN
========================= */

function connectedByRoads(
    startHex,
    targetCheck
)
{
    const queue = [startHex];
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

        if(visited.has(currentKey))
            continue;

        visited.add(currentKey);

        if(
            current !== startHex &&
            targetCheck(current)
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
                    isRoad(neighbour.tile) ||
                    neighbour === startHex ||
                    targetCheck(neighbour)
                )
                {
                    queue.push(neighbour);
                }
            }
        );
    }

    return false;
}

function getRoadDistance(
    startHex,
    targetCheck
)
{
    const queue = [
        {
            hex: startHex,
            distance: 0
        }
    ];

    const visited =
        new Set();

    while(queue.length)
    {
        const current =
            queue.shift();

        const currentKey =
            key(
                current.hex.q,
                current.hex.r
            );

        if(visited.has(currentKey))
            continue;

        visited.add(currentKey);

        if(
            current.hex !== startHex &&
            targetCheck(current.hex)
        )
        {
            return current.distance;
        }

        const neighbours =
            getNeighbours(
                current.hex.q,
                current.hex.r
            );

        neighbours.forEach(
            neighbour =>
            {
                if(
                    isRoad(neighbour.tile) ||
                    neighbour === startHex ||
                    targetCheck(neighbour)
                )
                {
                    queue.push({
                        hex: neighbour,
                        distance:
                            current.distance + 1
                    });
                }
            }
        );
    }

    return Infinity;
}

/* =========================
   CLUSTERS
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

        if(visited.has(currentKey))
            continue;

        visited.add(currentKey);

        if(current.tile !== tileType)
            continue;

        cluster.push(current);

        const neighbours =
            getNeighbours(
                current.q,
                current.r
            );

        neighbours.forEach(
            neighbour =>
            {
                if(
                    neighbour.tile === tileType
                )
                {
                    queue.push(neighbour);
                }
            }
        );
    }

    return cluster;
}

function transformCluster(
    sourceTile,
    targetTile,
    message
)
{
    const visited =
        new Set();

    let transformed = false;

    for(const hex of board.values())
    {
        if(hex.tile !== sourceTile)
            continue;

        const cluster =
            findConnectedTiles(
                hex,
                sourceTile,
                visited
            );

        if(cluster.length < 3)
            continue;

        const amount =
            Math.floor(
                cluster.length / 3
            );

        let converted = 0;

        for(let i = 0; i < cluster.length; i++)
        {
            if(converted >= amount * 3)
                break;

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
            transformed = true;
        }
    }

    if(transformed && message)
    {
        showMessage(message);
    }

    return transformed;
}

function updateForests()
{
    return transformCluster(
        TILES.BOOM,
        TILES.BOS,
        "Er is een bos ontstaan. Grote natuurgebieden versterken biodiversiteit."
    );
}

function updateCities()
{
    return transformCluster(
        TILES.DORP,
        TILES.STAD,
        "Er is een stad ontstaan. Meer mensen krijgen toegang tot voedsel."
    );
}

function updateIndustry()
{
    return transformCluster(
        TILES.FABRIEK,
        TILES.INDUSTRIETERREIN,
        "Er is een industriegebied ontstaan. Productie stijgt, maar de milieudruk neemt toe."
    );
}

/* =========================
   WEGEN ACTIVEREN
========================= */

function floodFillRoads()
{
    const start =
        getHex(0, 0);

    if(!start)
        return;

    const queue = [start];
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

        if(visited.has(currentKey))
            continue;

        visited.add(currentKey);

        const neighbours =
            getNeighbours(
                current.q,
                current.r
            );

        neighbours.forEach(
            neighbour =>
            {
                if(neighbour.tile === TILES.WEG)
                {
                    neighbour.tile =
                        TILES.VOLLE_WEG;

                    placeTile(
                        neighbour.q,
                        neighbour.r,
                        TILES.VOLLE_WEG
                    );

                    queue.push(neighbour);
                }

                if(neighbour.tile === TILES.VOLLE_WEG)
                {
                    queue.push(neighbour);
                }
            }
        );
    }
}

function updateRoadNetwork()
{
    floodFillRoads();
}

/* =========================
   SPECIALE TEGELS UPDATEN
========================= */

function updateSpecialTiles()
{
    updateForests();
    updateCities();
    updateIndustry();

    updateRoadNetwork();
    updateSlaughterhouses();
}

/* =========================
   SLACHTERIJ
========================= */

function farmConnectedToFactory(farm)
{
    return connectedByRoads(
        farm,
        hex =>
            hex.tile === TILES.FABRIEK ||
            hex.tile === TILES.INDUSTRIETERREIN
    );
}

function updateSlaughterhouses()
{
    let changed = false;

    for(const hex of board.values())
    {
        if(hex.tile !== TILES.BOERDERIJ)
            continue;

        if(farmConnectedToFactory(hex))
        {
            hex.tile =
                TILES.SLACHTERIJ;

            placeTile(
                hex.q,
                hex.r,
                TILES.SLACHTERIJ
            );

            changed = true;
        }
    }

    if(changed)
    {
        showMessage(
            "Er is een slachterij ontstaan. Productie stijgt, maar ook de uitstoot neemt toe."
        );
    }
}

/* =========================
   BASISSTATS TOEPASSEN
========================= */

function applyBaseTileStats()
{
    for(const hex of board.values())
    {
        if(!hex.tile)
            continue;

        const values =
            BASE_TILE_STATS[hex.tile];

        if(values)
        {
            addStats(values);
        }
    }
}

/* =========================
   CONTEXTREGELS PER TEGEL
========================= */

function applyTreeRules(hex)
{
    if(
        hasNeighbourIn(
            hex,
            [
                TILES.FABRIEK,
                TILES.INDUSTRIETERREIN,
                TILES.SLACHTERIJ,
                TILES.AEC
            ]
        )
    )
    {
        addStats({
            biodiversiteit: -1,
            emissiereductie: -1
        });
    }
}

function applyForestRules(hex)
{
    if(hasNeighbour(hex, TILES.WATER))
    {
        addStats({
            biodiversiteit: 2
        });
    }

    if(
        hasNeighbourIn(
            hex,
            [
                TILES.FABRIEK,
                TILES.INDUSTRIETERREIN,
                TILES.SLACHTERIJ
            ]
        )
    )
    {
        addStats({
            biodiversiteit: -3
        });
    }
}

function applyWaterRules(hex)
{
    if(hasNeighbour(hex, TILES.LANDBOUW))
    {
        addStats({
            productie: 2,
            betaalbaarheid: 1,
            biodiversiteit: -1
        });
    }

    if(
        hasNeighbourIn(
            hex,
            [
                TILES.FABRIEK,
                TILES.INDUSTRIETERREIN,
                TILES.AEC
            ]
        )
    )
    {
        addStats({
            biodiversiteit: -3,
            gezondheid: -3
        });
    }
}

function applyAgricultureRules(hex)
{
    if(hasNeighbour(hex, TILES.WATER))
    {
        addStats({
            productie: 2,
            emissiereductie: -1
        });
    }

    if(
        hasNeighbourIn(
            hex,
            [
                TILES.BOOM,
                TILES.BOS
            ]
        )
    )
    {
        addStats({
            biodiversiteit: 1,
            gezondheid: 1,
            emissiereductie: 1
        });
    }

    const agricultureNeighbours =
        countNeighbours(
            hex,
            TILES.LANDBOUW
        );

    if(agricultureNeighbours > 0)
    {
        addStats({
            productie:
                agricultureNeighbours
        });
    }
}

function applyFarmRules(hex)
{
    const distance =
        distanceToCanteen(hex);

    if(distance <= 3)
    {
        addStats({
            eerlijkeKeten: 4,
            gezondheid: 1,
            emissiereductie: 1
        });

        showMessageOnce(
            "short-chain",
            "Er is een korte keten gevormd. Dit zorgt voor meer eerlijke keten."
        );
    }

    if(distance > 5 && distance < Infinity)
    {
        addStats({
            emissiereductie: -2,
            eerlijkeKeten: -2,
            betaalbaarheid: 1,
            productie: 1
        });

        showMessageOnce(
            "long-chain",
            "Lange keten gevormd. Meer transport zorgt voor extra uitstoot."
        );
    }

    if(hasNeighbour(hex, TILES.LANDBOUW))
    {
        addStats({
            productie: 2
        });
    }

    if(
        hasNeighbourIn(
            hex,
            [
                TILES.BOS,
                TILES.WATER
            ]
        )
    )
    {
        addStats({
            biodiversiteit: 1,
            gezondheid: 1
        });
    }
}

function applyFactoryRules(hex)
{
    if(hasNeighbour(hex, TILES.KANTINE))
    {
        addStats({
            gezondheid: -2,
            inclusiviteit: -2,
            betaalbaarheid: 1
        });
    }

    const distance =
        distanceToCanteen(hex);

    if(
        distance >= 4 &&
        !hasNeighbourIn(
            hex,
            [
                TILES.BOOM,
                TILES.BOS,
                TILES.WATER
            ]
        )
    )
    {
        addStats({
            gezondheid: 1
        });
    }

    if(hasNeighbour(hex, TILES.WATER))
    {
        showMessageOnce(
            "factory-water",
            "Fabrieken naast water schaadt de biodiversiteit."
        );
    }
}

function applyIndustryRules(hex)
{
    const distance =
        distanceToCanteen(hex);

    if(
        distance >= 4 &&
        !hasNeighbourIn(
            hex,
            [
                TILES.WATER,
                TILES.BOS
            ]
        )
    )
    {
        addStats({
            emissiereductie: 2,
            gezondheid: 1
        });
    }

}

function applySlaughterhouseRules(hex)
{
    if(
        hasNeighbourIn(
            hex,
            [
                TILES.DORP,
                TILES.STAD,
                TILES.KANTINE
            ]
        )
    )
    {
        addStats({
            gezondheid: -2,
            inclusiviteit: -2
        });
    }
}

function applyAECRules(hex)
{
    if(
        hasNeighbourIn(
            hex,
            [
                TILES.STAD,
                TILES.FABRIEK,
                TILES.INDUSTRIETERREIN
            ]
        )
    )
    {
        addStats({
            betaalbaarheid: 2,
            emissiereductie: 1
        });
    }

    if(
        hasNeighbourIn(
            hex,
            [
                TILES.BOS,
                TILES.WATER,
                TILES.BOERDERIJ
            ]
        )
    )
    {
        addStats({
            biodiversiteit: -4,
            gezondheid: -3
        });

    }
}

function applyVillageRules(hex)
{
    if(hasNeighbour(hex, TILES.BOERDERIJ))
    {
        addStats({
            eerlijkeKeten: 2,
            inclusiviteit: 1
        });
    }

    if(
        hasNeighbourIn(
            hex,
            [
                TILES.BOS,
                TILES.WATER
            ]
        )
    )
    {
        addStats({
            gezondheid: 1,
            inclusiviteit: 1
        });
    }

    if(
        hasNeighbourIn(
            hex,
            [
                TILES.FABRIEK,
                TILES.SLACHTERIJ,
                TILES.AEC
            ]
        )
    )
    {
        addStats({
            gezondheid: -2,
            inclusiviteit: -1
        });
    }
}

function applyCityRules(hex)
{
    if(
        hasNeighbourIn(
            hex,
            [
                TILES.BOS,
                TILES.WATER
            ]
        )
    )
    {
        addStats({
            gezondheid: 2,
            inclusiviteit: 1
        });

       
    }

    if(hasNeighbour(hex, TILES.INDUSTRIETERREIN))
    {
        addStats({
            betaalbaarheid: 2,
            gezondheid: -3,
            emissiereductie: -2
        });

    }
}

/* =========================
   MONOCULTUUR
========================= */

function applyMonocultureRules()
{
    const visited =
        new Set();

    for(const hex of board.values())
    {
        if(hex.tile !== TILES.LANDBOUW)
            continue;

        const cluster =
            findConnectedTiles(
                hex,
                TILES.LANDBOUW,
                visited
            );

        if(cluster.length >= 3)
        {
            addStats({
                productie: 5,
                betaalbaarheid: 2,
                emissiereductie: -3,
                biodiversiteit: -5,
                gezondheid: -2,
                eerlijkeKeten: -2
            });

            showMessageOnce(
                "monoculture",
                "Veel landbouw bij elkaar verhoogt de productie, maar schaadt de biodiversiteit."
            );
        }
    }
}

/* =========================
   LANGE ROUTES
========================= */

function applyLongRoadRules()
{
    const roads =
        [...board.values()]
        .filter(
            hex =>
                hex.tile === TILES.VOLLE_WEG
        );

    if(roads.length >= 5)
    {
        addStats({
            emissiereductie: -3,
            eerlijkeKeten: -3,
            betaalbaarheid: 1,
            productie: 2
        });
    }
}

/* =========================
   STAD ↔ STAD
========================= */

function citiesConnectedByRoad(cityA, cityB)
{
    return connectedByRoads(
        cityA,
        hex => hex === cityB
    );
}

function applyConnectedCitiesRules()
{
    const cities =
        [...board.values()]
        .filter(
            hex =>
                hex.tile === TILES.STAD
        );

    if(cities.length < 2)
    {
        return;
    }

    let connectedPairFound = false;

    for(let i = 0; i < cities.length; i++)
    {
        for(let j = i + 1; j < cities.length; j++)
        {
            if(
    citiesConnectedByRoad(
        cities[i],
        cities[j]
    )
    &&
    distanceBetween(
        cities[i],
        cities[j]
    ) > 1
)
            {
                connectedPairFound = true;
            }
        }
    }

    if(connectedPairFound)
    {
        addStats({
            productie: 6,
            betaalbaarheid: 5,
            emissiereductie: -6,
            eerlijkeKeten: -3,
            inclusiviteit: 2
        });
    }
}

/* =========================
   OVERPRODUCTIE
========================= */

function applyOverproductionRules()
{
    if(stats.productie > 101)
    {
       addStats({
    emissiereductie: -5,
    biodiversiteit: -4,
    eerlijkeKeten: -3,
    gezondheid: -2
});

        showMessageOnce(
            "overproduction",
            "Er is overproductie, dit zorgt voor verspilling."
        );
    }
}

/* =========================
   CONTEXTREGELS TOEPASSEN
========================= */

function applyContextRules()
{
    for(const hex of board.values())
    {
        if(!hex.tile)
            continue;

        if(hex.tile === TILES.BOOM)
        {
            applyTreeRules(hex);
        }

        if(hex.tile === TILES.BOS)
        {
            applyForestRules(hex);
        }

        if(hex.tile === TILES.WATER)
        {
            applyWaterRules(hex);
        }

        if(hex.tile === TILES.LANDBOUW)
        {
            applyAgricultureRules(hex);
        }

        if(hex.tile === TILES.BOERDERIJ)
        {
            applyFarmRules(hex);
        }

        if(hex.tile === TILES.FABRIEK)
        {
            applyFactoryRules(hex);
        }

        if(hex.tile === TILES.INDUSTRIETERREIN)
        {
            applyIndustryRules(hex);
        }

        if(hex.tile === TILES.SLACHTERIJ)
        {
            applySlaughterhouseRules(hex);
        }

        if(hex.tile === TILES.AEC)
        {
            applyAECRules(hex);
        }

        if(hex.tile === TILES.DORP)
        {
            applyVillageRules(hex);
        }

        if(hex.tile === TILES.STAD)
        {
            applyCityRules(hex);
        }
    }

    applyMonocultureRules();
    applyLongRoadRules();
    applyConnectedCitiesRules();
    applyOverproductionRules();
}

/* =========================
   VOLLEDIGE BEREKENING
========================= */

function recalculateAllStats()
{
    resetStats();

    
    applyBaseTileStats();
    applyContextRules();

    clampStats();
    updateBars();
    updateBackground();
}

/* =========================
   KAN GROEP ERGENS?
========================= */

function canPlaceAnywhere()
{
    if(!currentGroup)
        return false;

    const originalRotation =
        currentRotation;

    for(let rotation = 0; rotation < 6; rotation++)
    {
        currentRotation = rotation;

        for(const hex of board.values())
        {
            if(
                canPlaceGroup(
                    hex.q,
                    hex.r
                )
            )
            {
                currentRotation =
                    originalRotation;

                return true;
            }
        }
    }

    currentRotation =
        originalRotation;

    return false;
}
/* =========================
   EINDE SPEL CHECK
========================= */

function scheduleEndCheck()
{
    if(endCheckTimer)
    {
        clearTimeout(endCheckTimer);
    }

    endCheckTimer =
        setTimeout(
            () =>
            {
                checkGameState();
            },
            900
        );
}

function checkGameState()
{
    if(gameEnded)
        return;

    if(canPlaceAnywhere())
        return;

    showMessage(
        "Deze tegelgroep past nergens meer. Het spel wordt afgerond."
    );

    setTimeout(
        () =>
        {
            if(gameEnded)
                return;

            endGame();
        },
        1200
    );
}

/* =========================
   WINCONDITIE
========================= */

function getEndResults()
{
    return [

        {
            label: "Emissiereductie",
            value: stats.emissiereductie,
            target: 50,
            passed: stats.emissiereductie >= 50
        },
        {
            label: "Biodiversiteit",
            value: stats.biodiversiteit,
            target: 50,
            passed: stats.biodiversiteit >= 50
        },
        {
            label: "Gezondheid",
            value: stats.gezondheid,
            target: 50,
            passed: stats.gezondheid >= 50
        },
        {
            label: "Inclusiviteit",
            value: stats.inclusiviteit,
            target: 50,
            passed: stats.inclusiviteit >= 50
        },
   
        {
            label: "Eerlijke keten",
            value: stats.eerlijkeKeten,
            target: 50,
            passed: stats.eerlijkeKeten >= 50
        },
        {
            label: "Betaalbaarheid",
            value: stats.betaalbaarheid,
            target: 50,
            passed: stats.betaalbaarheid >= 50
        },
        {
            label: "Productie",
            value: stats.productie,
            target: 30,
            passed: stats.productie >= 30
        }
    ];
}

function playerWon()
{
    return getEndResults()
        .every(
            result => result.passed
        );
}

function endGame()
{
    if(gameEnded)
        return;

    gameEnded = true;

    clearHoverPreview();

    showEndScreen(
        playerWon(),
        getEndResults()
    );
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

let activeBackgroundLayer = "A";

function updateBackground()
{
    let target =
        backgrounds.normaal;

    if(stats.emissiereductie <= 10)
    {
        target = backgrounds.emissies3;
    }
    else if(stats.emissiereductie <= 20)
    {
        target = backgrounds.emissies2;
    }
    else if(stats.emissiereductie <= 30)
    {
        target = backgrounds.emissies1;
    }
    else if(stats.biodiversiteit >= 80)
    {
        target = backgrounds.bio2;
    }
    else if(stats.biodiversiteit >= 60)
    {
        target = backgrounds.bio1;
    }

    if(target === currentBackground)
        return;

    currentBackground = target;

    const currentLayer =
        document.getElementById(
            activeBackgroundLayer === "A"
                ? "backgroundLayerA"
                : "backgroundLayerB"
        );

    const nextLayer =
        document.getElementById(
            activeBackgroundLayer === "A"
                ? "backgroundLayerB"
                : "backgroundLayerA"
        );

    nextLayer.style.backgroundImage =
        `url("${target}")`;

    nextLayer.classList.add("active");
    currentLayer.classList.remove("active");

    activeBackgroundLayer =
        activeBackgroundLayer === "A"
            ? "B"
            : "A";
}

/* =========================
   MELDINGEN
========================= */

/* =========================
   MELDINGEN
========================= */

const shownMessages = new Set();

let messageBatch = null;

const MESSAGE_IMPORTANCE = {
    "bos": "high",
    "stad": "high",
    "industriegebied": "high",
    "slachterij": "high",
    "monocultuur": "high",
    "connected-cities": "high",
    "overproduction": "high",
    "short-chain": "high",
    "long-chain": "high",

    "factory-water": "medium",
    "industry-forest": "medium",
    "aec-nature": "medium",
    "industry-city": "medium",

    "agriculture-water": "low",
    "agriculture-forest": "low",
    "forest-water": "low",
    "city-nature": "low"
};

const MESSAGE_IMPACT = {
    "bos": 8,
    "stad": 8,
    "industriegebied": 9,
    "slachterij": 9,
    "monocultuur": 9,
    "connected-cities": 8,
    "overproduction": 9,
    "short-chain": 7,
    "long-chain": 7,

    "factory-water": 6,
    "industry-forest": 6,
    "aec-nature": 6,
    "industry-city": 7,

    "agriculture-water": 4,
    "agriculture-forest": 4,
    "forest-water": 3,
    "city-nature": 4
};

function clearMessageMemory()
{
    shownMessages.clear();
}

function beginMessageBatch()
{
    messageBatch = [];
}

function endMessageBatch()
{
    if(!messageBatch)
        return;

    const messages = [...messageBatch];

    messageBatch = null;

    if(messages.length === 0)
        return;

    const important =
        messages.filter(
            item =>
                item.importance === "high"
        );

    if(important.length > 0)
    {
        important.forEach(
            item =>
            {
                showMessageNow(item.message);
            }
        );

        return;
    }

    const best =
        messages.sort(
            (a, b) =>
                b.impact - a.impact
        )[0];

    if(best)
    {
        showMessageNow(best.message);
    }
}

function showMessageOnce(id, message)
{
    const realId =
        message === undefined
            ? id
            : id;

    const realMessage =
        message === undefined
            ? id
            : message;

    if(!realMessage)
        return;

    if(shownMessages.has(realId))
        return;

    shownMessages.add(realId);

    showMessage(realMessage, realId);
}

function showMessage(message, id = message)
{
    const importance =
        MESSAGE_IMPORTANCE[id] || "medium";

    const impact =
        MESSAGE_IMPACT[id] || 5;

    if(messageBatch)
    {
        messageBatch.push({
            id,
            message,
            importance,
            impact
        });

        return;
    }

    showMessageNow(message);
}

function showMessageNow(message)
{
    let container =
        document.getElementById("messageToast");

    if(!container)
    {
        container =
            document.createElement("div");

        container.id = "messageToast";

        document
            .getElementById("gameArea")
            .appendChild(container);
    }

    const item =
        document.createElement("div");

    item.className = "message-toast-item";
    item.textContent = message;

    container.appendChild(item);

    requestAnimationFrame(
        () =>
        {
            item.classList.add("is-visible");
        }
    );

    setTimeout(
        () =>
        {
            item.classList.remove("is-visible");

            setTimeout(
                () =>
                {
                    item.remove();
                },
                300
            );
        },
        4600
    );
}

/* =========================
   FEEDBACK NA PLAATSING
========================= */

function showPlacementFeedback(placedTiles)
{
    const placedTypes =
        placedTiles.map(
            tile => tile.tile
        );

    if(placedTypes.includes(TILES.LANDBOUW))
    {
        placedTiles.forEach(
            placed =>
            {
                const hex =
                    getHex(placed.q, placed.r);

            }
        );
    }

    for(const placed of placedTiles)
    {
        const hex =
            getHex(placed.q, placed.r);

        if(!hex)
            continue;

        if(
            hex.tile === TILES.BOS &&
            hasNeighbour(hex, TILES.WATER)
        )
        {
            showMessageOnce(
                "forest-water",
                "Natuur en water versterken elkaar."
            );
        }

        if(hex.tile === TILES.AEC)
{
    if(
        hasNeighbourIn(
            hex,
            [
                TILES.BOS,
                TILES.WATER,
                TILES.BOERDERIJ
            ]
        )
    )
    {
        showMessageOnce(
            "aec-nature",
            "De AEC beïnvloedt de biodiversiteit van de directe leefomgeving."
        );
    }
    else
    {
        showMessageOnce(
            "aec-placed",
            "De AEC verhoogt emissiereductie"
        );
    }
    }
    }
}

/* =========================
   BEGIN SCHERM
========================= */

function createStartScreen()
{
    const overlay =
        document.createElement("div");

    overlay.id =
        "startOverlay";

    const modal =
        document.createElement("div");

    modal.id =
        "startModal";

    modal.addEventListener(
        "click",
        event =>
        {
            event.stopPropagation();
        }
    );

    const title =
        document.createElement("h1");

    title.textContent =
        "Bouw een voedselsysteem";

    const text =
        document.createElement("p");

    text.className = "start-text";
    text.textContent =
        "Bouw een voedselsysteem rond de kantine en ontdek hoe alles met elkaar verbonden is.";

    const note =
        document.createElement("p");

    note.className = "start-note";
    note.textContent =
        "Je kunt direct beginnen. De spelregels zijn optioneel.";

    const buttons =
        document.createElement("div");

    buttons.className = "start-buttons";

    const startBtn =
        document.createElement("button");

    startBtn.className = "start-button start-button-primary";
    startBtn.textContent =
        "Begin";

    const rulesBtn =
        document.createElement("button");

    rulesBtn.className = "start-button start-button-secondary";
    rulesBtn.textContent =
        "Spelregels bekijken";

    function close()
    {
        overlay.remove();
    }

    startBtn.addEventListener(
        "click",
        close
    );

    overlay.addEventListener(
        "click",
        close
    );

    rulesBtn.addEventListener(
        "click",
        () =>
        {
            showRulesScreen();
        }
    );

    buttons.appendChild(startBtn);
    buttons.appendChild(rulesBtn);

    modal.appendChild(title);
    modal.appendChild(text);
    modal.appendChild(note);
    modal.appendChild(buttons);

    overlay.appendChild(modal);

    document.body.appendChild(overlay);
}

function showRulesScreen()
{
    let overlay =
        document.getElementById(
            "rulesOverlay"
        );

    if(overlay)
    {
        overlay.remove();
        return;
    }

    overlay =
        document.createElement("div");

    overlay.id =
        "rulesOverlay";

    const img =
        document.createElement("img");

    img.src =
        "images/spelregels.png";

    img.alt =
        "Spelregels";

    img.addEventListener(
        "click",
        event =>
        {
            event.stopPropagation();
        }
    );

    overlay.addEventListener(
        "click",
        () =>
        {
            overlay.remove();
        }
    );

    overlay.appendChild(img);

    document.body.appendChild(overlay);
}

document
    .getElementById("rulesBtnFixed")
    .addEventListener(
        "click",
        () => {
            showRulesScreen();
        }
    );

/* =========================
   EINDSCHERM
========================= */

function showEndScreen(won, results)
{
    const overlay =
        document.createElement("div");

    overlay.id =
        "endOverlay";

    const modal =
        document.createElement("div");

    modal.id =
        "endModal";

    const title =
        document.createElement("h1");

    title.textContent =
        won
            ? "Gewonnen!"
            : "Verloren!";

    const intro =
        document.createElement("p");

    intro.className = "end-intro";
    intro.textContent =
        won
            ? "Je voedselsysteem voldoet aan alle voorwaarden."
            : "Je voedselsysteem werkt nog niet goed genoeg. Bekijk hieronder waar het misging.";

    const list =
        document.createElement("div");

    list.className = "end-results";

    results.forEach(
        result =>
        {
            const row =
                document.createElement("div");

            row.className =
                result.passed
                    ? "end-result passed"
                    : "end-result failed";

            const label =
                document.createElement("span");

            label.textContent =
                result.label;

            const value =
                document.createElement("span");

            value.textContent =
                `${result.value} / ${result.target}`;

            row.appendChild(label);
            row.appendChild(value);

            list.appendChild(row);
        }
    );

    const link =
        document.createElement("a");

    link.href =
        "prototype.html";

    link.className = "end-tool-link";
    link.textContent =
        "Verder naar tool →";

    const restartBtn =
    document.createElement("button");

restartBtn.textContent =
    "Opnieuw spelen";

restartBtn.className =
    "end-restart-button";

restartBtn.addEventListener(
    "click",
    () =>
    {
        location.reload();
    }
);

modal.appendChild(title);
modal.appendChild(intro);
modal.appendChild(list);
modal.appendChild(restartBtn);
modal.appendChild(link);
    overlay.appendChild(modal);

    document.body.appendChild(overlay);
}

/* =========================
   INIT
========================= */

function init()
{
    generateBoard();

    placeCanteen();

    updateRoadNetwork();

    recalculateAllStats();

    generateGroup();

    setupBoardClicks();

    setupHoverEvents();

    updateBars();

    createStartScreen();
}

init();


