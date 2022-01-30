import { v4 as uuidv4 } from 'uuid';

export type Constructor<T extends {}> = new (...args: any[]) => T;

export interface IComponent {
  init(targetComponent: Phaser.GameObjects.GameObject): void;
  awake?: () => void;
  start?: () => void;
  update?: (dt: number) => void;
  destroy?: () => void;
}

export default class ComponentService {
  private componentsByGameObject = new Map<string, IComponent[]>();
  private queueForStart: IComponent[] = [];

  public clearComponent(targetObject: Phaser.GameObjects.GameObject) {
    if (this.componentsByGameObject.has(targetObject.name)) {
      const entries = this.componentsByGameObject.get(targetObject.name);

      if (!entries) {
        return;
      }
      for (const entry of entries) {
        if (entry.destroy) {
          entry.destroy!();
        }
      }
      // delete entry in our queue (so we dont waste memory checking for it)
      this.componentsByGameObject.delete(targetObject.name);
    }
  }

  public addComponent(
    targetObject: Phaser.GameObjects.GameObject,
    component: IComponent,
    autoChildrenCleanup: boolean = true
  ) {
    if (!targetObject.name) {
      // generate new unique id, if no name is set
      targetObject.name = uuidv4();
    }

    if (!this.componentsByGameObject.has(targetObject.name)) {
      this.componentsByGameObject.set(targetObject.name, []); // create new empty space in our Map, for our component
    }

    const list = this.componentsByGameObject.get(targetObject.name)!;
    list.push(component); // add new component to this game object's list

    component.init(targetObject); // initialize the component

    if (component.awake) {
      component.awake();
    }

    if (component.start) {
      this.queueForStart.push(component);
    }

    // if we want to automatically call the destroy method of all of our children, when the parent is destroyed...
    if (autoChildrenCleanup) {
      targetObject.addListener('destroy', () => {
        this.clearComponent(targetObject);
      });
    }
  }

  public findComponent<ComponentType>(
    targetObject: Phaser.GameObjects.GameObject,
    componentType: Constructor<ComponentType>
  ) {
    const components = this.componentsByGameObject.get(targetObject.name);
    if (!components) {
      return null;
    }
    return components.find((component) => component instanceof componentType);
  }

  public update(dt: number) {
    while (this.queueForStart.length > 0) {
      const component = this.queueForStart.shift();

      if (component?.start) {
        component?.start();
      }
    }
    const entries = this.componentsByGameObject.entries();
    for (const [, components] of entries) {
      components.forEach((component) => {
        if (component?.update) {
          component?.update(dt);
        }
      });
    }
  }

  public destroy() {
    const entries = this.componentsByGameObject.entries();
    for (const [, components] of entries) {
      components.forEach((component) => {
        if (component?.destroy) {
          component?.destroy();
        }
      });
    }
  }
}
