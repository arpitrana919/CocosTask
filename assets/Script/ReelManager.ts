const { ccclass, property } = cc._decorator;

@ccclass
export default class ReelManager extends cc.Component {
    @property(cc.Node)
    reelContainer: cc.Node = null;

    @property(cc.Prefab)
    blockPrefab: cc.Prefab = null;

    @property(cc.Button)
    actionButton: cc.Button = null;

    private nodePool: cc.NodePool = new cc.NodePool();
    private isRunning: boolean = false;
    private intervalId: number = null;
    private currentNumber: number = 21;
    private colors: cc.Color[] = []; // Array of colors for the blocks

    onLoad() {
        this.initializeColors();
        for (let i = 19; i >= 0; i--) {
            const blockNode = this.createBlockNode(i + 1);
            this.reelContainer.addChild(blockNode);
        }

        // actionButton Event
        this.actionButton.node.on('click', this.toggleOperation, this);
        this.updateReelLayout();
    }

    initializeColors() {
        this.colors = [
            cc.Color.RED,
            cc.Color.GREEN,
            cc.Color.BLUE,
            cc.Color.YELLOW,
            cc.Color.MAGENTA,
            cc.Color.CYAN,
            cc.Color.ORANGE,
            cc.Color.GRAY,
            cc.Color.WHITE,
        ];
    }

    createBlockNode(number: number): cc.Node {
        let blockNode: cc.Node;
        if (this.nodePool.size() > 0) {
            blockNode = this.nodePool.get();
        } else {
            blockNode = cc.instantiate(this.blockPrefab);
        }

        // adding the bacground color to node
        blockNode.color = this.colors[number % this.colors.length]; // Cycle through colors

        // added Number on Label
        const label = blockNode.getComponentInChildren(cc.Label);
        label.string = number.toString();

        return blockNode;
    }

    toggleOperation() {
        if (this.isRunning) {
            this.stopOperation();
        } else {
            this.startOperation();
        }
    }

    startOperation() {
        this.isRunning = true;
        this.intervalId = setInterval(() => {
            this.removeBlockFromBottom();
            setTimeout(() => {
                this.addBlockToTopWithAnimation();
            }, 150);
        }, 300);
    }

    stopOperation() {
        this.isRunning = false;
        clearInterval(this.intervalId);
    }

    removeBlockFromBottom() {
        if (this.reelContainer.childrenCount > 0) {
            const lastChild = this.reelContainer.children[this.reelContainer.childrenCount - 1]; // Get the last child (bottommost)
            this.nodePool.put(lastChild);
            lastChild.removeFromParent(false);
        }
        this.updateReelLayout();
    }

    addBlockToTopWithAnimation() {
        const blockNode = this.createBlockNode(this.currentNumber++);
        blockNode.setPosition(cc.v3(0, this.reelContainer.height / 2 + blockNode.height, 0));
        this.reelContainer.insertChild(blockNode, 0);

        // adding tween effect while adding block
        cc.tween(blockNode)
            .to(0.3, { position: cc.v3(0, this.reelContainer.height / 2 - blockNode.height / 2, 0) }, { easing: 'sineOut' })
            .start();
        this.animateReelShift();
    }

    animateReelShift() {
        const children = this.reelContainer.children;
        const spacing = 20;
        const blockHeight = children.length > 0 ? children[0].height : 50;
        const totalContentHeight = children.length * blockHeight + (children.length - 1) * spacing;

        let yOffset = totalContentHeight / 2 - blockHeight / 2;
        children.forEach((child) => {
            cc.tween(child)
                .to(0.3, { position: cc.v3(0, yOffset, 0) }, { easing: 'sineOut' })
                .start();
            yOffset -= blockHeight + spacing;
        });
    }

    updateReelLayout() {
        const children = this.reelContainer.children;
        const spacing = 10;
        const blockHeight = children.length > 0 ? children[0].height : 50;
        const totalContentHeight = children.length * blockHeight + (children.length - 1) * spacing;

        let yOffset = totalContentHeight / 2 - blockHeight / 2;
        children.forEach((child) => {
            child.setPosition(0, yOffset);
            yOffset -= blockHeight + spacing;
        });
    }
}