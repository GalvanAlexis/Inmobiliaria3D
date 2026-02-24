const fs = require("fs");
const path = require("path");

function generateRoom(roomName, baseColor, texts) {
  const dir = path.join(__dirname, "public", roomName);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const faces = [
    { name: "px", color: `hsl(${baseColor}, 70%, 80%)`, text: texts[0] },
    { name: "nx", color: `hsl(${baseColor}, 70%, 70%)`, text: texts[1] },
    { name: "py", color: `hsl(${baseColor}, 70%, 90%)`, text: texts[2] },
    { name: "ny", color: `hsl(${baseColor}, 70%, 60%)`, text: texts[3] },
    { name: "pz", color: `hsl(${baseColor}, 70%, 85%)`, text: texts[4] },
    { name: "nz", color: `hsl(${baseColor}, 70%, 75%)`, text: texts[5] },
  ];

  faces.forEach((face) => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512">
            <rect width="100%" height="100%" fill="${face.color}"/>
            <text x="50%" y="50%" font-family="Arial" font-size="50" font-weight="bold" fill="black" text-anchor="middle" dominant-baseline="middle">${face.text}</text>
            <rect width="100%" height="100%" fill="none" stroke="black" stroke-width="10"/>
        </svg>`;
    fs.writeFileSync(path.join(dir, `${face.name}.svg`), svg);
  });
  console.log(`Mock cubemap generated in public/${roomName}/`);
}

// Room 1: Bedroom (Redish)
generateRoom("room1", 0, [
  "R1 RIGHT",
  "R1 LEFT",
  "R1 TOP",
  "R1 BOTTOM",
  "R1 BACK",
  "R1 FRONT",
]);
// Room 2: Bathroom (Blueish)
generateRoom("room2", 200, [
  "R2 RIGHT",
  "R2 LEFT",
  "R2 TOP",
  "R2 BOTTOM",
  "R2 BACK",
  "R2 FRONT",
]);
