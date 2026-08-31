import * as THREE from 'three';

export class PlayerCharacter {
  public readonly group = new THREE.Group();

  // Articulated Limbs
  private headGroup = new THREE.Group();
  private torsoMesh!: THREE.Mesh;
  private leftArmPivot = new THREE.Group();
  private rightArmPivot = new THREE.Group();
  private leftLegPivot = new THREE.Group();
  private rightLegPivot = new THREE.Group();

  private walkCycleTime = 0;
  private currentYaw = 0;
  private targetYaw = 0;

  private geometries: THREE.BufferGeometry[] = [];
  private materials: THREE.Material[] = [];

  constructor() {
    this.group.name = 'PlayerCharacter';
    this.buildCharacterMesh();
  }

  private track<T extends THREE.BufferGeometry>(geo: T): T {
    this.geometries.push(geo);
    return geo;
  }

  private trackMat<T extends THREE.Material>(mat: T): T {
    this.materials.push(mat);
    return mat;
  }

  private buildCharacterMesh() {
    // Materials
    const skinMat = this.trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xffd1a4, // Warm Peach skin tone
        roughness: 0.5,
      })
    );
    const shirtMat = this.trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x2563eb, // Royal Blue Hoodie/Shirt
        roughness: 0.6,
      })
    );
    const pantsMat = this.trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x1e293b, // Dark Slate Denim Jeans
        roughness: 0.7,
      })
    );
    const shoesMat = this.trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xffffff, // White Sneakers
        roughness: 0.4,
      })
    );
    const hairMat = this.trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x3d2314, // Dark Brown Hair
        roughness: 0.8,
      })
    );
    const eyeMat = this.trackMat(
      new THREE.MeshBasicMaterial({ color: 0x111827 })
    );

    // 1. Torso
    const torsoGeo = this.track(new THREE.BoxGeometry(0.68, 0.75, 0.38));
    this.torsoMesh = new THREE.Mesh(torsoGeo, shirtMat);
    this.torsoMesh.position.set(0, 0.95, 0);
    this.torsoMesh.castShadow = true;
    this.torsoMesh.receiveShadow = true;
    this.group.add(this.torsoMesh);

    // 2. Head & Face
    this.headGroup.position.set(0, 1.55, 0);

    const headGeo = this.track(new THREE.BoxGeometry(0.52, 0.52, 0.52));
    const headMesh = new THREE.Mesh(headGeo, skinMat);
    headMesh.castShadow = true;
    this.headGroup.add(headMesh);

    // Hair Top
    const hairGeo = this.track(new THREE.BoxGeometry(0.56, 0.22, 0.56));
    const hairMesh = new THREE.Mesh(hairGeo, hairMat);
    hairMesh.position.set(0, 0.22, -0.02);
    hairMesh.castShadow = true;
    this.headGroup.add(hairMesh);

    // Eyes
    const eyeGeo = this.track(new THREE.BoxGeometry(0.08, 0.1, 0.04));
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.14, 0.04, 0.27);
    this.headGroup.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(0.14, 0.04, 0.27);
    this.headGroup.add(rightEye);

    this.group.add(this.headGroup);

    // 3. Arms (Pivot at shoulder)
    const armGeo = this.track(new THREE.BoxGeometry(0.22, 0.65, 0.24));
    armGeo.translate(0, -0.28, 0); // Offset geometry down from pivot

    this.leftArmPivot.position.set(-0.48, 1.25, 0);
    const leftArmMesh = new THREE.Mesh(armGeo, shirtMat);
    leftArmMesh.castShadow = true;
    this.leftArmPivot.add(leftArmMesh);
    this.group.add(this.leftArmPivot);

    this.rightArmPivot.position.set(0.48, 1.25, 0);
    const rightArmMesh = new THREE.Mesh(armGeo, shirtMat);
    rightArmMesh.castShadow = true;
    this.rightArmPivot.add(rightArmMesh);
    this.group.add(this.rightArmPivot);

    // 4. Legs (Pivot at hip)
    const legGeo = this.track(new THREE.BoxGeometry(0.28, 0.62, 0.3));
    legGeo.translate(0, -0.31, 0);

    const shoeGeo = this.track(new THREE.BoxGeometry(0.3, 0.16, 0.38));

    // Left Leg & Shoe
    this.leftLegPivot.position.set(-0.18, 0.62, 0);
    const leftLegMesh = new THREE.Mesh(legGeo, pantsMat);
    leftLegMesh.castShadow = true;
    this.leftLegPivot.add(leftLegMesh);

    const leftShoe = new THREE.Mesh(shoeGeo, shoesMat);
    leftShoe.position.set(0, -0.56, 0.04);
    leftShoe.castShadow = true;
    this.leftLegPivot.add(leftShoe);
    this.group.add(this.leftLegPivot);

    // Right Leg & Shoe
    this.rightLegPivot.position.set(0.18, 0.62, 0);
    const rightLegMesh = new THREE.Mesh(legGeo, pantsMat);
    rightLegMesh.castShadow = true;
    this.rightLegPivot.add(rightLegMesh);

    const rightShoe = new THREE.Mesh(shoeGeo, shoesMat);
    rightShoe.position.set(0, -0.56, 0.04);
    rightShoe.castShadow = true;
    this.rightLegPivot.add(rightShoe);
    this.group.add(this.rightLegPivot);
  }

  public setFacingAngle(targetAngle: number, dt: number) {
    this.targetYaw = targetAngle;
    let diff = this.targetYaw - this.currentYaw;
    while (diff > Math.PI) diff -= 2 * Math.PI;
    while (diff < -Math.PI) diff += 2 * Math.PI;

    this.currentYaw += diff * Math.min(1, 16 * dt);
    this.group.rotation.y = this.currentYaw;
  }

  public updateAnimation(speed: number, isGrounded: boolean, dt: number) {
    if (!isGrounded) {
      // Airborne Jump Pose: Arms up, slight leg kick
      this.leftArmPivot.rotation.x = -1.2;
      this.rightArmPivot.rotation.x = -1.2;
      this.leftLegPivot.rotation.x = 0.45;
      this.rightLegPivot.rotation.x = -0.25;
      this.torsoMesh.position.y = 0.98;
      this.headGroup.position.y = 1.58;
      return;
    }

    if (speed > 0.2) {
      // Running walk cycle
      const cycleSpeed = Math.min(14, 5.0 + speed * 1.8);
      this.walkCycleTime += dt * cycleSpeed;

      const swing = Math.sin(this.walkCycleTime) * 0.75;
      this.leftLegPivot.rotation.x = swing;
      this.rightLegPivot.rotation.x = -swing;

      this.leftArmPivot.rotation.x = -swing * 0.8;
      this.rightArmPivot.rotation.x = swing * 0.8;

      // Subtle torso bobbing
      const bob = Math.abs(Math.cos(this.walkCycleTime)) * 0.06;
      this.torsoMesh.position.y = 0.95 + bob;
      this.headGroup.position.y = 1.55 + bob;
    } else {
      // Idle Pose: Smoothly return to rest
      this.walkCycleTime = 0;
      this.leftLegPivot.rotation.x *= Math.max(0, 1 - 12 * dt);
      this.rightLegPivot.rotation.x *= Math.max(0, 1 - 12 * dt);
      this.leftArmPivot.rotation.x *= Math.max(0, 1 - 12 * dt);
      this.rightArmPivot.rotation.x *= Math.max(0, 1 - 12 * dt);
      this.torsoMesh.position.y = 0.95;
      this.headGroup.position.y = 1.55;
    }
  }

  public setPosition(x: number, y: number, z: number) {
    this.group.position.set(x, y, z);
  }

  public dispose() {
    for (const g of this.geometries) g.dispose();
    for (const m of this.materials) m.dispose();
    this.geometries = [];
    this.materials = [];
  }
}
