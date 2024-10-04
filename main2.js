import * as THREE from "three";
import { gsap } from "gsap";

const theme1 = [
  // "bg-1.jpeg",
  // "bg-1.jpeg",
  // "bg-1.jpeg",
  // "bg-1.jpeg",
  // "bg-1.jpeg",
  // "image-1.jpg",
  // "image-2.jpg",
  // "image-3.jpg",
  // "image-4.jpg",
  // "image-5.jpg",
  "Eco-system-at-risk1.png",
  "Eco-system-at-risk2.png",
  "Eco-system-at-risk3.png",

  // "Climate-Disaster2.png",
  // "Climate-Disaster3.png",
];
const theme2 = [
  // "bg-2.jpeg",
  // "bg-2.jpeg",
  // "bg-2.jpeg",
  // "bg-2.jpeg",
  // "bg-2.jpeg",
  // "image-6.jpg",
  // "image-7.jpg",
  // "image-8.jpg",
  // "image-9.jpg",
  // "image-10.jpg",
  "Climate-Disaster1.png",
  "Climate-Disaster2.png",
  "Climate-Disaster3.png",
  // "Carbon-footprint1.png",
  // "Carbon-footprint2.png",
];
const theme3 = [
  // "image-1.jpg",
  // "image-2.jpg",
  // "image-3.jpg",
  // "image-4.jpg",
  // "image-5.jpg",
  "Carbon-footprint1.png",
  "Carbon-footprint2.png",
  "Carbon-footprint3.png",
];

const themes = {
  theme1: theme1,
  theme2: theme2,
  theme3: theme3,
};
const textures = {
  theme1: [],
  theme2: [],
  theme3: [],
};
let currentTheme = "theme1";
const n = themes[currentTheme].length;
const nRepeat = n * 8;
for (let i = 0; i < nRepeat; i++) {
  let imgNumber = (i + 1) % n;
  if (imgNumber == 0) {
    imgNumber = n;
  }
  for (let key in themes) {
    let texture = new THREE.TextureLoader().load(themes[key][imgNumber - 1]);
    texture.encoding = THREE.sRGBEncoding;
    texture.colorSpace = THREE.SRGBColorSpace;
    textures[key].push(texture);
  }
}
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  innerWidth / innerHeight,
  0.1,
  1000
);
camera.position.z = 2; //2
camera.position.y = 9; //9
const renderer = new THREE.WebGLRenderer();
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(devicePixelRatio);
document.body.appendChild(renderer.domElement);
renderer.setClearColor(0xeeeeee, 1);
// const controls = new OrbitControls(camera, renderer.domElement);
// const axesHelper = new THREE.AxesHelper(10);
// scene.add(axesHelper);
// controls.update();

// ------- ADDING LIGHTS FOR SHADOW IN PLANES -----------
const light = new THREE.DirectionalLight(0xffffff, 10);
const lightPosition = new THREE.Vector3(0, 12, 1);
light.position.set(lightPosition.x, lightPosition.y, lightPosition.z);
const ambientLight = new THREE.AmbientLight(0xffffff, 2);
scene.add(light);
scene.add(ambientLight);

const rayCaster = new THREE.Raycaster();

const group = new THREE.Group();
const bgImagesGroup = new THREE.Group();
let disableWheel = false;
function normalizeWheelSpeed(event) {
  var normalized;
  if (event.wheelDelta) {
    normalized =
      (event.wheelDelta % 120) - 0 == -0
        ? event.wheelDelta / 120
        : event.wheelDelta / 12;
  } else {
    var rawAmmount = event.deltaY ? event.deltaY : event.detail;
    normalized = -(rawAmmount % 3 ? rawAmmount * 10 : rawAmmount / 3);
  }
  return normalized;
}
const radius = 9;

let totalRotation = 0;
const angleIncrement = (Math.PI * 2) / nRepeat; // equally divide by twice the number of items to create full circle

let theta = Math.PI / 2; // 45deg
let initialTheta = theta; // 45deg
console.log("initialTheta", initialTheta);
console.log("angleIncrement", angleIncrement);
let lastTheta;
let scrollSpeed = 0;
let waveFlag = true;
let firstItemIndex = 0,
  lastItemIndex = n - 1;
let scroll = 0;
let bgImgMap = {};
let isAnimating = false;
const addWheelEvent = () => {
  addEventListener("wheel", (event) => {
    if (disableWheel) return;
    // waveFlag = true;
    let delta = normalizeWheelSpeed(event);
    scroll = delta;
    // console.log("delta", delta);
    const rotationAmount = delta / 100;
    const targetRotation = group.rotation.z - rotationAmount;
    totalRotation = parseFloat((totalRotation + targetRotation).toFixed(3));
    const rotationDifference = group.rotation.z - targetRotation;
    scrollSpeed = delta * 30;
    gsap.to(group.rotation, {
      z: targetRotation,
      ease: "power2.out",
      duration: 0.7,
      onComplete: () => {
        // waveFlag = false;
      },
      // ease: "sine.inOut",
    });
    bgImagesGroup.children.forEach((e) => {
      isAnimating = true;
      let newX = e.position.x + rotationAmount * 10;
      if (e.uuid in bgImgMap) {
        bgImgMap[e.uuid].kill();
      }
      if (newX <= -12 + e.position.z - 0.5) {
        // If image goes out of view on -ve x reset it to end of +ve x
        if (e.uuid in bgImgMap) {
          // bgImgMap[e.uuid].kill();
        }
        newX = 12 - e.position.z;
        e.position.set(newX, e.position.y, e.position.z);
      } else if (newX >= 12 - e.position.z + 0.5) {
        // If image goes out of view on +ve x reset it to end of -ve x
        if (e.uuid in bgImgMap) {
          // bgImgMap[e.uuid].kill();
        }
        newX = -12 + e.position.z;
        e.position.set(newX, e.position.y, e.position.z);
      } else {
        if (e.uuid in bgImgMap) {
          // bgImgMap[e.uuid].kill();
        }
        const anim = gsap.to(e.position, {
          x: newX,
        });
        bgImgMap[e.uuid] = anim;
        // e.position.x = newX;
        // e.position.set(newX, e.position.y, e.position.z);
      }
      // gsap.to(e.position, {
      //   x: newX,
      //   overwrite: true,
      //   onComplete: () => {
      //     let currentX = bgImagesGroup.children
      //       .filter((i) => {
      //         return i.uuid == e.uuid;
      //       })
      //       .at(0).position.x;
      //     if (currentX <= -8 + e.position.z) {
      //       // If image goes out of view on -ve x reset it to end of +ve x
      //       currentX = 9 - e.position.z;
      //       e.position.set(currentX, e.position.y, e.position.z);
      //     } else if (currentX >= 9 - e.position.z) {
      //       // If image goes out of view on +ve x reset it to end of -ve x
      //       currentX = -8 + e.position.z;
      //       e.position.set(currentX, e.position.y, e.position.z);
      //     }
      //   },
      // });
    });
  });
};
function createCarouselItems() {
  console.log("First items");

  // const startAngle = 0;
  // const endAngle = Math.PI * 2; // 360deg
  // const totalAngle = endAngle - startAngle;

  // const angleIncrement = ((90 / n) * Math.PI) / 180; // equally divide by twice the number of items to create full circle
  // let theta = (45 * Math.PI) / 180; // 90deg
  let x = 0;
  let y = 0;

  for (let i = 0; i < nRepeat; i++) {
    const planeGeometry = new THREE.PlaneGeometry(1.4, 2.0, 100, 100);
    let imgNumber = (i + 1) % n;
    if (imgNumber == 0) {
      imgNumber = n;
    }
    // let texture = new THREE.TextureLoader().load(
    //   themes[currentTheme][imgNumber - 1]
    // );
    // texture.encoding = THREE.sRGBEncoding;
    // texture.colorSpace = THREE.SRGBColorSpace;
    const planeMaterial = new THREE.MeshPhongMaterial({
      // color: "#ff0000",
      flatShading: true,
      map: textures[currentTheme][i],
      side: THREE.DoubleSide,
    });
    const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
    x = radius * Math.cos(theta);
    y = radius * Math.sin(theta);
    planeMesh.rotation.set(0, 0, theta - Math.PI / 2);
    console.log(`${i} => x:${x}, y:${y}, rotation: ${theta - Math.PI / 2}`);
    planeMesh.position.set(x, y, 0);
    planeMesh.castShadow = true;
    if (i == nRepeat - 1) {
      lastTheta = theta;
    }
    // const theta = startAngle + i * angleIncrement;
    theta += angleIncrement;
    group.add(planeMesh);
  }
  scene.add(group);
}
const mouse = {
  x: 0,
  y: 0,
};
function addMouseEvent() {
  addEventListener("mousemove", (e) => {
    mouse.x = (e.clientX / innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / innerHeight) * 2 + 1;
  });
}
function createBGImages() {
  let minZ = 0,
    maxZ = -100000;
  for (let i = 0; i <= 70; i++) {
    let imgNumber = i % 10 == 0 ? 10 : i % 10;
    const texture = new THREE.TextureLoader().load(`bg-${imgNumber}.jpeg`);
    const z = Math.random() * -9.5 - 2;
    if (z < minZ) minZ = z;
    else if (z >= maxZ) maxZ = z;
    const geometry11 = new THREE.PlaneGeometry(1.2, 0.8, 16, 16);
    const material11 = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
    });
    const plane11 = new THREE.Mesh(geometry11, material11);
    plane11.position.set((Math.random() - 0.5) * 20, Math.random() * 10, z);
    bgImagesGroup.add(plane11);
  }

  // Change opacity of images based on the z value
  bgImagesGroup.children.forEach((e) => {
    let opacity = (e.position.z - minZ) / (maxZ - minZ);
    if (opacity < 0.1) opacity = 0.1;
    if (opacity >= 1) opacity = 0.7;
    e.material.opacity = opacity;
  });
  scene.add(bgImagesGroup);
}
function bgImageAnimation() {
  // ------- CONTINUOUSLY MOVE BACKGROUND IMAGES ON Y AXIS --------
  bgImagesGroup.children.forEach((e) => {
    let newY = e.position.y + 0.005;
    // If image moves out of view from top add back to bottom
    if (newY >= 10.8 - e.position.z) newY = 7 + e.position.z;
    e.position.set(e.position.x, newY, e.position.z);
  });
}
function handlepPlaneHover() {
  // Raycaster checks intersection on plane and apply hover effect on mouse cursor
  rayCaster.setFromCamera(mouse, camera);
  const intersects = rayCaster.intersectObject(group);
  const cursor = document.querySelector(".cursor");
  const arrow = document.querySelector(".arrow:first-of-type");
  const arrowRight = document.querySelector(".arrow:nth-of-type(2)");
  if (intersects.length > 0) {
    cursor.style.height = "75px";
    cursor.style.width = "75px";
    arrow.style.marginLeft = "10px";
    arrowRight.style.marginRight = "10px";
  } else {
    cursor.style.height = "63px";
    cursor.style.width = "63px";
    cursor.style.padding = "0px";
    arrow.style.marginLeft = "5px";
    arrowRight.style.marginRight = "5px";
  }
}
function animate(ts) {
  requestAnimationFrame(animate);
  // if (waveFlag) {
  group.children.forEach((e) => {
    const positions = e.geometry.attributes.position.array;
    const numVertices = positions.length / 3;
    for (let i = 0; i < numVertices; i++) {
      const x = positions[i * 3];
      const y = positions[i * 3 + 1];
      const zIndex = i * 3 + 2;
      const flutter = Math.sin((x + y) * 3 + ts / 300) * 0.02;
      positions[zIndex] = flutter;
    }
    e.geometry.attributes.position.needsUpdate = true;
  });
  // }
  // carouselRotation(ts);
  bgImageAnimation();
  // controls.update();
  renderer.render(scene, camera);

  handlepPlaneHover();
}
createCarouselItems();
addWheelEvent();
createBGImages();
addMouseEvent();
animate(0);
const changePlanes2 = () => {
  let toRemove = [];
  group.children.forEach((e, i) => {
    if (i >= 3 && i < 21) {
      toRemove.push(e);
    }
  });
  toRemove.forEach((e) => {
    group.remove(e);
  });
  group.children.forEach((e, i) => {
    const x = radius * Math.cos(initialTheta);
    const y = radius * Math.sin(initialTheta);
    gsap.to(e.position, {
      x,
      y,
      z: (i / 10) * -1,
      ease: "power2.inOut",
      duration: 0.7,
    });
    console.log("e.rotation.z", e.rotation.z);
    gsap.to(e.rotation, {
      x: 0,
      y: 0,
      z: i < 3 ? 0 : e.rotation.z < Math.PI ? 0 : Math.PI * 2,
      ease: "power2.inOut",
      duration: 0.7,
    });
  });

  setTimeout(() => {
    toRemove = [];
    group.children.forEach((e, i) => {
      if (i >= 3) {
        toRemove.push(e);
      }
    });
    toRemove.forEach((e) => {
      group.remove(e);
    });
    toRemove = group.children.map((e) => e);
    let idx = group.children.length;
    for (let i = 0; i < nRepeat; i++) {
      let imgNumber = (i + 1) % n;
      if (imgNumber == 0) {
        imgNumber = n;
      }
      // e.children.forEach((child) => e.remove(child));
      // let texture = new THREE.TextureLoader().load(
      //   themes[currentTheme][imgNumber - 1]
      // );
      // texture.center = new THREE.Vector2(0.5, 0.5);
      // texture.encoding = THREE.sRGBEncoding;
      // texture.colorSpace = THREE.SRGBColorSpace;
      const planeGeometry = new THREE.PlaneGeometry(1.4, 2.0, 100, 100);
      const planeMaterial = new THREE.MeshPhongMaterial({
        // color: "#ff0000",
        flatShading: true,
        map: textures[currentTheme][i],
        side: THREE.DoubleSide,
      });
      // i++;
      // if (i >= newTheme.length) {
      //   i = 0;
      // }
      const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
      const x = radius * Math.cos(initialTheta);
      const y = radius * Math.sin(initialTheta);
      planeMesh.position.set(x, y, (idx / 10) * -1);
      idx++;
      // planeMesh.rotation.set(0, group.rotation.y + Math.PI, 0);
      group.add(planeMesh);
      // let texture = new THREE.TextureLoader().load(`image-${i}.png`);
      // texture.encoding = THREE.sRGBEncoding;
      // texture.colorSpace = THREE.SRGBColorSpace;
      // i++;
      // if (i == 11) {
      //   i = 6;
      // }
      // e.material.map = texture;
    }
    gsap.to(
      {},
      {
        onComplete: () => {
          toRemove.forEach((e, i) => {
            gsap.to(e.position, {
              x: 10,
              y: 10,
              z: 5,
              duration: 5,
              delay: i * 0.2,
              immediateRender: false,
              overwrite: true,
            });
            gsap.to(e.rotation, {
              x: Math.PI / 3,
              y: Math.PI / 4,
              z: Math.PI / 4,
              duration: 1,
              delay: i * 0.2,
              immediateRender: false,
              overwrite: true,
            });
          });
        },
      }
    );

    setTimeout(() => {
      toRemove.forEach((e) => group.remove(e));
      let newTheta = initialTheta;
      // console.log("group.children", group.children);
      console.log("Setting new items");
      for (let i = 0; i < nRepeat; i++) {
        // console.log("i", i);
        // console.log("group.children[i]", group.children[i]);
        let x = radius * Math.cos(newTheta);
        let y = radius * Math.sin(newTheta);
        console.log(
          `${i} => x:${x}, y:${y},newth =>${newTheta}, rotation: ${
            newTheta - Math.PI / 2
          }`
        );
        if (i < 5 || i > 20) {
          gsap.to(group.children[i].position, {
            x,
            y,
            z: 0,
            duration: 1,
          });
          gsap.to(group.children[i].rotation, {
            x: 0,
            y: 0,
            z:
              newTheta > Math.PI * 2
                ? newTheta - Math.PI * 2 - Math.PI / 2
                : newTheta - Math.PI / 2,
            duration: 1,
          });
        } else {
          group.children[i].position.set(x, y, 0);
          group.children[i].rotation.set(0, 0, newTheta - Math.PI / 2);
        }
        // e.rotation.set(0, 0, newTheta - Math.PI / 2);
        // e.position.set(x, y, 0);
        newTheta += angleIncrement;
      }
      setTimeout(() => {
        disableWheel = false;
      }, 1000);
    }, 1500);
  }, 700);
};
const changePosters = (newTheme) => {
  currentTheme = newTheme;
  // waveFlag = false;
  disableWheel = true;
  gsap.to(group.rotation, {
    z: group.rotation.z > Math.PI * 2 ? Math.PI * 2 : 0,
    ease: "power1.inOut",
    duration: 1,
    onComplete: changePlanes2,
  });
};
const button = document.getElementById("theme1");
const button2 = document.getElementById("theme2");
const button3 = document.getElementById("theme3");
button.onclick = () => {
  if (currentTheme == "theme1") return;
  changePosters("theme1");
};
button2.onclick = () => {
  if (currentTheme == "theme2") return;
  changePosters("theme2");
};
button3.onclick = () => {
  if (currentTheme == "theme3") return;
  changePosters("theme3");
};
let isDragging = false;
let previousMousePosition = {
  x: 0,
  y: 0,
};
function onPointerDown(event) {
  if (disableWheel) return;
  isDragging = true;
  previousMousePosition = {
    x: event.clientX || event.touches[0].clientX,
    y: event.clientY || event.touches[0].clientY,
  };
}

// Function to handle mouse move or touch move
function onPointerMove(event) {
  if (!isDragging) return;

  let currentMousePosition = {
    x: event.clientX || event.touches[0].clientX,
    y: event.clientY || event.touches[0].clientY,
  };

  let deltaMove = {
    x: currentMousePosition.x - previousMousePosition.x,
    y: currentMousePosition.y - previousMousePosition.y,
  };

  // Rotate the group based on mouse movement
  const rotationSpeed = 0.001;
  // group.rotation.z -= deltaMove.x * rotationSpeed;
  gsap.to(group.rotation, {
    z: group.rotation.z - deltaMove.x * 0.005,
    duration: 1,
  });

  previousMousePosition = currentMousePosition;
}

function onPointerUp() {
  isDragging = false;
}

window.addEventListener("mousedown", onPointerDown, false);
window.addEventListener("mousemove", onPointerMove, false);
window.addEventListener("mouseup", onPointerUp, false);

window.addEventListener("touchstart", onPointerDown, false);
window.addEventListener("touchmove", onPointerMove, false);
window.addEventListener("touchend", onPointerUp, false);
