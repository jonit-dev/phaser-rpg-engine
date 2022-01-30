import ComponentService from './ComponentService';

export class ComponentsScene extends Phaser.Scene {
  public components: ComponentService = new ComponentService();

  init() {
    this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.components.destroy();
    });
  }

  update(dt: number) {
    this.components.update(dt);
  }

  destroy() {
    this.components.destroy();
  }
}
