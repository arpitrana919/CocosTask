const { ccclass, property } = cc._decorator;

@ccclass
export default class SpritePrefab extends cc.Component {
    @property(cc.Label)
    numberLabel: cc.Label = null;

    private static counter: number = 0;

    onLoad() {
        this.node.width = 100;
        this.node.height = 100;
    }

    init(number?: number) {
        if (number !== undefined) {
            this.numberLabel.string = number.toString();
        } else {
            SpritePrefab.counter++;
            this.numberLabel.string = SpritePrefab.counter.toString();
        }

        // Set random color
        const color = this.getRandomColor();
        this.node.color = color;
    }

    showWithAnimation() {
        this.node.scale = 0;
        cc.tween(this.node)
            .to(0.3, { scale: 1 }, { easing: 'backOut' })
            .start();
    }

    hideWithAnimation(callback: Function) {
        cc.tween(this.node)
            .to(0.2, { scale: 0 }, { easing: 'backIn' })
            .call(() => {
                if (callback) callback();
            })
            .start();
    }

    private getRandomColor(): cc.Color {
        return new cc.Color(
            Math.random() * 255,
            Math.random() * 255,
            Math.random() * 255
        );
    }

    static resetCounter() {
        SpritePrefab.counter = 0;
    }
}