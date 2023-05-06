'use client';

import styles from './page.module.css'
import { Engine, Render, Runner, Bodies, Composite, Svg, Vertices, Common } from "matter-js";
import { useEffect } from 'react';

export default function Home() {

    useEffect(() => {
    const engine = Engine.create();

    const render = Render.create({ 
        engine: engine,
        element: document.querySelector('#canvas'),
    })

    const boxA = Bodies.rectangle(400, 200, 80, 80);
    const boxB = Bodies.rectangle(450, 50, 80, 80);
    const ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });

    Composite.add(engine.world, [boxA, boxB, ground]);

    Render.run(render);

    const runner = Runner.create();

    Runner.run(runner, engine);

    }, []);

    return (
    <main className={styles.main}>
        <div id="canvas"></div>
    </main>
    )
}
