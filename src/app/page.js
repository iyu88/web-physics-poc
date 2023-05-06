'use client';

import styles from './page.module.css'
import { Engine, Render, Runner, Bodies, Composite, Svg, Vertices, Common, Mouse, MouseConstraint } from "matter-js";
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
        });

        Render.run(render);

        // create runner
        const runner = Runner.create();
        Runner.run(runner, engine);

        const ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });

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

            ([
                './1.svg',
                './2.svg',
                './3.svg',
                './4.svg',
                './5.svg',
            ]).forEach(function(path, i) { 
                loadSvg(path).then(function(root) {
                    const color = Common.choose(['#f19648', '#f5d259', '#f55a3c', '#063e7b', '#ececd1']);

                    const vertexSets = select(root, 'path')
                        .map(function(path) { return Vertices.scale(Svg.pathToVertices(path, 10), 0.4, 0.4); });
                    Composite.add(world, Bodies.fromVertices(100 + i * 150, 200 + i * 50, vertexSets, {
                        render: {
                            fillStyle: color,
                            strokeStyle: color,
                            lineWidth: 1
                        }
                    }, true));
                });
            });
        } else {
            Common.warn('Fetch is not available. Could not load SVG.');
        }

        Composite.add(world, [
            Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),
            Bodies.rectangle(400, 600, 800, 50, { isStatic: true }),
            Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
            Bodies.rectangle(0, 300, 50, 600, { isStatic: true })
        ]);

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
