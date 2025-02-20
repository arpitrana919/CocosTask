const {ccclass, property} = cc._decorator;

@ccclass
export default class CircularMotion extends cc.Component {
 @property(cc.Boolean)
 isMoving: boolean = false;

 @property
 angle: number = 0;

 @property
 radius: number = 200;

 @property
 rotationSpeed: number = 2;

 @property(cc.Label)
 label: cc.Label = null;

 @property
 text: string = 'hello';
 // onLoad () {}

 start () {
     this.node.setPosition(this.radius, 0);
 }

 update(deltaTime: number) {
     if (this.isMoving) {
         this.angle += this.rotationSpeed * deltaTime;
         const x = Math.cos(this.angle) * this.radius;
         const y = Math.sin(this.angle) * this.radius;
         this.node.setPosition(cc.v2(x, y));  // Use cc.v2 for 2D position
     }
 }

 onButtonClick() {
     this.isMoving = !this.isMoving;
 }
}