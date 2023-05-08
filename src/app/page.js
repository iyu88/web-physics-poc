'use client';

import styles from './page.module.css'
import { Engine, Render, Runner, Body, Bodies, Composite, Svg, Vertices, Common, Mouse, MouseConstraint } from "matter-js";
import { useEffect } from 'react';
import pathseg from 'pathseg';
Common.setDecomp(require('poly-decomp'));

export default function Home() {

    useEffect(() => {
        // create engine
        const engine = Engine.create();
        const world = engine.world;

        // create renderer
        const render = Render.create({
            element: document.querySelector('#canvas'),
            engine: engine,
            options: {
                background: '#ffffff',
                wireframes: false
            }
        });

        Render.run(render);

        // create runner
        const runner = Runner.create();
        Runner.run(runner, engine);

        const ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });

        Composite.add(world, [
            Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),
            Bodies.rectangle(400, 600, 800, 50, { isStatic: true }),
            Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
            Bodies.rectangle(0, 300, 50, 600, { isStatic: true })
        ]);

        // add bodies
        if (typeof fetch !== 'undefined') {
            const select = function(root, selector) {
                return Array.prototype.slice.call(root.querySelectorAll(selector));
            };

            const loadSvg = function(url) {
                return fetch(url)
                    .then(function(response) { return response.text(); })
                    .then(function(raw) { return (new window.DOMParser()).parseFromString(raw, 'image/svg+xml'); });
            };

            const color = ['#000000', '#964b00'];

            Promise.all(['./7.svg', './8.svg'].map(loadSvg)).then(svgs => 
                svgs.map((svg, i) => select(svg, 'path')
                        .map(path =>
                            Bodies.fromVertices(100 + 1 * 150, 200 - i * 40, 
                                Vertices.scale(Svg.pathToVertices(path, 10), 0.4, 0.4),
                                {
                                render: {
                                    fillStyle: color[i],
                                    strokeStyle: color[i],
                                    lineWidth: 2,
                                    isStatic: true,
                                    }
                                }, true)
                            )))
                .then((shapes) => Body.create({parts: shapes.flat()}))
                .then((compound) => Composite.add(world, compound));
        }

        // add mouse control
        const mouse = Mouse.create(render.canvas),
            mouseConstraint = MouseConstraint.create(engine, {
                mouse: mouse,
                constraint: {
                    stiffness: 0.2,
                    render: {
                        visible: false
                    }
                }
            });

        Composite.add(world, mouseConstraint);

        // keep the mouse in sync with rendering
        render.mouse = mouse;

    }, []);

    return (
    <main className={styles.main}>
        <div id="canvas"></div>
    </main>
    )
}
