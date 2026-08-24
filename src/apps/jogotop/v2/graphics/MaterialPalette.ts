import * as THREE from 'three';
import { ResourceRegistry } from './ResourceRegistry';

export class MaterialPalette {
  public readonly vertexColorBasic: THREE.MeshBasicMaterial;
  public readonly vertexColorDoubleSide: THREE.MeshBasicMaterial;

  // Character Palette
  public readonly skin: THREE.MeshBasicMaterial;
  public readonly skinDark: THREE.MeshBasicMaterial;
  public readonly hoodieRed: THREE.MeshBasicMaterial;
  public readonly hoodieDark: THREE.MeshBasicMaterial;
  public readonly capRed: THREE.MeshBasicMaterial;
  public readonly capDark: THREE.MeshBasicMaterial;
  public readonly capVisor: THREE.MeshBasicMaterial;
  public readonly white: THREE.MeshBasicMaterial;
  public readonly cream: THREE.MeshBasicMaterial;
  public readonly hair: THREE.MeshBasicMaterial;
  public readonly eyeBrown: THREE.MeshBasicMaterial;
  public readonly pupilBlack: THREE.MeshBasicMaterial;
  public readonly pants: THREE.MeshBasicMaterial;
  public readonly pantsDark: THREE.MeshBasicMaterial;
  public readonly pack: THREE.MeshBasicMaterial;
  public readonly packDark: THREE.MeshBasicMaterial;
  public readonly matRoll: THREE.MeshBasicMaterial;
  public readonly gold: THREE.MeshBasicMaterial;
  public readonly metal: THREE.MeshBasicMaterial;
  public readonly blush: THREE.MeshBasicMaterial;
  public readonly mouth: THREE.MeshBasicMaterial;

  // World & Props
  public readonly grassInner: THREE.MeshBasicMaterial;
  public readonly grassOuter: THREE.MeshBasicMaterial;
  public readonly waterPond: THREE.MeshBasicMaterial;
  public readonly waterFountain: THREE.MeshBasicMaterial;
  public readonly fountainJet: THREE.MeshBasicMaterial;
  public readonly lampBulb: THREE.MeshBasicMaterial;
  public readonly dust: THREE.MeshBasicMaterial;

  private basicCache = new Map<number, THREE.MeshBasicMaterial>();

  constructor(registry: ResourceRegistry) {
    const basic = (color: number) => {
      const m = new THREE.MeshBasicMaterial({ color });
      registry.trackMaterial(m);
      return m;
    };

    this.vertexColorBasic = registry.trackMaterial(new THREE.MeshBasicMaterial({ vertexColors: true }));
    this.vertexColorDoubleSide = registry.trackMaterial(
      new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.DoubleSide })
    );

    // Character
    this.skin = basic(0xffd4a8);
    this.skinDark = basic(0xf2ba87);
    this.hoodieRed = basic(0xe53935);
    this.hoodieDark = basic(0xc62828);
    this.capRed = basic(0xdb3434);
    this.capDark = basic(0x9e1e1e);
    this.capVisor = basic(0xd32f2f);
    this.white = basic(0xffffff);
    this.cream = basic(0xfaf0e4);
    this.hair = basic(0x3e2723);
    this.eyeBrown = basic(0x4a2810);
    this.pupilBlack = basic(0x111318);
    this.pants = basic(0x283863);
    this.pantsDark = basic(0x1e284a);
    this.pack = basic(0xa66c38);
    this.packDark = basic(0x7c4e22);
    this.matRoll = basic(0x26a69a);
    this.gold = basic(0xffc107);
    this.metal = basic(0xdfe6e9);
    this.blush = basic(0xff8a80);
    this.mouth = basic(0x9c3826);

    // World
    this.grassInner = basic(0x44b33a);
    this.grassOuter = basic(0x3aa830);
    this.waterPond = basic(0x1dbfd8);
    this.waterFountain = basic(0x18c8e6);
    this.fountainJet = basic(0xd6f7ff);
    this.lampBulb = basic(0xfff3cf);
    this.dust = basic(0xe0d2b4);
  }

  public getSolidBasic(color: number, registry: ResourceRegistry): THREE.MeshBasicMaterial {
    let m = this.basicCache.get(color);
    if (!m) {
      m = registry.trackMaterial(new THREE.MeshBasicMaterial({ color }));
      this.basicCache.set(color, m);
    }
    return m;
  }
}
