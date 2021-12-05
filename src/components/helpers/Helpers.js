export function cardioid() {

    const scale = (value, min, max, minR, maxR) => minR + ((maxR - minR) * ((value - min) / (max - min)));

    const limit = (value, min, max) => {
        if (value > max) return max;
        if (value < min) return min;
        return value;
    };

    const sgn = (v) => {
        if (v < 0) return -1;
        if (v > 0) return 1;
        return 0;
    };

    CanvasRenderingContext2D.prototype.RGB = function (r, g, b, a) {
        if (Array.isArray(r)) {
            let alpha = g !== undefined ? g : 1;
            return `rgba(${r[0]},${r[1]},${r[2]},${alpha})`;
        } else {
            a = a !== undefined ? a : 1;
            return `rgba(${r},${g},${b},${a})`;
        }
    };

    CanvasRenderingContext2D.prototype.interpolateColors = function (value, color1, color2) {
        return [
            scale(value, 0, 1, color1[0], color2[0]),
            scale(value, 0, 1, color1[1], color2[1]),
            scale(value, 0, 1, color1[2], color2[2]),
        ];
    };

    CanvasRenderingContext2D.prototype.setLinerGradient = function (x1, y1, x2, y2, massiveWithColors) {
        let gradient = this.createLinearGradient(x1, y1, x2, y2);
        for (var i = 0; i < massiveWithColors.length; i++) {
            gradient.addColorStop(i / (massiveWithColors.length - 1), massiveWithColors[i]);
        }
        return gradient;
    };

    const canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext("2d");

    const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };

    resize();

    window.addEventListener("resize", resize);

    const config = {
        linesCount: 150,
        radius: 0.3,
        color1: [255, 30, 30],
        color2: [44,44,178],
        back: "rgb(17, 17, 19)",
        speed: 0.005,
        wheelSpeed: 0.01,
    };

    class Cardioid {
        constructor () {
            this.radius = config.radius;
            this.ctr = 1;
            this.stop = false;
        };

        getColor (value) {
            return value < 0.5 ? ctx.interpolateColors(scale(value, 0, 0.5, 0, 1), config.color1, config.color2) : ctx.interpolateColors(scale(value, 0.5, 1, 0, 1), config.color2, config.color1);
        };

        updateRadius (dir) {
            this.radius = limit(this.radius - dir * config.wheelSpeed, 0.1, 0.47);
        };

        draw () {
            ctx.save();

            ctx.translate(canvas.width * 0.5, canvas.height * 0.5);

            ctx.lineWidth = 1;

            const radius = this.radius * Math.min(canvas.height, canvas.width);

            for (let i = 0; i < config.linesCount; i++) {
                const angle1 = i / config.linesCount * 2 * Math.PI;
                const angle2 = angle1 * this.ctr;
                
                const x1 = Math.cos(angle1) * radius;
                const y1 = Math.sin(angle1) * radius;
                const x2 = Math.cos(angle2) * radius;
                const y2 = Math.sin(angle2) * radius;

                ctx.strokeStyle = ctx.RGB(this.getColor(i / config.linesCount));

                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
            }

            ctx.strokeStyle = ctx.setLinerGradient(radius, 0, -radius, 0, [ctx.RGB(config.color1), ctx.RGB(config.color2)]);

            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.arc(0, 0, radius, 0, 2 * Math.PI);
            ctx.stroke();

            ctx.restore();

            if (!this.stop) this.ctr += config.speed;
        };
    };

    const cardioid = new Cardioid();

    const loop = function () {
        requestAnimationFrame(loop);
        ctx.save();
        ctx.fillStyle = config.back;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        cardioid.draw();
        ctx.restore();
    };

    window.addEventListener("load", loop);
    window.addEventListener("click", () => cardioid.stop = !cardioid.stop);
    window.addEventListener("wheel", e => cardioid.updateRadius(sgn(e.deltaY)));
}