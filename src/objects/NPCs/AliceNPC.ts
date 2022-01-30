import { ComponentsScene } from '../../abstractions/ComponentsScene';
import { MainSceneData } from '../../constants/scenes/MainSceneData';
import { BaseNPC } from './BaseNPC';
import { NPCBody } from './components/NPCBody';

export class AliceNPC extends BaseNPC {
  constructor(scene: ComponentsScene, x: number, y: number, texture: string) {
    super(scene, x, y, texture, 'alice');

    this.scene.add.existing(this);

    scene.components.addComponent(this, new NPCBody(MainSceneData.assets.alice));
  }
}
