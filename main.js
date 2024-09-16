import * as THREE from "three";
import { gsap } from "gsap";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  innerWidth / innerHeight,
  0.1,
  1000
);
camera.position.z = 30;
camera.position.y = 12;
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
let lefRayCaster;
let rightRayCaster;
const group = new THREE.Group();
const bgImagesGroup = new THREE.Group();
let firstItemPosition = {},
  lastItemPosition = {};
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
const radius = 17;
const n = 13;
let totalRotation = 0;
const angleIncrement = ((90 / n) * Math.PI) / 180; // equally divide by twice the number of items to create full circle
let theta = (45 * Math.PI) / 180; // 45deg
let initialTheta = (45 * Math.PI) / 180; // 45deg
let lastTheta;
console.log("angleIncrement", angleIncrement);
console.log("theta", theta, theta * angleIncrement * n * 2);
let firstItemIndex = 0,
  lastItemIndex = n - 1;
const addWheelEvent = () => {
  addEventListener("wheel", (event) => {
    let delta = normalizeWheelSpeed(event);
    // console.log("delta", delta);
    const rotationAmount = delta / 100;
    const targetRotation = group.rotation.z - rotationAmount;
    totalRotation = parseFloat((totalRotation + targetRotation).toFixed(3));
    const rotationDifference = group.rotation.z - targetRotation;
    gsap.to(group.rotation, {
      z: targetRotation,
      ease: "power2.out",
      duration: 0.7,
      onComplete: () => {
        // scrollSpeed = 0;
      },
      // ease: "sine.inOut",
    });
    // console.log("targetRotation,lastTheta,initialTheta", targetRotation);
    // if (targetRotation < 0) {
    //   const val = parseFloat(
    //     (targetRotation % (angleIncrement * -1)).toFixed(2)
    //   );
    //   console.log(
    //     "targetRotation%(angleIncrement*-1)",
    //     (targetRotation % (angleIncrement * -1)).toFixed(2)
    //   );
    //   if (val == 0) {
    //     lastTheta += angleIncrement;
    //     totalRotation = 0;
    //     const x = radius * Math.cos(lastTheta);
    //     const y = radius * Math.sin(lastTheta);
    //     const firstItem = group.children[firstItemIndex];
    //     firstItem.position.set(x, y, 0);
    //     firstItem.rotation.set(0, 0, lastTheta - Math.PI / 2);
    //     firstItemIndex += 1;
    //     if (firstItemIndex >= n) {
    //       firstItemIndex = 0;
    //     }
    //   }
    // } else {
    //   const val = parseFloat((targetRotation % angleIncrement).toFixed(2));
    //   console.log(
    //     "targetRotation%(angleIncrement)",
    //     (targetRotation % angleIncrement).toFixed(2)
    //   );
    //   if (val == 0) {
    //     initialTheta -= angleIncrement;
    //     totalRotation = 0;
    //     const x = radius * Math.cos(initialTheta);
    //     const y = radius * Math.sin(initialTheta);
    //     const lastItem = group.children[lastItemIndex];
    //     lastItem.position.set(x, y, 0);
    //     lastItem.rotation.set(0, 0, initialTheta - Math.PI / 2);
    //     lastItemIndex -= 1;
    //     if (lastItemIndex < 0) {
    //       lastItemIndex = n - 1;
    //     }
    //   }
    // }
    let val = 0;
    if (totalRotation < 0) {
      val = parseFloat((totalRotation % (angleIncrement * -1)).toFixed(2));
    } else {
      val = parseFloat((totalRotation % angleIncrement).toFixed(2));
    }
    console.log("val", val);
    if (val == 0 && totalRotation < 0) {
      //left
      lastTheta += angleIncrement;
      totalRotation = 0;
      const x = radius * Math.cos(lastTheta);
      const y = radius * Math.sin(lastTheta);
      const firstItem = group.children[firstItemIndex];
      firstItem.position.set(x, y, 0);
      firstItem.rotation.set(0, 0, lastTheta - Math.PI / 2);
      firstItemIndex += 1;
      if (firstItemIndex >= n) {
        firstItemIndex = 0;
      }
    } else {
      if (val == 0) {
        //right

        initialTheta -= angleIncrement;
        totalRotation = 0;
        const x = radius * Math.cos(initialTheta);
        const y = radius * Math.sin(initialTheta);
        const lastItem = group.children[lastItemIndex];
        lastItem.position.set(x, y, 0);
        lastItem.rotation.set(0, 0, initialTheta - Math.PI / 2);
        lastItemIndex -= 1;
        if (lastItemIndex < 0) {
          lastItemIndex = n - 1;
        }
      }
    }
    // if (targetRotation < 0) {
    //   if ((targetRotation * -1) / angleIncrement >= 1) {
    //     console.log((targetRotation * -1) / angleIncrement);
    //     // targetRotation = 0;
    //     console.log("remove1");
    //   }
    // } else {
    //   if (targetRotation / angleIncrement >= 1) {
    //     console.log(targetRotation / angleIncrement);
    //     // targetRotation = 0;
    //     console.log("remove2");
    //   }
    // }
    // const intersects = rightRayCaster.intersectObjects(group.children);
    // console.log("intersects", intersects);
    // const intersects2 = lefRayCaster.intersectObjects(group.children);
    // console.log("intersects2", intersects2);
  });
};
function createCarouselItems() {
  // const startAngle = 0;
  // const endAngle = Math.PI * 2; // 360deg
  // const totalAngle = endAngle - startAngle;

  // const angleIncrement = ((90 / n) * Math.PI) / 180; // equally divide by twice the number of items to create full circle
  // let theta = (45 * Math.PI) / 180; // 90deg
  let x = 0;
  let y = 0;

  for (let i = 0; i < n; i++) {
    const planeGeometry = new THREE.PlaneGeometry(1.4, 2.0, 100, 100);
    let imgNumber = (i + 1) % n;
    if (imgNumber == 0) {
      imgNumber = n;
    }
    var texture = new THREE.TextureLoader().load(`image-${imgNumber}.png`);
    texture.encoding = THREE.sRGBEncoding;
    texture.colorSpace = THREE.SRGBColorSpace;
    const planeMaterial = new THREE.MeshPhongMaterial({
      // color: "#ff0000",
      flatShading: true,
      map: texture,
      side: THREE.DoubleSide,
    });
    const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
    x = radius * Math.cos(theta);
    y = radius * Math.sin(theta);
    planeMesh.rotation.set(0, 0, theta - Math.PI / 2);
    planeMesh.position.set(x, y, 0);
    if (i == 0) {
      firstItemPosition = {
        x,
        y,
        rotation: theta - Math.PI / 2,
      };
      const startDirection = new THREE.Vector3(
        -Math.sin(theta),
        Math.cos(theta),
        -1
      ).normalize();
      lefRayCaster = new THREE.Raycaster(
        new THREE.Vector3(x, y, -1),
        startDirection
      );
      scene.add(
        new THREE.ArrowHelper(
          lefRayCaster.ray.direction,
          lefRayCaster.ray.origin,
          10,
          0xff0000
        )
      );
    } else if (i == n - 1) {
      lastTheta = theta;
      lastItemPosition = {
        x,
        y,
        rotation: theta - Math.PI / 2,
      };
      const endDirection = new THREE.Vector3(
        -Math.sin(theta),
        Math.cos(theta),
        -1
      ).normalize();
      rightRayCaster = new THREE.Raycaster(
        new THREE.Vector3(x, y, -1),
        endDirection
      );
      scene.add(
        new THREE.ArrowHelper(
          rightRayCaster.ray.direction,
          rightRayCaster.ray.origin,
          10,
          0xff0000
        )
      );
    }
    planeMesh.castShadow = true;
    // const theta = startAngle + i * angleIncrement;
    theta += angleIncrement;
    group.add(planeMesh);
  }
  scene.add(group);
}
const mouse = {
  x: undefined,
  y: undefined,
};
function addMouseEvent() {
  addEventListener("mousemove", (e) => {
    mouse.x = (e.clientX / innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / innerHeight) * 2 + 1;
  });
}
function handlepPlaneHover() {
  // Raycaster checks intersection on plane and apply hover effect on mouse cursor
  // rayCaster.setFromCamera(mouse, camera);
  // const intersects = rayCaster.intersectObject(group);
  // const cursor = document.querySelector(".cursor");
  // const arrow = document.querySelector(".arrow:first-of-type");
  // const arrowRight = document.querySelector(".arrow:nth-of-type(2)");
  // if (intersects.length > 0) {
  //   cursor.style.height = "75px";
  //   cursor.style.width = "75px";
  //   arrow.style.marginLeft = "10px";
  //   arrowRight.style.marginRight = "10px";
  // } else {
  //   cursor.style.height = "63px";
  //   cursor.style.width = "63px";
  //   cursor.style.padding = "0px";
  //   arrow.style.marginLeft = "5px";
  //   arrowRight.style.marginRight = "5px";
  // }
}
function animate(ts) {
  requestAnimationFrame(animate);
  // carouselRotation(ts);
  // bgImageAnimation();
  // controls.update();
  renderer.render(scene, camera);
  handlepPlaneHover();
}
createCarouselItems();
addWheelEvent();
// createBGImages();
addMouseEvent();
animate(0);
