import React, {useEffect, useRef} from 'react';

function Canvas() {

    const ref = useRef<HTMLCanvasElement | null>(null)

    useEffect(() => {

        if (ref.current !== null) {
            const context = ref.current.getContext('2d');
            const img = new Image();
            img.src = '/metrof_r.png';
            img.onload = function () {
                context?.drawImage(img, 0, 0);
            }
        }

    }, [ref])

    return (
        <canvas width={987} height={952} ref={ref} id="metro"/>
    );
}

export default Canvas;