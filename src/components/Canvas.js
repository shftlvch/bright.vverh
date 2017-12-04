import React, {Component} from "react";
import PropTypes from "prop-types";
import * as PIXI from "pixi.js";
import sprite from "../assets/icons/png/001-sad-1.png";

export default class Canvas extends Component {

    /**
     * Define our prop types
     **/
    static propTypes = {
        zoomLevel: PropTypes.number.isRequired
    };

    constructor(props) {
        super(props);

        //bind our animate function
        this.animate = this.animate.bind(this);
        //bind our zoom function
        this.updateZoomLevel = this.updateZoomLevel.bind(this);
    }

    /**
     * In this case, componentDidMount is used to grab the canvas container ref, and
     * and hook up the PixiJS renderer
     **/
    componentDidMount() {
        let windowSize = {
            width: window.innerWidth,
            height: window.innerHeight
        };
        //Setup PIXI Canvas in componentDidMount
        this.renderer = PIXI.autoDetectRenderer(0, 0, {
            resolution: 1,
            // view: document.getElementById("canvas"),
            backgroundColor: 0x4c5656,
            // antialias: false
        });
        this.renderer.autoResize = true;
        this.renderer.view.style.position = "absolute";
        this.renderer.view.style.display = "block";
        this.renderer.autoResize = true;
        this.renderer.resize(window.innerWidth, window.innerHeight);

        this.refs.gameCanvas.appendChild(this.renderer.view);

        // create the root of the scene graph
        this.stage = new PIXI.Container();

        this.stage.width = windowSize.width;
        this.stage.height = windowSize.height;


        let graphics = new PIXI.Graphics();

        graphics.lineStyle(10, 0xffd900, 1);
        graphics.moveTo(0, windowSize.height);
        graphics.quadraticCurveTo(this.renderer.width / 2, this.renderer.height / 2, this.renderer.width, this.renderer.height);

        // graphics.endFill();
        this.stage.addChild(graphics);

        let circle = new PIXI.Graphics();
        circle.lineStyle(2, 0xffd900, 1);
        circle.beginFill(0x9966FF);
        circle.drawCircle(this.renderer.width / 2, this.renderer.height, this.renderer.height / 2);

        circle.endFill();
        this.stage.addChild(circle);


        let vOffset = 40,
        hOffset = 50;

        let texture = PIXI.Texture.fromImage(sprite);
        // Create a 5x5 grid of bunnies
        let icon = new PIXI.Sprite(texture);
        icon.anchor.set(0.5);
        icon.x = 0+hOffset;
        icon.y = this.renderer.height-vOffset;
        icon.scale.x = .4;
        icon.scale.y = .4;
        this.stage.addChild(icon);

        // Center on the screen
        // this.stage.x = (this.renderer.width - this.stage.width) / 2;
        // this.stage.y = (this.renderer.height - this.stage.height) / 2;


        //start the game
        this.animate();
    }

    /**
     * shouldComponentUpdate is used to check our new props against the current
     * and only update if needed
     **/
    shouldComponentUpdate(nextProps, nextState) {
        //this is easy with 1 prop, using Immutable helpers make
        //this easier to scale

        return nextProps.zoomLevel !== this.props.zoomLevel;
    }

    /**
     * When we get new props, run the appropriate imperative functions
     **/
    componentWillReceiveProps(nextProps) {
        this.updateZoomLevel(nextProps);
    }

    /**
     * Update the stage "zoom" level by setting the scale
     **/
    updateZoomLevel(props) {
        // this.stage.scale.x = props.zoomLevel;
        // this.stage.scale.y = props.zoomLevel;
        this.stage.rotation = props.zoomLevel;
    }

    /**
     * Animation loop for updating Pixi Canvas
     **/
    animate() {
        // render the stage container
        this.renderer.render(this.stage);
        this.frame = requestAnimationFrame(this.animate);
    }

    /**
     * Render our container that will store our PixiJS game canvas. Store the ref
     **/
    render() {
        return (
            <div className="game-canvas-container" ref="gameCanvas">
            </div>
        );
    }
}